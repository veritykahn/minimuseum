import { Cormorant_Garamond, Outfit } from 'next/font/google';

// Self-hosted by Next, so the projector never falls back to Georgia
// on a slow school network.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-outfit',
  display: 'swap',
});

export default function LessonsLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${cormorant.variable} ${outfit.variable}`}>{children}</div>;
}
