import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';

const env = readFileSync('.env.local', 'utf8');
const match = env.match(/AI_API_KEYS="([^"]+)"/);
const key = match[1].split(',')[0].trim();
console.log('Key prefix:', key.substring(0, 15) + '...');

const genAI = new GoogleGenerativeAI(key);
const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

// Test 1: Basic text
try {
  const result = await model.generateContent('Say hello in one word.');
  console.log('✅ Basic text works:', result.response.text());
} catch(e) {
  console.log('❌ Basic text failed:', e.message, '| Status:', e.status);
}

// Test 2: YouTube URL via fileData
try {
  const result = await model.generateContent([
    { text: 'What is this video about? One sentence.' },
    { fileData: { mimeType: 'video/mp4', fileUri: 'https://www.youtube.com/watch?v=jNQXAC9IVRw' } }
  ]);
  console.log('✅ YouTube fileData works:', result.response.text().substring(0, 100));
} catch(e) {
  console.log('❌ YouTube fileData failed:', e.message, '| Status:', e.status);
}
