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
        fetch(`${process.env.NEXT_PUBLIC_SCRAPER_URL}/scrape/twitter`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ scrapeType: TwitterScrapeType.Initialize, handles: [
            "Rayid_ashraf",
            // "_alexshaq",
            // "marc_louvion",
            // "DhravyaShah",
            // "avansteenweghen",
            // "mrmagan_",
            // "thiteanish",
            // "mattrothenberg",
            // "adamchenchew",
            // "hypercosmac",
            // "jean__gatt",
            // "_baretto",
            // "jakezward",
            // "mckaywrigley",
            // "hardeep_gambhir",
            // "arvidkahl",
            // "yongfook",
            // "tdinh_me",
            // "tibo_maker",
            // "csallen",
            // "czue",
            // "TheRaymondYeh",
            // "qayyumrajan",
            // "DannyPostmaa",
            // "JosephKChoi",
            // "itsandrewgao",
            // "mountain_mal",
            // "aribk24",
            // "desmondhth",
            // "TheSlavant"
            // "braedenhall_",
            // "adamlyttleapps",
            // "remotemontes"
          ] }),
        })
      }}>Scrape Twitter</Button> */}
      <CuratedResources />
      <Footer />
    </main>
  );
}
