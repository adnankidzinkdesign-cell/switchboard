import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// No Supabase project has been provisioned for Switchboard yet (see
// server/README.md) — this stays undefined until VITE_SUPABASE_URL and
// VITE_SUPABASE_PUBLISHABLE_KEY are set (copy client/.env.example to
// .env.local). Everything that touches auth checks this before calling into
// Supabase, so the app degrades to a clear "not configured" message instead
// of a crash.
export const supabase = url && publishableKey ? createClient(url, publishableKey) : null;
