import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { tweets, twitterHandles } from "@/lib/db-schema";
import { eq } from "drizzle-orm";
import { Tweet } from "@/lib/types";

export async function GET(request: Request, { params }: { params: { handle_id: string } }) {
  const handle_id = params.handle_id;

  try {
    // Fetch handle data
    const handleData = await db
      .select({
        id: twitterHandles.id,
        handle: twitterHandles.handle,
        url: twitterHandles.url,
        pfp: twitterHandles.pfp,
      })
      .from(twitterHandles)
      .where(eq(twitterHandles.id, BigInt(handle_id)))
      .limit(1);

    if (handleData.length === 0) {
      return NextResponse.json({ error: "Handle not found" }, { status: 404 });
    }

    // Fetch tweets for the handle
    const tweetData = await db
      .select()
      .from(tweets)
      .innerJoin(twitterHandles, eq(tweets.handle_id, twitterHandles.id))
      .where(eq(twitterHandles.id, BigInt(handle_id)))
      .orderBy(tweets.date);

    const response: Tweet[] = tweetData.map((tweet) => ({
      author: {
        id: handleData[0].id.toString(),
        handle: handleData[0].handle,
        pfp: handleData[0].pfp || "",
        url: handleData[0].url,
      },
      tweet_id: tweet.tweets.tweet_id.toString(),
      url: tweet.tweets.url,
      date: tweet.tweets.date.toISOString(),
      bookmark_count: tweet.tweets.bookmark_count,
      retweet_count: tweet.tweets.retweet_count,
      reply_count: tweet.tweets.reply_count,
      like_count: tweet.tweets.like_count,
      quote_count: tweet.tweets.quote_count,
      view_count: tweet.tweets.view_count,
      language: tweet.tweets.language,
      is_reply: tweet.tweets.is_reply,
      is_retweet: tweet.tweets.is_retweet,
      is_quote: tweet.tweets.is_quote,
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching tweets for handle:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
