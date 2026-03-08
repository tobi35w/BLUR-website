'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabaseClient, hasSupabaseEnv } from '@/lib/supabase';
import { useReveal } from './useReveal';

type AuthMode = 'login' | 'signup';

const defaultMessage = 'Create your BLUR account or log in below.';

export default function AuthSection() {
  const ref = useReveal();
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [mode, setMode] = useState<AuthMode>('signup');
  const [session, setSession] = useState<Session | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(defaultMessage);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!mounted) {
        return;
      }

      if (sessionError) {
        setError(sessionError.message);
        return;
      }

      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        setSession(nextSession);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      setError('Add your Supabase environment variables first.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage(defaultMessage);

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
            },
            emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        setMessage('Account created. Check your email if Supabase email confirmation is enabled for this project.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }

        setMessage('You are logged in. This session now matches the same Supabase auth used by the BLUR app.');
      }

      setPassword('');
      if (mode === 'signup') {
        setFirstName('');
        setLastName('');
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to complete auth request.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!supabase) {
      return;
    }

    setLoading(true);
    setError('');

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
    } else {
      setMessage('Signed out successfully.');
    }

    setLoading(false);
  };

  if (session) {
    return null;
  }

  return (
    <section className="auth-wrap sec" id="auth" ref={ref}>
      <div className="section-head reveal">
        <div className="section-label">Account Access</div>
        <h2>Sign up or log in with the same BLUR account.</h2>
        <p>Create your BLUR account here or log in with your existing credentials.</p>
      </div>

      <div className="auth-grid auth-grid-single reveal">
        <div className="auth-card">
          <div className="auth-session-box auth-session-top">
            <span className="auth-session-label">Current session</span>
            <strong>Not logged in</strong>
          </div>

          <div className="auth-toggle" role="tablist" aria-label="Authentication mode">
            <button
              className={mode === 'signup' ? 'active' : ''}
              type="button"
              onClick={() => setMode('signup')}
            >
              Sign up
            </button>
            <button
              className={mode === 'login' ? 'active' : ''}
              type="button"
              onClick={() => setMode('login')}
            >
              Log in
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="auth-name-grid">
                <label>
                  <span>First name</span>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="Tobi"
                    required
                  />
                </label>

                <label>
                  <span>Last name</span>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Ade"
                    required
                  />
                </label>
              </div>
            )}

            <label>
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@blursim.com"
                required
              />
            </label>

            <label>
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 6 characters"
                minLength={6}
                required
              />
            </label>

            <button className="auth-submit" type="submit" disabled={loading || !hasSupabaseEnv()}>
              {loading ? 'Processing...' : mode === 'signup' ? 'Create account' : 'Log in'}
            </button>

          </form>

          {!hasSupabaseEnv() ? (
            <p className="auth-error">Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` to enable auth.</p>
          ) : null}
          {message ? <p className="auth-message">{message}</p> : null}
          {error ? <p className="auth-error">{error}</p> : null}
        </div>
      </div>
    </section>
  );
}
