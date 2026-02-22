'use client';

type DownloadItemProps = {
  name: string;
  subtitle: string;
  href: string;
};

/**
 * Single downloadable item with info and download button
 */
export function DownloadItem({ name, subtitle, href }: DownloadItemProps) {
  return (
    <>
      <div className="download-item">
        <div className="download-info">
          <span className="download-name">{name}</span>
          <span className="download-subtitle">{subtitle}</span>
        </div>
        <a href={href} download className="download-btn">
          Download
        </a>
      </div>

      <style jsx>{`
        .download-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .download-item:last-child {
          border-bottom: none;
        }

        .download-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .download-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          color: #fafafa;
        }

        .download-subtitle {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          color: #666;
          letter-spacing: 0.05em;
        }

        .download-btn {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 10px 20px;
          background: transparent;
          border: 1px solid rgba(125, 132, 113, 0.4);
          color: #7D8471;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }
        .download-btn:hover {
          border-color: #7D8471;
          background: rgba(125, 132, 113, 0.15);
          color: #fafafa;
        }

        @media (max-width: 768px) {
          .download-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>
    </>
  );
}
