import { useState } from 'react';
import { Loader2, Mail } from 'lucide-react';
import { supabase } from './lib/supabaseClient';

// Deferred, not removed: the Azure App Registration this depends on isn't
// set up yet, so Microsoft sign-in would just error if shown. Flip this
// back to true once it's ready -- signInWithMicrosoft() below still works
// as-is, nothing else needs to change.
const MICROSOFT_SIGN_IN_ENABLED = false;

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
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  const signInWithMicrosoft = async () => {
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

  const sendMagicLink = async (e) => {
    e.preventDefault();
    if (!supabase) return;

    const trimmed = email.trim().toLowerCase();
    if (!trimmed.endsWith('@kidzink.com')) {
      setError('Use your @kidzink.com email address.');
      return;
    }

    setPending(true);
    setError(null);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { emailRedirectTo: window.location.origin },
    });
    setPending(false);
    if (otpError) {
      setError(otpError.message);
    } else {
      setSent(true);
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
      ) : sent ? (
        <p className="rounded-2xl bg-ink-strong/5 px-4 py-3 text-sm font-medium text-ink-strong/70">
          Check <span className="font-bold">{email.trim()}</span> for a sign-in
          link.
        </p>
      ) : (
        <>
          <form onSubmit={sendMagicLink} className="w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@kidzink.com"
              required
              disabled={pending}
              className="w-full rounded-full border-[1.5px] border-ink-strong/16 bg-white px-5 py-3 text-center text-[0.95rem] outline-none focus:border-accent disabled:opacity-70"
            />
            <button
              type="submit"
              disabled={pending}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-[0.95rem] font-bold text-on-accent transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Mail size={16} strokeWidth={2.5} aria-hidden="true" />
              )}
              {pending ? 'Sending…' : 'Email me a sign-in link'}
            </button>
          </form>

          {MICROSOFT_SIGN_IN_ENABLED && (
            <>
              <div className="my-5 flex w-full items-center gap-3 text-xs font-semibold text-ink-strong/40">
                <span className="h-px flex-1 bg-ink-strong/10" />
                or
                <span className="h-px flex-1 bg-ink-strong/10" />
              </div>
              <button
                type="button"
                onClick={signInWithMicrosoft}
                disabled={pending}
                className="inline-flex w-full items-center justify-center gap-3 rounded-full border-[1.5px] border-ink-strong/16 bg-white px-6 py-3 text-[0.95rem] font-bold text-ink-strong transition hover:-translate-y-px hover:shadow-[0_8px_16px_rgba(24,24,27,0.1)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <MicrosoftMark />
                Sign in with Microsoft
              </button>
            </>
          )}

          {error && (
            <p className="mt-4 text-sm font-medium text-[#dc2626]">{error}</p>
          )}
        </>
      )}
    </div>
  );
}
