-- Switchboard database schema.
-- Run this once in the Supabase project's SQL Editor (Database > SQL Editor
-- > New query), then run 0002_seed_users.sql (generated separately -- see
-- server/seed/README.md) to populate the initial roster.
--
-- Design notes:
--   - Keyed by EMAIL, not auth.users.id. Nobody in the seeded roster has
--     ever signed into Switchboard, so there's no auth.users row for them
--     yet -- an admin needs to be able to grant a person access to an app
--     *before* their first login, not only after. `auth_user_id` gets
--     filled in the first time they actually sign in (see claim_profile()
--     below), linking the two once that happens.
--   - app_access.app_id is free text, matching the `id` field in
--     client/src/apps.js, deliberately NOT a fixed enum/check-constraint
--     list -- adding a new app to the launcher shouldn't require a
--     migration here. This is intentionally a different, simpler shape
--     than creator2's per-app permissions JSON blob (boq/procurement/etc.):
--     Switchboard only needs "can this person see this app or not", not
--     creator2's feature-level flags.
--   - Default-deny: no app_access row (or can_access = false) means hidden.
--     An admin has to explicitly grant each app, rather than everything
--     being visible until explicitly revoked.

create table if not exists switchboard_users (
  email text primary key,
  display_name text,
  auth_user_id uuid unique,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  last_sign_in_at timestamptz
);

create table if not exists app_access (
  email text not null references switchboard_users(email) on delete cascade,
  app_id text not null,
  can_access boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (email, app_id)
);

alter table switchboard_users enable row level security;
alter table app_access enable row level security;

-- True if the currently-authenticated request belongs to an admin.
create or replace function is_switchboard_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from switchboard_users
    where email = (auth.jwt() ->> 'email')
    and role = 'admin'
  );
$$;

-- switchboard_users policies
create policy "users can read their own profile"
  on switchboard_users for select
  using (email = (auth.jwt() ->> 'email'));

create policy "admins can read every profile"
  on switchboard_users for select
  using (is_switchboard_admin());

create policy "admins can update roles"
  on switchboard_users for update
  using (is_switchboard_admin());

-- app_access policies
create policy "users can read their own app access"
  on app_access for select
  using (email = (auth.jwt() ->> 'email'));

create policy "admins can read everyone's app access"
  on app_access for select
  using (is_switchboard_admin());

create policy "admins can grant or revoke app access"
  on app_access for all
  using (is_switchboard_admin())
  with check (is_switchboard_admin());

-- Called by the client right after a successful sign-in. Links the
-- Entra ID-authenticated user to their (likely pre-seeded) switchboard_users
-- row by email, or creates one for someone not in the original roster
-- (e.g. a new hire) with the safe default role='user' and no app access
-- granted yet. SECURITY DEFINER because a brand-new user has no row yet for
-- ordinary RLS to match against.
create or replace function claim_profile()
returns void
language plpgsql
security definer
as $$
declare
  current_email text := auth.jwt() ->> 'email';
begin
  if current_email is null then
    raise exception 'claim_profile() called with no authenticated email';
  end if;

  insert into switchboard_users (email, auth_user_id, last_sign_in_at)
  values (current_email, auth.uid(), now())
  on conflict (email) do update
    set auth_user_id = excluded.auth_user_id,
        last_sign_in_at = excluded.last_sign_in_at;
end;
$$;

grant execute on function claim_profile() to authenticated;
