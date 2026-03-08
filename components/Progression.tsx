'use client';

import { useReveal } from './useReveal';

const cards = [
  { icon: '\u26A1', title: 'XP System', desc: 'Every session earns XP based on your grade. Grind your way up with consistency.' },
  { icon: '\uD83C\uDFC6', title: 'Ranked Tiers', desc: 'Climb from Newcomer to Elite. Your rank reflects your real progress, not time spent.' },
  { icon: '\uD83D\uDD25', title: 'Daily Streaks', desc: "Daily goals push you to show up even when it's uncomfortable. That's how growth happens." },
  { icon: '\uD83D\uDCCA', title: 'Session History', desc: "Every conversation is logged. Review past sessions and see exactly how far you've come." },
];

export default function Progression() {
  const ref = useReveal();

  return (
    <section id="progress" className="sec" style={{ paddingTop: 0 }} ref={ref}>
      <div className="reveal">
        <div className="sec-eye">Growth System</div>
        <h2>
          Earn every
          <br />
          <span className="g">level.</span>
        </h2>
        <p className="sec-body">
          BLUR tracks your growth with a full XP and ranking system. Daily goals and streaks keep you showing up.
        </p>
      </div>
      <div className="prog-grid">
        {cards.map((card, index) => (
          <div className={`prog-card reveal d${index + 1}`} key={card.title}>
            <div className="prog-icon">{card.icon}</div>
            <div className="prog-title">{card.title}</div>
            <div className="prog-desc">{card.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
