/**
 * YouTube Transcript Fetcher
 * Uses RapidAPI (YouTube Data API) as primary method to bypass Vercel IP ban.
 * Falls back to youtube-transcript-plus and youtube-transcript packages.
 */

// Method 0: RapidAPI - YouTube Data (bypasses Vercel IP ban)
async function fetchViaRapidAPI(videoId: string): Promise<string> {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) throw new Error('RAPIDAPI_KEY not set');

  const url = `https://youtube-data16.p.rapidapi.com/captions/${videoId}?lang=en&format=json`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'youtube-data16.p.rapidapi.com',
      'x-rapidapi-key': apiKey,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`RapidAPI returned status ${response.status}`);
  }

  const data = await response.json();

  // The API returns an array of caption objects with 'text' field
  if (Array.isArray(data) && data.length > 0) {
    return data.map((item: any) => item.text || '').join(' ').trim();
  }

  // Some responses wrap in a 'captions' or 'items' key
  if (data?.captions && Array.isArray(data.captions) && data.captions.length > 0) {
    return data.captions.map((item: any) => item.text || '').join(' ').trim();
  }

  if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
    return data.items.map((item: any) => item.text || item.snippet?.text || '').join(' ').trim();
  }

  throw new Error('RapidAPI returned empty transcript data');
}

// Method 1: youtube-transcript-plus (more robust, works from servers)
async function fetchViaPlus(videoId: string): Promise<string> {
  const { fetchTranscript } = await import('youtube-transcript-plus');

  const langAttempts = ['en', 'en-US', 'en-GB'];

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

  const items = await fetchTranscript(videoId, { lang: 'en' });
  if (items && items.length > 0) {
    return items.map((item: any) => item.text).join(' ');
  }
  throw new Error('Empty transcript from youtube-transcript-plus');
}

// Method 2: youtube-transcript npm package
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
 * 1. RapidAPI YouTube Data (primary — bypasses Vercel IP ban)
 * 2. youtube-transcript-plus (fallback)
 * 3. youtube-transcript package (last resort)
 */
export async function fetchYoutubeTranscript(videoId: string): Promise<string> {
  const errors: string[] = [];

  // Method 0: RapidAPI (Primary — bypasses Vercel IP restrictions)
  try {
    const text = await fetchViaRapidAPI(videoId);
    if (text.trim().length > 0) {
      console.log('[Transcript] RapidAPI success!');
      return text;
    }
  } catch (err: any) {
    const msg = err?.message || String(err);
    errors.push(`RapidAPI: ${msg}`);
    console.warn('[Transcript] RapidAPI failed:', msg);
  }

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
