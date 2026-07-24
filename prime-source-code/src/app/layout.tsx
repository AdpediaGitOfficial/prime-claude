import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

import Header from "../components/Header";
import ContactSection from "../components/ContactSection";
import ScrollTopArrow from "../components/ScrollTopArrow";
import Popup from "../components/Popup";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "../utils/site";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
});

const SITE_DESCRIPTION =
  "A premium four-floor lifestyle destination seamlessly blending fitness, wellness, business, and modern luxury experiences.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Prime Promenade – Many Experiences",
  description: SITE_DESCRIPTION,
  keywords: [
    "Prime Promenade",
    "Thrissur",
    "Kerala",
    "lifestyle destination",
    "gym",
    "spa",
    "swimming pool",
    "conference hall",
    "gaming arena",
    "vendor zone",
  ],
  alternates: { canonical: "/" },
  icons: {
    icon: "/LOGO/favicon.svg",
    shortcut: "/LOGO/favicon.svg",
  },
  openGraph: {
    title: "Prime Promenade – Many Experiences",
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_IN",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prime Promenade – Many Experiences",
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
  telephone: "+91-90707-99700",
  email: "info@primepromenade.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Near Reliance Petrol Station, Puzhakkal",
    addressLocality: "Thrissur",
    addressRegion: "Kerala",
    postalCode: "680553",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 10.5485294,
    longitude: 76.1740172,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <html lang="en" suppressHydrationWarning>
     <body className={`${instrumentSans.variable} font-instrument-sans bg-white text-black`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <ContactSection />
        <ScrollTopArrow />
        <Popup />
      </body>
    </html>
  );
}
