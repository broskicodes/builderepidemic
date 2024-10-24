import { NextRequest, NextResponse } from 'next/server';
import { TwitterScrapeType, APIFY_TWEET_SCRAPER_ACTOR } from '@/lib/types';
import { runApifyActor } from '@/lib/apify';

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
        `from:${handle} since:2024-10-16 -filter:replies -filter:quotes`
    ],
      "sort": "Latest",
      "tweetLanguage": "en",
    //   maxTweets: scrapeType === TwitterScrapeType.Initialize ? 1000 : 100,
      // Add other parameters as needed
    };

    const result = await runApifyActor(APIFY_TWEET_SCRAPER_ACTOR, input);

    const stats = result.map(item => ({
      tweet_id: item.id,
      url: item.url,
      date: item.createdAt,
      bookmarkCount: item.bookmarkCount,
      retweetCount: item.retweetCount,
      replyCount: item.replyCount,
      likeCount: item.likeCount,
      quoteCount: item.quoteCount,
      viewCount: item.viewCount
    }));

    console.log(stats)
    // Process the result as needed
    // For example, you might want to store it in your database or return it directly

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error scraping Twitter:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

