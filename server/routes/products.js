import { Router } from 'express';
import db from '../db/connection.js';

const router = Router();

router.get('/', (req, res) => {
  const { category, search } = req.query;

  let query = 'SELECT * FROM products';
  const conditions = [];
  const params = [];

  if (category && category !== 'All') {
    conditions.push('category = ?');
    params.push(category);
  }

  if (search) {
    conditions.push('(name LIKE ? OR category LIKE ? OR description LIKE ?)');
    const q = `%${search}%`;
    params.push(q, q, q);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY id ASC';
  const products = db.prepare(query).all(...params);
  res.json(products);
});

router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

export default router;
