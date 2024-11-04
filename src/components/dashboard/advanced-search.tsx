"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Filter,
  Search,
  Heart,
  Bookmark,
  BarChart2,
  ExternalLink,
  MessageCircle,
  Calendar,
  Users,
  Image,
  Link as LinkIcon,
  Quote,
  Repeat,
  BadgeCheck,
  ScrollText,
} from "lucide-react";
import Link from "next/link";
import { Tweet } from "@/lib/types";
import { useSession } from "next-auth/react";
import posthog from "posthog-js";
import { TweetList } from "./tweet-list";

type SortBy = "date" | "impressions" | "likes" | "comments" | "bookmarks" | "retweets";

interface SearchFilters {
  verified: boolean;
  mediaOnly: boolean;
  linksOnly: boolean;
  threadOnly: boolean;
  quoteTweetsOnly: boolean;
  minLikes: string;
  minComments: string;
  minRetweets: string;
  dateRange: string;
}

export function AdvancedSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [listHeight, setListHeight] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    verified: false,
    mediaOnly: false,
    linksOnly: false,
    threadOnly: false,
    quoteTweetsOnly: false,
    minLikes: "",
    minComments: "",
    minRetweets: "",
    dateRange: "24h",
  });

  const { data: session } = useSession();

  useEffect(() => {
    if (containerRef.current) {
      const height = containerRef.current.offsetHeight;
      console.log("setting height", height);

      setListHeight(height);
    }
  }, []);

  const handleSearch = async () => {
    if (!session?.user?.id) {
      return;
    }

    setIsLoading(true);
    posthog.capture("search_submitted", {
      userId: session?.user?.id,
      query: searchQuery,
      filters: filters,
    });

    const results = await fetch(`${process.env.NEXT_PUBLIC_SCRAPER_URL}/twitter/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: session?.user?.id,
        query: searchQuery,
        filters: filters,
      }),
    });
    const data = await results.json();
    setSearchResults(data.results);
    console.log(data);
    setIsLoading(false);
  };

  const sortedResults = [...searchResults].sort((a, b) => {
    switch (sortBy) {
      case "impressions":
        return b.view_count - a.view_count;
      case "likes":
        return b.like_count - a.like_count;
      case "comments":
        return b.reply_count - a.reply_count;
      case "bookmarks":
        return b.bookmark_count - a.bookmark_count;
      case "retweets":
        return b.retweet_count - a.retweet_count;
      case "date":
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Advanced Twitter Search</CardTitle>
        <CardDescription>Find high performing tweets in any niche</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Enter a search term and/or select filters"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="grow"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[calc(100vw-32px)] md:w-[480px] p-0">
              <div className="grid gap-4 p-6">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Filters</h4>
                  <p className="text-sm text-muted-foreground">Customize your search results</p>
                </div>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date Range</Label>
                      <Select
                        value={filters.dateRange}
                        onValueChange={(value) => setFilters({ ...filters, dateRange: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All time</SelectItem>
                          <SelectItem value="24h">Last 24 hours</SelectItem>
                          <SelectItem value="7d">Last 7 days</SelectItem>
                          <SelectItem value="28d">Last 28 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tweet Type</Label>
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="verified" className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>Verified only</span>
                          </Label>
                          <Switch
                            id="verified"
                            checked={filters.verified}
                            onCheckedChange={(checked) =>
                              setFilters({ ...filters, verified: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="mediaOnly" className="flex items-center space-x-2">
                            <Image className="h-4 w-4" />
                            <span>Media only</span>
                          </Label>
                          <Switch
                            id="mediaOnly"
                            checked={filters.mediaOnly}
                            onCheckedChange={(checked) =>
                              setFilters({ ...filters, mediaOnly: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="linksOnly" className="flex items-center space-x-2">
                            <LinkIcon className="h-4 w-4" />
                            <span>Links only</span>
                          </Label>
                          <Switch
                            id="linksOnly"
                            checked={filters.linksOnly}
                            onCheckedChange={(checked) =>
                              setFilters({ ...filters, linksOnly: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="quoteTweetsOnly" className="flex items-center space-x-2">
                            <Quote className="h-4 w-4" />
                            <span>Quotes only</span>
                          </Label>
                          <Switch
                            id="quoteTweetsOnly"
                            checked={filters.quoteTweetsOnly}
                            onCheckedChange={(checked) =>
                              setFilters({ ...filters, quoteTweetsOnly: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="threadOnly" className="flex items-center space-x-2">
                            <ScrollText className="h-4 w-4" />
                            <span>Thread only</span>
                          </Label>
                          <Switch
                            id="threadOnly"
                            checked={filters.threadOnly}
                            onCheckedChange={(checked) =>
                              setFilters({ ...filters, threadOnly: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label>Minimum Metrics</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                      <div className="space-y-2">
                        <Label htmlFor="minLikes" className="flex items-center space-x-2">
                          <Heart className="h-4 w-4" />
                          <span>Likes</span>
                        </Label>
                        <Input
                          id="minLikes"
                          type="number"
                          value={filters.minLikes}
                          onChange={(e) => setFilters({ ...filters, minLikes: e.target.value })}
                          placeholder="Min likes"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minComments" className="flex items-center space-x-2">
                          <MessageCircle className="h-4 w-4" />
                          <span>Comments</span>
                        </Label>
                        <Input
                          id="minComments"
                          type="number"
                          value={filters.minComments}
                          onChange={(e) => setFilters({ ...filters, minComments: e.target.value })}
                          placeholder="Min comments"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minRetweets" className="flex items-center space-x-2">
                          <Repeat className="h-4 w-4" />
                          <span>Retweets</span>
                        </Label>
                        <Input
                          id="minRetweets"
                          type="number"
                          value={filters.minRetweets}
                          onChange={(e) => setFilters({ ...filters, minRetweets: e.target.value })}
                          placeholder="Min retweets"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? (
              <span className="animate-spin mr-2">⏳</span>
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Search
          </Button>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Results</h3>
          <div className="flex items-center space-x-2">
            <Label>Sort by:</Label>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Date
                  </div>
                </SelectItem>
                <SelectItem value="impressions">
                  <div className="flex items-center">
                    <BarChart2 className="w-4 h-4 mr-2" />
                    Impressions
                  </div>
                </SelectItem>
                <SelectItem value="likes">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Likes
                  </div>
                </SelectItem>
                <SelectItem value="comments">
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Comments
                  </div>
                </SelectItem>
                <SelectItem value="bookmarks">
                  <div className="flex items-center">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Bookmarks
                  </div>
                </SelectItem>
                <SelectItem value="retweets">
                  <div className="flex items-center">
                    <Repeat className="w-4 h-4 mr-2" />
                    Retweets
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div ref={containerRef} className="flex-1">
          {listHeight && <TweetList tweets={sortedResults} maxHeight={`${listHeight}px`} />}
        </div>
      </CardContent>
    </Card>
  );
}
