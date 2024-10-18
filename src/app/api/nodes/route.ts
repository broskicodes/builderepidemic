import { NextResponse } from "next/server";
import { nodes } from "@/lib/db-schema";
import { db } from "@/lib/drizzle";
import { asc } from "drizzle-orm";

export async function GET() {
  const allNodes = await db.select().from(nodes).orderBy(asc(nodes.name));

  return NextResponse.json(allNodes);
}

export async function POST(request: Request) {
  const { name, description, location, longitude, latitude, node_type, links, connection } = await request.json();

  const newNode = await db.insert(nodes).values({
    name,
    description,
    location,
    longitude,
    latitude,
    node_type,
    links,
    connection,
  }).returning();

  return NextResponse.json(newNode[0]);
}
