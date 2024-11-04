"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Metric, Tweet } from "@/lib/types";
import { TweetPerformance } from "./tweet-performance";
import { Metrics } from "./metrics";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectSearch,
} from "@/components/ui/select";
import { addWeeks, format, startOfWeek, endOfWeek } from "date-fns";
import { cn } from "@/lib/utils";

const metricLabels: Record<Metric, string> = {
  impressions: "Impressions",
  engagement_rate: "Engagement Rate",
  comments: "Comments",
  likes: "Likes",
  bookmarks: "Bookmarks",
  retweets: "Retweets",
};

interface DateRange {
  start: Date;
  end: Date;
  label: string;
  value: string;
}

interface TwitterHandle {
  handle: string;
  pfp: string | null;
  url: string;
}

export function PersonalDashboard() {
  const { data: session } = useSession();
  const [tweetData, setTweetData] = useState<Tweet[]>([]);
  const [filteredTweets, setFilteredTweets] = useState<Tweet[]>([]);
  const [prevPeriodTweets, setPrevPeriodTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<string>("all");
  const [dateRanges, setDateRanges] = useState<DateRange[]>([]);
  const [selectedHandle, setSelectedHandle] = useState<TwitterHandle | null>(null);
  const [handles, setHandles] = useState<TwitterHandle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (session?.user?.handle) {
      setSelectedHandle({
        handle: session.user.handle,
        pfp: `https://unavatar.io/twitter/${session.user.handle}`,
        url: `https://x.com/${session.user.handle}`,
      });
    }
  }, [session?.user?.handle]);

  useEffect(() => {
    const fetchTweets = async () => {
      if (!selectedHandle) return;

      try {
        const response = await fetch(`/api/tweets/${selectedHandle.handle}`);

        if (!response.ok) {
          throw new Error("Failed to fetch tweets");
        }

        const data: Tweet[] = await response.json();
        setTweetData(data);
        setFilteredTweets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching tweets:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTweets();
  }, [selectedHandle]);

  useEffect(() => {
    if (!tweetData.length) return;

    const oldestTweetDate = new Date(Math.min(...tweetData.map((t) => new Date(t.date).getTime())));
    const now = new Date();
    const ranges: DateRange[] = [];

    // Add "All Time" option
    ranges.push({
      start: oldestTweetDate,
      end: now,
      label: "All Time",
      value: "all",
    });

    // Calculate weekly ranges from oldest tweet to now
    let currentStart = startOfWeek(oldestTweetDate, { weekStartsOn: 0 });
    let weekCount = 0;

    while (currentStart <= now) {
      const rangeEnd = endOfWeek(currentStart, { weekStartsOn: 0 });
      ranges.push({
        start: currentStart,
        end: rangeEnd,
        label: `${format(currentStart, "MMM d")} - ${format(rangeEnd, "MMM d")}`,
        value: `week_${weekCount}`,
      });
      currentStart = addWeeks(currentStart, 1);
      weekCount++;
    }

    setDateRanges(ranges);
  }, [tweetData]);

  useEffect(() => {
    if (!tweetData.length || !dateRanges.length) return;

    if (selectedRange === "all") {
      setFilteredTweets(tweetData);
      setPrevPeriodTweets([]);
      return;
    }

    const selectedDateRange = dateRanges.find((range) => range.value === selectedRange);

    if (!selectedDateRange) return;

    const filtered = tweetData.filter((tweet) => {
      const tweetDate = new Date(tweet.date);
      return tweetDate >= selectedDateRange.start && tweetDate <= selectedDateRange.end;
    });

    const periodLength = selectedDateRange.end.getTime() - selectedDateRange.start.getTime();
    const prevPeriodStart = new Date(selectedDateRange.start.getTime() - periodLength);
    const prevPeriodEnd = new Date(selectedDateRange.start);

    const prevPeriod = tweetData.filter((tweet) => {
      const tweetDate = new Date(tweet.date);
      return tweetDate >= prevPeriodStart && tweetDate < prevPeriodEnd;
    });

    setFilteredTweets(filtered);
    setPrevPeriodTweets(prevPeriod);
  }, [selectedRange, tweetData, dateRanges]);

  useEffect(() => {
    const fetchHandles = async () => {
      try {
        const response = await fetch(`/api/handles`);
        if (!response.ok) {
          throw new Error("Failed to fetch handles");
        }
        const data: TwitterHandle[] = await response.json();
        setHandles(data);
      } catch (err) {
        console.error("Error fetching handles:", err);
      }
    };

    fetchHandles();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Loading tweets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Please sign in to view your tweet analytics</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">Twitter Analytics for:</h1>
            {selectedHandle && selectedHandle.pfp && (
              <a href={selectedHandle.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={selectedHandle.pfp}
                  alt={`@${selectedHandle.handle}`}
                  className="w-10 h-10 rounded-full"
                />
              </a>
            )}
            <div className="w-48">
              <Select
                value={selectedHandle?.handle}
                onValueChange={(value) =>
                  setSelectedHandle(handles.find((handle) => handle.handle === value) || null)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select handle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectSearch
                    placeholder="Search handles..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <SelectGroup>
                    <SelectLabel>Handles</SelectLabel>
                    {/* Show current user's handle first */}
                    {session?.user?.handle && (
                      <SelectItem value={session.user.handle}>
                        @{session.user.handle} (You)
                      </SelectItem>
                    )}
                    {/* Show filtered handles */}
                    {handles
                      .filter(
                        (h) =>
                          h.handle.toLowerCase().includes(searchQuery.toLowerCase()) &&
                          h.handle !== session?.user?.handle,
                      )
                      .map((handle) => (
                        <SelectItem key={handle.handle} value={handle.handle}>
                          @{handle.handle}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="w-fit ml-auto flex space-x-2 items-center">
          <label
            htmlFor="date-range"
            className="whitespace-nowrap text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Select Date Range:
          </label>
          <div className="w-64">
            <Select value={selectedRange} onValueChange={setSelectedRange}>
              <SelectTrigger id="date-range">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Available Ranges</SelectLabel>
                  {dateRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8 flex flex-col gap-4">
        <TweetPerformance tweets={filteredTweets} metricLabels={metricLabels} />
        <Metrics
          tweets={filteredTweets}
          prevPeriodTweets={prevPeriodTweets}
          metricLabels={metricLabels}
        />
      </main>
    </div>
  );
}
