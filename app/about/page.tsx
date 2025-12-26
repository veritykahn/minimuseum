'use client';

export default function About() {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');

        body {
          background: #0a0a0a;
          color: #fafafa;
        }

        .font-serif {
          font-family: 'Cormorant Garamond', Georgia, serif;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #7D8471;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #8e9682;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-up {
          opacity: 0;
          animation: fadeInUp 1.2s ease-out forwards;
        }

        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        .delay-3 { animation-delay: 0.6s; }
        .delay-4 { animation-delay: 0.8s; }
        .delay-5 { animation-delay: 1s; }
        .delay-6 { animation-delay: 1.2s; }
        .delay-7 { animation-delay: 1.4s; }
        .delay-8 { animation-delay: 1.6s; }

        .container {
          max-width: 650px;
          margin: 0 auto;
          padding: 120px 100px;
        }

        @media (max-width: 768px) {
          .container {
            padding: 80px 40px;
          }
        }

        .inline-image {
          width: 100%;
          height: auto;
          margin: 60px 0;
          opacity: 0;
          animation: fadeInUp 1.2s ease-out forwards;
        }

        .image-text-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
          margin: 60px 0;
          opacity: 0;
          animation: fadeInUp 1.2s ease-out forwards;
        }

        .image-text-row.reverse {
          direction: rtl;
        }

        .image-text-row.reverse > * {
          direction: ltr;
        }

        @media (max-width: 768px) {
          .image-text-row {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          
          .image-text-row.reverse {
            direction: ltr;
          }
        }

        .image-caption {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #7D8471;
          text-align: center;
          margin-top: 16px;
          font-weight: 300;
        }

        .section {
          margin-bottom: 100px;
        }

        .section-title {
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #7D8471;
          margin-bottom: 20px;
          font-weight: 400;
        }

        .divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(125, 132, 113, 0.3), transparent);
          margin: 80px 0;
        }

        .accent-border {
          border-left: 2px solid #7D8471;
          padding-left: 32px;
        }

        .quote-box {
          background: linear-gradient(135deg, rgba(125, 132, 113, 0.08), rgba(125, 132, 113, 0.03));
          border-left: 3px solid #7D8471;
          padding: 48px;
          margin: 80px 0;
        }

        @media (max-width: 768px) {
          .quote-box {
            padding: 32px 24px;
          }
        }
      `}</style>

      <div className="container">
        {/* Hero */}
        <div className="section fade-in-up">
          <h1 className="font-serif" style={{
            fontSize: 'clamp(4rem, 12vw, 8rem)',
            fontWeight: 300,
            lineHeight: 0.9,
            color: '#fafafa',
            marginBottom: '24px',
          }}>About</h1>
        </div>

        <div className="divider fade-in-up delay-1"></div>

        {/* Mission Statement with WWI Image */}
        <div className="image-text-row delay-2">
          <div>
            <p style={{
              fontSize: '17px',
              lineHeight: 1.8,
              color: '#d4d4d4',
              fontWeight: 300,
              marginBottom: '28px',
            }}>
              The Mini Museum is both a physical space and a concept. It is about bringing history to the places where people already are — so they can discover the unexpected in the unexpected.
            </p>
            <p style={{
              fontSize: '17px',
              lineHeight: 1.8,
              color: '#d4d4d4',
              fontWeight: 300,
            }}>
              Each month, a new exhibition transforms an ordinary space, both physical and virtual, into a place of exploration. Real historical artifacts. Original primary sources. All presented with the same care and scholarship you'd find in a major institution.
            </p>
          </div>

          <div>
            <img 
              src="/about/wwi.jpeg" 
              alt="Mini Museum exhibition display with WWI artifacts"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <p className="image-caption">The Great War Exhibition</p>
          </div>
        </div>

        <div className="divider fade-in-up delay-3"></div>

        {/* Philosophy */}
        <div className="section fade-in-up delay-4">
          <div className="accent-border">
            <p className="section-title">Philosophy</p>
            <p className="font-serif" style={{
              fontSize: 'clamp(1.75rem, 4.5vw, 2.5rem)',
              fontWeight: 400,
              lineHeight: 1.3,
              color: '#fafafa',
              marginBottom: '28px',
            }}>
              Discovery comes before knowledge.
            </p>
            <p style={{
              fontSize: '16px',
              lineHeight: 1.8,
              color: '#a3a3a3',
              fontWeight: 300,
              marginBottom: '20px',
            }}>
              We cannot expect anyone to learn about what they have never encountered. The role of a museum is not to teach, but to spark — to place something remarkable in front of someone and let curiosity do the rest.
            </p>
            <p style={{
              fontSize: '16px',
              lineHeight: 1.8,
              color: '#a3a3a3',
              fontWeight: 300,
            }}>
              The great museums of the world were founded on this principle: that historical objects are witnesses to the entirety of human civilization, and that stepping through their doors is to step into a schoolroom accessible to everyone.
            </p>
          </div>
        </div>

        <div className="divider fade-in-up delay-5"></div>

        {/* Curation with Moondust Image */}
        <div className="image-text-row reverse delay-5">
          <div>
            <img 
              src="/about/moondust.jpeg" 
              alt="Lunar meteorite sample under microscope"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <p className="image-caption">Lunar Meteorite Adrar 013</p>
          </div>

          <div>
            <p className="section-title">Curation</p>
            <p style={{
              fontSize: '16px',
              lineHeight: 1.8,
              color: '#a3a3a3',
              fontWeight: 300,
              marginBottom: '20px',
            }}>
              Every exhibition is built around authentic artifacts and primary sources. A Victorian needle case. Letters from the 1940s. A WWI soldier's helmet. Objects that survived history and now tell its stories.
            </p>
            <p style={{
              fontSize: '16px',
              lineHeight: 1.8,
              color: '#a3a3a3',
              fontWeight: 300,
            }}>
              Each exhibition includes two beautifully designed posters, primary source analysis, and digital extensions linking to major museum collections worldwide.
            </p>
          </div>
        </div>

        {/* Access Quote */}
        <div className="quote-box fade-in-up delay-6">
          <p className="font-serif" style={{
            fontSize: 'clamp(1.35rem, 3.5vw, 2rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            lineHeight: 1.5,
            color: '#fafafa',
            marginBottom: '20px',
          }}>
            A child in Central Texas deserves the same sense of discovery as a child who grows up walking distance from the Natural History Museum.
          </p>
          <p style={{
            fontSize: '16px',
            color: '#7D8471',
            fontWeight: 400,
          }}>
            This is equity in its truest form.
          </p>
        </div>

        {/* The Network */}
        <div className="section fade-in-up delay-7">
          <p className="section-title">The Network</p>
          <p style={{
            fontSize: '16px',
            lineHeight: 1.8,
            color: '#a3a3a3',
            fontWeight: 300,
            marginBottom: '20px',
          }}>
            The Mini Museum began in one school library. It was never meant to stay there.
          </p>
          <p style={{
            fontSize: '16px',
            lineHeight: 1.8,
            color: '#a3a3a3',
            fontWeight: 300,
            marginBottom: '20px',
          }}>
            The vision is a network of traveling exhibitions. A librarian in rural Kansas. A teacher in suburban Florida. A community center in small-town Scotland.
          </p>
          <p style={{
            fontSize: '16px',
            lineHeight: 1.8,
            color: '#d4d4d4',
            fontWeight: 400,
          }}>
            Apply to host. Receive a case of real artifacts. Keep it for a month. Send it on.
          </p>
        </div>

        {/* Letters Image Below Network */}
        <div className="inline-image delay-8">
          <img 
            src="/about/letters.jpeg" 
            alt="Historic letters displayed in glass case"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
          <p className="image-caption">Victorian Letters · Mini Museum Collection</p>
        </div>

        <div className="divider fade-in-up delay-8"></div>

        {/* Contact */}
        <div className="section fade-in-up delay-8">
          <p className="section-title">Contact</p>
          <p style={{
            fontSize: '16px',
            lineHeight: 1.8,
            color: '#a3a3a3',
            fontWeight: 300,
          }}>
            To learn more about hosting an exhibition or partnership opportunities.
          </p>
        </div>

        {/* Footer */}
        <footer className="fade-in-up delay-8" style={{
          paddingTop: '80px',
          textAlign: 'center',
          borderTop: '1px solid rgba(125, 132, 113, 0.2)',
        }}>
          <p style={{
            fontSize: '13px',
            color: '#737373',
            marginBottom: '8px',
          }}>
            Founded by Dr. Verity Kahn. Curated for everyone.
          </p>
          <p style={{
            fontSize: '11px',
            color: '#525252',
            letterSpacing: '0.1em',
          }}>
            © 2025 The Mini Museum
          </p>
        </footer>
      </div>
    </>
  );
}