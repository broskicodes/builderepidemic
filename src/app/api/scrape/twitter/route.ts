import { NextRequest, NextResponse } from 'next/server';
import { TwitterScrapeType, APIFY_TWEET_SCRAPER_ACTOR, Tweet } from '@/lib/types';
import { runApifyActor } from '@/lib/apify';
import { addTweetsToDb } from '@/lib/drizzle';

function getSinceDate(scrapeType: TwitterScrapeType): string {
  const now = new Date();
  let sinceDate: Date;

  switch (scrapeType) {
    case TwitterScrapeType.Initialize:
      sinceDate = new Date('2024-10-01T00:00:00Z');
      break;
    case TwitterScrapeType.Monthly:
      sinceDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
      break;
    case TwitterScrapeType.Weekly:
      sinceDate = new Date(now);
      sinceDate.setUTCDate(now.getUTCDate() - now.getUTCDay() + 1); // Get the most recent Monday
      sinceDate.setUTCHours(0, 0, 0, 0);
      break;
    case TwitterScrapeType.Daily:
      sinceDate = new Date(now);
      sinceDate.setUTCHours(0, 0, 0, 0);
      break;
    default:
      throw new Error('Invalid scrape type');
  }

  // Format as YYYY-MM-DD_HH:mm:ss_UTC
  return sinceDate.toISOString().replace('T', '_').replace(/\.\d{3}Z$/, '_UTC');
}

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { scrapeType, handles } = await request.json();

    if (!scrapeType || !handles) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    if (!Object.values(TwitterScrapeType).includes(scrapeType)) {
      return NextResponse.json({ error: 'Invalid scrape type' }, { status: 400 });
    }

    const sinceDate = getSinceDate(scrapeType as TwitterScrapeType);

    const input = {
      "searchTerms": handles.map((handle: string) => `from:${handle} since:${sinceDate} -filter:replies -filter:quotes`),
      "sort": "Latest",
      "tweetLanguage": "en",
    };

    const result = await runApifyActor(APIFY_TWEET_SCRAPER_ACTOR, input);

    const stats: Tweet[] = result.map((item: any) => ({
      author: {
        id: item.author.id,
        handle: item.author.userName,
        pfp: item.author.profilePicture,
        url: item.author.url,
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

    // console.log(stats);

    await addTweetsToDb(stats);

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error scraping Twitter:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
