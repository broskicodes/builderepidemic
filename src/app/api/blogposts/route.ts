import { NextResponse } from 'next/server';
import { blogposts } from '@/lib/db-schema';
import { db } from '@/lib/drizzle';
import { asc } from 'drizzle-orm';

export async function GET() {
    const posts = await db.query.blogposts.findMany({
        orderBy: (blogposts, { asc }) => [asc(blogposts.created_at)],
    });

    return NextResponse.json(posts.reverse());
}

export async function POST(request: Request) {
    const { title, content, slug, author, description, image_url } = await request.json();

    const newPost = await db.insert(blogposts).values({
        title,
        content,
        slug,
        author,
        description,
        image_url,
    });

    return NextResponse.json(newPost);
}
