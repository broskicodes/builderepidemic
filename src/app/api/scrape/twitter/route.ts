import { NextRequest, NextResponse } from 'next/server';
import { TwitterScrapeType, APIFY_TWEET_SCRAPER_ACTOR, Tweet } from '@/lib/types';
import { runApifyActor } from '@/lib/apify';
import { addTweetsToDb } from '@/lib/drizzle';

export async function POST(request: NextRequest) {
  try {
    const { scrapeType, handle } = await request.json();

    if (!scrapeType || !handle) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    if (!Object.values(TwitterScrapeType).includes(scrapeType)) {
      return NextResponse.json({ error: 'Invalid scrape type' }, { status: 400 });
    }

    const input = {
        "searchTerms": [
        `from:${handle} since:2024-10-16 -filter:replies -filter:quotes`,
        `from:mattiapomelli since:2024-10-16 -filter:replies -filter:quotes`
    ],
      "sort": "Latest",
      "tweetLanguage": "en",
    //   maxTweets: scrapeType === TwitterScrapeType.Initialize ? 1000 : 100,
      // Add other parameters as needed
    };

    const result = await runApifyActor(APIFY_TWEET_SCRAPER_ACTOR, input);

    const stats: Tweet[] = result.map((item: any) => ({
      author: {
        id: item.author.id,
        handle: item.author.userName,
      },
      tweet_id: item.id,
      url: item.url,
      date: item.createdAt,
      bookmark_count: item.bookmarkCount,
      retweet_count: item.retweetCount,
      reply_count: item.replyCount,
      like_count: item.likeCount,
      quote_count: item.quoteCount,
      view_count: item.viewCount
    }));

    await addTweetsToDb(stats);

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error scraping Twitter:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
