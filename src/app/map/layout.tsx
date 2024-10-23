import "./globals.css";

import type { Metadata } from "next";
import { Inter, Instrument_Sans } from "next/font/google";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontHeading = Instrument_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Builder Epidemic Map",
  description: "An interactive map to discover builder events and communities happening near you.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://builderepidemic.com/map",
    title: "Builder Epidemic Map",
    description: "An interactive map to discover builder events and communities happening near you.",
    siteName: "Builder Epidemic Map",
    images: [{
      url: "https://builderepidemic.com/images/map.png",
      width: 800,
      height: 548,
      alt: "Builder Epidemic Map",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Builder Epidemic Map",
    description: "An interactive map to discover builder events and communities happening near you.",
    images: ["https://builderepidemic.com/images/map.png"],
    creator: "@braedenhall_",
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
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          fontSans.variable,
          fontHeading.variable,
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
