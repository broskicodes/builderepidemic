import { NextResponse } from "next/server";
import { signups } from "@/lib/db-schema";
import { db } from "@/lib/drizzle";

export async function POST(request: Request) {
  const { name, twitter, email, buildingStatus, projectLink, projectDescription, idea } =
    await request.json();

  try {
    const newSignup = await db
      .insert(signups)
      .values({
        name,
        twitter,
        email,
        buildingStatus,
        projectLink,
        projectDescription,
        idea,
      })
      .returning();

    return NextResponse.json(newSignup[0], { status: 201 });
  } catch (error) {
    console.error("Error saving signup data:", error);
    return NextResponse.json({ error: "Failed to save signup data" }, { status: 500 });
  }
}
