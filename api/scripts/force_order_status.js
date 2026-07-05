#!/usr/bin/env node
/*
  Script to force update an Order status directly via models.
  Usage: ORDER_ID=<orderId> NEW_STATUS=paid node api/scripts/force_order_status.js
*/
import { sequelize } from '../databases/conecta.js';
import { Order } from '../models/Order.js';

const orderId = process.env.ORDER_ID;
const newStatus = process.env.NEW_STATUS || 'paid';

if (!orderId) {
  console.error('ORDER_ID env var is required');
  process.exit(1);
}

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    const order = await Order.findByPk(orderId);
    if (!order) {
      console.error('Order not found:', orderId);
      process.exit(1);
    }
    order.status = newStatus;
    await order.save();
    console.log('Order updated:', order.id, order.status);
    process.exit(0);
  } catch (err) {
    console.error('Error updating order:', err);
    process.exit(1);
  }
})();
