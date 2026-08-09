import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only Pro or Enterprise users can generate API keys
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (user?.plan === "FREE") {
      return NextResponse.json({ error: "API access requires Pro or Enterprise plan" }, { status: 403 });
    }

    const newApiKey = "ytn_" + crypto.randomBytes(24).toString("hex");

    await prisma.user.update({
      where: { id: session.user.id },
      data: { apiKey: newApiKey }
    });

    return NextResponse.json({ apiKey: newApiKey });
  } catch (error) {
    console.error("API Key generation error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
