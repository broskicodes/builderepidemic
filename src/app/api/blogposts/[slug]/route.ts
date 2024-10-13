import { NextResponse } from 'next/server';
import { blogposts } from '@/lib/db-schema';
import { db } from '@/lib/drizzle';
import { asc } from 'drizzle-orm';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const slug = params.slug;

    const post = await db.query.blogposts.findFirst({
        where: (blogposts, { eq }) => eq(blogposts.slug, slug),
    });

    return NextResponse.json(post);
}