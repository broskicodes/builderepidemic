import { NextResponse } from "next/server";
import { nodes } from "@/lib/db-schema";
import { db } from "@/lib/drizzle";
import { asc } from "drizzle-orm";

export async function GET() {
  const allNodes = await db.select().from(nodes).orderBy(asc(nodes.name));

  return NextResponse.json(allNodes);
}

export async function POST(request: Request) {
  const nodesList = await request.json();

  if (!Array.isArray(nodesList)) {
    return NextResponse.json({ error: "Invalid input. Expected an array of nodes." }, { status: 400 });
  }

  const newNodes = await db.insert(nodes).values(nodesList.map(node => ({
    name: node.name,
    description: node.description,
    location: node.location,
    longitude: node.longitude,
    latitude: node.latitude,
    node_type: node.node_type,
    links: node.links,
    connection: node.connection,
  }))).returning();

  return NextResponse.json(newNodes);
}
