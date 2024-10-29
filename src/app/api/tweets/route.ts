import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { tweets, twitterHandles } from "@/lib/db-schema";
import { eq } from "drizzle-orm";
import { LeaderboardData, Tweet } from "@/lib/types";

export async function GET(request: Request) {
  try {
    // Fetch all unique handles with their data
    const handles = await db
      .select({
        user_id: twitterHandles.id,
        handle: twitterHandles.handle,
        url: twitterHandles.url,
        pfp: twitterHandles.pfp,
      })
      .from(twitterHandles);

    const tweetsByHandle: Record<string, LeaderboardData> = {};

    // Fetch tweets for each handle
    for (const { user_id, handle, url, pfp } of handles) {
      const tweetData = await db
        .select({
          date: tweets.date,
          url: tweets.url,
          tweet_id: tweets.tweet_id,
          bookmark_count: tweets.bookmark_count,
          retweet_count: tweets.retweet_count,
          reply_count: tweets.reply_count,
          like_count: tweets.like_count,
          quote_count: tweets.quote_count,
          view_count: tweets.view_count,
        })
        .from(tweets)
        .innerJoin(twitterHandles, eq(tweets.handle_id, twitterHandles.id))
        .where(eq(twitterHandles.handle, handle))
        .orderBy(tweets.date);

      tweetsByHandle[handle] = {
        user_id: user_id.toString(),
        url,
        pfp,
        tweets: tweetData.map((tweet) => ({
          ...tweet,
          tweet_id: tweet.tweet_id.toString(),
          date: tweet.date.toISOString(),
        })),
      };
    }

    return NextResponse.json(tweetsByHandle);
  } catch (error) {
    console.error("Error fetching all tweets:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
