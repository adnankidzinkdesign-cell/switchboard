import { Loader2, LogOut } from 'lucide-react';
import PageBackground from './PageBackground';
import Login from './Login';
import Launcher from './Launcher';
import { useSession } from './hooks/useSession';
import { supabase } from './lib/supabaseClient';

export default function App() {
  const { session, loading } = useSession();

  return (
    <div className="relative min-h-screen overflow-hidden px-[18px] pt-5 pb-10 sm:px-8 sm:pt-7 sm:pb-14 lg:pb-28">
      <PageBackground />

      <header className="relative z-2 mb-6 flex items-center justify-between">
        <img
          src="/brand/kidzink-logo-red.svg"
          alt="Kidzink"
          className="h-[38px] w-auto"
        />
        {session && (
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-strong/68 transition hover:text-ink-strong"
          >
            <LogOut size={15} strokeWidth={2.5} aria-hidden="true" />
            Sign out
          </button>
        )}
      </header>

      <main className="relative z-2 mx-auto max-w-[1240px]">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-24">
            <Loader2 className="h-5 w-5 animate-spin text-accent" aria-hidden="true" />
            <span className="font-medium text-ink-strong/68">Loading…</span>
          </div>
        ) : session || !supabase ? (
          // No Supabase project is wired up yet (see client/.env.example),
          // so there's no real sign-in to gate on — show the dashboard
          // directly. Once real credentials are set, `supabase` stops being
          // null and this falls through to the normal session check below,
          // so the login page comes back on its own with no flag to flip.
          <Launcher />
        ) : (
          <Login />
        )}
      </main>
    </div>
  );
}
