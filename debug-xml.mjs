// Test all available packages
const videoId = process.argv[2] || 'jNQXAC9IVRw';
console.log(`\n🔍 Testing all methods for: ${videoId}\n`);

// Test 1: youtube-transcript-plus
console.log('--- 1: youtube-transcript-plus ---');
try {
  const { fetchTranscript } = await import('youtube-transcript-plus');
  const items = await fetchTranscript(videoId);
  console.log(`✅ Got ${items.length} items: "${items.slice(0,2).map(i=>i.text).join(' ')}"`);
} catch(e) { console.log('❌', e.message); }

// Test 2: youtube-transcript
console.log('\n--- 2: youtube-transcript ---');
try {
  const { YoutubeTranscript } = await import('youtube-transcript');
  const items = await YoutubeTranscript.fetchTranscript(videoId);
  console.log(`✅ Got ${items.length} items: "${items.slice(0,2).map(i=>i.text).join(' ')}"`);
} catch(e) { console.log('❌', e.message); }

// Test 3: @danielxceron/youtube-transcript
console.log('\n--- 3: @danielxceron/youtube-transcript ---');
try {
  const mod = await import('@danielxceron/youtube-transcript');
  const YT = mod.YoutubeTranscript || mod.default?.YoutubeTranscript || mod.default;
  const items = await (YT.fetchTranscript || YT)(videoId);
  console.log(`✅ Got ${items.length} items: "${items.slice(0,2).map(i=>i.text).join(' ')}"`);
} catch(e) { console.log('❌', e.message); }
