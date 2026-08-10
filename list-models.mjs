import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';

const env = readFileSync('.env.local', 'utf8');
const match = env.match(/AI_API_KEYS="([^"]+)"/);
const key = match[1].split(',')[0].trim();

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
);
const data = await response.json();
if (data.models) {
  data.models
    .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
    .forEach(m => console.log(m.name, '-', m.displayName));
} else {
  console.log(JSON.stringify(data, null, 2));
}
