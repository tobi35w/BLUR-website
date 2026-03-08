import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { Database } from '@/lib/supabase';

type WaitlistRequest = {
  email?: string;
};

function getServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function sendWaitlistEmail(email: string) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.WAITLIST_FROM_EMAIL;

  if (!resendApiKey || !fromEmail) {
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [email],
      subject: 'You are on the BLUR waitlist',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2>Thanks for joining the BLUR waitlist.</h2>
          <p>I appreciate your interest in BLUR.</p>
          <p>We are building something sharp, practical, and worth the wait. You will be among the first to hear when access opens.</p>
          <p>Thanks again for the anticipation and support.</p>
          <p>BLUR</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send waitlist email.');
  }
}

export async function POST(request: Request) {
  const supabase = getServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Server waitlist configuration is missing Supabase credentials.' },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as WaitlistRequest | null;
  const email = body?.email?.trim().toLowerCase();

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  const { error } = await supabase.from('waitlist_signups').insert({
    email,
    source: 'website',
  });

  if (error && error.code !== '23505') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  try {
    if (!error) {
      await sendWaitlistEmail(email);
    }
  } catch {
    return NextResponse.json(
      {
        message: 'You are on the BLUR waitlist. We saved your email, but the thank-you email could not be sent yet.',
      },
      { status: 200 },
    );
  }

  if (error?.code === '23505') {
    return NextResponse.json({ message: 'You are already on the BLUR waitlist.' });
  }

  return NextResponse.json({
    message: "You're on the BLUR waitlist. Check your inbox for a thank-you email.",
  });
}
