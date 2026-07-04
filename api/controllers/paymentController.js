import mercadopago from 'mercadopago';
import { Order } from '../models/Order.js';

mercadopago.configure({ access_token: process.env.MP_ACCESS_TOKEN || '' });

export const createPreference = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ error: 'orderId é obrigatório' });

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ error: 'Order não encontrada' });

    if (!process.env.MP_ACCESS_TOKEN) {
      return res.status(400).json({ error: 'MP_ACCESS_TOKEN não configurado no servidor' });
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

    const mpResponse = await mercadopago.preferences.create(preference);

    // save preference id
    order.preference_id = mpResponse.body.id;
    await order.save();

    res.status(200).json({ init_point: mpResponse.body.init_point, preference_id: mpResponse.body.id });
  } catch (error) {
    console.error('Erro createPreference:', error);
    res.status(500).json({ error: 'Erro ao criar preferência' });
  }
};

export const webhook = async (req, res) => {
  try {
    // Mercado Pago sends notifications in query params, e.g., ?topic=payment&id=12345
    const topic = req.query.topic || req.body.topic;
    const id = req.query.id || req.body.id;

    // Simples handler — para produção valide assinatura se disponível
    if (!topic || !id) {
      return res.status(400).json({ error: 'Notificação inválida' });
    }

    // For simplicity, if topic is payment, we fetch payment details and update order by external_reference
    if (topic === 'payment') {
      const payment = await mercadopago.payment.findById(id);
      const external_reference = payment.body.external_reference;
      const status = payment.body.status; // 'approved' indicates paid

      const order = await Order.findOne({ where: { id: external_reference } });
      if (!order) return res.status(404).json({ error: 'Order not found' });

      if (status === 'approved') order.status = 'paid';
      else order.status = 'failed';

      await order.save();
      return res.status(200).json({ ok: true });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Erro webhook:', error);
    res.status(500).json({ error: 'Erro no webhook' });
  }
};
