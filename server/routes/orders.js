import { Router } from 'express';
import db from '../db/connection.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.post('/', auth, (req, res) => {
  const { items, address, phone, country } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  if (!address || !phone) {
    return res.status(400).json({ error: 'Address and phone are required' });
  }

  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.id);
    if (!product) {
      return res.status(400).json({ error: `Product ${item.id} not found` });
    }
    const qty = item.qty || 1;
    subtotal += product.price * qty;
    orderItems.push({
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity: qty
    });
  }

  const deliveryFee = subtotal >= 999 ? 0 : 99;
  const total = subtotal + deliveryFee;

  const createOrder = db.transaction(() => {
    const result = db.prepare(`
      INSERT INTO orders (user_id, address, phone, country, subtotal, delivery_fee, total)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(req.user.id, address, phone, country || 'IN', subtotal, deliveryFee, total);

    const orderId = result.lastInsertRowid;

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const item of orderItems) {
      insertItem.run(orderId, item.product_id, item.product_name, item.price, item.quantity);
    }

    return orderId;
  });

  const orderId = createOrder();

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  const items_result = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);

  res.status(201).json({ ...order, items: items_result });
});

router.get('/', auth, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);

  const withItems = orders.map(order => ({
    ...order,
    items: db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id)
  }));

  res.json(withItems);
});

export default router;
