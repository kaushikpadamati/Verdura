import { Router } from 'express';
import db from '../db/connection.js';
import { auth, admin } from '../middleware/auth.js';

const router = Router();

router.get('/orders', auth, admin, (req, res) => {
  const orders = db.prepare(`
    SELECT o.*, u.username, u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `).all();

  const withItems = orders.map(order => ({
    ...order,
    items: db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id)
  }));

  res.json(withItems);
});

router.get('/users', auth, admin, (req, res) => {
  const users = db.prepare(`
    SELECT id, username, email, avatar, role, created_at,
      (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as order_count,
      (SELECT COALESCE(SUM(total), 0) FROM orders WHERE user_id = users.id) as total_spent
    FROM users
    ORDER BY created_at DESC
  `).all();
  res.json(users);
});

router.patch('/orders/:id', auth, admin, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);

  const updated = db.prepare(`
    SELECT o.*, u.username, u.email
    FROM orders o JOIN users u ON o.user_id = u.id
    WHERE o.id = ?
  `).get(req.params.id);

  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(req.params.id);
  res.json({ ...updated, items });
});

router.get('/stats', auth, admin, (req, res) => {
  const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
  const totalRevenue = db.prepare('SELECT COALESCE(SUM(total), 0) as total FROM orders').get().total;
  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('customer').count;
  const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'").get().count;

  res.json({ totalOrders, totalRevenue, totalUsers, pendingOrders });
});

export default router;
