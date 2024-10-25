"use client"

import { LeaderboardSection } from "@/components/leaderboard/leaderboard-section";
import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { LeaderboardData } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { InfoIcon } from "lucide-react";

async function getLeaderboardData(): Promise<Record<string, LeaderboardData>> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_ENV_URL}/api/tweets`, {
    method: "GET",
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard data');
  }

  const leaderboardData = await response.json();

  return leaderboardData;
};

export default function Leaderboard() {
  const { data: session } = useSession();
  const [leaderboardData, setLeaderboardData] = useState<Record<string, LeaderboardData>>({});

  useEffect(() => {
    async function fetchData() {
      const data = await getLeaderboardData();
      setLeaderboardData(data);
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-background relative">
      <main className="flex-1 flex flex-col h-screen w-full bg-background">
        <Header />
        <LeaderboardSection leaderboardData={leaderboardData} />
      </main>
      <Footer />
      {!session && (
        <Card className="fixed bottom-4 right-4 shadow-lg">
          <CardContent className="p-4 flex items-center text-muted-foreground">
            <InfoIcon className="w-4 h-4 mr-2" />
            <p className="text-sm ">Join to add yourself to leaderboard</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
