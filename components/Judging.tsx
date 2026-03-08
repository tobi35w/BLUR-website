'use client';

import { useReveal } from './useReveal';

const grades = [
  { letter: 'A', color: '#22c55e', width: '88%', range: '90-100', xp: '50 XP' },
  { letter: 'B', color: '#3b82f6', width: '74%', range: '80-89', xp: '40 XP' },
  { letter: 'C', color: '#f97316', width: '60%', range: '70-79', xp: '30 XP' },
  { letter: 'D', color: '#eab308', width: '46%', range: '60-69', xp: '20 XP' },
  { letter: 'E', color: '#fdba74', width: '32%', range: '50-59', xp: '10 XP' },
  { letter: 'F', color: '#ef4444', width: '20%', range: '0-49', xp: '0 XP' },
];

const criteria = [
  ['Sincerity & Authenticity', 90],
  ['Clarity & Directness', 82],
  ['Emotional Intelligence', 88],
  ['Assertiveness', 80],
  ['Conversational Flow', 86],
] as const;

const fire = '\uD83D\uDD25';
const middleDot = '\u00B7';

export default function Judging() {
  const ref = useReveal();

  return (
    <section id="judging" className="sec" style={{ paddingTop: 0 }} ref={ref}>
      <div className="grade-split">
        <div>
          <div className="reveal">
            <div className="sec-eye">The Judging System</div>
            <h2>
              No mercy.
              <br />
              <span className="g">Real feedback.</span>
            </h2>
            <p className="sec-body">
              Our AI judge scores you across 5 dimensions. Sarcasm, deflection, and half-hearted effort all get called
              out.
            </p>
          </div>

          <div className="grade-list reveal d1">
            {grades.map((grade) => (
              <div className="grade-row" key={grade.letter}>
                <div className="grade-letter" style={{ color: grade.color }}>
                  {grade.letter}
                </div>
                <div className="grade-track">
                  <div
                    className="grade-fill"
                    style={{
                      width: grade.width,
                      background: grade.color,
                      boxShadow: `0 0 6px ${grade.color}60`,
                    }}
                  />
                </div>
                <div className="grade-meta">
                  {grade.range} {middleDot} {grade.xp}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal d2">
          <div className="sec-eye" style={{ marginBottom: 20 }}>
            Sample Feedback
          </div>
          <div className="fb-card">
            <div className="fb-head">
              <div>
                <div className="fb-head-title">Session Complete</div>
                <div className="fb-head-sub">Scenario: Saying Sorry</div>
              </div>
              <div className="grade-big" style={{ color: '#22c55e', textShadow: '0 0 20px rgba(34,197,94,.45)' }}>
                A
              </div>
            </div>

            <div className="fb-body">
              <div className="fb-scores">
                <div>
                  <div className="fb-met-v">86</div>
                  <div className="fb-met-l">Score</div>
                </div>
                <div>
                  <div className="fb-met-v" style={{ color: '#22c55e' }}>
                    +50
                  </div>
                  <div className="fb-met-l">XP Earned</div>
                </div>
                <div>
                  <div className="fb-met-v" style={{ color: '#f97316' }}>
                    {fire} 4
                  </div>
                  <div className="fb-met-l">Day Streak</div>
                </div>
              </div>

              <div className="fb-div" />

              {criteria.map(([name, score]) => (
                <div className="fb-crit" key={name}>
                  <div className="fb-crit-n">{name}</div>
                  <div className="fb-crit-r">
                    <div className="fb-crit-bar">
                      <div className="fb-crit-f" style={{ width: `${score}%` }} />
                    </div>
                    <div className="fb-crit-s">{score}</div>
                  </div>
                </div>
              ))}

              <div className="fb-note">
                Strong apology, you acknowledged impact without making excuses. Next time, try holding the silence
                longer before offering a solution.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
