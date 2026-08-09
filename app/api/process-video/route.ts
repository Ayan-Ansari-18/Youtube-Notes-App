import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import { generateNotesFromTranscript } from '@/lib/ai';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// Helper to extract Video ID
function extractVideoId(url: string) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length == 11) ? match[7] : null;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const dbUserId = session?.user?.id || null;

    if (!dbUserId) {
      return NextResponse.json({ error: "UNAUTHORIZED", message: "Please sign in to generate notes." }, { status: 401 });
    }

    const dbUserObj = await prisma.user.findUnique({ where: { id: dbUserId } });
    if (dbUserObj?.plan === "FREE" && dbUserObj.noteCount >= 5) {
      return NextResponse.json({ error: "LIMIT_REACHED", message: "You have reached your 5 free notes limit. Please upgrade to Pro to continue." }, { status: 403 });
    }

    const { url, customPrompt } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "YouTube URL is required" }, { status: 400 });
    }

    const isPro = dbUserObj?.plan === "PRO" || dbUserObj?.plan === "ENTERPRISE";
    const allowedCustomPrompt = isPro ? customPrompt : null;

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    // 1. Check if video already exists in DB
    let existingVideo: any = await prisma.video.findUnique({
      where: { youtubeId: videoId },
      include: { notes: true }
    });

    if (existingVideo && existingVideo.notes.length > 0) {
      return NextResponse.json({ 
        message: "Found existing notes",
        note: existingVideo.notes[0],
        video: existingVideo 
      });
    }

    // 2. Fetch Transcript
    let transcriptItems = [];
    try {
      transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    } catch (e) {
      console.error("Transcript Error:", e);
      return NextResponse.json({ error: "Could not fetch transcript for this video. Subtitles might be disabled." }, { status: 400 });
    }

    const fullTranscript = transcriptItems.map(t => t.text).join(' ');
    
    let videoTitle = `YouTube Video (${videoId})`;
    try {
      const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      if (oembedRes.ok) {
        const oembedData = await oembedRes.json();
        if (oembedData.title) {
          videoTitle = oembedData.title;
        }
      }
    } catch (err) {
      console.error("Could not fetch video title", err);
    }

    // 3. Generate Notes via AI
    let generatedNotes = "";
    try {
       generatedNotes = await generateNotesFromTranscript(fullTranscript, videoTitle, allowedCustomPrompt, isPro);
    } catch (e: any) {
      console.error("AI Generation Error inside route:", e);
      return NextResponse.json({ error: e.message || "AI Processing failed due to high demand. Please try again later." }, { status: 503 });
    }

    // 4. Save to Database
    if (!existingVideo) {
      existingVideo = await prisma.video.create({
        data: {
          youtubeId: videoId,
          title: videoTitle,
          url: url,
          transcript: fullTranscript,
          userId: dbUserId
        }
      });
    }

    const newNote = await prisma.note.create({
      data: {
        videoId: existingVideo.id,
        content: generatedNotes,
        userId: dbUserId
      }
    });

    await prisma.user.update({
      where: { id: dbUserId },
      data: { noteCount: { increment: 1 } }
    });

    return NextResponse.json({
      message: "Notes generated successfully",
      note: newNote,
      video: existingVideo
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
