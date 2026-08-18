import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from './lib/supabaseClient';

function MicrosoftMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 21 21" aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  );
}

export default function Login() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const signIn = async () => {
    if (!supabase) return;
    setPending(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email openid profile',
        redirectTo: window.location.origin,
      },
    });
    // On success the browser navigates away to Microsoft immediately, so
    // only the failure path (e.g. provider misconfigured) reaches here.
    if (signInError) {
      setError(signInError.message);
      setPending(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-[28px] bg-white/70 px-8 py-12 text-center shadow-[0_10px_26px_rgba(24,24,27,0.07)]">
      <h1 className="text-[clamp(2rem,4vw,2.75rem)] leading-none font-extrabold tracking-[-0.03em] text-ink-strong">
        Switchboard
      </h1>
      <p className="mt-3 mb-8 text-base font-medium text-ink-strong/68">
        Sign in with your Kidzink account to continue.
      </p>

      {!supabase ? (
        <p className="rounded-2xl bg-ink-strong/5 px-4 py-3 text-sm font-medium text-ink-strong/70">
          Sign-in isn&rsquo;t configured yet — this app is missing its
          Supabase project credentials.
        </p>
      ) : (
        <>
          <button
            type="button"
            onClick={signIn}
            disabled={pending}
            className="inline-flex w-full items-center justify-center gap-3 rounded-full border-[1.5px] border-ink-strong/16 bg-white px-6 py-3 text-[0.95rem] font-bold text-ink-strong transition hover:-translate-y-px hover:shadow-[0_8px_16px_rgba(24,24,27,0.1)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MicrosoftMark />}
            {pending ? 'Redirecting…' : 'Sign in with Microsoft'}
          </button>
          {error && (
            <p className="mt-4 text-sm font-medium text-[#dc2626]">{error}</p>
          )}
        </>
      )}
    </div>
  );
}
