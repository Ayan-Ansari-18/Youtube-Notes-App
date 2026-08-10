import { fetchTranscript } from 'youtube-transcript-plus';

const videoId = process.argv[2] || 'jNQXAC9IVRw';
console.log('Testing youtube-transcript-plus for:', videoId);
try {
  const items = await fetchTranscript(videoId);
  console.log('✅ Got', items.length, 'items');
  console.log('Sample:', items.slice(0,3).map(i => i.text).join(' '));
} catch(e) {
  console.log('❌ Error:', e.message);
}
