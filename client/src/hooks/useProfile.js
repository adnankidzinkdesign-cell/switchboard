import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// Once a session exists, links the signed-in Entra ID identity to its
// switchboard_users row (creating one if this person wasn't in the seeded
// roster -- e.g. a new hire) and loads what they're allowed to see.
// `allowedAppIds` is only the apps with an explicit can_access = true row --
// default-deny, so a fresh sign-in sees nothing until an admin grants access.
export function useProfile(session) {
  const [profile, setProfile] = useState(null);
  const [allowedAppIds, setAllowedAppIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase || !session) {
      setProfile(null);
      setAllowedAppIds([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      await supabase.rpc('claim_profile');

      const email = session.user.email;
      const [{ data: profileRow }, { data: accessRows }] = await Promise.all([
        supabase.from('switchboard_users').select('*').eq('email', email).maybeSingle(),
        supabase.from('app_access').select('app_id').eq('email', email).eq('can_access', true),
      ]);

      if (cancelled) return;
      setProfile(profileRow ?? null);
      setAllowedAppIds((accessRows ?? []).map((row) => row.app_id));
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [session]);

  return { profile, allowedAppIds, loading, isAdmin: profile?.role === 'admin' };
}
