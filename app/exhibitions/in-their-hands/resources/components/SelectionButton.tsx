'use client';

type SelectionButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};

/**
 * Reusable selection button for the resource wizard
 */
export function SelectionButton({ onClick, children }: SelectionButtonProps) {
  return (
    <>
      <button className="selection-btn" onClick={onClick}>
        {children}
      </button>

      <style jsx>{`
        .selection-btn {
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 16px 32px;
          background: transparent;
          border: 1px solid rgba(125, 132, 113, 0.4);
          color: #fafafa;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 140px;
        }
        .selection-btn:hover {
          border-color: #7D8471;
          background: rgba(125, 132, 113, 0.1);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .selection-btn {
            padding: 14px 24px;
            min-width: 120px;
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
}
