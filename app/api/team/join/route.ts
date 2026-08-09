import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

    const invite = await prisma.teamInvitation.findUnique({
      where: { token },
      include: { team: true }
    });

    if (!invite) return NextResponse.json({ error: "Invalid or expired invite" }, { status: 404 });

    // Join team
    await prisma.user.update({
      where: { id: session.user.id },
      data: { teamId: invite.teamId }
    });

    // Delete the invite since it has been used
    await prisma.teamInvitation.delete({ where: { token } });

    return NextResponse.json({ message: "Successfully joined team", team: invite.team });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
