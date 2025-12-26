'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function About() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[100px] top-0 left-1/4"
          style={{ background: 'radial-gradient(circle, rgba(232,93,4,0.3) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full opacity-20 blur-[100px] bottom-1/4 right-1/4"
          style={{ background: 'radial-gradient(circle, rgba(123,44,191,0.25) 0%, transparent 70%)' }}
        />
      </div>

      {/* Banner */}
      <div className="w-full overflow-hidden border-b border-[#1a1a1a]">
        <div className="animate-scroll-infinite">
          <Image
            src="/banner.png"
            alt="Historical artifacts"
            width={1920}
            height={200}
            className="w-auto h-32 md:h-40 object-cover opacity-60"
          />
        </div>
      </div>

      {/* Content */}
      <div 
        className={`max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24 transition-all duration-1000 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Hero */}
        <h1 className="font-serif text-5xl md:text-6xl text-[#d4d4d4] mb-16 tracking-tight">
          About
        </h1>

        {/* Mission Statement */}
        <section className="mb-20">
          <p className="text-[#a3a3a3] text-lg md:text-xl leading-relaxed mb-6 font-light">
            The Mini Museum is both a physical space and a concept. It is about bringing history to the places where people already are — so they can discover the unexpected in the unexpected.
          </p>
          <p className="text-[#a3a3a3] text-lg md:text-xl leading-relaxed font-light">
            Each month, a new exhibition transforms an ordinary space, both physical and virtual, into a place of exploration. Real historical artifacts. Original primary sources. All presented with the same care and scholarship you'd find in a major institution.
          </p>
        </section>

        {/* Philosophy */}
        <section className="mb-20 border-l-2 border-[#e85d04] pl-8">
          <h2 className="text-[#e85d04] text-sm uppercase tracking-[0.3em] mb-6 font-light">
            Philosophy
          </h2>
          <p className="text-[#d4d4d4] text-2xl md:text-3xl font-serif mb-6 leading-relaxed">
            Discovery comes before knowledge.
          </p>
          <p className="text-[#a3a3a3] text-lg leading-relaxed mb-4 font-light">
            We cannot expect anyone to learn about what they have never encountered. The role of a museum is not to teach, but to spark — to place something remarkable in front of someone and let curiosity do the rest.
          </p>
          <p className="text-[#a3a3a3] text-lg leading-relaxed font-light">
            The great museums of the world were founded on this principle: that historical objects are witnesses to the entirety of human civilization, and that stepping through their doors is to step into a schoolroom accessible to everyone.
          </p>
        </section>

        {/* Curation */}
        <section className="mb-20">
          <h2 className="text-[#e85d04] text-sm uppercase tracking-[0.3em] mb-6 font-light">
            Curation
          </h2>
          <p className="text-[#a3a3a3] text-lg leading-relaxed mb-4 font-light">
            Every exhibition is built around authentic artifacts and primary sources. A Victorian needle case. Letters from the 1940s. A WWI soldier's helmet. Objects that survived history and now tell its stories.
          </p>
          <p className="text-[#a3a3a3] text-lg leading-relaxed font-light">
            Each exhibition includes two beautifully designed posters, primary source analysis, and digital extensions linking to major museum collections worldwide.
          </p>
        </section>

        {/* Access Quote */}
        <section className="mb-20 bg-gradient-to-r from-[#1a1a1a] to-transparent p-8 md:p-12 border-l-4 border-[#7b2cbf]">
          <p className="text-[#d4d4d4] text-xl md:text-2xl font-serif mb-4 leading-relaxed italic">
            A child in Central Texas deserves the same sense of discovery as a child who grows up walking distance from the Natural History Museum.
          </p>
          <p className="text-[#7b2cbf] text-lg font-light">
            This is equity in its truest form.
          </p>
        </section>

        {/* The Network */}
        <section className="mb-20">
          <h2 className="text-[#e85d04] text-sm uppercase tracking-[0.3em] mb-6 font-light">
            The Network
          </h2>
          <p className="text-[#a3a3a3] text-lg leading-relaxed mb-6 font-light">
            The Mini Museum began in one school library. It was never meant to stay there.
          </p>
          <p className="text-[#a3a3a3] text-lg leading-relaxed mb-6 font-light">
            The vision is a network of traveling exhibitions. A librarian in rural Kansas. A teacher in suburban Florida. A community center in small-town Scotland.
          </p>
          <p className="text-[#d4d4d4] text-lg leading-relaxed font-light">
            Apply to host. Receive a case of real artifacts. Keep it for a month. Send it on.
          </p>
        </section>

        {/* Contact */}
        <section className="mb-20">
          <h2 className="text-[#e85d04] text-sm uppercase tracking-[0.3em] mb-6 font-light">
            Contact
          </h2>
          <p className="text-[#a3a3a3] text-lg leading-relaxed font-light">
            To learn more about hosting an exhibition or partnership opportunities.
          </p>
        </section>

        {/* Footer */}
        <footer className="pt-12 border-t border-[#1a1a1a] text-center">
          <p className="text-[#737373] text-sm mb-2">
            Founded by Dr. Verity Kahn. Curated for everyone.
          </p>
          <p className="text-[#525252] text-xs tracking-wider">
            © 2025 The Mini Museum
          </p>
        </footer>
      </div>

      <style jsx>{`
        @keyframes scroll-infinite {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll-infinite {
          animation: scroll-infinite 30s linear infinite;
          display: flex;
          width: 200%;
        }
      `}</style>
    </main>
  );
}