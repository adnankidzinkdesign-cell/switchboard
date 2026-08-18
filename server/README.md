# Switchboard "server"

Turns out this doesn't need a custom Node/Next.js server at all — Supabase
(Postgres + Auth + Row Level Security) is the entire backend. The client
(`client/`) talks to Supabase directly; there's no separate API process to
build or deploy. Revisit this only if something genuinely needs
server-only logic later (e.g. calling Microsoft Graph for group-based
access) that RLS can't express.

A real Supabase project now exists for Switchboard (URL + publishable key
in `client/.env.local`, not committed). What's built against it:

## Single sign-on

Confirmed direction: migrate every Kidzink app to Microsoft sign-in, since
every user already has a `@kidzink.com` Entra ID account. Switchboard is the
hub — sign in once there, launch into whichever app you need with no second
login.

Where each app stands:
- **consultflow** — already on Microsoft 365 / Entra ID SSO. Nothing to
  migrate.
- **Switchboard** — built, but Microsoft sign-in is currently *deferred*:
  the Azure App Registration it depends on isn't something the user can set
  up right now. `signInWithOAuth({ provider: 'azure' })` is still there and
  works as soon as that's ready — see `MICROSOFT_SIGN_IN_ENABLED` in
  `client/src/Login.jsx`, just flip it to `true`. In the meantime, sign-in
  is Supabase's email magic link (`signInWithOtp`) instead, restricted
  client-side to `@kidzink.com` addresses — genuinely temporary, not a
  replacement plan, since it needs no Azure setup and RLS/`app_access`
  behave identically regardless of which auth method produced the session.
- **creator2**, **scorecard** — both still on Supabase Auth with
  email/password today. Plan is to switch these to the Azure provider
  approach (once Switchboard's own Azure setup is sorted) rather than
  replacing Supabase — keeps their existing session handling, RLS, and
  role-guard middleware (e.g. creator2's `proxy.ts`) intact; only the login
  method changes. Not started.

Why the hand-off to another app can be a plain link and not custom plumbing:
Entra ID does SSO natively across apps in the same tenant. Once a user has
an active Entra ID session (from signing into Switchboard), any other app
that redirects to that same tenant for login resolves silently — no
re-entered credentials. Switchboard doesn't pass tokens to the target apps
itself.

Remaining items for the creator2/scorecard migration:
- Every Azure App Registration involved must be restricted to "Accounts in
  this organizational directory only" (single-tenant) — otherwise any
  Microsoft account, not just `@kidzink.com` staff, could sign in.
- **creator2** has real user rows tied to email/password today — switching
  to Azure sign-in needs those to resolve to the *same* user record by
  email rather than creating duplicate accounts. A real per-app migration
  detail, not just a config toggle.
- **scorecard**'s current users are just test users, not real accounts — no
  migration/email-matching concern there, it can cut over cleanly.
- Cutover style (for creator2, where it matters): hard switch, or keep
  password login as a fallback during a transition window?

## Per-app access control

Built. Schema in `migrations/0001_init.sql`, roster seed in
`migrations/0002_seed_users.sql` (generated from `seed/`), setup order in
`seed/README.md`.

- `switchboard_users` — every known person (keyed by email, not
  `auth.users.id` — most people haven't signed in yet, so there's nothing
  else to key on), plus a `role` (`user`/`admin`).
- `app_access` — per (email, app_id), a plain `can_access` boolean.
  Deliberately simpler than creator2's per-app feature-flag permissions
  (`boq`, `procurement`, etc.) — Switchboard only needs "can this person see
  this app", not feature-level flags within an app. Default-deny: nobody
  sees an app until an admin explicitly grants it.
- `/admin` in the client (`AdminPanel.jsx`) — a grid of every person × every
  app, admin-only, backed directly by these two tables through Supabase's
  client SDK (no custom API needed, RLS does the authorization).
- `claim_profile()` (a Postgres function) links a person's Entra ID identity
  to their `switchboard_users` row the first time they actually sign in,
  or creates one for someone not in the original seeded roster (e.g. a new
  hire).

## App registry

`client/src/apps.js` is still a hardcoded array (id, title, description,
status, icon, colors, href) — fine for now since the set of apps changes
rarely, unlike per-user access which changes often and is why that part
got a real table instead. Worth moving into Supabase too eventually for the
same reason (so adding an app doesn't need a client code change + redeploy),
but not yet done.
