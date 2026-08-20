import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Search } from 'lucide-react';
import { Badge, Input, Toggle } from '@kidzink/ui';
import { apps } from './apps';
import { supabase } from './lib/supabaseClient';
import type { SwitchboardUser } from './lib/database.types';

// Clearly-fake sample rows for demoMode -- never real employee data. Lets
// someone preview the panel's layout/interaction before Microsoft sign-in
// is enabled, without weakening RLS to expose the real roster to anyone
// who isn't actually authenticated as an admin.
const DEMO_USERS: SwitchboardUser[] = [
  {
    email: 'avery@example.com',
    display_name: 'Avery (sample)',
    role: 'admin',
    auth_user_id: null,
    created_at: '',
    last_sign_in_at: null,
  },
  {
    email: 'jordan@example.com',
    display_name: 'Jordan (sample)',
    role: 'user',
    auth_user_id: null,
    created_at: '',
    last_sign_in_at: null,
  },
  {
    email: 'sam@example.com',
    display_name: null,
    role: 'user',
    auth_user_id: null,
    created_at: '',
    last_sign_in_at: null,
  },
];
const DEMO_ACCESS: Record<string, Set<string>> = {
  'avery@example.com': new Set(['consultant-hub', 'project-pulse']),
  'jordan@example.com': new Set(['project-pulse']),
};

export default function AdminPanel({ demoMode = false }: { demoMode?: boolean }) {
  const [users, setUsers] = useState<SwitchboardUser[] | null>(demoMode ? DEMO_USERS : null);
  const [access, setAccess] = useState<Record<string, Set<string>>>(
    demoMode ? DEMO_ACCESS : {}
  );
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (demoMode) return;
    if (!supabase) return;

    (async () => {
      const [{ data: userRows, error: usersError }, { data: accessRows, error: accessError }] =
        await Promise.all([
          supabase.from('switchboard_users').select('*').order('email'),
          supabase.from('app_access').select('email, app_id').eq('can_access', true),
        ]);

      if (usersError || accessError) {
        setError((usersError ?? accessError)!.message);
        return;
      }

      const accessMap: Record<string, Set<string>> = {};
      for (const row of accessRows ?? []) {
        (accessMap[row.email] ??= new Set()).add(row.app_id);
      }
      setUsers(userRows);
      setAccess(accessMap);
    })();
  }, [demoMode]);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.email.toLowerCase().includes(q) || u.display_name?.toLowerCase().includes(q)
    );
  }, [users, query]);

  async function toggle(email: string, appId: string, nextValue: boolean) {
    // Optimistic update -- an admin toggling access shouldn't wait on a
    // round-trip to see the checkbox move.
    setAccess((prev) => {
      const next = { ...prev, [email]: new Set(prev[email]) };
      nextValue ? next[email].add(appId) : next[email].delete(appId);
      return next;
    });

    if (demoMode || !supabase) return; // nothing to persist -- sample data only

    const { error: upsertError } = await supabase
      .from('app_access')
      .upsert({ email, app_id: appId, can_access: nextValue, updated_at: new Date().toISOString() });

    if (upsertError) {
      setError(`Couldn't save ${email} / ${appId}: ${upsertError.message}`);
      // Roll back the optimistic flip.
      setAccess((prev) => {
        const next = { ...prev, [email]: new Set(prev[email]) };
        nextValue ? next[email].delete(appId) : next[email].add(appId);
        return next;
      });
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-strong/68 transition hover:text-ink-strong"
      >
        <ArrowLeft size={15} strokeWidth={2.5} aria-hidden="true" />
        Back to Switchboard
      </Link>

      <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-ink-strong">
        App access
      </h1>
      <p className="mt-1 mb-6 text-sm font-medium text-ink-strong/68">
        Grant or revoke which apps each person can see on the launcher.
        Unchecked means hidden -- nobody sees an app until it's explicitly
        granted here.
      </p>

      {demoMode && (
        <p className="mb-4 rounded-xl bg-[#f5af4d]/15 px-4 py-2.5 text-sm font-medium text-[#8a5a1e]">
          Preview mode — the three people below are sample data, not real.
          Sign in as an admin once Microsoft sign-in is enabled to manage
          actual access.
        </p>
      )}

      {error && (
        <p className="mb-4 rounded-xl bg-[#dc2626]/10 px-4 py-2.5 text-sm font-medium text-[#dc2626]">
          {error}
        </p>
      )}

      {!users ? (
        <div className="flex items-center justify-center gap-2 py-16">
          <Loader2 className="h-5 w-5 animate-spin text-accent" aria-hidden="true" />
          <span className="font-medium text-ink-strong/68">Loading…</span>
        </div>
      ) : (
        <>
          <div className="relative mb-4 max-w-xs">
            <Search
              size={16}
              strokeWidth={2.5}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-strong/40"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by name or email"
              className="rounded-full pl-9 text-sm"
            />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-ink-strong/10 bg-white">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-ink-strong/10 text-left">
                  <th className="px-4 py-3 font-semibold text-ink-strong/70">Person</th>
                  {apps.map((app) => (
                    <th key={app.id} className="px-3 py-3 text-center font-semibold text-ink-strong/70">
                      {app.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.email} className="border-b border-ink-strong/5 last:border-0">
                    <td className="px-4 py-2.5">
                      <div className="font-semibold text-ink-strong">
                        {user.display_name ?? user.email}
                      </div>
                      {user.display_name && (
                        <div className="text-xs text-ink-strong/50">{user.email}</div>
                      )}
                      {user.role === 'admin' && (
                        <Badge
                          variant="outline"
                          className="mt-1 border-transparent bg-accent/10 px-2 py-0.5 text-[0.65rem] font-bold text-accent"
                        >
                          Admin
                        </Badge>
                      )}
                    </td>
                    {apps.map((app) => (
                      <td key={app.id} className="px-3 py-2.5 text-center">
                        <Toggle
                          size="sm"
                          checked={access[user.email]?.has(app.id) ?? false}
                          onCheckedChange={(checked: boolean) =>
                            toggle(user.email, app.id, checked)
                          }
                          aria-label={`${user.email} can access ${app.title}`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
