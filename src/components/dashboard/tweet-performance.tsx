"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, ThumbsUp, Bookmark, MessageCircle, Repeat, BarChart3Icon } from "lucide-react";
import { Metric, Tweet } from "@/lib/types";
import { useState, useCallback } from "react";
import { format } from "date-fns";
import { Toggle } from "@/components/ui/toggle";
import { Label } from "@/components/ui/label";

const metricIcons = {
  impressions: <Eye className="h-4 w-4" />,
  likes: <ThumbsUp className="h-4 w-4" />,
  bookmarks: <Bookmark className="h-4 w-4" />,
  comments: <MessageCircle className="h-4 w-4" />,
  retweets: <Repeat className="h-4 w-4" />,
  engagement_rate: <BarChart3Icon className="h-4 w-4" />,
};

type TimeRange = '24h' | '7d' | '28d' | 'all'

interface TweetPerformanceProps {
  tweets: Tweet[];
  metricLabels: Record<string, string>;
  showTimeRange?: boolean;
}

export function TweetPerformance({ tweets, metricLabels, showTimeRange = false }: TweetPerformanceProps) {
  const [selectedMetric, setSelectedMetric] = useState<Metric>("impressions");
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');

  const handleMetricChange = (value: string | undefined) => {
    if (value) {
      setSelectedMetric(value as Metric);
    }
  };

  const filteredTweets = tweets.filter(tweet => {
    if (!showTimeRange || timeRange === 'all') return true;
    
    const tweetDate = new Date(tweet.date);
    const now = new Date();
    const diffInHours = (now.getTime() - tweetDate.getTime()) / (1000 * 60 * 60);
    
    switch (timeRange) {
      case '24h':
        return diffInHours <= 24;
      case '7d':
        return diffInHours <= 24 * 7;
      case '28d':
        return diffInHours <= 24 * 28;
      default:
        return true;
    }
  });

  // Transform tweet data for the chart
  const chartData = filteredTweets
    .map((tweet) => {
      const engagement =
        tweet.like_count +
        tweet.reply_count +
        tweet.bookmark_count +
        tweet.retweet_count +
        tweet.quote_count;
      return {
        id: tweet.tweet_id,
        date: new Date(tweet.date),
        url: `https://twitter.com/user/status/${tweet.tweet_id}`,
        impressions: tweet.view_count,
        comments: tweet.reply_count,
        likes: tweet.like_count,
        bookmarks: tweet.bookmark_count,
        retweets: tweet.retweet_count + tweet.quote_count,
        engagement_rate: tweet.view_count > 0 ? (engagement / tweet.view_count) * 100 : 0,
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort by date

  // Add click handler
  const handleBarClick = useCallback((data: any) => {
    if (data && data.url) {
      window.open(data.url, "_blank");
    }
  }, []);

  const formatValue = (value: number, name: string): string => {
    if (name === "Engagement Rate") {
      const rounded = value.toFixed(1);
      return rounded.endsWith('.0') ? `${Math.round(value)}%` : `${rounded}%`;
    }
    
    if (value >= 1_000_000) {
      const rounded = (value / 1_000_000).toFixed(1);
      return rounded.endsWith('.0') ? `${Math.round(value / 1_000_000)}M` : `${rounded}M`;
    }
    
    if (value >= 1_000) {
      const rounded = (value / 1_000).toFixed(1);
      return rounded.endsWith('.0') ? `${Math.round(value / 1_000)}K` : `${rounded}K`;
    }
    
    return Math.round(value).toString();
  };

  if (!tweets.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Tweet Performance Overview</CardTitle>
          <CardDescription>Analyze different metrics for your tweets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">No data available for this period</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tweet Performance Overview</CardTitle>
        <CardDescription>Analyze different metrics for your tweets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4 mb-6">
          {showTimeRange && (
            <div className="flex space-x-2 items-center justify-end w-full">
              <Label className="text-base">Time Range:</Label>
              <div className="flex items-center rounded-md  p-1 space-x-1 w-fit">
                <Toggle
                  variant="outline"
                  size="sm"
                  pressed={timeRange === '24h'}
                  onPressedChange={() => setTimeRange('24h')}
                >
                  24h
                </Toggle>
                <Toggle
                  variant="outline"
                  size="sm"
                  pressed={timeRange === '7d'}
                  onPressedChange={() => setTimeRange('7d')}
                >
                  7d
                </Toggle>
                <Toggle
                  variant="outline"
                  size="sm"
                  pressed={timeRange === '28d'}
                  onPressedChange={() => setTimeRange('28d')}
                >
                  28d
                </Toggle>
                {/* <Toggle
                  variant="outline"
                  size="sm"
                  pressed={timeRange === 'all'}
                  onPressedChange={() => setTimeRange('all')}
                >
                  All
                </Toggle> */}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-lg font-medium">
              {selectedMetric.charAt(0).toUpperCase() +
                selectedMetric.slice(1).replaceAll("_", " ")}
            </div>
            <ToggleGroup
              type="single"
              value={selectedMetric}
              onValueChange={handleMetricChange}
              className="justify-start"
            >
              {(Object.keys(metricLabels) as Metric[]).map((key) => (
                <ToggleGroupItem
                  key={key}
                  value={key}
                  aria-label={`Show ${metricLabels[key]}`}
                  className="flex items-center gap-2"
                >
                  {metricIcons[key as keyof typeof metricIcons]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), "MMM d")} />
              <YAxis 
                tickFormatter={(value) => 
                  value >= 1_000_000
                    ? `${(value / 1_000_000).toFixed(1)}M`
                    : value >= 1_000
                    ? `${(value / 1_000).toFixed(1)}K`
                    : value.toString()
                }
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatValue(value, name),
                  metricLabels[name as Metric] || name,
                ]}
                labelFormatter={(value: string) => format(new Date(value), "MMM d, yyyy")}
              />
              <Legend />
              <Bar
                dataKey={selectedMetric}
                fill="hsl(var(--primary))"
                name={metricLabels[selectedMetric]}
                cursor="pointer"
                onClick={handleBarClick}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
