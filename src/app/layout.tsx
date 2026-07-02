import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://genesistrust.online"),

  title: {
    default: "Genesis Heritage Trust",
    template: "%s | Genesis Heritage Trust",
  },

  description:
    "Official public portal of Genesis Heritage Trust. Learn about SUSDC, AFIP, Atlantis Bank, digital settlement infrastructure and trusted financial innovation.",

  keywords: [
    "Genesis Heritage Trust",
    "Atlantis Bank",
    "SUSDC",
    "AFIP",
    "Stellar",
    "Digital Assets",
    "Settlement",
    "Treasury",
    "Trust",
    "Blockchain",
  ],

  authors: [
    {
      name: "Genesis Heritage Trust",
    },
  ],

  creator: "Genesis Heritage Trust",

  publisher: "Genesis Heritage Trust",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Genesis Heritage Trust",
    description:
      "Official public portal for SUSDC, AFIP and Atlantis Bank digital financial infrastructure.",
    url: "https://genesistrust.online",
    siteName: "Genesis Heritage Trust",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Genesis Heritage Trust",
    description:
      "Official public portal for SUSDC, AFIP and Atlantis Bank.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}