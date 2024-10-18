import { WorldMap } from "@/components/map/leaflet";
import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function MapPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <main className="flex-1 flex flex-col h-screen w-full bg-background">
        <Header />
        <WorldMap />
      </main>
      <Footer />
    </div>
  );
}
