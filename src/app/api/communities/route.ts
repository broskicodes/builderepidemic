import { NextResponse } from "next/server";
import { communities } from "@/lib/db-schema";
import { db } from "@/lib/drizzle";
import { asc } from "drizzle-orm";

export async function GET() {
  const allCommunities = await db.select().from(communities).orderBy(asc(communities.name));

  return NextResponse.json(allCommunities);
}

export async function POST(request: Request) {
  const { name, description, link } = await request.json();

  const newCommunity = await db
    .insert(communities)
    .values({
      name,
      description,
      link,
    })
    .returning();

  return NextResponse.json(newCommunity[0]);
}
