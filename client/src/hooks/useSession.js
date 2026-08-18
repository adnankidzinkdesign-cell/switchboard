import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// Tracks the current Supabase auth session. `loading` is true only while the
// very first check is in flight; after that, onAuthStateChange keeps
// `session` current for sign-in/sign-out/token refresh.
export function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  return { session, loading };
}
