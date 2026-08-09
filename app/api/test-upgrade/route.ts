import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { plan } = await req.json();
    
    await prisma.user.update({
      where: { id: session.user.id },
      data: { plan }
    });
    
    return NextResponse.json({ success: true, plan });
  } catch (error) {
    console.error("Test upgrade error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
