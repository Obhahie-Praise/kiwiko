import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Sans, Instrument_Serif, League_Spartan } from "next/font/google";
import "./globals.css";
import { ReactLenis } from "../utils/lenis";
import Script from "next/script";
import { Toaster } from "@/components/lightswind/toaster";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const leagueSpartan = League_Spartan({
  variable: "--font-league_spartan-sans",
  subsets: ["latin"],
  weight: "400",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kiwiko | A new way to discover early stage startups",
  description:
    "Discover and invest in early stage startups with Kiwiko. Explore innovative companies, connect with founders, and be part of the next big thing.",
  icons: {
    icon: "/neutral-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReactLenis root>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${leagueSpartan.variable} ${instrumentSans.variable} ${instrumentSerif.variable} antialiased overflow-x-hidden special-scroll-bar`}
        >
          {children}
          <Toaster />
          <Script

            src="http://localhost:3000/api/tracker.js"
            data-project="pk_7a78c55694cfb3564b3742dbeda39ba34f130b27ec16fc28"
            strategy="afterInteractive"
          />
        </body>
      </ReactLenis>
    </html>
  );
}
