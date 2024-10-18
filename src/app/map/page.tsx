"use client";

import { WorldMap } from "@/components/map/leaflet";
import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { HomeIcon, LayersIcon, PlusIcon, SearchIcon, SettingsIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCallback, useState } from "react";
import { NodeType } from "@/lib/types";

export default function MapPage() {
  const [newNodeData, setNewNodeData] = useState({
    name: "",
    description: "",
    location: "",
    longitude: 0,
    latitude: 0,
    node_type: NodeType.Coworking,
    links: [],
    connection: null,
  });

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
      console.log("New node added:", addedNode);
      // TODO: Update the map or state with the new node
    } catch (error) {
      console.error("Error adding node:", error);
    }
  }, [newNodeData]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <main className="flex-1 flex flex-col h-screen w-full bg-background relative">
        {/* <Header /> */}
        <WorldMap />
        <Dock direction="middle" className="absolute bg-white bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <DockIcon>
            <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}>
              <HomeIcon className="size-6" />
            </Link>
          </DockIcon>
          <DockIcon>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <PlusIcon className="size-6" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <p className="text-lg font-bold">Wanna add a new node?</p>
                  <p><a href="mailto:braeden@brhall.dev" className="text-primary underline">Send me an email</a>!</p>
                </PopoverContent>
              </Popover>
            </Button>
          </DockIcon>
          {/* <DockIcon>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleAddNode}>
              <SearchIcon className="size-6" />
            </Button>
          </DockIcon> */}
        </Dock>
      </main>
      <Footer />
    </div>
  );
}
