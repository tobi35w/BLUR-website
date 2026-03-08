import Link from 'next/link';

export default function Privacy() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '120px 48px 80px', position: 'relative', zIndex: 1 }}>
      <div className="grid-bg" />
      <Link href="/" style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--green)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 48 }}>
        ← Back to BLUR
      </Link>
      <div className="sec-eye">Legal</div>
      <h2>Privacy <span className="g">Policy</span></h2>
      <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 28, color: 'var(--muted)', lineHeight: 1.8, fontSize: 15 }}>
        <p><strong style={{ color: 'var(--text)', fontFamily: "'Orbitron',sans-serif", fontSize: 13 }}>Last updated:</strong> March 2026</p>
        <p>BLUR (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights.</p>
        {[
          ['What We Collect', 'We collect your email address when you join the waitlist. When using the app, we collect anonymized session data to improve AI performance. We do not sell your data to third parties.'],
          ['How We Use It',   'Your email is used solely to send product updates, beta invites, and launch announcements. You can unsubscribe at any time. Session data is used to improve BLUR\'s AI models and judging accuracy.'],
          ['Data Storage',    'Data is stored securely using industry-standard encryption. We use Supabase for data storage. Data is never shared with advertisers.'],
          ['Your Rights',     'You can request deletion of your data at any time by emailing tobi@blursim.com. We will process deletion requests within 30 days.'],
          ['Contact',         'For any privacy concerns, reach out to tobi@blursim.com.'],
        ].map(([title, text]) => (
          <div key={title as string}>
            <h3 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
