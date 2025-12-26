'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function TiltImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      style={{
        transform,
        transition: 'transform 0.15s ease-out',
        transformStyle: 'preserve-3d',
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
      />
    </div>
  );
}

export default function About() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-black text-[#999]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-8 flex justify-between items-center">
          <Link href="/" className="font-serif text-lg text-white/90 tracking-wide hover:text-white transition-colors">
            The Mini Museum
          </Link>
          <nav className="flex gap-12">
            <Link href="/about" className="text-[10px] tracking-[0.25em] uppercase text-white/90">About</Link>
            <Link href="/exhibitions" className="text-[10px] tracking-[0.25em] uppercase text-white/30 hover:text-white/90 transition-colors">Exhibitions</Link>
            <Link href="/contact" className="text-[10px] tracking-[0.25em] uppercase text-white/30 hover:text-white/90 transition-colors">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-8">
        <div
          className={`max-w-2xl text-center transition-all duration-1000 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="font-serif text-5xl md:text-6xl text-white font-light tracking-wide mb-8">
            About
          </h1>
          <p className="text-lg leading-relaxed mb-6">
            The Mini Museum is both a physical space and a concept. It is about bringing history to the places where people already are — so they can discover the unexpected in the unexpected.
          </p>
          <p className="text-lg leading-relaxed">
            Each month, a new exhibition transforms an ordinary space, both physical and virtual, into a place of exploration.
          </p>
        </div>
      </section>

      {/* Philosophy with Image */}
      <section className="px-8 py-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-serif text-3xl md:text-4xl text-white font-light italic leading-snug mb-10">
              Discovery comes before knowledge.
            </p>
            <div className="space-y-6 leading-relaxed">
              <p>
                We cannot expect anyone to learn about what they have never encountered. The role of a museum is not to teach, but to spark — to place something remarkable in front of someone and let curiosity do the rest.
              </p>
              <p>
                The great museums of the world were founded on this principle: that historical objects are witnesses to the entirety of human civilization.
              </p>
            </div>
          </div>
          <div>
            <TiltImage
              src="/about/letters.jpeg"
              alt="Historical letters in display case"
              className="aspect-[4/5] w-full max-w-md ml-auto"
            />
          </div>
        </div>
      </section>

      {/* Curation */}
      <section className="px-8 py-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <TiltImage
              src="/about/moondust.jpeg"
              alt="Moon dust under microscope"
              className="aspect-square w-full max-w-sm"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="font-serif text-3xl text-white font-light tracking-wide mb-10">Curation</h2>
            <div className="space-y-6 leading-relaxed">
              <p>
                Every exhibition is built around authentic artifacts and primary sources. A Victorian needle case. Letters from the 1940s. A WWI soldier's helmet. Objects that survived history and now tell its stories.
              </p>
              <p className="text-white/60">
                Two beautifully designed posters presenting historical context. Primary source analysis. Digital extensions linking to major museum collections worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Access - Full width statement */}
      <section className="px-8 py-40">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-serif text-2xl md:text-3xl text-white font-light leading-relaxed">
            A child in Central Texas deserves the same sense of discovery as a child who grows up walking distance from the Natural History Museum.
          </p>
          <p className="mt-8 text-sm text-white/40">
            This is equity in its truest form.
          </p>
        </div>
      </section>

      {/* The Network with Image */}
      <section className="px-8 py-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-serif text-3xl text-white font-light tracking-wide mb-10">The Network</h2>
            <div className="space-y-6 leading-relaxed">
              <p>
                The Mini Museum began in one school library. It was never meant to stay there.
              </p>
              <p>
                The vision is a network of traveling exhibitions. A librarian in rural Kansas. A teacher in suburban Florida. A community center in small-town Scotland.
              </p>
              <p className="text-white/80">
                Apply to host. Receive a case of real artifacts. Keep it for a month. Send it on.
              </p>
            </div>
          </div>
          <div>
            <TiltImage
              src="/about/wwi.jpeg"
              alt="WWI exhibition with poppies"
              className="aspect-[3/4] w-full max-w-md ml-auto"
            />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-8 py-32">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg mb-8">
            To learn more about hosting an exhibition or partnership opportunities:
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 border border-white/20 text-[10px] tracking-[0.25em] uppercase text-white/70 hover:text-white hover:border-white/50 transition-all duration-300"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-24">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <p className="font-serif text-lg text-white/40 italic">
            Founded by Dr. Verity Kahn. Curated for everyone.
          </p>
          <p className="mt-8 text-[9px] tracking-[0.3em] uppercase text-white/20">
            © 2025 The Mini Museum
          </p>
        </div>
      </footer>
    </main>
  );
}
