import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Search } from 'lucide-react';
import { apps } from './apps';
import { supabase } from './lib/supabaseClient';

export default function AdminPanel() {
  const [users, setUsers] = useState(null);
  const [access, setAccess] = useState({}); // { [email]: Set<app_id> }
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const [{ data: userRows, error: usersError }, { data: accessRows, error: accessError }] =
        await Promise.all([
          supabase.from('switchboard_users').select('*').order('email'),
          supabase.from('app_access').select('email, app_id').eq('can_access', true),
        ]);

      if (usersError || accessError) {
        setError((usersError ?? accessError).message);
        return;
      }

      const accessMap = {};
      for (const row of accessRows) {
        (accessMap[row.email] ??= new Set()).add(row.app_id);
      }
      setUsers(userRows);
      setAccess(accessMap);
    })();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.email.toLowerCase().includes(q) || u.display_name?.toLowerCase().includes(q)
    );
  }, [users, query]);

  async function toggle(email, appId, nextValue) {
    // Optimistic update -- an admin toggling access shouldn't wait on a
    // round-trip to see the checkbox move.
    setAccess((prev) => {
      const next = { ...prev, [email]: new Set(prev[email]) };
      nextValue ? next[email].add(appId) : next[email].delete(appId);
      return next;
    });

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
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by name or email"
              className="w-full rounded-full border border-ink-strong/16 bg-white py-2 pr-4 pl-9 text-sm outline-none focus:border-accent"
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
                        <span className="mt-1 inline-block rounded-full bg-accent/10 px-2 py-0.5 text-[0.65rem] font-bold text-accent">
                          Admin
                        </span>
                      )}
                    </td>
                    {apps.map((app) => (
                      <td key={app.id} className="px-3 py-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={access[user.email]?.has(app.id) ?? false}
                          onChange={(e) => toggle(user.email, app.id, e.target.checked)}
                          className="h-4 w-4 accent-accent"
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
