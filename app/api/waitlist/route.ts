import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  // Save to Supabase (ignore if email already exists)
  const { error: dbError } = await supabase
    .from('waitlist')
    .insert({ email })
    .select();

  if (dbError && dbError.code !== '23505') {
    // 23505 = unique violation (already on list) — that's fine, still send the email
    console.error('DB error:', dbError);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  // Send thank-you email via Resend
  try {
    await resend.emails.send({
      from: 'BLUR <hello@blursim.com>',
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
