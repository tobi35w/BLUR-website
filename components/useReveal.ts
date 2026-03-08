'use client';

import { useEffect, useRef } from 'react';

let revealObserver: IntersectionObserver | null = null;

function getRevealObserver() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('visible');
          revealObserver?.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' },
    );
  }

  return revealObserver;
}

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('visible');
      el.querySelectorAll('.reveal').forEach((target) => target.classList.add('visible'));
      return;
    }

    const observer = getRevealObserver();
    if (!observer) {
      return;
    }

    // Observe this element and all .reveal children
    const targets = el.querySelectorAll('.reveal');
    targets.forEach((target) => observer.observe(target));
    if (el.classList.contains('reveal')) {
      observer.observe(el);
    }

    return () => {
      targets.forEach((target) => observer.unobserve(target));
      if (el.classList.contains('reveal')) {
        observer.unobserve(el);
      }
    };
  }, []);

  return ref;
}
