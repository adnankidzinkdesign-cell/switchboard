# Seeding the Switchboard roster

One-time setup for a fresh Supabase project, in order:

1. **Run the schema.** Supabase dashboard → SQL Editor → New query → paste
   `../migrations/0001_init.sql` → Run.
2. **Run the seed.** Same place → paste `../migrations/0002_seed_users.sql`
   → Run. Adds all ~277 people from `creator2-profiles-export.json` as
   `switchboard_users` rows, nobody granted access to any app yet (default
   deny — see `0001_init.sql`'s comments).
3. **Enable Azure sign-in.** Supabase dashboard → Authentication → Providers
   → Azure, backed by an Azure App Registration restricted to "Accounts in
   this organizational directory only" (@kidzink.com tenant). Sign-in
   doesn't work until this is done, even with the schema/seed in place.
4. **Sign in as one of the four seeded admins** (`adam@kidzink.com`,
   `adnan@kidzink.com`, `fida@kidzink.com`, `sanandu@kidzink.com` — pulled
   from creator2's `role = 'admin'` rows, since they're the ones already
   administering that project; adjust in the database directly if that
   assumption is wrong) and use the in-app admin panel (`/admin`) to start
   granting people access to specific apps.

## Where the roster came from

`creator2-profiles-export.json` is a one-time export of creator2's Supabase
`profiles` table — used here only for the roster (email, display name, role
tier), not creator2's own permissions. creator2's per-app permission flags
(`boq`, `procurement`, `approveFactory`, etc.) don't apply to Switchboard,
which uses its own simpler `app_access` table instead (a plain "can this
person see this app" per app, not creator2's feature-level flags) — see
`0001_init.sql` for why that's a deliberately different, more generic shape.

creator2's `manager` role tier has no Switchboard equivalent and became
plain `user` in the seed; only creator2's `admin` rows became Switchboard
`admin` rows.

## Re-running

`node generate-seed.js` regenerates `0002_seed_users.sql` from the JSON —
re-run it if the source roster export changes, and re-run the resulting SQL
in Supabase. It's written with `on conflict (email) do nothing`, so
re-running it is always safe: it only ever adds people who aren't already
there, never overwrites an admin's later changes to someone's role or
access.
