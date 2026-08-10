/**
 * YouTube Transcript Fetcher
 * Uses YouTube's Innertube API directly as a reliable fallback.
 * This avoids the fragile HTML-scraping that `youtube-transcript` package uses.
 */

interface TranscriptItem {
  text: string;
  start: number;
  duration: number;
}

// Parses XML-formatted transcript from YouTube
function parseTranscriptXML(xml: string): TranscriptItem[] {
  const items: TranscriptItem[] = [];
  const regex = /<text start="([^"]*)" dur="([^"]*)"[^>]*>([\s\S]*?)<\/text>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    const text = match[3]
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/<[^>]+>/g, '')
      .trim();
    if (text) {
      items.push({
        text,
        start: parseFloat(match[1]),
        duration: parseFloat(match[2]),
      });
    }
  }
  return items;
}

// Fetches transcript using YouTube's internal player API (Innertube)
async function fetchViaInnertube(videoId: string): Promise<TranscriptItem[]> {
  const body = JSON.stringify({
    context: {
      client: {
        clientName: 'ANDROID',
        clientVersion: '19.09.37',
        androidSdkVersion: 30,
        hl: 'en',
        gl: 'US',
      },
    },
    videoId,
  });

  const playerRes = await fetch(
    `https://www.youtube.com/youtubei/v1/player?key=AIzaSyA8eiZmM1FaDVjRy-df2KTyQ_vz_yYM39w`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'com.google.android.youtube/19.09.37 (Linux; U; Android 11)',
        'X-YouTube-Client-Name': '3',
        'X-YouTube-Client-Version': '19.09.37',
      },
      body,
    }
  );

  if (!playerRes.ok) {
    throw new Error(`Innertube player API returned ${playerRes.status}`);
  }

  const playerData = await playerRes.json();

  const captionTracks =
    playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

  if (!captionTracks || captionTracks.length === 0) {
    throw new Error('No caption tracks found. Video may not have subtitles.');
  }

  // Prefer English, fallback to first available track
  const track =
    captionTracks.find((t: any) => t.languageCode?.startsWith('en')) ||
    captionTracks[0];

  const transcriptUrl = track.baseUrl + '&fmt=xml';
  const xmlRes = await fetch(transcriptUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });

  if (!xmlRes.ok) {
    throw new Error(`Failed to fetch transcript XML: ${xmlRes.status}`);
  }

  const xml = await xmlRes.text();
  return parseTranscriptXML(xml);
}

// Fetches transcript using the youtube-transcript npm package as primary attempt
async function fetchViaPackage(videoId: string): Promise<TranscriptItem[]> {
  const { YoutubeTranscript } = await import('youtube-transcript');
  const items = await YoutubeTranscript.fetchTranscript(videoId);
  return items.map((item: any) => ({
    text: item.text,
    start: item.offset ?? item.start ?? 0,
    duration: item.duration ?? 0,
  }));
}

/**
 * Main export: fetches transcript with automatic fallback.
 * Tries npm package first, falls back to direct Innertube API.
 */
export async function fetchYoutubeTranscript(videoId: string): Promise<string> {
  let items: TranscriptItem[] = [];

  try {
    items = await fetchViaPackage(videoId);
    if (items.length > 0) {
      return items.map((t) => t.text).join(' ');
    }
  } catch (err) {
    console.warn('[Transcript] npm package failed, trying Innertube fallback...', err);
  }

  try {
    items = await fetchViaInnertube(videoId);
    if (items.length > 0) {
      return items.map((t) => t.text).join(' ');
    }
  } catch (err) {
    console.error('[Transcript] Innertube fallback also failed:', err);
    throw new Error(
      'Could not fetch transcript for this video. The video may not have English subtitles, or subtitles might be disabled by the creator.'
    );
  }

  throw new Error(
    'Transcript is empty. This video may not have subtitles available.'
  );
}
