import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.WAITLIST_FROM_EMAIL || 'BLUR <hello@blursim.com>';

  if (!resendApiKey) {
    return NextResponse.json({ error: 'Missing RESEND_API_KEY' }, { status: 500 });
  }

  const { email } = await req.json();

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  // Send thank-you email via Resend (no database storage)
  try {
    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: fromEmail,
      to: email,
      replyTo: 'tobi@blursim.com',
      subject: "You're in. BLUR is coming.",
      text: `Hey,

You just took the first step toward something most people never do —
actually deciding to get better at the stuff that makes them anxious.

BLUR is an AI-powered training app that simulates the real social
situations you dread, so you can practice them before they happen.
No judgment. No audience. Just you, the AI, and honest feedback.

We're in active development and getting close.

When we launch, you'll be the first to know — and the first to get in.

Stay sharp.

— The BLUR Team
blursim.com`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
