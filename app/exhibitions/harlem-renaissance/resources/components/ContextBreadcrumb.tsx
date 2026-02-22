'use client';

type ContextBreadcrumbProps = {
  items: string[];
};

/**
 * Breadcrumb showing user's current path through the wizard
 */
export function ContextBreadcrumb({ items }: ContextBreadcrumbProps) {
  return (
    <>
      <p className="context-breadcrumb">
        {items.map((item, index) => (
          <span key={index}>
            {index > 0 && ' \u2192 '}
            {index === 0 ? item : <span className="highlight">{item}</span>}
          </span>
        ))}
      </p>

      <style jsx>{`
        .context-breadcrumb {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #525252;
          margin-bottom: 24px;
        }
        .context-breadcrumb :global(.highlight) {
          color: #7D8471;
        }
      `}</style>
    </>
  );
}
