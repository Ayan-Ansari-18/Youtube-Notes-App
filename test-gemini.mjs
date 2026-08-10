// Quick test - does the Gemini API key work at all?
import { GoogleGenerativeAI } from "@google/generative-ai";

const keysString = process.env.AI_API_KEYS || "";
const genAI = new GoogleGenerativeAI(keysString);

// Test 1: Basic text
console.log("Test 1: Basic text generation...");
try {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent("Say hello in one sentence.");
  console.log("✅ Basic text works:", result.response.text().substring(0, 100));
} catch(e) {
  console.log("❌ Basic text failed:", e.message);
}

// Test 2: YouTube URL 
console.log("\nTest 2: YouTube URL processing...");
try {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent([
    {
      fileData: {
        fileUri: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
      }
    },
    { text: "What is this video about? One sentence." }
  ]);
  console.log("✅ YouTube URL works:", result.response.text().substring(0, 100));
} catch(e) {
  console.log("❌ YouTube URL failed:", e.message);
}

// Test 3: With gemini-flash-latest
console.log("\nTest 3: gemini-flash-latest...");
try {
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  const result = await model.generateContent("Say hello in one sentence.");
  console.log("✅ gemini-flash-latest works:", result.response.text().substring(0, 100));
} catch(e) {
  console.log("❌ gemini-flash-latest failed:", e.message);
}
