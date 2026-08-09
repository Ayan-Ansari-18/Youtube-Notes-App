import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header. Format: Bearer <API_KEY>" }, { status: 401 });
    }

    const apiKey = authHeader.split(" ")[1];
    if (!apiKey) {
      return NextResponse.json({ error: "API key not provided" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { apiKey }
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    if (user.plan === "FREE") {
      return NextResponse.json({ error: "API access requires Pro or Enterprise plan" }, { status: 403 });
    }

    // Get limit and skip from query params
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = parseInt(searchParams.get("skip") || "0");

    const notes = await prisma.note.findMany({
      where: { userId: user.id },
      take: Math.min(limit, 50), // Max 50 per request
      skip,
      orderBy: { createdAt: 'desc' },
      include: {
        video: {
          select: {
            title: true,
            youtubeId: true,
            url: true
          }
        }
      }
    });

    return NextResponse.json({
      data: notes.map(note => ({
        id: note.id,
        content: note.content,
        isPublic: note.isPublic,
        createdAt: note.createdAt,
        video: note.video
      })),
      meta: {
        limit,
        skip,
        count: notes.length
      }
    });

  } catch (error) {
    console.error("API v1 notes error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
