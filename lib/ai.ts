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

export async function generateNotesFromTranscript(transcript: string, videoTitle: string, customPrompt?: string | null) {
  if (apiKeys[0] === "dummy-key") {
    console.warn("WARNING: Using dummy AI_API_KEY. Returning mock data.");
    return `# YouTube Video\n## ${videoTitle}\n\n## Executive Summary\nThis is a mock summary because no AI_API_KEY was provided in .env.local.\n\n## Key Takeaways\n- Add your Gemini API Key\n- Restart the server\n\n## Detailed Notes\n### Introduction\nThe transcript was processed, but AI generation was skipped.\n\n## Action Items\n- [ ] Get API Key from Google AI Studio`;
  }

  const prompt = `
    You are an expert educational assistant. Your goal is to transform the provided video transcript into highly structured, premium notes.

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

    ---
    Transcript:
    ${transcript}
  `;

  const availableKeys = shuffleArray(apiKeys);
  let lastError: any = null;

  for (let i = 0; i < availableKeys.length; i++) {
    const key = availableKeys[i];
    try {
      console.log(`Trying API key ${i + 1} of ${availableKeys.length}...`);
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error(`Gemini AI Error with key ${i + 1}:`, error?.message);
      lastError = error;
    }
  }

  // If we get here, all keys failed
  if (lastError?.status === 503 || lastError?.message?.includes("503") || lastError?.message?.includes("Service Unavailable")) {
    throw new Error("Gemini AI is experiencing high demand across all our keys. Please try again in a few seconds.");
  }
  if (lastError?.status === 429 || lastError?.message?.includes("429") || lastError?.message?.includes("quota")) {
    throw new Error("We have hit the rate limit on all our Gemini API keys. Please try again later.");
  }
  
  throw new Error(lastError?.message || "Failed to generate notes from transcript.");
}
