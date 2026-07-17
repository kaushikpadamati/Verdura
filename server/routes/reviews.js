import { Router } from 'express';
import db from '../db/connection.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/products/:id/reviews', (req, res) => {
  const reviews = db.prepare(`
    SELECT r.*, u.username, u.avatar
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.product_id = ?
    ORDER BY r.created_at DESC
  `).all(req.params.id);
  res.json(reviews);
});

router.post('/products/:id/reviews', auth, (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  if (!rating || !comment || !comment.trim()) {
    return res.status(400).json({ error: 'Rating and comment are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  const result = db.prepare(`
    INSERT INTO reviews (user_id, product_id, rating, comment)
    VALUES (?, ?, ?, ?)
  `).run(req.user.id, productId, rating, comment.trim());

  db.prepare(`
    UPDATE products SET
      rating = (SELECT AVG(rating) FROM reviews WHERE product_id = ?),
      reviews_count = (SELECT COUNT(*) FROM reviews WHERE product_id = ?)
    WHERE id = ?
  `).run(productId, productId, productId);

  const review = db.prepare(`
    SELECT r.*, u.username, u.avatar
    FROM reviews r JOIN users u ON r.user_id = u.id
    WHERE r.id = ?
  `).get(result.lastInsertRowid);

  res.status(201).json(review);
});

router.put('/reviews/:id', auth, (req, res) => {
  const { rating, comment } = req.body;

  const existing = db.prepare('SELECT * FROM reviews WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Review not found' });
  if (existing.user_id !== req.user.id) return res.status(403).json({ error: 'Not your review' });

  if (!comment || !comment.trim()) {
    return res.status(400).json({ error: 'Comment is required' });
  }

  db.prepare(`
    UPDATE reviews SET rating = ?, comment = ?, updated_at = datetime('now') WHERE id = ?
  `).run(rating || existing.rating, comment.trim(), req.params.id);

  db.prepare(`
    UPDATE products SET rating = (SELECT AVG(rating) FROM reviews WHERE product_id = ?)
    WHERE id = ?
  `).run(existing.product_id, existing.product_id);

  const review = db.prepare(`
    SELECT r.*, u.username, u.avatar
    FROM reviews r JOIN users u ON r.user_id = u.id
    WHERE r.id = ?
  `).get(req.params.id);

  res.json(review);
});

router.delete('/reviews/:id', auth, (req, res) => {
  const existing = db.prepare('SELECT * FROM reviews WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Review not found' });
  if (existing.user_id !== req.user.id) return res.status(403).json({ error: 'Not your review' });

  db.prepare('DELETE FROM reviews WHERE id = ?').run(req.params.id);

  db.prepare(`
    UPDATE products SET
      rating = COALESCE((SELECT AVG(rating) FROM reviews WHERE product_id = ?), 0),
      reviews_count = (SELECT COUNT(*) FROM reviews WHERE product_id = ?)
    WHERE id = ?
  `).run(existing.product_id, existing.product_id, existing.product_id);

  res.json({ message: 'Review deleted' });
});

export default router;
