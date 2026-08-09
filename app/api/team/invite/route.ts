import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import crypto from 'crypto';
import { transporter, getTeamInviteTemplate } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { ownedTeams: true }
    });

    if (user?.plan !== 'ENTERPRISE') {
      return NextResponse.json({ error: "Team features require Enterprise plan" }, { status: 403 });
    }

    const team = user.ownedTeams[0];
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const token = crypto.randomBytes(32).toString('hex');

    // Upsert so if we invite the same person again, we just generate a new token
    const invite = await prisma.teamInvitation.upsert({
      where: {
        teamId_email: { teamId: team.id, email }
      },
      update: { token },
      create: { teamId: team.id, email, token }
    });

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?invite=${token}`;
    
    // Send email via SMTP
    try {
      if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
        await transporter.sendMail({
          from: `"YouTube Notes Team" <${process.env.SMTP_EMAIL}>`,
          to: email,
          subject: `Invitation to join ${team.name} on YouTube Notes`,
          html: getTeamInviteTemplate(team.name, inviteLink)
        });
      } else {
        console.warn("SMTP credentials not configured. Email not sent.");
        // If not configured, we still return success but maybe warn frontend
        return NextResponse.json({ 
          invite, 
          inviteLink,
          warning: "Email not sent because SMTP is not configured."
        });
      }
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      return NextResponse.json({ error: "Invite created but failed to send email." }, { status: 500 });
    }

    return NextResponse.json({ invite, inviteLink, success: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
