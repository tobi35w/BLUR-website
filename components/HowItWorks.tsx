'use client';
import { useReveal } from './useReveal';

const steps = [
  ['Choose a Scenario', 'Pick the exact kind of conversation you want to practice, from easy ice-breakers to confrontational moments.'],
  ['Talk to the AI',    'BLUR acts out the situation with realistic pressure, tone, and push-back. The AI never lets you off easy.'],
  ['Get Judged',        'Receive a structured performance review, sincerity, assertiveness, clarity, emotional intelligence, then earn XP.'],
  ['Level Up',          'Track XP, streaks, and rank progress as your communication genuinely improves over time.'],
];

const scenarios = [
  ['Setting boundaries with a manipulative friend', 'Hard'],
  ['Starting conversations without overthinking',   'Easy'],
  ['Handling awkward silences with confidence',     'Medium'],
  ['Speaking up in meetings or public spaces',      'Medium'],
];

export default function HowItWorks() {
  const ref = useReveal();
  return (
    <section id="how" className="sec" style={{ paddingTop: 0 }} ref={ref}>
      <div className="reveal">
        <div className="sec-eye">The Process</div>
        <h2>Train. Reflect.<br /><span className="g">Improve.</span></h2>
      </div>
      <div className="how-grid">
        <div className="steps-card reveal d1">
          {steps.map(([title, desc], i) => (
            <div className="step-item" key={title}>
              <div className="step-num">0{i + 1}</div>
              <div>
                <div className="step-title">{title}</div>
                <div className="step-desc">{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="scen-card reveal d2">
          <div className="sec-eye" style={{ marginBottom: 16 }}>Popular Scenarios</div>
          <h3 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 24 }}>
            Built for moments<br />that actually matter.
          </h3>
          {scenarios.map(([name, diff]) => (
            <div className="scen-item" key={name}>
              <div className="scen-name">{name}</div>
              <div className="scen-chip">{diff}</div>
            </div>
          ))}
          <div className="vision">
            <div className="vision-eye">Vision</div>
            <div className="vision-txt">BLUR is not just another mental wellness app. It is a training environment for social courage.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
