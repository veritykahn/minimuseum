import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | The Mini Museum',
  description:
    'Get in touch with The Mini Museum. Apply to host an exhibition, inquire about educational resources, or learn about partnerships.',
  openGraph: {
    title: 'Contact The Mini Museum',
    description: 'Apply to host an exhibition or learn about partnerships.',
    url: 'https://minimuseumproject.com/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
