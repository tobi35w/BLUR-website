import { Resend } from 'resend';
import { NextResponse } from 'next/server';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: 'BLUR <tobikolakareem@blursim.com>',
      to: email,
      subject: "You've Joined the waitlist!",
      text: `Hey,

You just took the first step toward something most people never do, and
actually deciding to get better at the stuff that makes them anxious.

BLUR is an AI-powered training app that simulates the real social
situations you dread, so you can practice them before they happen.
No judgment. No audience. Just you, the AI, and honest feedback.

We're in active development and getting close.

When we launch, you'll be the first to know and the first to get in.

Stay sharp.

 BLUR Team
www.blursim.com`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
