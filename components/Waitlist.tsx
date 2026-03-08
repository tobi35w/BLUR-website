'use client';

import { useState } from 'react';
import { useReveal } from './useReveal';

export default function Waitlist() {
  const ref = useReveal();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState("You're on the list. We'll be in touch.");

  const handleSubmit = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage("You're on the list. We'll be in touch.");

    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: trimmedEmail,
      }),
    });

    const payload = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;

    if (!response.ok) {
      setError(payload?.error ?? 'Unable to join the waitlist right now.');
      setLoading(false);
      return;
    }

    if (payload?.message) {
      setSuccessMessage(payload.message);
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
          <div className="wl-success">&#10022; {successMessage}</div>
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
              <button className="wl-btn" type="button" onClick={handleSubmit} disabled={loading}>
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
