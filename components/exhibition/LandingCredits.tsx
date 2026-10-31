import { emphasisRuns } from './helpers';

/*
 * The landing page's picture credits, folded into a small "Picture credits"
 * toggle at its foot so the page still fits on one screen. Opened, the list
 * rises over the page above the toggle (poster-exhibition.css). A native
 * <details>, so it opens with the keyboard and is read as a disclosure.
 * Each credit is as its owner specifies, linked to its record; *Title* is
 * set in italics.
 */

export default function LandingCredits({ credits }: { credits: { text: string; href?: string }[] }) {
  if (credits.length === 0) return null;
  return (
    <details className="pe-landing-credits">
      <summary>Picture credits</summary>
      <ul className="pe-credits" aria-label="Picture credits">
        {credits.map((c) => {
          const text = emphasisRuns(c.text).map((r, i) => (r.em ? <em key={i}>{r.text}</em> : <span key={i}>{r.text}</span>));
          return (
            <li key={c.text}>
              {c.href ? (
                <a href={c.href} target="_blank" rel="noopener noreferrer">
                  {text}
                </a>
              ) : (
                text
              )}
            </li>
          );
        })}
      </ul>
    </details>
  );
}
