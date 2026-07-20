import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

import Header from "../components/Header";
import ContactSection from "../components/ContactSection";
import ScrollTopArrow from "../components/ScrollTopArrow";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
});

export const metadata: Metadata = {
  title: "Prime Promenade – Many Experiences",
  description:
    "A premium four-floor lifestyle destination seamlessly blending fitness, wellness, business, and modern luxury experiences.",
  icons: {
    icon: "/LOGO/favicon.svg",
    shortcut: "/LOGO/favicon.svg",
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
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <ContactSection />
        <ScrollTopArrow />
      </body>
    </html>
  );
}
