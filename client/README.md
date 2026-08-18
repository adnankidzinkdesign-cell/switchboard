# Switchboard client

The launcher UI. Vite + React 18 + Tailwind CSS v4 (`@tailwindcss/vite`),
`react-router-dom`, `lucide-react` for icons, Poppins for type, Supabase
(`@supabase/supabase-js`) for auth/data — matching the stack conventions
used across Kidzink's other internal tools.

```
src/
  apps.js         Static registry of every app card (title, description,
                  status, icon, colors, href). `href` is null everywhere
                  until each app has a real destination — see
                  ../server/README.md. Who can SEE which app is a separate
                  concern, handled by app_access in Supabase, not this file.
  App.jsx         Page shell + routing: background, header, sign-out/admin
                  link, and the / vs /admin route gate.
  PageBackground.jsx  The decorative corner blobs/characters/dot-grid.
  Login.jsx       Sign-in card, shown when signed out. Email magic link
                  is the active method today (@kidzink.com only); Microsoft
                  sign-in is coded but deferred behind
                  MICROSOFT_SIGN_IN_ENABLED = false pending an Azure App
                  Registration -- flip that flag once it exists.
  Launcher.jsx    The card grid, filtered to only the apps the signed-in
                  user has been granted (via allowedAppIds).
  AdminPanel.jsx  /admin, admin-only: every person x every app, toggled
                  live against the app_access table.
  hooks/
    useSession.js   Tracks the current Supabase auth session.
    useProfile.js   Once signed in, links the session to its
                    switchboard_users row and loads which apps it can see.
  lib/
    supabaseClient.js  Exports `supabase`, or `null` if
                       VITE_SUPABASE_URL/PUBLISHABLE_KEY aren't set --
                       everything above checks this and degrades to a demo
                       mode (Login.jsx shows "not configured"; App.jsx shows
                       every app rather than gating on a session that can
                       never exist) instead of crashing.
  styles.css      Tailwind entry point + the small set of reusable design
                  tokens (brand red, page background, ink color) as a
                  Tailwind v4 `@theme` block. Per-card colors are NOT theme
                  tokens — they're one-off decorative colors scoped to a
                  single card each, so apps.js is their source of truth
                  instead.
```

See `../server/README.md` and `../server/seed/README.md` for the database
schema this all talks to and how to set one up from scratch.

## Develop

```
npm install
npm run dev       # http://localhost:5173
npm run build
```

Copy `.env.example` to `.env.local` and fill in a real Supabase project's
URL + publishable key to test sign-in locally; without it, the app runs in
the demo mode described above.
