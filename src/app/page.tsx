"use client";

import { Header } from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { CuratedResources } from "@/components/lp/curated-resources";
import Hero from "@/components/lp/hero-1";
import { TwitterScrapeType } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      {/* <Button onClick={() => {
        fetch('/api/scrape/twitter', {
          method: 'POST',
          body: JSON.stringify({ scrapeType: TwitterScrapeType.Weekly, handles: ["levelsio", "mattiapomelli", "iamgdsa"] }),
        })
      }}>Scrape Twitter</Button> */}
      <CuratedResources />
      <Footer />
    </main>
  );
}
