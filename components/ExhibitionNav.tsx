'use client';

import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

type ExhibitionNavProps = {
  /** Page-specific classes that carry the look (e.g. "hr-nav hr-nav-left"). */
  className: string;
  /** Route target. When given, renders a real link. */
  href?: string;
  /** In-page action (or side effect before navigating when used with href). */
  onClick?: () => void;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * The "M ← First Floor" / "Resources → M" corner navigation used across the
 * exhibitions. Renders a <Link> for routes and a <button> for in-page actions,
 * so it is keyboard-operable and announced correctly, while the visual styling
 * stays with each page's own classes. Pages mark the decorative "M" and arrow
 * aria-hidden, so the visible label ("First Floor", "Resources") is the name.
 */
export default function ExhibitionNav({ className, href, onClick, style, children }: ExhibitionNavProps) {
  if (href) {
    return (
      <Link href={href} className={`exh-nav ${className}`} onClick={onClick} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={`exh-nav btn-reset ${className}`} onClick={onClick} style={style}>
      {children}
    </button>
  );
}
