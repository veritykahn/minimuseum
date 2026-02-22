'use client';

type SectionHeaderProps = {
  children: React.ReactNode;
  isFirst?: boolean;
};

/**
 * Section header for download sections
 */
export function SectionHeader({ children, isFirst }: SectionHeaderProps) {
  return (
    <>
      <h3 className={`section-header ${isFirst ? 'first' : ''}`}>{children}</h3>

      <style jsx>{`
        .section-header {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #7D8471;
          margin-bottom: 20px;
          margin-top: 40px;
        }
        .section-header.first {
          margin-top: 0;
        }
      `}</style>
    </>
  );
}
