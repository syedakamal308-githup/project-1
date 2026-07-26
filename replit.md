# ChocoMoggy

A premium artisan chocolate e-commerce storefront built with React + TypeScript + Vite + Tailwind CSS.

## Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Framer Motion animations
- **UI Components:** Lucide React icons
- **Data:** `@supabase/supabase-js` is installed (currently unused in UI — rule-based AI chat only)

## Features

- Product catalog with 13+ chocolate flavors + Sugar-Free collection
- Cart, wishlist, and search overlays
- Gift basket builder
- Rule-based AI chat assistant (MoggyChat) — no external API required
- Animated intro loader, hero section, testimonials, about, contact, footer

## How to Run

```
npm run dev
```

Starts the Vite dev server on port 5000. The workflow **Start application** is configured to do this automatically.

## Other Scripts

```
npm run build      # Build for production (output: dist/)
npm run preview    # Preview the production build locally
npm run lint       # ESLint
npm run typecheck  # TypeScript type check
```

## Project Structure

```
src/
  components/   # All UI components (Navbar, Hero, CartDrawer, MoggyChat, etc.)
  context/      # ShopContext — cart, wishlist, search state
  data/         # products.ts — full product catalog
  lib/          # moggyAI.ts — rule-based AI chat logic
  App.tsx       # Root component
  main.tsx      # Entry point
public/         # Static assets (images, video)
dist/           # Pre-built production output
```

## User Preferences

<!-- Add any preferences or conventions here -->
