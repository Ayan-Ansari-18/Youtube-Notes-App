import { NextResponse } from 'next/server';
import { generateNotesFromYoutubeUrl, generateNotesFromTranscript } from '@/lib/ai';
import { fetchYoutubeTranscript } from '@/lib/transcript';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// Vercel: allow up to 120 seconds for this route (transcript + AI generation)
export const maxDuration = 120;

// Helper to extract Video ID from any YouTube URL format
function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    // youtu.be/VIDEO_ID
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1).split('?')[0] || null;
    }
    // youtube.com/watch?v=VIDEO_ID
    if (parsed.hostname.includes('youtube.com')) {
      const v = parsed.searchParams.get('v');
      if (v) return v;
      // youtube.com/shorts/VIDEO_ID or /embed/VIDEO_ID
      const match = parsed.pathname.match(/\/(shorts|embed|v)\/([^/?]+)/);
      if (match) return match[2];
    }
  } catch {
    // Not a valid URL, try regex fallback
    const regExp = /^.*((youtu\.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[7]?.length === 11) return match[7];
  }
  return null;
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
      const existingNote = existingVideo.notes[0];
      // Skip cache if note is a mock/failed note — regenerate it
      const isMockNote = existingNote.content?.includes('Mock summary') || 
                         existingNote.content?.includes('add AI_API_KEY') ||
                         existingNote.content?.trim().length < 50;
      if (!isMockNote) {
        return NextResponse.json({ 
          message: "Found existing notes",
          note: existingNote,
          video: existingVideo 
        });
      }
      // Delete the bad mock note so we can regenerate
      await prisma.note.delete({ where: { id: existingNote.id } });
      console.log('[Cache] Deleted mock note, will regenerate...');
    }

    // 2. Get video title via oembed (fast, reliable)
    let videoTitle = `YouTube Video (${videoId})`;
    try {
      const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      if (oembedRes.ok) {
        const oembedData = await oembedRes.json();
        if (oembedData.title) videoTitle = oembedData.title;
      }
    } catch { /* title fallback is fine */ }

    // 3. Generate Notes — Gemini processes YouTube URL directly (no transcript needed!)
    let generatedNotes = "";
    let fullTranscript = "[Generated directly from YouTube video by Gemini AI]";
    try {
      generatedNotes = await generateNotesFromYoutubeUrl(
        `https://www.youtube.com/watch?v=${videoId}`,
        videoTitle,
        allowedCustomPrompt,
        isPro
      );
    } catch (geminiError: any) {
      console.warn('Gemini direct URL failed, trying transcript fallback:', geminiError?.message);
      // Fallback: fetch transcript manually then send to Gemini
      try {
        fullTranscript = await fetchYoutubeTranscript(videoId);
        generatedNotes = await generateNotesFromTranscript(fullTranscript, videoTitle, allowedCustomPrompt, isPro);
      } catch (e: any) {
        console.error("All methods failed:", e);
        const transcriptMsg = e?.message || '';
        const isTranscriptOnly = transcriptMsg.toLowerCase().includes('subtitle') || transcriptMsg.toLowerCase().includes('caption');
        
        let errorMsg = "Could not process this video. Please try again later.";
        if (isTranscriptOnly) {
           errorMsg = "This video does not have closed captions (subtitles). AI needs subtitles to generate notes. Please try another video.";
        }
        
        return NextResponse.json({ error: errorMsg }, { status: 400 });
      }
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
