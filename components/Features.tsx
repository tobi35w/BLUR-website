'use client';

import { useReveal } from './useReveal';

const features = [
  {
    icon: '\u25CE',
    title: 'Practice Before Real Life',
    desc: 'Rehearse difficult conversations with AI before facing them in the real world. No consequences, just growth.',
  },
  {
    icon: '\u2726',
    title: 'Instant, Honest Feedback',
    desc: 'Every session ends with structured AI feedback, your strengths, blind spots, and exactly what to improve next.',
  },
  {
    icon: '\u25B2',
    title: 'Progress That Feels Real',
    desc: 'XP, levels, streaks, and rank insights turn invisible growth into something you can actually see and track.',
  },
];

export default function Features() {
  const ref = useReveal();

  return (
    <section id="features" className="sec" ref={ref}>
      <div className="reveal">
        <div className="sec-eye">Why BLUR</div>
        <h2>
          A smarter way to
          <br />
          <span className="g">build real confidence.</span>
        </h2>
        <p className="sec-body">
          BLUR combines immersive roleplay, adaptive AI, and meaningful progression so practice feels real, not awkward
          or generic.
        </p>
      </div>
      <div className="feat-grid">
        {features.map((feature, index) => (
          <div className={`feat-card reveal d${index + 1}`} key={feature.title}>
            <div className="feat-icon">{feature.icon}</div>
            <div className="feat-title">{feature.title}</div>
            <div className="feat-desc">{feature.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
