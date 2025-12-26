'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <main className="min-h-screen bg-black text-[#e5e5e5]">
      {/* Header */}
      <header className="border-b border-[#1a1a1a]">
        <div className="max-w-[1100px] mx-auto px-6 py-5 flex justify-between items-center">
          <Link href="/" className="text-[15px] text-white tracking-tight hover:opacity-70 transition-opacity">
            The Mini Museum
          </Link>
          <nav className="flex gap-8">
            <Link href="/about" className="text-[13px] text-white">About</Link>
            <Link href="/exhibitions" className="text-[13px] text-[#666] hover:text-white transition-colors">Exhibitions</Link>
            <Link href="/contact" className="text-[13px] text-[#666] hover:text-white transition-colors">Contact</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto px-6">

        {/* Hero Section with Banner */}
        <section className={`py-16 border-b border-[#1a1a1a] transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="mb-12">
            <Image
              src="/banner.png"
              alt="Museum artifacts banner"
              width={1100}
              height={120}
              className="w-full h-auto opacity-80"
            />
          </div>
          <h1 className="text-[36px] md:text-[42px] text-white font-light tracking-tight">About</h1>
        </section>

        {/* Mission Statement */}
        <section className="py-20 border-b border-[#1a1a1a]">
          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-12 md:col-span-7">
              <p className="text-[20px] md:text-[24px] leading-[1.6] text-white font-light mb-8">
                The Mini Museum is both a physical space and a concept. It is about bringing history to the places where people already are — so they can discover the unexpected in the unexpected.
              </p>
              <p className="text-[15px] leading-[1.8] text-[#999]">
                Each month, a new exhibition transforms an ordinary space, both physical and virtual, into a place of exploration. Real historical artifacts. Original primary sources. All presented with the same care and scholarship you'd find in a major institution.
              </p>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-20 border-b border-[#1a1a1a]">
          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-12 md:col-span-2">
              <h2 className="text-[11px] text-[#666] uppercase tracking-[0.2em] sticky top-8">Philosophy</h2>
            </div>
            <div className="col-span-12 md:col-span-7">
              <p className="text-[26px] md:text-[32px] leading-[1.4] text-white font-light mb-10">
                Discovery comes before knowledge.
              </p>
              <div className="space-y-6 text-[15px] leading-[1.8] text-[#999]">
                <p>
                  We cannot expect anyone to learn about what they have never encountered. The role of a museum is not to teach, but to spark — to place something remarkable in front of someone and let curiosity do the rest.
                </p>
                <p>
                  The great museums of the world were founded on this principle: that historical objects are witnesses to the entirety of human civilization, and that stepping through their doors is to step into a schoolroom accessible to everyone.
                </p>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className="relative aspect-square bg-[#0a0a0a] overflow-hidden border border-[#1a1a1a]">
                <Image
                  src="/about/letters.jpeg"
                  alt="Historical artifacts"
                  fill
                  className="object-cover opacity-70 hover:opacity-90 transition-opacity duration-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Curation */}
        <section className="py-20 border-b border-[#1a1a1a]">
          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-12 md:col-span-2">
              <h2 className="text-[11px] text-[#666] uppercase tracking-[0.2em] sticky top-8">Curation</h2>
            </div>
            <div className="col-span-12 md:col-span-6">
              <div className="space-y-6 text-[15px] leading-[1.8] text-[#999]">
                <p>
                  Every exhibition is built around authentic artifacts and primary sources. A Victorian needle case. Letters from the 1940s. A WWI soldier's helmet. Objects that survived history and now tell its stories.
                </p>
                <p>
                  Each exhibition includes two beautifully designed posters, primary source analysis, and digital extensions linking to major museum collections worldwide.
                </p>
              </div>
            </div>
            <div className="col-span-12 md:col-span-4">
              <div className="relative aspect-[4/5] bg-[#0a0a0a] overflow-hidden border border-[#1a1a1a]">
                <Image
                  src="/about/moondust.jpeg"
                  alt="Moon dust exhibition"
                  fill
                  className="object-cover opacity-70 hover:opacity-90 transition-opacity duration-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Access Quote with Green Accent */}
        <section className="py-24 border-b border-[#1a1a1a]">
          <div className="grid grid-cols-12">
            <div className="col-span-12 md:col-span-10 md:col-start-2">
              <div className="border-l-2 border-[#6B8E6F] pl-8">
                <blockquote className="text-[24px] md:text-[28px] leading-[1.5] text-white font-light mb-6">
                  A child in Central Texas deserves the same sense of discovery as a child who grows up walking distance from the Natural History Museum.
                </blockquote>
                <p className="text-[13px] text-[#6B8E6F] tracking-wide">
                  This is equity in its truest form.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Network */}
        <section className="py-20 border-b border-[#1a1a1a]">
          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-12 md:col-span-2">
              <h2 className="text-[11px] text-[#666] uppercase tracking-[0.2em] sticky top-8">The Network</h2>
            </div>
            <div className="col-span-12 md:col-span-5">
              <div className="space-y-6 text-[15px] leading-[1.8] text-[#999]">
                <p>
                  The Mini Museum began in one school library. It was never meant to stay there.
                </p>
                <p>
                  The vision is a network of traveling exhibitions. A librarian in rural Kansas. A teacher in suburban Florida. A community center in small-town Scotland.
                </p>
                <p className="text-white">
                  Apply to host. Receive a case of real artifacts. Keep it for a month. Send it on.
                </p>
              </div>
            </div>
            <div className="col-span-12 md:col-span-5">
              <div className="relative aspect-[3/4] bg-[#0a0a0a] overflow-hidden border border-[#1a1a1a]">
                <Image
                  src="/about/wwi.jpeg"
                  alt="WWI exhibition display"
                  fill
                  className="object-cover opacity-70 hover:opacity-90 transition-opacity duration-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-20 border-b border-[#1a1a1a]">
          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-12 md:col-span-2">
              <h2 className="text-[11px] text-[#666] uppercase tracking-[0.2em]">Contact</h2>
            </div>
            <div className="col-span-12 md:col-span-6">
              <p className="text-[15px] text-[#999] mb-6 leading-[1.8]">
                To learn more about hosting an exhibition or partnership opportunities.
              </p>
              <Link href="/contact" className="inline-block text-[14px] text-white border-b border-white/20 hover:border-white transition-colors pb-1">
                Get in touch →
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16">
          <div className="grid grid-cols-12">
            <div className="col-span-12 md:col-span-10 md:col-start-2">
              <p className="text-[14px] text-[#555] mb-4">
                Founded by Dr. Verity Kahn. Curated for everyone.
              </p>
              <p className="text-[11px] text-[#444] tracking-wide">
                © 2025 The Mini Museum
              </p>
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}
