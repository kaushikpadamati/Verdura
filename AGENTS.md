# AGENTS.md

## Project

Single-package React + Vite plant store ("Verdura"). No TypeScript, no monorepo.

## Commands

```bash
npm run dev       # Vite dev server (also aliased as npm run start)
npm run build     # Production build → dist/
npm run lint      # ESLint (flat config, React hooks + refresh plugins)
npm run preview   # Preview production build locally
```

No test script exists. No typecheck. No CI.

## Architecture

**App.jsx is a 917-line monolith** containing all state, logic, and JSX for every view (home, shop, care, about, cart, modals). This is the single most important structural fact.

- `src/styles.js` — all CSS as a ~463-line JS template literal, injected via `<style>{CSS}</style>` in App.jsx
- `src/constants.js` — design tokens, care guides, reviews, categories, country configs
- `src/utils.js` — `fmt()` (INR formatter) and `stars()` (rating display)
- `src/services/plantsAPI.js` — mock async API over `src/data/plants.json` (300ms simulated delay)
- `src/data/plants.json` — plant catalog (40+ items, fields: id, name, cat, price, rating, reviews, care, light, water, desc, badge, image)
- `public/images/` — plant product PNGs, referenced as `/images/<name>.png`

**Navigation is state-based** (`useState("home")`), not using react-router-dom despite it being a dependency.

**Dark mode** toggles a `.dark` class on `<html>`. All dark overrides live in `styles.js` as `.dark .selector` rules.

**Persistence** — all via `localStorage`: dark mode, user auth (username + avatar), plant reviews (keyed by plant ID), delivery address/phone/country.

## Refactor Status

`TODO.md` claims 8/18 refactor phases are done (extracted hooks, components, pages), but **those files do not exist**. The `src/hooks/`, `src/components/`, `src/pages/` directories are absent. TODO.md is stale/aspirational — everything is still in App.jsx.

## Gotchas

- **Duplicated code**: `constants.js` and `utils.js` exist but App.jsx still redefines the same values inline (design tokens, `CARE_GUIDES`, `REVIEWS`, `CATS`, `COUNTRIES`, `fmt`, `stars`). Changes to the extracted files won't affect the running app.
- **`react-router-dom`** is installed but unused — routing is page-state-based.
- **ESLint `no-unused-vars`** ignores variables starting with uppercase or underscore (`varsIgnorePattern: '^[A-Z_]'`).
- **INR currency** — all prices in ₹, locale `en-IN`. Delivery threshold: ₹999 for free shipping.
- **`dist/`** directory exists in the repo tree (build artifact).
- **Plant images** are static PNGs in `public/images/`, not imported — referenced by path from JSON data.

## When Editing

- CSS changes go in `src/styles.js` (the exported `CSS` template literal), not separate `.css` files. `App.css` and `index.css` exist but are minimal/unused.
- Adding new plant data: edit `src/data/plants.json` and ensure a matching image exists in `public/images/`.
- All component logic lives in `src/App.jsx`. There are no other component files.
