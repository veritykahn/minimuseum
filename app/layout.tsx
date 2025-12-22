import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Mini Museum | Where History Finds a Room",
  description: "Monthly curated exhibitions bringing museum experiences to intimate spaces. Discovery comes before knowledge.",
  keywords: ["museum", "education", "history", "exhibitions", "Austin", "Texas", "school museum"],
  authors: [{ name: "The Mini Museum" }],
  openGraph: {
    title: "The Mini Museum",
    description: "Where history finds a room. Monthly curated exhibitions coming January 2026.",
    url: "https://minimuseumproject.com",
    siteName: "The Mini Museum",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Mini Museum",
    description: "Where history finds a room. Monthly curated exhibitions coming January 2026.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}