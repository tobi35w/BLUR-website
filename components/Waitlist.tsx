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
    setError('');
    if (!email || !email.includes('@')) {
      setError('Enter a valid email.');
      return;
    }
    setLoading(true);
 
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        if (data?.message) {
          setSuccessMessage(data.message);
        }
        setSubmitted(true);
      } else {
        setError(data?.error || 'Something went wrong. Try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Network issue. Please try again.');
    }

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
