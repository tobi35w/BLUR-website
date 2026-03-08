'use client';
import { useReveal } from './useReveal';

export default function Download() {
  const ref = useReveal();
  return (
    <div className="dl-wrap" id="download" ref={ref}>
      <div className="dl-inner reveal">
        <div className="dl-eyebrow">Download</div>
        <div className="dl-headline">
          Start training<br /><span className="g">today.</span>
        </div>
        <p className="dl-sub">Download BLUR free. No subscriptions to start. Just practice.</p>

        <div className="dl-btns">
          {/* App Store */}
          <a href="#" className="dl-btn">
            <svg className="dl-btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div>
              <div className="dl-btn-sub">Download on the</div>
              <div className="dl-btn-name">App Store</div>
            </div>
          </a>

          {/* Google Play */}
          <a href="#" className="dl-btn">
            <svg className="dl-btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.18 23.76c.3.17.64.21.96.12l11.26-6.5-2.41-2.41-9.81 8.79zm-1.45-17.5C1.27 6.7 1 7.24 1 7.87v8.26c0 .63.27 1.17.73 1.61l.09.08 4.63-4.63v-.11L1.73 6.26zm14.37 6.47l-1.55-1.55-3.08 3.08 1.55 1.55 3.08-3.08zm-13.08-8.1l9.81 8.79 2.41-2.41L3.98 1.01c-.32-.1-.66-.05-.96.13l-.7.4 1.7 3.09z" />
            </svg>
            <div>
              <div className="dl-btn-sub">Get it on</div>
              <div className="dl-btn-name">Google Play</div>
            </div>
          </a>
        </div>

        <div className="dl-fine">Free to download · iOS &amp; Android · No account needed to try</div>
      </div>
    </div>
  );
}
