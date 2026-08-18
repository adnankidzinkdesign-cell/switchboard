# Switchboard server (not built yet)

Two jobs, once this exists:

1. **Single sign-on.** One login gets a user into Switchboard and, from
   there, into whichever of the linked apps they're allowed to use —
   the user shouldn't have to sign in again per app. Kidzink's existing
   SSO pattern is Microsoft 365 / Entra ID (already in use by consultflow);
   the default plan is to reuse that same tenant/app-registration approach
   here rather than introducing a second auth system. Whether "no second
   login" is:
   - a shared session cookie the target apps also read (needs those apps'
     cooperation), or
   - each app doing its own independent Entra ID redirect, relying on the
     browser already holding an Entra ID session so the redirect resolves
     silently (no cooperation needed from the target apps, just Entra ID's
     own SSO behavior),

   is an open decision — the second option is far less invasive to build
   since it needs nothing from consultflow/creator2/etc., but confirm before
   committing either way.

2. **App registry.** The source of truth for which apps exist, their live
   URLs, current status (in development / coming soon / live), and — once
   per-user access control matters — which apps a given signed-in user is
   allowed to see. `client/src/apps.js` is a hardcoded stand-in for this
   today; once this API exists, that file's shape (id, title, description,
   status, icon, colors, href) is the contract the client already expects
   the registry response to fill.

No stack decision has been made yet. Given every other Kidzink app here is
Next.js + Supabase on Netlify, that's the natural default unless there's a
reason to diverge.
