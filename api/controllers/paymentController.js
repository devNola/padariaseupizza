import mercadopago from 'mercadopago';
import { Order } from '../models/Order.js';
import { Notification } from '../models/Notification.js';
import logger from '../logger.js';

mercadopago.configure({ access_token: process.env.MP_ACCESS_TOKEN || '' });

async function retry(fn, retries = 2, delay = 500) {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      return await fn();
    } catch (err) {
      attempt += 1;
      if (attempt > retries) throw err;
      // exponential backoff
      const wait = delay * Math.pow(2, attempt - 1);
      logger.warn({ err: err.message || err, attempt, wait, msg: 'Retrying after error' });
      await new Promise(r => setTimeout(r, wait));
    }
  }
}

export const createPreference = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ error: 'orderId é obrigatório' });

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ error: 'Order não encontrada' });

    if (!process.env.MP_ACCESS_TOKEN) {
      return res.status(400).json({ error: 'MP_ACCESS_TOKEN não configurado no servidor' });
    }

    // If preference already created, return existing init_point if available
    if (order.preference_id && order.init_point) {
      return res.status(200).json({ init_point: order.init_point, preference_id: order.preference_id });
    }

    // build items
    const items = order.items.map(i => ({
      title: i.nome,
      quantity: i.quantity,
      currency_id: 'BRL',
      unit_price: parseFloat(i.unit_price),
    }));

    const preference = {
      items,
      external_reference: order.id,
      back_urls: {
        success: process.env.MP_BACK_SUCCESS || process.env.FRONTEND_URL,
        failure: process.env.MP_BACK_FAILURE || process.env.FRONTEND_URL,
        pending: process.env.MP_BACK_PENDING || process.env.FRONTEND_URL,
      },
      notification_url: process.env.MP_NOTIFICATION_URL || (process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/payments/webhook` : ''),
    };

    // Use retry wrapper to handle transient network/timeout errors
    const mpResponse = await retry(() => mercadopago.preferences.create(preference), 3, 500);

    // save preference id and init_point
    order.preference_id = mpResponse.body.id;
    order.init_point = mpResponse.body.init_point;
    await order.save();

    res.status(200).json({ init_point: mpResponse.body.init_point, preference_id: mpResponse.body.id });
  } catch (error) {
    logger.error({ err: error, msg: 'Erro createPreference' });
    // Distinguish MP errors from server errors when possible
    if (error?.cause || error?.name === 'MPError') {
      return res.status(502).json({ error: 'Erro ao comunicar com Mercado Pago' });
    }
    res.status(500).json({ error: 'Erro ao criar preferência' });
  }
};

export const webhook = async (req, res) => {
  try {
    // Mercado Pago sends notifications in query params, e.g., ?topic=payment&id=12345
    const topic = req.query.topic || req.body.topic;
    const id = req.query.id || req.body.id;

    if (!topic || !id) {
      return res.status(400).json({ error: 'Notificação inválida' });
    }

    // Idempotency: use composite key topic:id
    const notificationId = `${topic}:${id}`;

    // Try to create the notification record, but handle unique-constraint races
    let notif;
    try {
      notif = await Notification.create({ notification_id: notificationId, topic, payload: req.body });
    } catch (err) {
      // If unique constraint, another process already created it — re-fetch
      if (err.name === 'SequelizeUniqueConstraintError' || (err.parent && err.parent.code === 'ER_DUP_ENTRY')) {
        logger.warn({ err: err.message || err, notificationId, msg: 'Notification already exists, re-querying' });
        notif = await Notification.findOne({ where: { notification_id: notificationId } });
      } else {
        throw err;
      }
    }

    // If already processed, return 200
    if (notif && notif.processed_at) {
      return res.status(200).json({ ok: true, note: 'already_processed' });
    }

    if (topic === 'payment') {
      // fetch payment details from MP to validate
      const payment = await retry(() => mercadopago.payment.findById(id), 2, 300);
      const external_reference = payment.body.external_reference;
      const status = payment.body.status; // 'approved' indicates paid

      const order = await Order.findOne({ where: { id: external_reference } });
      if (!order) {
        logger.warn({ msg: 'Order not found for external_reference', external_reference });
        // mark notification as processed to avoid repeated attempts; or keep unprocessed for manual inspection
        notif.processed_at = new Date();
        await notif.save();
        return res.status(200).json({ ok: true });
      }

      if (status === 'approved') order.status = 'paid';
      else order.status = 'failed';

      await order.save();

      notif.processed_at = new Date();
      await notif.save();

      return res.status(200).json({ ok: true });
    }

    // Other topics: mark processed
    notif.processed_at = new Date();
    await notif.save();

    return res.status(200).json({ ok: true });
  } catch (error) {
    logger.error({ err: error, msg: 'Erro webhook' });
    // Return 500 so Mercado Pago retries delivery
    return res.status(500).json({ error: 'Erro no webhook' });
  }
};
