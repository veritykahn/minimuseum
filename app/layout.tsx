import { SITE_URL } from '@/lib/site';
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import MuseumMap from "@/components/museum-map/MuseumMapRefactored";
import { OrganizationJsonLd } from "@/components/JsonLd";
import StyledJsxRegistry from "@/components/StyledJsxRegistry";
import PageGround from "@/components/PageGround";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "The Mini Museum | Big History. Small Spaces.",
  description: "Monthly curated exhibitions bringing museum experiences to intimate spaces. Discovery comes before knowledge.",
  keywords: ["museum", "education", "history", "exhibitions", "Austin", "Texas", "school museum"],
  authors: [{ name: "The Mini Museum" }],
  openGraph: {
    title: "The Mini Museum",
    description: "Big History. Small Spaces. Monthly curated exhibitions coming January 2026.",
    url: SITE_URL,
    siteName: "The Mini Museum",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Mini Museum",
    description: "Big History. Small Spaces. Monthly curated exhibitions coming January 2026.",
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
      <head>
        <OrganizationJsonLd />
      </head>
      <body>
        <StyledJsxRegistry>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <main id="main-content">
            {/* A page whose script has not arrived yet waits inside its own
                boundary, so hydrating it cannot unsettle the layout around
                it (React error #418, intermittent, on every route). */}
            <Suspense>{children}</Suspense>
          </main>
          <Suspense>
            <MuseumMap />
          </Suspense>
          <PageGround />
        </StyledJsxRegistry>
      </body>
    </html>
  );
}