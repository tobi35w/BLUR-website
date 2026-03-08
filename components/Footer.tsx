export default function Footer() {
  const copyright = '\u00A9';
  const middleDot = '\u00B7';

  return (
    <footer>
      <div className="footer-logo">BLUR</div>
      <div className="footer-copy">
        {copyright} 2026 BLUR {middleDot} blursim.com {middleDot} All rights reserved
      </div>
      <div className="footer-links">
        <a href="mailto:tobi@blursim.com">tobi@blursim.com</a>
        <a href="/privacy">Privacy</a>
        <a href="https://blursim.com">blursim.com</a>
      </div>
    </footer>
  );
}
