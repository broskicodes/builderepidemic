import { LeaderboardSection } from "@/components/leaderboard/leaderboard-section";
import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { GetServerSideProps } from 'next';
import { LeaderboardData, Tweet } from "@/lib/types";

interface LeaderboardPageProps {
  leaderboardData: Record<string, LeaderboardData>;
}

export const getLeaderboardData = async (): Promise<Record<string, LeaderboardData>> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_ENV_URL}/api/tweets`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard data');
  }

  const leaderboardData = await response.json();

  return leaderboardData;
};

export default async function Leaderboard() {
  const leaderboardData = await getLeaderboardData();

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <main className="flex-1 flex flex-col h-screen w-full bg-background">
        <Header />
        <LeaderboardSection leaderboardData={leaderboardData} />
      </main>
      <Footer />
    </div>
  );
}