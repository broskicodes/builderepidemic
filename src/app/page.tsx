import Footer from "@/components/layout/footer";
import { CuratedResources } from "@/components/lp/curated-resources";
import Hero from "@/components/lp/hero";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Hero />
      <CuratedResources />
      <Footer />
    </main>
  );
}
