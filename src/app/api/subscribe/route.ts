import { subscribers } from "@/lib/db-schema";
import { db } from "@/lib/drizzle";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();

  const newSubscriber = await db.insert(subscribers).values({
    email,
  });

  return NextResponse.json(newSubscriber);
}
