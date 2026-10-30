/*
 * A museum note: a fact from outside the posters, owner-approved and
 * fact-checked, set as a plain caption with its source beneath it, small and
 * linked. Each room styles it in its own caption voice through `className`
 * (the note) and `${className}-source` (its source line).
 */

export type FactSource = { label: string; href: string };

export type ApprovedFact = {
  text: string;
  sources: readonly FactSource[];
};

export function FactSources({ sources, className }: { sources: readonly FactSource[]; className: string }) {
  return (
    <span className={className}>
      {sources.length > 1 ? 'Sources: ' : 'Source: '}
      {sources.map((s, i) => (
        <span key={s.href}>
          {i > 0 && '; '}
          <a href={s.href} target="_blank" rel="noopener noreferrer">
            {s.label}
          </a>
        </span>
      ))}
    </span>
  );
}

export default function FactNote({ fact, className, as: Tag = 'p', lead }: { fact: ApprovedFact; className: string; as?: 'p' | 'div'; lead?: string }) {
  return (
    <Tag className={className} data-fact="approved">
      {lead && <><strong className={`${className}-lead`}>{lead}</strong>{' '}</>}
      <span className={`${className}-text`}>{fact.text}</span>{' '}
      <FactSources sources={fact.sources} className={`${className}-source`} />
    </Tag>
  );
}
