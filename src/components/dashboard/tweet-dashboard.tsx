"use client";

import { useState, useEffect } from "react";
import { AdvancedSearch } from "./advanced-search";
import { PopularTweets } from "./popular-tweets";
import { TweetHeatmap } from "./tweet-heatmap";
import { Tweet } from "@/lib/types";
import { useSession } from "next-auth/react";

export function TweetDashboard() {
  const [popularTweets, setPopularTweets] = useState<Tweet[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPopularTweets = async () => {
    //   if (!session?.user?.id) return;
      
    //   try {
    //     const response = await fetch(`${process.env.NEXT_PUBLIC_SCRAPER_URL}/twitter/popular`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify({
    //         userId: session.user.id
    //       })
    //     });
    //     const data = await response.json();
    //     setPopularTweets(data.results);
    //   } catch (error) {
    //     console.error('Error fetching popular tweets:', error);
    //   }
    const response = await fetch(`/api/tweets/${session?.user?.handle}`);

    const data = await response.json();
    setPopularTweets(data);
    };

    fetchPopularTweets();
  }, [session?.user?.id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-1">
            <PopularTweets tweets={popularTweets} />
          </div>
          <div className="col-span-1">
          <TweetHeatmap tweets={popularTweets} />
        </div>
        </div>
        <div className="md:col-span-1">
            <AdvancedSearch />
          </div>
      </div>
    </div>
  );
}