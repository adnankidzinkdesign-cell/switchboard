# Switchboard client

The launcher UI. Vite + React 18 + Tailwind CSS v4 (`@tailwindcss/vite`),
`lucide-react` for icons, Poppins for type — matching the stack conventions
used across Kidzink's other internal tools.

```
src/
  apps.js       Registry of every app card shown (title, description,
                status, icon, colors, href). `href` is null everywhere
                until each app has a real destination to send users to —
                see ../server/README.md for what's meant to eventually
                fill this file's shape from an API instead of a hardcoded
                array.
  App.jsx       Page shell: background, header, hero copy, card grid.
  AppCard.jsx   One launcher card.
  styles.css    Tailwind entry point + the small set of reusable design
                tokens (brand red, page background, ink color) as a
                Tailwind v4 `@theme` block. Per-card colors are NOT theme
                tokens — they're one-off decorative colors scoped to a
                single card each, so apps.js is their source of truth
                instead.
```

## Develop

```
npm install
npm run dev       # http://localhost:5173
npm run build
```
