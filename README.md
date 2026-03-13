# BLUR Website

The official landing page for [blursim.com](https://blursim.com).

Built with **Next.js 14** (App Router) + **TypeScript**.

## Getting Started

```bash
# Install dependencies
npm install

# Run locally
npm run dev
# → http://localhost:3000

# Build for production
npm run build
npm start
```

### Environment variables

Copy `.env.example` to `.env.local` and fill in values:

- `RESEND_API_KEY` - from Resend dashboard
- `WAITLIST_FROM_EMAIL` - e.g. `BLUR <hello@blursim.com>`
- `NEXT_PUBLIC_SUPABASE_URL` - your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - preferred for inserting into `waitlist_signups`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - optional if you keep the public insert policy enabled

Supabase schema lives in `supabase/schema.sql` (includes the `waitlist_signups` table and RLS). Run it once in the Supabase SQL editor or via the CLI.

## Project Structure

```
blur-website/
├── app/
│   ├── layout.tsx        ← Root layout + metadata
│   ├── page.tsx          ← Home page
│   ├── globals.css       ← All styles
│   └── privacy/
│       └── page.tsx      ← Privacy policy page
├── components/
│   ├── Nav.tsx           ← Sticky nav with active section + mobile menu
│   ├── Hero.tsx          ← Hero section with sim card
│   ├── Ticker.tsx        ← Scrolling scenario ticker
│   ├── Features.tsx      ← Why BLUR cards
│   ├── HowItWorks.tsx    ← Steps + scenarios
│   ├── Judging.tsx       ← Grade system + feedback preview
│   ├── Progression.tsx   ← XP / streak / rank cards
│   ├── Download.tsx      ← App Store + Play Store
│   ├── Waitlist.tsx      ← Email signup form
│   ├── Footer.tsx        ← Footer
│   └── useReveal.ts      ← Scroll-reveal hook
├── public/
│   └── logo.png          ← BLUR logo
├── next.config.js
├── tsconfig.json
└── package.json
```

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → Import project
3. Select the repo — Vercel auto-detects Next.js
4. Add your custom domain: `blursim.com`
5. Update DNS at your registrar to point to Vercel

## Updating Download Links

In `components/Download.tsx`, replace the `href="#"` on both buttons with your real App Store / Play Store URLs.

## Connecting Waitlist Form

Already wired: `components/Waitlist.tsx` POSTs to `/api/waitlist`, which:
- Inserts the email into `waitlist_signups` in Supabase (source = `website`)
- Sends a confirmation email through Resend

Just set the env vars above, deploy, and you're live.
"# BLUR-website" 
