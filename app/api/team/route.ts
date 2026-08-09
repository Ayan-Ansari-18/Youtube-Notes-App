import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        team: { include: { members: true, invites: true } },
        ownedTeams: { include: { members: true, invites: true } }
      }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const team = user.ownedTeams[0] || user.team;

    return NextResponse.json({ team });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.plan !== 'ENTERPRISE') {
      return NextResponse.json({ error: "Team features require Enterprise plan" }, { status: 403 });
    }

    const { name } = await req.json();

    const team = await prisma.team.create({
      data: {
        name: name || "My Team",
        ownerId: session.user.id,
        members: {
          connect: { id: session.user.id }
        }
      }
    });

    return NextResponse.json({ team });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
