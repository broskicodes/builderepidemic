"use client";

import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Dock, DockIcon } from "@/components/magicui/dock";
import {
  HomeIcon,
  MessageCircleWarningIcon,
  PlusIcon,
  AlertCircle,
  SearchIcon,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCallback, useState, useEffect } from "react";
import { Hero } from "@/components/lp/hero-2";
import dynamic from "next/dynamic";
import { Node, NodeType } from "@/lib/types";
import { SHOW_MAP_EVENT } from "@/lib/types";

const WorldMap = dynamic(() => import("@/components/map/leaflet"), {
  ssr: false,
});

export default function MapPage() {
  const [showMap, setShowMap] = useState(false);
  const [newNodeData, setNewNodeData] = useState<Omit<Node, "id">[]>([
    // {
    //     name: "The Quest",
    //     description: "A startup studio in Paris",
    //     location: "Paris, France",
    //     longitude: 2.3522,
    //     latitude: 48.8566,
    //     node_type: NodeType.IncubatorOrAccelerator,
    //     links: [
    //       {
    //         name: "Website",
    //         url: "https://jointhequest.co",
    //       },
    //       {
    //         name: "Instagram",
    //         url: "https://www.instagram.com/thequest_fr/",
    //       },
    //       {
    //         name: "Youtube",
    //         url: "https://www.youtube.com/@thequest_fr",
    //       },
    //       {
    //         name: "LinkedIn",
    //         url: "https://www.linkedin.com/company/the-quest-1er-centre-de-formation-entrepreneurial/",
    //       }
    //     ],
    //     connection: null,
    //   },
    //   {
    //     name: "Station F",
    //     description: "A startup campus in Paris",
    //     location: "Paris, France",
    //     longitude: 2.3710,
    //     latitude: 48.8336,
    //     node_type: NodeType.IncubatorOrAccelerator,
    //     links: [
    //       {
    //         name: "Website",
    //         url: "https://stationf.co/",
    //       },
    //       {
    //         name: "Instagram",
    //         url: "https://www.instagram.com/joinstationf",
    //       },
    //       {
    //         name: "Twitter",
    //         url: "https://x.com/joinstationf",
    //       },
    //       {
    //         name: "LinkedIn",
    //         url: "https://www.linkedin.com/company/stationf/",
    //       },
    //       {
    //         name: "Youtube",
    //         url: "https://www.youtube.com/channel/UCJdVyJNEdvWrQrUBGq6moIw",
    //       }
    //     ],
    //     connection: null,
    //   }
  ]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("subscribedEmail");
    if (storedEmail) {
      setShowMap(true);
    }

    const handleShowMap = () => setShowMap(true);
    window.addEventListener(SHOW_MAP_EVENT, handleShowMap);

    // Cleanup function
    return () => {
      window.removeEventListener(SHOW_MAP_EVENT, handleShowMap);
    };
  }, []);

  const handleAddNode = useCallback(async () => {
    try {
      const res = await fetch("/api/nodes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNodeData),
      });

      if (!res.ok) {
        throw new Error("Failed to add node");
      }

      const addedNode = await res.json();
      // TODO: Update the map or state with the new node
    } catch (error) {
      console.error("Error adding node:", error);
    }
  }, [newNodeData]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      {!showMap && (
        <main className="flex-1 flex flex-col h-screen w-full bg-background">
          <Header />
          <Hero />
        </main>
      )}
      {showMap && (
        <main className="flex-1 flex flex-col h-screen w-full bg-background relative">
          <WorldMap />
          <Dock
            direction="middle"
            className="absolute bg-white sm:bottom-8 bottom-32 left-1/2 -translate-x-1/2 z-50"
          >
            <DockIcon>
              <Link
                href="/"
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}
              >
                <HomeIcon className="size-6" />
              </Link>
            </DockIcon>
            <DockIcon>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <PlusIcon className="size-6" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <p className="text-lg font-bold">Wanna add a new node?</p>
                  <p>
                    <a href="mailto:braeden@brhall.dev" className="text-primary underline">
                      Send me an email
                    </a>
                    !
                  </p>
                </PopoverContent>
              </Popover>
            </DockIcon>
            <DockIcon>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MessageCircleWarningIcon className="size-6" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <p className="text-lg font-bold">Find an issue with the map?</p>
                  <p>
                    <a href="mailto:braeden@brhall.dev" className="text-primary underline">
                      Send me an email
                    </a>
                    !
                  </p>
                </PopoverContent>
              </Popover>
            </DockIcon>
            {/* <DockIcon>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleAddNode}>
              <SearchIcon className="size-6" />
            </Button>
          </DockIcon> */}
          </Dock>
          <div className="absolute sm:bottom-4 bottom-24 right-4 bg-white/40 backdrop-blur-sm p-2 rounded-md shadow-md z-50 flex items-center space-x-2">
            <AlertCircle className="text-gray-500" size={16} />
            <span className="text-xs text-gray-600">
              These communities are not affiliated with Builder Epidemic
            </span>
          </div>
        </main>
      )}
      {!showMap && <Footer />}
    </div>
  );
}
