# Switchboard server (not built yet)

Two jobs, once this exists:

1. **Single sign-on.** Confirmed direction: migrate every Kidzink app to
   Microsoft sign-in, since every user already has a `@kidzink.com` Entra ID
   account. Switchboard is the hub — sign in once there, launch into
   whichever app you need with no second login.

   Where each app stands today:
   - **consultflow** — already on Microsoft 365 / Entra ID SSO. Nothing to
     migrate.
   - **creator2**, **scorecard** — both on Supabase Auth with email/password.
     Plan is to switch these to Supabase's built-in Azure AD provider
     (`signInWithOAuth({ provider: 'azure' })`) rather than replacing Supabase
     — keeps their existing session handling, RLS, and role-guard middleware
     (e.g. creator2's `proxy.ts`) intact; only the login method changes.
   - **Switchboard itself** — not built. Leaning toward Supabase + Azure
     provider too, for consistency with creator2/scorecard, over a
     client-only MSAL.js integration — open call, not yet decided.

   Why the hand-off can be a plain link and not custom plumbing: Entra ID
   does SSO natively across apps in the same tenant. Once a user has an
   active Entra ID session (from signing into Switchboard), any other app
   that redirects to that same tenant for login resolves silently — no
   re-entered credentials. Switchboard doesn't need to pass tokens to the
   target apps itself.

   Remaining decisions before/during the migration:
   - Every Azure App Registration involved must be restricted to
     "Accounts in this organizational directory only" (single-tenant) —
     otherwise any Microsoft account, not just `@kidzink.com` staff, could
     sign in.
   - creator2/scorecard have existing Supabase user rows tied to
     email/password today. Switching to Azure sign-in needs those to
     resolve to the *same* user record by email rather than creating
     duplicate accounts — a real per-app migration detail, not just a
     config toggle.
   - Cutover style: hard switch, or keep password login as a fallback
     during a transition window?

2. **App registry.** The source of truth for which apps exist, their live
   URLs, current status (in development / coming soon / live), and — once
   per-user access control matters — which apps a given signed-in user is
   allowed to see. `client/src/apps.js` is a hardcoded stand-in for this
   today; once this API exists, that file's shape (id, title, description,
   status, icon, colors, href) is the contract the client already expects
   the registry response to fill.

No stack decision has been made yet. Given every other Kidzink app here is
Next.js + Supabase on Netlify, that's the natural default unless there's a
reason to diverge — and would let Switchboard share the same Azure AD
provider pattern as creator2/scorecard.
