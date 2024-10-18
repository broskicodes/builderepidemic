"use client";

import { WorldMap } from "@/components/map/leaflet";
import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { HomeIcon, MessageCircleWarningIcon, PlusIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCallback, useState, useEffect } from "react";
import { Hero } from "@/components/lp/hero-2";

export default function MapPage() {
  const [showMap, setShowMap] = useState(false);
  const [newNodeData, setNewNodeData] = useState([
    // {
    //   name: "Aurea",
    //   description: "Hacker house in Berlin, Germany",
    //   location: "Berlin, Germany",
    //   longitude: 13.404954,
    //   latitude: 52.520008,
    //   node_type: NodeType.HackerHouse,
    //   links: [{
    //     name: "Website",
    //     url: "https://joinaurea.com/"
    //   }, {
    //     name: "Twitter",
    //     url: "https://x.com/AureaBerlin"
    //   }],
    //   connection: null,
    // },
    // {
    //   name: "SF2",
    //   description: "Hacker house in San Francisco, USA",
    //   location: "San Francisco, USA",
    //   longitude: -122.4794, // Shifted much further west (towards Ocean Beach)
    //   latitude: 37.7549,    // Shifted slightly south
    //   node_type: NodeType.HackerHouse,
    //   links: [{
    //     name: "Website",
    //     url: "https://sf2.sh/"
    //   }, {
    //     name: "Twitter",
    //     url: "https://x.com/_TheResidency"
    //   }],
    //   connection: null,
    // },
    // {
    //   name: "SF Parc",
    //   description: "Group house in San Francisco, USA",
    //   location: "San Francisco, USA",
    //   longitude: -122.4194, // Moved back to central San Francisco
    //   latitude: 37.7749,    // Standard coordinates for San Francisco
    //   node_type: NodeType.HackerHouse,
    //   links: [{
    //     name: "Website",
    //     url: "https://www.sfparc.com/"
    //   }, {
    //     name: "Twitter",
    //     url: "https://x.com/_TheResidency"
    //   }],
    //   connection: null,
    // },
    // {
    //   name: "Arcadia",
    //   description: "Hacker house in Berkeley, USA",
    //   location: "Berkeley, USA",
    //   longitude: -122.2727,
    //   latitude: 37.8719,
    //   node_type: NodeType.HackerHouse,
    //   links: [
    //     {
    //       name: "Website",
    //       url: "https://www.joinarcadia.org/"
    //     },
    //     {
    //       name: "Twitter",
    //       url: "https://x.com/_TheResidency"
    //     }
    //   ],
    //   connection: null,
    // },
    // // {
    // //   name: "Alexandria",
    // //   description: "Group house in Munich, Germany",
    // //   location: "Munich, Germany",
    // //   longitude: 11.5761,
    // //   latitude: 48.1374,
    // //   node_type: NodeType.HackerHouse,
    // //   links: [],
    // //   connection: null,
    // // },
    // {
    //   name: "C-House",
    //   description: "Group house in Cambridge, USA",
    //   location: "Cambridge, USA",
    //   longitude: -71.1072,
    //   latitude: 42.3736,
    //   node_type: NodeType.HackerHouse,
    //   links: [
    //     {
    //       name: "Website",
    //       url: "https://harvardentrepreneurs.com/"
    //     },
    //     {
    //       name: "Twitter",
    //       url: "https://x.com/_TheResidency"
    //     }
    //   ],
    //   connection: null,
    // },
    // {
    //   name: "Bangalore Group House",
    //   description: "Group house in Bangalore, India",
    //   location: "Bangalore, India",
    //   longitude: 77.5946,
    //   latitude: 12.9716,
    //   node_type: NodeType.HackerHouse,
    //   links: [
    //     {
    //       name: "Website",
    //       url: "https://www.livetheresidency.com/"
    //     },
    //     {
    //       name: "Twitter",
    //       url: "https://x.com/_TheResidency"
    //     }
    //   ],
    //   connection: null,
    // },
    // {
    //   name: "Dubai Group House",
    //   description: "Group house in Dubai, UAE",
    //   location: "Dubai, UAE",
    //   longitude: 55.2708, // Adjusted to be on land in Dubai
    //   latitude: 25.2048,  // Adjusted to be on land in Dubai
    //   node_type: NodeType.HackerHouse,
    //   links: [
    //     {
    //       name: "Website",
    //       url: "https://www.livetheresidency.com/"
    //     },
    //     {
    //       name: "Twitter",
    //       url: "https://x.com/_TheResidency"
    //     }
    //   ],
    //   connection: null,
    // },
    // {
    //   name: "Socratica",
    //   description: "Weekly coworking sessions in Waterloo, Ontario",
    //   location: "Waterloo, Ontario",
    //   longitude: -80.5204,
    //   latitude: 43.4643,
    //   node_type: NodeType.Coworking,
    //   links: [
    //     {
    //       name: "RSVP",
    //       url: "https://lu.ma/socratica"
    //     },
    //     {
    //       name: "Website",
    //       url: "https://socratica.info/"
    //     },
    //     {
    //       name: "Instagram",
    //       url: "https://www.instagram.com/socratica.info"
    //     },
    //     {
    //       name: "Twitter",
    //       url: "https://x.com/socraticainfo"
    //     },
    //     {
    //       name: "YouTube",
    //       url: "https://www.youtube.com/@socraticainfo"
    //     }
    //   ],
    //   connection: null,
    // },
    // {
    //   name: "Atelier",
    //   description: "Weekly coworking sessions in Vancouver, BC",
    //   location: "Vancouver, BC",
    //   longitude: -123.1207,
    //   latitude: 49.2827,
    //   node_type: NodeType.Coworking,
    //   links: [
    //     {
    //       name: "RSVP",
    //       url: "https://lu.ma/atelier.ubc"
    //     },
    //     {
    //       name: "Website",
    //       url: "https://www.atelier.ac/"
    //     },
    //     {
    //       name: "Instagram",
    //       url: "https://www.instagram.com/atelier.ubc"
    //     },
    //     {
    //       name: "Twitter",
    //       url: "https://x.com/atelier_ubc"
    //     }
    //   ],
    //   connection: null,
    // },
    // // {
    // //   name: "",
    // //   description: "",
    // //   location: "Los Angeles, California",
    // //   longitude: -118.2437,
    // //   latitude: 34.0522,
    // //   node_type: NodeType.Coworking,
    // //   links: [],
    // //   connection: null,
    // // },
    // // {
    // //   name: "Playspace",
    // //   description: "Weekly coworking sessions in San Francisco, California",
    // //   location: "San Francisco, California",
    // //   longitude: -122.4194,
    // //   latitude: 37.7749,
    // //   node_type: NodeType.Coworking,
    // //   links: [
    // //     {
    // //       name: "RSVP",
    // //       url: "https://lu.ma/playspace"
    // //     },
    // //     {
    // //       name: "Website",
    // //       url: "https://playspace.club/"
    // //     }
    // //   ],
    // //   connection: null,
    // // },
    // {
    //   name: "Making@UMN",
    //   description: "Weekly coworking sessions in Minneapolis, Minnesota",
    //   location: "Minneapolis, Minnesota",
    //   longitude: -93.2650,
    //   latitude: 44.9778,
    //   node_type: NodeType.Coworking,
    //   links: [
    //     {
    //       name: "RSVP",
    //       url: "https://lu.ma/making-umn"
    //     },
    //     {
    //       name: "Instagram",
    //       url: "https://www.instagram.com/makingatumn"
    //     },
    //     {
    //       name: "Website",
    //       url: "https://making.mn/"
    //     }
    //   ],
    //   connection: null,
    // },
    // {
    //   name: "Momentum",
    //   description: "Weekly coworking sessions in London, Ontario",
    //   location: "London, Ontario",
    //   longitude: -81.2497,
    //   latitude: 42.9849,
    //   node_type: NodeType.Coworking,
    //   links: [
    //     {
    //       name: "RSVP",
    //       url: "https://lu.ma/moment.um"
    //     },
    //     {
    //       name: "Instagram",
    //       url: "https://www.instagram.com/momentum_uwo"
    //     }
    //   ],
    //   connection: null,
    // },
    // {
    //   name: "Friendly Beans",
    //   description: "Weekly coworking sessions in Boston, Massachusetts",
    //   location: "Boston, Massachusetts",
    //   longitude: -71.0589,
    //   latitude: 42.3601,
    //   node_type: NodeType.Coworking,
    //   links: [
    //     {
    //       name: "RSVP",
    //       url: "https://lu.ma/beans"
    //     },
    //     {
    //       name: "Instagram",
    //       url: "https://www.instagram.com/friendlybeansboston/"
    //     }
    //   ],
    //   connection: null,
    // },
    // {
    //   name: "DouzeaDeux",
    //   description: "Weekly coworking sessions in Montreal, Quebec",
    //   location: "Montreal, Quebec",
    //   longitude: -73.5674,
    //   latitude: 45.5017,
    //   node_type: NodeType.Coworking,
    //   links: [{
    //     name: "RSVP",
    //     url: "https://lu.ma/douzeadeuxMontreal",
    //   },
    //   {
    //     name: "Instagram",
    //     url: "https://www.instagram.com/douzeadeux/",
    //   },
    //   {
    //     name: "Twitter",
    //     url: "https://twitter.com/douzeadeux"
    //   }],
    //   connection: null,
    // },
    // {
    //   name: "Craft",
    //   description: "Weekly coworking sessions in London, UK",
    //   location: "London, UK",
    //   longitude: -0.1496, // Shifted much further west
    //   latitude: 51.5194, // Shifted much further north
    //   node_type: NodeType.Coworking,
    //   links: [{
    //     name: "RSVP",
    //     url: "https://lu.ma/craft_",
    //   },
    //   {
    //     name: "Instagram",
    //     url: "https://www.instagram.com/craft_ldn",
    //   },
    //   {
    //     name: "Website",
    //     url: "https://www.craftedu.org/"
    //   }],
    //   connection: null,
    // },
    // {
    //   name: "Scaledown",
    //   description: "Weekly coworking sessions in Cambridge, UK",
    //   location: "Cambridge, UK",
    //   longitude: 0.1218,
    //   latitude: 52.2053,
    //   node_type: NodeType.Coworking,
    //   links: [{
    //     name: "RSVP",
    //     url: "https://lu.ma/scaledown"
    //   }],
    //   connection: null,
    // },
    // {
    //   name: "New York Coworking",
    //   description: "A collective of coworking spaces in New York City, USA",
    //   location: "New York City, USA",
    //   longitude: -74.0060,
    //   latitude: 40.7128,
    //   node_type: NodeType.Coworking,
    //   links: [
    //     {
    //       name: "Info page",
    //       url: "https://socratica-nyc.notion.site/Socratica-NYC-Info-Page-5f387d55f1794450ad77a9a8af7bde8f"
    //     }
    //   ],
    //   connection: null,
    // },
    // {
    //   name: "IndieBeers Tokyo",
    //   description: "Monthly nomad meetups in Tokyo, Japan",
    //   location: "Tokyo, Japan",
    //   longitude: 139.6917,
    //   latitude: 35.6895,
    //   node_type: NodeType.Meetup,
    //   links: [{
    //     name: "Info page",
    //     url: "https://www.meetup.com/indie-tokyo/?eventOrigin=event_home_page"
    //   }],
    //   connection: null,
    // },
    // {
    //   name: "IndieBeers Lisbon",
    //   description: "Monthly nomad meetups in Lisbon, Portugal",
    //   location: "Lisbon, Portugal",
    //   longitude: -9.1393,
    //   latitude: 38.7223,
    //   node_type: NodeType.Meetup,
    //   links: [{
    //     name: "Info page",
    //     url: "https://www.meetup.com/indie-lisboa/?eventOrigin=event_home_page"
    //   }],
    //   connection: null,
    // },
    // {
    //   name: "IndieBeers London",
    //   description: "Monthly nomad meetups in London, UK",
    //   location: "London, UK",
    //   longitude: -0.1056, // Shifted much further east
    //   latitude: 51.4954, // Shifted much further south
    //   node_type: NodeType.Meetup,
    //   links: [{
    //     name: "Info page",
    //     url: "https://www.meetup.com/indie-london/?eventOrigin=event_home_page"
    //   }],
    //   connection: null,
    // },
    // {
    //   name: "IndieBeers New York",
    //   description: "Monthly nomad meetups in New York City, USA",
    //   location: "New York City, USA",
    //   longitude: -73.9860,
    //   latitude: 40.7128,
    //   node_type: NodeType.Meetup,
    //   links: [{
    //     name: "Info page",
    //     url: "https://lu.ma/ramen-club-nyc"
    //   }],
    //   connection: null,
    // },
  ]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("subscribedEmail");
    if (storedEmail) {
      setShowMap(true);
    }
    
    const handleShowMap = () => setShowMap(true);
    window.addEventListener('showMap', handleShowMap);

    // Cleanup function
    return () => {
      window.removeEventListener('showMap', handleShowMap);
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
      console.log("New node added:", addedNode);
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
        <Dock direction="middle" className="absolute bg-white bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <DockIcon>
            <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}>
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
                <p><a href="mailto:braeden@brhall.dev" className="text-primary underline">Send me an email</a>!</p>
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
                <p><a href="mailto:braeden@brhall.dev" className="text-primary underline">Send me an email</a>!</p>
              </PopoverContent>
            </Popover>
          </DockIcon>
          {/* <DockIcon>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleAddNode}>
              <SearchIcon className="size-6" />
            </Button>
          </DockIcon> */}
          </Dock>
        </main>
      )}
      {!showMap && <Footer />}
    </div>
  );
}
