# AGENTS.md

## Project

React + Vite plant store ("Verdura") with Express + SQLite backend. No TypeScript, no monorepo.

## Commands

### Frontend (root)
```bash
npm run dev       # Vite dev server
npm run build     # Production build → dist/
npm run lint      # ESLint (flat config, React hooks + refresh plugins)
npm run preview   # Preview production build locally
```

### Backend (server/)
```bash
cd server && npm install   # Install dependencies (first time only)
node index.js              # Starts API on http://localhost:3001
node --watch index.js      # Dev mode with auto-reload
```

No test script exists. No typecheck. No CI.

## Architecture

**Frontend**: `src/App.jsx` (~1018 lines) — all views, state, and logic in one file.

- `src/api.js` — Axios client with JWT interceptor. Base URL from `VITE_API_URL` env var (defaults to `http://localhost:3001`).
- `src/styles.js` — all CSS as a ~463-line JS template literal, injected via `<style>{CSS}</style>` in App.jsx
- `src/data/plants.json` — seed data (40 plants). Read by server on first run to populate DB.
- `public/images/` — plant product PNGs, referenced as `./images/<name>.png` (relative paths for GitHub Pages).

**Backend**: `server/` — Express + better-sqlite3 + JWT auth.

```
server/
  index.js              — Express entry, serves API + built frontend
  db/connection.js      — SQLite connection (verdura.db)
  db/schema.js          — Table creation + seed from plants.json + admin user
  middleware/auth.js     — JWT verification + admin role check
  routes/auth.js         — POST /register, POST /login, GET /me
  routes/products.js     — GET / (with ?category= and ?search= filters)
  routes/reviews.js      — CRUD on /products/:id/reviews and /reviews/:id
  routes/orders.js       — POST / (place order), GET / (user's orders)
  routes/admin.js        — GET /orders, GET /users, PATCH /orders/:id, GET /stats
```

**Database tables**: users, products, orders, order_items, reviews, addresses.

**Auth**: JWT tokens stored in localStorage. Passwords hashed with bcrypt. Token sent as `Authorization: Bearer <token>`.

**Navigation**: State-based (`useState("home")`), not using react-router-dom.

**Dark mode**: Toggles `.dark` class on `<html>`. Overrides in `styles.js`.

## Key Data

- **Admin account**: `admin@verdura.in` / `verdura2024` (seeded on first run)
- **Delivery**: Free over ₹999, otherwise ₹99
- **Currency**: INR (₹), locale `en-IN`

## When Editing

- CSS → `src/styles.js` (the exported `CSS` template literal), not `.css` files.
- Product data → `src/data/plants.json` + matching image in `public/images/`. Then restart server to re-seed (delete `server/verdura.db` first).
- App logic → `src/App.jsx`. There are no other component files.
- API routes → `server/routes/`.
- DB schema → `server/db/schema.js`.
- Frontend API calls → `src/api.js`.
