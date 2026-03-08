export default function Hero() {
  return (
    <div className="hero">
      <div>
        <div className="hero-tag">
          <span className="tag-dot" />
          AI-Powered Social Training
        </div>

        <h1>
          Rehearse<br />
          <span className="acc">difficult</span><br />
          <span className="dim">situations.</span>
        </h1>

        <p className="hero-sub">
          BLUR is an AI-powered training app that puts you in real social scenarios,
          practice conversations, set boundaries, and build confidence before it actually matters.
        </p>

        <div className="hero-btns">
          <a href="#how" className="btn-ghost">How It Works</a>
        </div>

        <div className="hero-stats">
          {[['20+','Scenarios'],['AI','Powered'],['6','Grade Tiers'],['Free','To Start']].map(([v,l]) => (
            <div className="stat-cell" key={l}>
              <div className="stat-val">{v}</div>
              <div className="stat-lbl">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulation preview card */}
      <div className="sim-card">
        <div className="sim-outer">
          <div className="sim-inner">
            <div className="sim-phone-top">
              <div className="sim-notch" />
              <div className="sim-phone-icons">
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="sim-top">
              <div className="sim-profile">
                <div className="sim-avatar">
                  <span>NM</span>
                </div>
                <div>
                  <div className="sim-name">Noah Mercer</div>
                  <div className="sim-meta">LVL 10 | 60/120 XP | Scenario: Setting a boundary</div>
                </div>
              </div>
              <div className="sim-actions">
                <div className="live-badge">
                  <span className="live-dot" />
                  Live AI
                </div>
                <button className="sim-end-btn" type="button">
                  End
                </button>
              </div>
            </div>

            <div className="sim-status">Daily simulation cap paused for beta preview</div>

            <div className="msgs">
              <div className="msg msg-ai-chat">
                <div className="msg-txt">
                  You are making this more serious than it needs to be. I was joking, and I do not get why you keep
                  bringing it up.
                </div>
              </div>

              <div className="msg msg-you-chat">
                <div className="msg-txt">
                  I am bringing it up because it did affect me. Even if you meant it as a joke, I need you to stop
                  speaking to me like that.
                </div>
              </div>

              <div className="msg msg-ai-chat">
                <div className="msg-txt">
                  Alright, I hear you. I did not realize it landed that way, but I can see you are being serious.
                </div>
              </div>

              <div className="msg msg-you-chat msg-typing">
                <div className="msg-txt">
                  Thank you. What I need is for that line not to be crossed again, especially when I have already said it makes me uncomfortable.<span className="cursor" />
                </div>
              </div>
            </div>

            <div className="score-blk">
              <div className="score-row">
                <div className="score-lbl">Confidence Grade</div>
                <div className="score-val">A</div>
              </div>
              <div className="score-track"><div className="score-fill" /></div>
              <div className="score-note">Clear tone. Strong boundary. Could be even firmer if pressure continues.</div>
            </div>

            <div className="sim-bottom-bar" />
          </div>
        </div>
      </div>
    </div>
  );
}
