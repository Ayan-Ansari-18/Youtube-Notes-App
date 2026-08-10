/**
 * YouTube Transcript Fetcher
 * Uses youtube-transcript-plus as primary (works from server environments),
 * with youtube-transcript as fallback.
 * Handles multilingual transcripts - fetches in any available language.
 */

// Primary: youtube-transcript-plus (more robust, works from servers)
async function fetchViaPlus(videoId: string): Promise<string> {
  const { fetchTranscript } = await import('youtube-transcript-plus');

  // Try English first, then any available language
  const langAttempts = ['en', 'en-US', 'en-GB'];

  // First try with specific langs
  for (const lang of langAttempts) {
    try {
      const items = await fetchTranscript(videoId, { lang });
      if (items && items.length > 0) {
        return items.map((item: any) => item.text).join(' ');
      }
    } catch {
      // try next lang
    }
  }

  // Fallback: no lang specified (gets any available language)
  const items = await fetchTranscript(videoId, { lang: 'en' });
  if (items && items.length > 0) {
    return items.map((item: any) => item.text).join(' ');
  }
  throw new Error('Empty transcript from youtube-transcript-plus');
}


// Fallback: youtube-transcript npm package
async function fetchViaPackage(videoId: string): Promise<string> {
  const { YoutubeTranscript } = await import('youtube-transcript');

  const langAttempts = ['en', 'en-US', 'en-GB', ''];
  let lastError: any;

  for (const lang of langAttempts) {
    try {
      const items = lang
        ? await YoutubeTranscript.fetchTranscript(videoId, { lang })
        : await YoutubeTranscript.fetchTranscript(videoId);
      if (items && items.length > 0) {
        return items.map((item: any) => item.text).join(' ');
      }
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError || new Error('No transcript found via youtube-transcript');
}

/**
 * Main export: fetches transcript with automatic fallback chain.
 * 1. youtube-transcript-plus (most reliable for servers)
 * 2. youtube-transcript npm package
 */
export async function fetchYoutubeTranscript(videoId: string): Promise<string> {
  const errors: string[] = [];

  // Method 1: youtube-transcript-plus
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

  // Provide a helpful, clear error message
  const isDisabled = errors.some(e =>
    e.toLowerCase().includes('disabled') || e.toLowerCase().includes('no transcript')
  );

  if (isDisabled) {
    throw new Error(
      'This video has subtitles disabled. Please try a different video that has CC (closed captions) enabled.'
    );
  }

  throw new Error(
    'Could not fetch transcript from YouTube servers. This can happen due to server restrictions. Please try again in a few minutes, or try a different video.'
  );
}
