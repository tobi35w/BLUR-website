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

In `components/Waitlist.tsx`, replace the simulated delay with a real API call to:
- [Resend](https://resend.com) for email capture
- [Mailchimp](https://mailchimp.com)
- Or your own Supabase table
"# BLUR-website" 
