'use client';

import { useState } from 'react';
import { getSupabaseClient, hasSupabaseEnv } from '@/lib/supabase';
import { useReveal } from './useReveal';

export default function Waitlist() {
  const ref = useReveal();
  const [supabase] = useState(() => getSupabaseClient());
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }

    if (!supabase || !hasSupabaseEnv()) {
      setError('Waitlist is not configured yet. Add your Supabase environment variables first.');
      return;
    }

    setLoading(true);
    setError('');

    const { error: insertError } = await supabase.from('waitlist_signups').insert({
      email: trimmedEmail,
      source: 'website',
    });

    if (insertError) {
      if (insertError.code === '23505') {
        setSubmitted(true);
        setEmail('');
        setLoading(false);
        return;
      }

      setError(insertError.message);
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setEmail('');
    setLoading(false);
  };

  return (
    <div className="wl-wrap" ref={ref}>
      <div className="wl-card reveal">
        <div className="sec-eye" style={{ justifyContent: 'center', marginBottom: 16 }}>
          Early Access
        </div>
        <div className="wl-title">Be first to experience BLUR.</div>
        <p className="wl-sub">
          Join the waitlist for beta access, launch updates, and news on the future of AI-powered social training.
        </p>

        {submitted ? (
          <div className="wl-success">&#10022; You&apos;re on the list. We&apos;ll be in touch.</div>
        ) : (
          <>
            <div className="wl-form">
              <input
                className="wl-input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
              />
              <button className="wl-btn" type="button" onClick={handleSubmit} disabled={loading || !hasSupabaseEnv()}>
                {loading ? '...' : 'Join'}
              </button>
            </div>
            {error ? <div className="auth-error">{error}</div> : null}
            <div className="wl-note">No spam. Just product updates, beta news, and launch drops.</div>
          </>
        )}
      </div>
    </div>
  );
}
