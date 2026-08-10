import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure we don't crash if key is missing during build
const keysString = process.env.AI_API_KEYS || process.env.AI_API_KEY || "dummy-key";
const apiKeys = keysString.split(",").map(k => k.trim()).filter(Boolean);

// Shuffle array for load balancing
function shuffleArray(array: string[]) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function buildPrompt(videoTitle: string, isPremium: boolean, customPrompt?: string | null, transcriptMode = false): string {
  return `
    You are an expert educational assistant. Your goal is to transform this YouTube video into highly structured, premium notes.
    ${transcriptMode ? 'The video transcript is provided below.' : 'Analyze the full video content from the YouTube URL provided.'}
    
    ${isPremium 
      ? "CRITICAL REQUIREMENT: The user is a Premium subscriber. You MUST generate EXTREMELY detailed, comprehensive, and in-depth notes. Do not summarize too much; instead, break down every single major concept, include sub-topics, examples, and nuances mentioned in the video. Make it long, extensive, and highly valuable." 
      : "The user is a Free subscriber. Generate a standard, concise summary with the main points clearly outlined. Keep it brief and to the point."}

    Please output the notes in Markdown format following this exact structure:
    
    # YouTube Video
    ## ${videoTitle}
    
    ## Executive Summary
    [A 2-3 sentence overview of the video's core message]

    ## Key Takeaways
    - [Takeaway 1]
    - [Takeaway 2]
    - ...
    
    ## Detailed Notes
    [Break down the main concepts into logical headers (###) and bullet points. Ignore filler words or sponsor reads. Make it highly readable.]

    ## Action Items
    - [Any actionable advice or next steps mentioned in the video]

    ${customPrompt ? `\n    ## IMPORTANT CUSTOM INSTRUCTIONS FROM USER\n    ${customPrompt}\n    Please strictly follow the above instructions while formatting or translating the notes.\n` : ""}
  `;
}

/**
 * NEW: Generate notes by passing YouTube URL directly to Gemini.
 * Gemini natively supports YouTube URLs — no transcript scraping needed!
 */
export async function generateNotesFromYoutubeUrl(
  youtubeUrl: string,
  videoTitle: string,
  customPrompt?: string | null,
  isPremium: boolean = false
) {
  if (apiKeys[0] === "dummy-key") {
    return `# YouTube Video\n## ${videoTitle}\n\n## Executive Summary\nMock summary — add AI_API_KEY.\n`;
  }

  const prompt = buildPrompt(videoTitle, isPremium, customPrompt, false);
  const availableKeys = shuffleArray(apiKeys);
  let lastError: any = null;

  for (let i = 0; i < availableKeys.length; i++) {
    const key = availableKeys[i];
    try {
      console.log(`[Gemini URL] Trying key ${i + 1}/${availableKeys.length}...`);
      const genAI = new GoogleGenerativeAI(key);
      // Use gemini-1.5-flash which supports YouTube URL natively
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent([
        {
          fileData: {
            mimeType: "video/mp4",  // Gemini accepts YouTube URLs here
            fileUri: youtubeUrl,
          },
        },
        { text: prompt },
      ]);

      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error(`[Gemini URL] Key ${i + 1} failed:`, error?.message);
      lastError = error;
    }
  }

  throw new Error(lastError?.message || "Gemini could not process this YouTube URL.");
}

/**
 * FALLBACK: Generate notes from a plain text transcript.
 */
export async function generateNotesFromTranscript(
  transcript: string,
  videoTitle: string,
  customPrompt?: string | null,
  isPremium: boolean = false
) {
  if (apiKeys[0] === "dummy-key") {
    console.warn("WARNING: Using dummy AI_API_KEY. Returning mock data.");
    return `# YouTube Video\n## ${videoTitle}\n\n## Executive Summary\nThis is a mock summary because no AI_API_KEY was provided in .env.local.\n\n## Key Takeaways\n- Add your Gemini API Key\n- Restart the server\n\n## Detailed Notes\n### Introduction\nThe transcript was processed, but AI generation was skipped.\n\n## Action Items\n- [ ] Get API Key from Google AI Studio`;
  }

  const prompt = buildPrompt(videoTitle, isPremium, customPrompt, true) + `\n    ---\n    Transcript:\n    ${transcript}`;

  const availableKeys = shuffleArray(apiKeys);
  let lastError: any = null;

  for (let i = 0; i < availableKeys.length; i++) {
    const key = availableKeys[i];
    try {
      console.log(`[Gemini Transcript] Trying key ${i + 1}/${availableKeys.length}...`);
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error(`[Gemini Transcript] Key ${i + 1} failed:`, error?.message);
      lastError = error;
    }
  }

  if (lastError?.status === 503 || lastError?.message?.includes("503")) {
    throw new Error("Gemini AI is experiencing high demand. Please try again in a few seconds.");
  }
  if (lastError?.status === 429 || lastError?.message?.includes("429")) {
    throw new Error("Rate limit reached. Please try again later.");
  }
  
  throw new Error(lastError?.message || "Failed to generate notes from transcript.");
}

