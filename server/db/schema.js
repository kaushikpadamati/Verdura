import db from './connection.js';
import bcrypt from 'bcrypt';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      avatar TEXT DEFAULT '👤',
      role TEXT DEFAULT 'customer' CHECK(role IN ('customer', 'admin')),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      rating REAL DEFAULT 0,
      reviews_count INTEGER DEFAULT 0,
      care TEXT,
      light TEXT,
      water TEXT,
      description TEXT,
      badge TEXT DEFAULT '',
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      country TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      delivery_fee INTEGER DEFAULT 0,
      total INTEGER NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'shipped', 'delivered')),
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      price INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      comment TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      full_address TEXT NOT NULL,
      phone TEXT NOT NULL,
      country_code TEXT DEFAULT 'IN',
      is_default INTEGER DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  seedData();
}

function seedData() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) return;

  const adminHash = bcrypt.hashSync('verdura2024', 10);
  db.prepare(`
    INSERT INTO users (username, email, password_hash, avatar, role)
    VALUES (?, ?, ?, ?, ?)
  `).run('Admin', 'admin@verdura.in', adminHash, '🌿', 'admin');

  const productsPath = join(__dirname, '..', '..', 'src', 'data', 'plants.json');
  const products = JSON.parse(readFileSync(productsPath, 'utf-8'));

  const insert = db.prepare(`
    INSERT INTO products (id, name, category, price, rating, reviews_count, care, light, water, description, badge, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((items) => {
    for (const p of items) {
      insert.run(p.id, p.name, p.cat, p.price, p.rating, p.reviews, p.care, p.light, p.water, p.desc, p.badge, p.image);
    }
  });

  insertMany(products);
  console.log(`Seeded ${products.length} products and 1 admin user`);
}
