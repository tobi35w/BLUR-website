import Nav        from '@/components/Nav';
import Hero       from '@/components/Hero';
import Ticker     from '@/components/Ticker';
import Features   from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Judging    from '@/components/Judging';
import Progression from '@/components/Progression';
import AuthSection from '@/components/AuthSection';
import Reviews from '@/components/Reviews';
import Waitlist   from '@/components/Waitlist';
import Footer     from '@/components/Footer';

const SHOW_REVIEWS = false;

export default function Home() {
  return (
    <>
      {/* Background layers */}
      <div className="grid-bg" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <Nav />
      <Hero />
      <Ticker />
      <Features />
      <HowItWorks />
      <Judging />
      <Progression />
      <AuthSection />
      {SHOW_REVIEWS ? <Reviews /> : null}
      <Waitlist />
      <Footer />
    </>
  );
}
