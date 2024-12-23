"use client";

import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Eye, ThumbsUp, Bookmark, MessageCircle } from "lucide-react";
import { LeaderboardData, Tweet } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useMediaQuery } from "react-responsive";
import { Pagination } from "@/components/ui/pagination";

// Define interfaces and types
interface Score {
  label: string;
  score: number;
}

interface ScoreData {
  label: string;
  score: number;
  views: number;
  likes: number;
  bookmarks: number;
  replies: number;
  scores: Score[];
}

interface ProcessedLeaderboardData {
  user_id: string;
  handle: string;
  pfp: string;
  dailyScores: ScoreData[];
  weeklyScores: ScoreData[];
  monthlyScores: ScoreData[];
}

// Add this function to process leaderboard data
function processLeaderboardData(
  leaderboardData: Record<string, LeaderboardData>,
): ProcessedLeaderboardData[] {
  const processedData: ProcessedLeaderboardData[] = [];

  Object.keys(leaderboardData).forEach((handle) => {
    const player = leaderboardData[handle];

    // Group tweets by day
    const dailyScoresMap: Record<string, ScoreData> = {};
    player.tweets.forEach((tweet) => {
      const date = new Date(tweet.date).toLocaleDateString();
      const tweetScore =
        tweet.view_count + tweet.like_count + tweet.bookmark_count + tweet.reply_count;

      if (!dailyScoresMap[date]) {
        dailyScoresMap[date] = {
          label: date,
          score: 0,
          views: 0,
          likes: 0,
          bookmarks: 0,
          replies: 0,
          scores: [],
        };
      }
      dailyScoresMap[date].score += tweetScore;
      dailyScoresMap[date].views += tweet.view_count;
      dailyScoresMap[date].likes += tweet.like_count;
      dailyScoresMap[date].bookmarks += tweet.bookmark_count;
      dailyScoresMap[date].replies += tweet.reply_count;
      dailyScoresMap[date].scores.push({ label: tweet.tweet_id, score: tweetScore });
    });

    // Fill in missing days with a score of 0
    const startDate = new Date(
      Math.min(...player.tweets.map((tweet) => new Date(tweet.date).getTime())),
    );
    const endDate = new Date(
      Math.max(...player.tweets.map((tweet) => new Date(tweet.date).getTime())),
    );
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toLocaleDateString();
      if (!dailyScoresMap[dateStr]) {
        dailyScoresMap[dateStr] = {
          label: dateStr,
          score: 0,
          views: 0,
          likes: 0,
          bookmarks: 0,
          replies: 0,
          scores: [],
        };
      }
    }

    const dailyScores = Object.values(dailyScoresMap).sort(
      (a, b) => new Date(a.label).getTime() - new Date(b.label).getTime(),
    );

    // Compute weekly scores
    const weeklyScoresMap: Record<string, ScoreData> = {};
    let currentWeekStart: Date | null = null;
    let currentWeekScore: ScoreData = {
      label: "",
      score: 0,
      views: 0,
      likes: 0,
      bookmarks: 0,
      replies: 0,
      scores: [],
    };

    dailyScores.forEach(({ label, score, views, likes, bookmarks, replies }) => {
      const currentDate = new Date(label);
      const dayOfWeek = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)

      if (dayOfWeek === 1 || (currentWeekStart === null && dayOfWeek !== 0)) {
        // Start a new week on Monday or if it's the first week and not starting on Sunday
        if (currentWeekScore.scores.length > 0) {
          weeklyScoresMap[currentWeekScore.label] = currentWeekScore;
          currentWeekScore = {
            label: "",
            score: 0,
            views: 0,
            likes: 0,
            bookmarks: 0,
            replies: 0,
            scores: [],
          };
        }
        currentWeekStart = currentDate;
        currentWeekScore.label = currentWeekStart.toLocaleDateString();
      }

      currentWeekScore.score += score;
      currentWeekScore.views += views;
      currentWeekScore.likes += likes;
      currentWeekScore.bookmarks += bookmarks;
      currentWeekScore.replies += replies;
      currentWeekScore.scores.push({ label, score });
    });

    // Add the last week if it has any days
    if (currentWeekScore.scores.length > 0) {
      weeklyScoresMap[currentWeekScore.label] = currentWeekScore;
    }

    const weeklyScores = Object.values(weeklyScoresMap);

    // Compute monthly scores
    const monthlyScoresMap: Record<string, ScoreData> = {};
    weeklyScores.forEach(({ label, score, views, likes, bookmarks, replies }) => {
      const month = new Date(label).toLocaleString("default", { month: "long" });
      if (!monthlyScoresMap[month]) {
        monthlyScoresMap[month] = {
          label: month,
          score: 0,
          views: 0,
          likes: 0,
          bookmarks: 0,
          replies: 0,
          scores: [],
        };
      }
      monthlyScoresMap[month].score += score;
      monthlyScoresMap[month].views += views;
      monthlyScoresMap[month].likes += likes;
      monthlyScoresMap[month].bookmarks += bookmarks;
      monthlyScoresMap[month].replies += replies;
      monthlyScoresMap[month].scores.push({ label, score });
    });

    const monthlyScores = Object.values(monthlyScoresMap);

    processedData.push({
      user_id: player.user_id,
      handle,
      pfp: `https://unavatar.io/x/${handle}`,
      dailyScores,
      weeklyScores,
      monthlyScores,
    });
  });

  // console.log(processedData);

  return processedData;
}

export function LeaderboardSection({
  leaderboardData,
}: {
  leaderboardData: Record<string, LeaderboardData>;
}) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("monthly");
  const [playerData, setPlayerData] = useState<
    { user_id: string; handle: string; pfp: string; scoreData: ScoreData | null }[]
  >([]);
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const itemsPerPage = isMobile ? 10 : 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Process the leaderboard data
  const processedData = useMemo(() => processLeaderboardData(leaderboardData), [leaderboardData]);

  useEffect(() => {
    if (processedData.length === 0) return;

    if (activeTab === "monthly") {
      setPlayerData(
        processedData.map((player) => ({
          user_id: player.user_id,
          handle: player.handle,
          pfp: player.pfp,
          scoreData: player.monthlyScores.at(-1)!,
        })),
      );
    } else if (activeTab === "weekly") {
      setPlayerData(
        processedData.map((player) => ({
          user_id: player.user_id,
          handle: player.handle,
          pfp: player.pfp,
          scoreData: player.weeklyScores.at(-1)!,
        })),
      );
    } else {
      setPlayerData(
        processedData.map((player) => ({
          user_id: player.user_id,
          handle: player.handle,
          pfp: player.pfp,
          scoreData: player.dailyScores.at(-1)!,
        })),
      );
    }
  }, [activeTab, processedData]);

  const renderScoreGraph = (data: any[], dataKey: string, xAxisLabel: string) => (
    <ChartContainer
      config={{
        score: {
          label: "Score",
          color: "hsl(var(--primary))",
        },
      }}
      className="h-[200px] w-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" label={{ value: xAxisLabel, position: "bottom", offset: -5 }} />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey={dataKey} fill="var(--color-score)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );

  const renderPlayerInfo = (scoreData: ScoreData) => (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-1">
        <Eye className="h-4 w-4 text-muted-foreground" />
        <span>{scoreData.views.toLocaleString()}</span>
      </div>
      <div className="flex items-center space-x-1">
        <ThumbsUp className="h-4 w-4 text-muted-foreground" />
        <span>{scoreData.likes.toLocaleString()}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Bookmark className="h-4 w-4 text-muted-foreground" />
        <span>{scoreData.bookmarks.toLocaleString()}</span>
      </div>
      <div className="flex items-center space-x-1">
        <MessageCircle className="h-4 w-4 text-muted-foreground" />
        <span>{scoreData.replies.toLocaleString()}</span>
      </div>
    </div>
  );

  const renderPodium = () => {
    const topThree = playerData
      .sort((a, b) => {
        if (!a.scoreData || !b.scoreData) {
          return !a.scoreData && !b.scoreData ? 0 : !a.scoreData ? 1 : -1;
        }
        return b.scoreData.score - a.scoreData.score;
      })
      .slice(0, 3);

    const [first, second, third] = topThree;

    return (
      <div className="flex justify-center items-end mb-12 mt-8">
        {first &&
          second &&
          third &&
          [second, first, third].map((player, index) => {
            const isFirst = index === 1;
            const avatarSize = isFirst
              ? "w-20 h-20 sm:w-24 sm:h-24"
              : index === 0
                ? "w-16 h-16 sm:w-20 sm:h-20"
                : "w-12 h-12 sm:w-16 sm:h-16";
            const podiumHeight = isFirst
              ? "h-24 sm:h-32"
              : index === 0
                ? "h-20 sm:h-24"
                : "h-12 sm:h-16";
            const textSize = isFirst ? "text-xl sm:text-2xl" : "text-lg sm:text-xl";
            const marginTop = isFirst ? "mt-0" : "mt-4 sm:mt-8";
            // Update highlight class to use primary/40
            // @ts-ignore
            const highlightClass = session?.user?.handle === player.handle ? "bg-primary/20" : "";

            return (
              <Popover key={player.handle}>
                <PopoverTrigger asChild>
                  <div
                    className={`flex flex-col items-center mx-2 sm:mx-4 cursor-pointer ${marginTop} w-32 ${highlightClass} rounded-lg p-2`}
                  >
                    <a
                      href={`https://x.com/${player.handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Avatar className={`${avatarSize} mb-2`}>
                        <AvatarImage src={player.pfp} alt={player.handle} />
                        <AvatarFallback>
                          {player.handle
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </a>
                    <div className="text-center">
                      <div className={`font-semibold ${textSize}`}>@{player.handle}</div>
                      <div className={`font-bold text-primary ${textSize}`}>
                        {player.scoreData?.score.toLocaleString()}
                      </div>
                    </div>
                    <div
                      className={`w-20 sm:w-24 ${podiumHeight} bg-primary mt-2 flex items-center justify-center rounded-t-lg`}
                    >
                      <span className="text-primary-foreground font-bold text-xl sm:text-2xl">
                        {index === 1 ? 1 : index === 0 ? 2 : 3}
                      </span>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto">
                  {player.scoreData && renderPlayerInfo(player.scoreData)}
                  {activeTab === "monthly" &&
                    player.scoreData &&
                    renderScoreGraph(
                      player.scoreData.scores.map((score) => ({
                        name: score.label,
                        score: score.score,
                      })),
                      "score",
                      "Weeks",
                    )}
                  {activeTab === "weekly" &&
                    player.scoreData &&
                    renderScoreGraph(
                      player.scoreData.scores.map((score) => ({
                        name: score.label,
                        score: score.score,
                      })),
                      "score",
                      "Days",
                    )}
                  {activeTab === "daily" &&
                    player.scoreData &&
                    renderScoreGraph(
                      player.scoreData.scores.map((score, i) => ({
                        name: `Tweet ${i + 1}`,
                        score: score.score,
                      })),
                      "score",
                      "Tweets",
                    )}
                </PopoverContent>
              </Popover>
            );
          })}
      </div>
    );
  };

  const renderLeaderboard = () => {
    const sortedPlayers = playerData
      .sort((a, b) => {
        if (!a.scoreData || !b.scoreData) {
          return !a.scoreData && !b.scoreData ? 0 : !a.scoreData ? 1 : -1;
        }
        return b.scoreData.score - a.scoreData.score;
      })
      .slice(3);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPlayers = sortedPlayers.slice(startIndex, endIndex);

    return paginatedPlayers.map((player, index) => {
      // @ts-ignore
      const highlightClass = session?.user?.handle === player.handle ? "bg-primary/20" : "";
      const playerRank = startIndex + index + 4;

      return (
        <Popover key={player.handle}>
          <PopoverTrigger asChild>
            <div
              className={`flex items-center space-x-4 mb-4 cursor-pointer hover:bg-muted p-2 rounded-md ${highlightClass}`}
            >
              <div className="w-8 text-center font-bold flex justify-center items-center">
                {playerRank}
              </div>
              <a href={`https://x.com/${player.handle}`} target="_blank" rel="noopener noreferrer">
                <Avatar>
                  <AvatarImage src={player.pfp} alt={player.handle} />
                  <AvatarFallback>
                    {player.handle
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </a>
              <div className="flex-1">
                <div className="font-semibold">@{player.handle}</div>
              </div>
              <div className="hidden sm:block">
                {player.scoreData && renderPlayerInfo(player.scoreData)}
              </div>
              <div className="font-bold text-lg text-primary ml-4 min-w-[80px] text-right">
                {player.scoreData?.score.toLocaleString()}
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto">
            <div className="sm:hidden flex">
              {player.scoreData && renderPlayerInfo(player.scoreData)}
            </div>
            {activeTab === "monthly" &&
              player.scoreData &&
              renderScoreGraph(
                player.scoreData.scores.map((score) => ({ name: score.label, score: score.score })),
                "score",
                "Weeks",
              )}
            {activeTab === "weekly" &&
              player.scoreData &&
              renderScoreGraph(
                player.scoreData.scores.map((score) => ({ name: score.label, score: score.score })),
                "score",
                "Days",
              )}
            {activeTab === "daily" &&
              player.scoreData &&
              renderScoreGraph(
                player.scoreData.scores.map((score, i) => ({
                  name: `Tweet ${i + 1}`,
                  score: score.score,
                })),
                "score",
                "Tweets",
              )}
          </PopoverContent>
        </Popover>
      );
    });
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Leaderboard</CardTitle>
        <CardDescription className="text-center">
          The best Twitter shippers of our generation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly" className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-center">Monthly Leaders</h3>
            {renderPodium()}
            {renderLeaderboard()}
            <Pagination
              currentPage={currentPage}
              totalItems={playerData.length - 3}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </TabsContent>
          <TabsContent value="weekly" className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-center">Weekly Leaders</h3>
            {renderPodium()}
            {renderLeaderboard()}
            <Pagination
              currentPage={currentPage}
              totalItems={playerData.length - 3}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </TabsContent>
          <TabsContent value="daily" className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-center">Daily Leaders</h3>
            {renderPodium()}
            {renderLeaderboard()}
            <Pagination
              currentPage={currentPage}
              totalItems={playerData.length - 3}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
