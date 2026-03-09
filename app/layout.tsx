import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BLUR | Train Your Social Confidence',
  description:
    'BLUR is the AI-powered social simulation app. Practice real conversations, get judged, and level up your confidence.',
  metadataBase: new URL('https://blursim.com'),
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'BLUR | Train Your Social Confidence',
    description: 'Practice real social situations with AI. Get judged. Level up.',
    url: 'https://blursim.com',
    siteName: 'BLUR',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
