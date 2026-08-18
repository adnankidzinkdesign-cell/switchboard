import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import type { SwitchboardUser } from '../lib/database.types';

// Once a session exists, links the signed-in Entra ID identity to its
// switchboard_users row (creating one if this person wasn't in the seeded
// roster -- e.g. a new hire) and loads what they're allowed to see.
// `allowedAppIds` is only the apps with an explicit can_access = true row --
// default-deny, so a fresh sign-in sees nothing until an admin grants access.
export function useProfile(session: Session | null) {
  const [profile, setProfile] = useState<SwitchboardUser | null>(null);
  const [allowedAppIds, setAllowedAppIds] = useState<string[]>([]);
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

      const email = session.user.email;
      if (!email) {
        // Every auth method this app offers (email OTP, Azure OAuth) always
        // populates email -- this shouldn't happen in practice, but without
        // one there's no switchboard_users row to link to.
        setProfile(null);
        setAllowedAppIds([]);
        setLoading(false);
        return;
      }

      await supabase.rpc('claim_profile');

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
