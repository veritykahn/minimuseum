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
    <main className="min-h-screen bg-black text-[#d4d4d4]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-serif text-xl text-white hover:text-[#a3a3a3] transition-colors">
            The Mini Museum
          </Link>
          <nav className="flex gap-8">
            <Link href="/about" className="text-sm tracking-wide text-white">About</Link>
            <Link href="/exhibitions" className="text-sm tracking-wide text-[#737373] hover:text-white transition-colors">Exhibitions</Link>
            <Link href="/contact" className="text-sm tracking-wide text-[#737373] hover:text-white transition-colors">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div
          className={`max-w-3xl mx-auto transition-all duration-1000 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="font-serif text-4xl md:text-5xl text-white font-light mb-8">
            About
          </h1>
          <div className="space-y-6 text-lg leading-relaxed">
            <p>
              The Mini Museum is both a physical space and a concept. It is about bringing history to the places where people already are — so they can discover the unexpected in the unexpected.
            </p>
            <p>
              Each month, a new exhibition transforms an ordinary space, both physical and virtual, into a place of exploration. Real historical artifacts. Original primary sources. All presented with the same care and scholarship you'd find in a major institution — but accessible to anyone who walks or clicks through the door.
            </p>
          </div>
        </div>
      </section>

      {/* Main Image */}
      <section
        className={`px-6 pb-20 transition-all duration-1000 delay-300 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
            <Image
              src="/about/museum-wide.jpg"
              alt="The Mini Museum exhibition space"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl text-white font-light mb-10">Philosophy</h2>

          <div className="space-y-6 leading-relaxed">
            <p className="text-white font-serif text-2xl italic">
              Discovery comes before knowledge.
            </p>
            <p>
              We cannot expect anyone to learn about what they have never encountered. The role of a museum is not to teach, but to spark — to place something remarkable in front of someone and let curiosity do the rest.
            </p>
            <p>
              The great museums of the world were founded on this principle: that historical objects are witnesses to the entirety of human civilization, and that stepping through their doors is to step into a schoolroom accessible to everyone. A place where wonder and fascination are not optional, but built in.
            </p>
            <p>
              The Mini Museum carries this tradition forward, bringing it to schools, libraries, and community spaces that have never had access to such experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Image Grid */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src="/about/artifacts-victorian.jpg"
              alt="Victorian artifact display case"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src="/about/artifact-letters.jpg"
              alt="Historical letters display"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Curation */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl text-white font-light mb-10">Curation</h2>

          <div className="space-y-6 leading-relaxed">
            <p>
              Every exhibition is built around authentic artifacts and primary sources. A Victorian needle case. Letters from the 1940s. A WWI soldier's helmet. Objects that survived history and now tell its stories.
            </p>
            <p>
              Alongside these artifacts, each exhibition includes:
            </p>
            <div className="space-y-4 pl-4 border-l border-white/10">
              <p>
                <span className="text-white font-medium">Two beautifully designed posters</span> — presenting historical context, timelines, and connections to broader themes.
              </p>
              <p>
                <span className="text-white font-medium">Primary source analysis</span> — documents, photographs, and ephemera that allow visitors to engage directly with history.
              </p>
              <p>
                <span className="text-white font-medium">Digital extensions</span> — links to major museum collections worldwide, so that a single display case can become a gateway to the British Museum, the Smithsonian, or the V&A.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Museum Space Image */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
            <Image
              src="/about/museum-bhm.jpg"
              alt="The Mini Museum exhibition"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Access */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl text-white font-light mb-10">Access</h2>

          <div className="space-y-6 leading-relaxed">
            <p>
              Museums should not be reserved for the wealthy, or for those who can travel to London or New York or Paris. A child in Central Texas deserves the same sense of discovery as a child who grows up walking distance from the Natural History Museum.
            </p>
            <p>
              This is equity in its truest form: bringing the extraordinary to the ordinary places where people already are.
            </p>
            <p>
              The Mini Museum website extends this mission further — teachers can use exhibitions in their classrooms, families can explore from home, and librarians anywhere can share these resources with their communities.
            </p>
          </div>
        </div>
      </section>

      {/* The Network */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl text-white font-light mb-10">The Network</h2>

          <div className="space-y-6 leading-relaxed">
            <p>
              The Mini Museum began in one school library. It was never meant to stay there.
            </p>
            <p>
              The vision is a network of traveling exhibitions that any school or library can host. A librarian in rural Kansas. A teacher in suburban Florida. A community center in small-town Scotland.
            </p>
            <p>
              Apply to host an exhibition. Pay a small fee. Receive a case of real artifacts, posters, and teaching materials. Keep it for a month. Send it on.
            </p>
            <p className="text-white font-serif text-xl italic">
              A whole network of mini museums, bringing wonder to places that have never had it.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl text-white font-light mb-10">Contact</h2>

          <div className="space-y-6 leading-relaxed">
            <p>
              To learn more about The Mini Museum, hosting an exhibition, or partnership opportunities:
            </p>
            <Link
              href="/contact"
              className="inline-block mt-4 px-6 py-3 border border-white/20 rounded-full text-white text-sm tracking-wide hover:bg-white/5 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-serif text-lg text-[#737373] italic mb-2">
            Founded by Dr. Verity Kahn.
          </p>
          <p className="font-serif text-lg text-[#737373] italic mb-8">
            Curated for everyone.
          </p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#404040]">
            © 2025 The Mini Museum
          </p>
        </div>
      </footer>
    </main>
  );
}
