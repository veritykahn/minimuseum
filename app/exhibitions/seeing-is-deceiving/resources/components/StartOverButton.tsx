'use client';

type StartOverButtonProps = {
  onClick: () => void;
};

/**
 * Start over button to reset the wizard
 */
export function StartOverButton({ onClick }: StartOverButtonProps) {
  return (
    <>
      <button className="start-over" onClick={onClick}>
        ← Start Over
      </button>

      <style jsx>{`
        .start-over {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #525252;
          background: none;
          border: none;
          cursor: pointer;
          margin-top: 48px;
          transition: color 0.3s ease;
        }
        .start-over:hover {
          color: #7D8471;
        }
      `}</style>
    </>
  );
}
