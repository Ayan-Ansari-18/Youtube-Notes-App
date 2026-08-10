/**
 * YouTube Transcript Fetcher
 * Uses youtube-transcript-plus as primary (works from server environments),
 * with youtube-transcript as fallback.
 */

interface TranscriptItem {
  text: string;
  start: number;
  duration: number;
}

// Primary: youtube-transcript-plus (more robust, works from servers)
async function fetchViaPlus(videoId: string): Promise<string> {
  const { fetchTranscript } = await import('youtube-transcript-plus');
  const items = await fetchTranscript(videoId);
  if (!items || items.length === 0) throw new Error('Empty transcript returned.');
  return items.map((item: any) => item.text).join(' ');
}

// Fallback: youtube-transcript npm package
async function fetchViaPackage(videoId: string): Promise<string> {
  const { YoutubeTranscript } = await import('youtube-transcript');
  const items = await YoutubeTranscript.fetchTranscript(videoId);
  if (!items || items.length === 0) throw new Error('Package returned empty transcript.');
  return items.map((item: any) => item.text).join(' ');
}

/**
 * Main export: fetches transcript with automatic fallback chain.
 * 1. youtube-transcript-plus (most reliable for servers)
 * 2. youtube-transcript npm package
 */
export async function fetchYoutubeTranscript(videoId: string): Promise<string> {
  const errors: string[] = [];

  // Method 1: youtube-transcript-plus (best for servers)
  try {
    const text = await fetchViaPlus(videoId);
    if (text.trim().length > 0) return text;
  } catch (err: any) {
    const msg = err?.message || String(err);
    errors.push(`TranscriptPlus: ${msg}`);
    console.warn('[Transcript] youtube-transcript-plus failed:', msg);
  }

  // Method 2: Original youtube-transcript package
  try {
    const text = await fetchViaPackage(videoId);
    if (text.trim().length > 0) return text;
  } catch (err: any) {
    const msg = err?.message || String(err);
    errors.push(`Package: ${msg}`);
    console.warn('[Transcript] youtube-transcript package failed:', msg);
  }

  console.error('[Transcript] All methods failed:', errors);

  throw new Error(
    'Could not fetch transcript. Please make sure the video has English subtitles enabled. Try opening the video on YouTube and checking if "CC" (closed captions) button is available.'
  );
}
