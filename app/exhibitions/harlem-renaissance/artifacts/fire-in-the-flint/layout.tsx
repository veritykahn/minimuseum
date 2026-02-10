import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Fire in the Flint | The Mini Museum',
  description: 'Explore Walter F. White\u2019s 1924 novel \u2014 a first edition from the Harlem Renaissance that drew from his undercover investigations of racial violence.',
};

export default function FireInTheFlintLayout({ children }: { children: React.ReactNode }) {
  return children;
}
