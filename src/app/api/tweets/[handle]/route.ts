import { NextResponse } from 'next/server';
import { db } from '@/lib/drizzle';
import { tweets, twitterHandles } from '@/lib/db-schema';
import { eq } from 'drizzle-orm';
import { Tweet } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { handle: string } }
) {
  const handle = params.handle;

  try {
    // Fetch handle data
    const handleData = await db.select({
      url: twitterHandles.url,
      pfp: twitterHandles.pfp
    })
    .from(twitterHandles)
    .where(eq(twitterHandles.handle, handle))
    .limit(1);

    if (handleData.length === 0) {
      return NextResponse.json({ error: 'Handle not found' }, { status: 404 });
    }

    // Fetch tweets for the handle
    const tweetData = await db.select()
      .from(tweets)
      .innerJoin(twitterHandles, eq(tweets.handle_id, twitterHandles.id))
      .where(eq(twitterHandles.handle, handle))
      .orderBy(tweets.date);

    const response = {
      url: handleData[0].url,
      pfp: handleData[0].pfp,
      tweets: tweetData
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching tweets for handle:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
