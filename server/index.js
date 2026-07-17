import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { initDB } from './db/schema.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import reviewRoutes from './routes/reviews.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

initDB();

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

const clientDist = join(__dirname, '..', 'dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(join(clientDist, 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`Verdura API running on http://localhost:${PORT}`);
});
