"use client";

import { LeaderboardSection } from "@/components/leaderboard/leaderboard-section";
import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { LeaderboardData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { InfoIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

async function getLeaderboardData(): Promise<Record<string, LeaderboardData>> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_ENV_URL}/api/tweets`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard data");
  }

  const leaderboardData = await response.json();

  return leaderboardData;
}

export default function Leaderboard() {
  const { data: session } = useSession();
  const [leaderboardData, setLeaderboardData] = useState<Record<string, LeaderboardData>>({});
  const [showModal, setShowModal] = useState(false);
  const [popUpShown, setPopUpShown] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const data = await getLeaderboardData();
      setLeaderboardData(data);
    }
    fetchData();

    const handleScroll = () => {
      if (window.scrollY > 500 && !session && !showModal && !popUpShown) {
        setShowModal(true);
        setPopUpShown(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [session, showModal, popUpShown]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-background relative">
      <main className="flex-1 flex flex-col h-screen w-full bg-background">
        <Header />
        <LeaderboardSection leaderboardData={leaderboardData} />
      </main>
      <Footer />
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wanna add yourself to the leaderboard?</DialogTitle>
            <DialogDescription className="flex items-center">
              Join the shipper epidemic!
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => signIn("twitter")} className="mt-6">
            Join
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
