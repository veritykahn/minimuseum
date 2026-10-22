import Link from 'next/link';
import { storyLinksForCoin } from '../story-links';

/** "This coin in the story": its Timeline stop, Hands of History round, lesson. */
export default function CoinStoryLinks({ coinId }: { coinId: string }) {
  const links = storyLinksForCoin(coinId);
  if (!links.length) return null;
  return (
    <nav className="cv-story" aria-labelledby="cv-story-title">
      <style>{`
        .cv-story { margin-top: 14px; }
        .cv-story-title {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #a3a3a3;
          margin: 0 0 6px;
        }
        .cv-story ul { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 4px 18px; }
        .cv-story ul a {
          display: inline-block;
          padding: 4px 0;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          color: #E2C36B;
          text-decoration: underline;
          text-decoration-color: rgba(226, 195, 107, 0.4);
          text-underline-offset: 3px;
        }
        .cv-story ul a:hover { color: #fafafa; text-decoration-color: currentColor; }
        .cv-story ul a:focus-visible { outline: 2px solid #fafafa; outline-offset: 2px; }
      `}</style>
      <h2 className="cv-story-title" id="cv-story-title">This coin in the story</h2>
      <ul>
        {links.map(l => (
          <li key={l.kind}><Link href={l.href}>{l.label}</Link></li>
        ))}
      </ul>
    </nav>
  );
}
