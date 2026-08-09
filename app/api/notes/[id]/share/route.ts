import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const note = await prisma.note.findUnique({
      where: { id }
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (note.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { isPublic, isTeamShared } = await req.json();

    const dataToUpdate: any = {};
    if (isPublic !== undefined) dataToUpdate.isPublic = Boolean(isPublic);
    if (isTeamShared !== undefined) dataToUpdate.isTeamShared = Boolean(isTeamShared);

    const updatedNote = await prisma.note.update({
      where: { id },
      data: dataToUpdate
    });

    return NextResponse.json({ 
      isPublic: updatedNote.isPublic,
      isTeamShared: updatedNote.isTeamShared
    });
  } catch (error) {
    console.error("Error updating share status", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
