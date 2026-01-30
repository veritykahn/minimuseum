import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-8 text-center">
      <h1 className="font-serif text-[clamp(4rem,15vw,8rem)] font-light text-[#fafafa] mb-2 tracking-wider">
        404
      </h1>

      <h2 className="font-serif text-[clamp(1.25rem,4vw,2rem)] font-light italic text-[#737373] mb-8">
        Exhibition Not Found
      </h2>

      <p className="text-[#a3a3a3] max-w-[400px] mb-12 leading-relaxed text-[clamp(0.875rem,2vw,1rem)]">
        The gallery you&apos;re looking for may have been moved or is currently being installed.
      </p>

      <Link
        href={ROUTES.GREAT_HALL}
        className="inline-block px-8 py-3 border border-[#7D8471] text-[#7D8471] text-xs uppercase tracking-widest transition-all duration-300 hover:bg-[rgba(125,132,113,0.1)]"
      >
        Return to Great Hall
      </Link>
    </div>
  );
}
