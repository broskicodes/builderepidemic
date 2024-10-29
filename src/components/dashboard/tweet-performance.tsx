"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, ThumbsUp, Bookmark, MessageCircle, Repeat, BarChart3Icon } from "lucide-react";
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Metric, Tweet } from "@/lib/types";
import { useState, useCallback } from "react";

const metricIcons = {
  impressions: <Eye className="h-4 w-4" />,
  likes: <ThumbsUp className="h-4 w-4" />,
  bookmarks: <Bookmark className="h-4 w-4" />,
  comments: <MessageCircle className="h-4 w-4" />,
  retweets: <Repeat className="h-4 w-4" />,
  engagement_rate: <BarChart3Icon className="h-4 w-4" />,
};

interface TweetPerformanceProps {
  tweets: Tweet[];
  metricLabels: Record<string, string>;
}

export function TweetPerformance({ tweets, metricLabels }: TweetPerformanceProps) {
  const [selectedMetric, setSelectedMetric] = useState<Metric>("impressions");

  const handleMetricChange = (value: string | undefined) => {
    if (value) {
      setSelectedMetric(value as Metric);
    }
  };

  // Transform tweet data for the chart
  const chartData = tweets.map((tweet) => {
    const engagement =
      tweet.like_count +
      tweet.reply_count +
      tweet.bookmark_count +
      tweet.retweet_count +
      tweet.quote_count;
    return {
      id: tweet.tweet_id,
      url: `https://twitter.com/user/status/${tweet.tweet_id}`,
      impressions: tweet.view_count,
      comments: tweet.reply_count,
      likes: tweet.like_count,
      bookmarks: tweet.bookmark_count,
      retweets: tweet.retweet_count + tweet.quote_count,
      engagement_rate: tweet.view_count > 0 ? (engagement / tweet.view_count) * 100 : 0,
    };
  });

  // Add click handler
  const handleBarClick = useCallback((data: any) => {
    if (data && data.url) {
      window.open(data.url, "_blank");
    }
  }, []);

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
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between mb-6">
          <div className="flex justify-between">
            <div className="flex items-center space-x-2 text-lg font-medium">
              {selectedMetric.charAt(0).toUpperCase() +
                selectedMetric.slice(1).replaceAll("_", " ")}
            </div>
          </div>
          <TooltipProvider>
            <ToggleGroup
              type="single"
              value={selectedMetric}
              onValueChange={handleMetricChange}
              className="justify-start"
            >
              {(Object.keys(metricLabels) as Metric[]).map((key) => (
                <ShadcnTooltip key={key}>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value={key}
                      aria-label={`Show ${metricLabels[key]}`}
                      className="flex items-center gap-2"
                    >
                      {metricIcons[key as keyof typeof metricIcons]}
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>{metricLabels[key]}</span>
                  </TooltipContent>
                </ShadcnTooltip>
              ))}
            </ToggleGroup>
          </TooltipProvider>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="id" tickFormatter={(value) => `Tweet ${value.slice(0, 4)}...`} />
              <YAxis />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name === "engagement_rate" ? `${value.toFixed(1)}%` : value,
                  metricLabels[name as Metric] || name,
                ]}
                labelFormatter={(label: string) => {
                  const tweet = chartData.find((t) => t.id === label);
                  return `Tweet ${label.slice(0, 4)}...`;
                }}
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
