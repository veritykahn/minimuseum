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
    <main className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
      {/* Header */}
      <header className="border-b border-[#222]">
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

        {/* Page Title */}
        <section className={`py-12 border-b border-[#222] transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-[32px] text-white font-normal">About</h1>
        </section>

        {/* Mission Statement */}
        <section className="py-12 border-b border-[#222]">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-7">
              <p className="text-[17px] leading-[1.7] text-[#b5b5b5] mb-6">
                The Mini Museum is both a physical space and a concept. It is about bringing history to the places where people already are — so they can discover the unexpected in the unexpected.
              </p>
              <p className="text-[15px] leading-[1.7] text-[#888]">
                Each month, a new exhibition transforms an ordinary space, both physical and virtual, into a place of exploration. Real historical artifacts. Original primary sources. All presented with the same care and scholarship you'd find in a major institution.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 md:col-start-9">
              <div className="relative aspect-[3/4] bg-[#111] overflow-hidden">
                <Image
                  src="/about/letters.jpeg"
                  alt="Historical letters"
                  fill
                  className="object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-12 border-b border-[#222]">
          <h2 className="text-[13px] text-[#666] uppercase tracking-wider mb-8">Philosophy</h2>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-8">
              <p className="text-[24px] leading-[1.4] text-white font-light mb-8">
                Discovery comes before knowledge.
              </p>
              <p className="text-[15px] leading-[1.7] text-[#888] mb-4">
                We cannot expect anyone to learn about what they have never encountered. The role of a museum is not to teach, but to spark — to place something remarkable in front of someone and let curiosity do the rest.
              </p>
              <p className="text-[15px] leading-[1.7] text-[#888]">
                The great museums of the world were founded on this principle: that historical objects are witnesses to the entirety of human civilization, and that stepping through their doors is to step into a schoolroom accessible to everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Curation */}
        <section className="py-12 border-b border-[#222]">
          <h2 className="text-[13px] text-[#666] uppercase tracking-wider mb-8">Curation</h2>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-3">
              <div className="relative aspect-square bg-[#111] overflow-hidden">
                <Image
                  src="/about/moondust.jpeg"
                  alt="Moon dust under microscope"
                  fill
                  className="object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                />
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 md:col-start-5">
              <p className="text-[15px] leading-[1.7] text-[#888] mb-4">
                Every exhibition is built around authentic artifacts and primary sources. A Victorian needle case. Letters from the 1940s. A WWI soldier's helmet. Objects that survived history and now tell its stories.
              </p>
              <p className="text-[14px] leading-[1.7] text-[#666]">
                Each exhibition includes two beautifully designed posters, primary source analysis, and digital extensions linking to major museum collections worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* Access Quote */}
        <section className="py-16 border-b border-[#222]">
          <div className="grid grid-cols-12">
            <div className="col-span-12 md:col-span-9">
              <blockquote className="text-[22px] leading-[1.5] text-white font-light">
                A child in Central Texas deserves the same sense of discovery as a child who grows up walking distance from the Natural History Museum.
              </blockquote>
              <p className="mt-4 text-[13px] text-[#666]">
                This is equity in its truest form.
              </p>
            </div>
          </div>
        </section>

        {/* The Network */}
        <section className="py-12 border-b border-[#222]">
          <h2 className="text-[13px] text-[#666] uppercase tracking-wider mb-8">The Network</h2>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-6">
              <p className="text-[15px] leading-[1.7] text-[#888] mb-4">
                The Mini Museum began in one school library. It was never meant to stay there.
              </p>
              <p className="text-[15px] leading-[1.7] text-[#888] mb-4">
                The vision is a network of traveling exhibitions. A librarian in rural Kansas. A teacher in suburban Florida. A community center in small-town Scotland.
              </p>
              <p className="text-[14px] leading-[1.7] text-[#666]">
                Apply to host. Receive a case of real artifacts. Keep it for a month. Send it on.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 md:col-start-8">
              <div className="relative aspect-[4/5] bg-[#111] overflow-hidden">
                <Image
                  src="/about/wwi.jpeg"
                  alt="WWI exhibition"
                  fill
                  className="object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-12 border-b border-[#222]">
          <h2 className="text-[13px] text-[#666] uppercase tracking-wider mb-6">Contact</h2>
          <p className="text-[15px] text-[#888] mb-4">
            To learn more about hosting an exhibition or partnership opportunities.
          </p>
          <Link href="/contact" className="text-[14px] text-white underline underline-offset-4 hover:no-underline">
            Get in touch →
          </Link>
        </section>

        {/* Footer */}
        <footer className="py-12">
          <p className="text-[14px] text-[#555] mb-6">
            Founded by Dr. Verity Kahn. Curated for everyone.
          </p>
          <p className="text-[12px] text-[#444]">
            © 2025 The Mini Museum
          </p>
        </footer>

      </div>
    </main>
  );
}
