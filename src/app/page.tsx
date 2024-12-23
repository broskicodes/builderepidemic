"use client";

import { Header } from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { CuratedResources } from "@/components/lp/curated-resources";
import Hero from "@/components/lp/hero-lp";
import { TwitterScrapeType } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      {/* <Button onClick={() => {
        fetch(`${process.env.NEXT_PUBLIC_SCRAPER_URL}/twitter/scrape/run-all`, {
          // headers: {
          //   'Content-Type': 'application/json',
          // },
          method: 'POST',
          // body: JSON.stringify({ scrapeType: TwitterScrapeType.Initialize, handles: [
          //   "desmondhth",
          //   // "fresh_man_cyrus",
          //   // "sabacha26488",
          //   // "hector6872",
          //   // "josuetoz"
          // ] }),
        })
      }}>Scrape Twitter</Button> */}
      <CuratedResources />
      <Footer />
    </main>
  );
}
