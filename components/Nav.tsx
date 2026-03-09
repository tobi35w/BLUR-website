'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/supabase';

const SHOW_REVIEWS = false;
const sections = SHOW_REVIEWS
  ? ['features', 'how', 'judging', 'progress', 'auth', 'reviews']
  : ['features', 'how', 'judging', 'progress', 'auth'];

export default function Nav() {
  const [supabase] = useState(() => getSupabaseClient());
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const getCurrentSection = () => {
      const scrollPosition = window.scrollY + 120;
      let current = '';

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && scrollPosition >= el.offsetTop) {
          current = id;
        }
      }

      return current;
    };

    const updateNavState = () => {
      frameRef.current = null;
      setScrolled(window.scrollY > 40);
      setActive(getCurrentSection());
    };

    const onScroll = () => {
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(updateNavState);
    };

    updateNavState();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session);
        setAuthReady(true);
      }
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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMenuOpen(false);
    }
  };

  const firstName =
    typeof session?.user?.user_metadata?.first_name === 'string'
      ? session.user.user_metadata.first_name
      : '';

  const navItems = SHOW_REVIEWS
    ? [['Features', 'features'], ['How It Works', 'how'], ['Judging', 'judging'], ['Progress', 'progress'], ['Reviews', 'reviews']]
    : [['Features', 'features'], ['How It Works', 'how'], ['Judging', 'judging'], ['Progress', 'progress']];
  const mobileItems = SHOW_REVIEWS
    ? [['Features', 'features'], ['How It Works', 'how'], ['Judging', 'judging'], ['Progress', 'progress'], ['Reviews', 'reviews'], ['Log In', 'auth'], ['Sign Up', 'auth']]
    : [['Features', 'features'], ['How It Works', 'how'], ['Judging', 'judging'], ['Progress', 'progress'], ['Log In', 'auth'], ['Sign Up', 'auth']];

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <button
          className="nav-logo"
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ background: 'none', border: 'none' }}
        >
          <div className="logo-mark">
            <Image src="/logo.png" alt="BLUR" width={32} height={32} style={{ objectFit: 'cover', borderRadius: '50%' }} />
          </div>
          <div>
            <div className="logo-name">BLUR</div>
            <div className="logo-sub">{firstName ? `Hi, ${firstName}` : 'Social confidence, trained'}</div>
          </div>
        </button>

        <ul className="nav-links">
          {navItems.map(([label, id]) => (
            <li key={`${label}-${id}`}>
              <a className={active === id ? 'active' : ''} onClick={() => scrollTo(id)}>{label}</a>
            </li>
          ))}
        </ul>

        {!session && authReady && (
          <div className="nav-actions">
            <a className="nav-login" onClick={() => scrollTo('auth')} style={{ cursor: 'pointer' }}>Log In</a>
            <a className="nav-signup" onClick={() => scrollTo('auth')} style={{ cursor: 'pointer' }}>Sign Up</a>
          </div>
        )}

        <button className={`hamburger${menuOpen ? ' open' : ''}`} type="button" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <ul>
          {mobileItems.map(([label, id]) => (
            <li key={`${label}-${id}`}><a onClick={() => scrollTo(id)}>{label}</a></li>
          ))}
        </ul>
      </div>
    </>
  );
}
