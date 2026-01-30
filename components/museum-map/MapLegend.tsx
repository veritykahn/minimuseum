'use client';

/**
 * Legend showing map symbols
 */
export function MapLegend() {
  return (
    <>
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-line solid" />
          <span>Open</span>
        </div>
        <div className="legend-item">
          <span className="legend-line dashed" />
          <span>Coming Soon</span>
        </div>
      </div>

      <style jsx>{`
        .map-legend {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(125, 132, 113, 0.2);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-outfit), sans-serif;
          font-size: 0.75rem;
          color: rgba(250, 250, 250, 0.6);
        }

        .legend-line {
          width: 20px;
          height: 2px;
        }

        .legend-line.solid {
          background: #7D8471;
        }

        .legend-line.dashed {
          background: repeating-linear-gradient(
            90deg,
            rgba(125, 132, 113, 0.5) 0px,
            rgba(125, 132, 113, 0.5) 4px,
            transparent 4px,
            transparent 8px
          );
        }

        @media (max-width: 480px) {
          .map-legend {
            flex-wrap: wrap;
            gap: 12px;
          }
        }
      `}</style>
    </>
  );
}
