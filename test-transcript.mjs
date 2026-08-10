// Quick debug script - run with: node test-transcript.mjs VIDEO_ID
const videoId = process.argv[2] || 'jNQXAC9IVRw';

console.log(`\n🔍 Testing transcript for video: ${videoId}\n`);

function parseXML(xml) {
  const items = [];
  const regex = /<text start="([^"]*)" dur="([^"]*)"[^>]*>([\s\S]*?)<\/text>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    const text = match[3]
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/<[^>]+>/g, '').trim();
    if (text) items.push(text);
  }
  return items;
}

async function testPageScrape() {
  console.log('--- Method: Page Scraping ---');
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    });
    const html = await res.text();

    const captionMatch = html.match(/"captionTracks":(\[.*?\])/s);
    if (!captionMatch) {
      console.log('❌ No captionTracks found in page');
      if (html.includes('captionsDisabled')) console.log('  (Captions disabled)');
      return;
    }

    const raw = captionMatch[1].replace(/\\u0026/g, '&').replace(/\\u003d/g, '=');
    const tracks = JSON.parse(raw);
    console.log(`✅ Found ${tracks.length} caption tracks:`);
    tracks.forEach(t => console.log(`   - [${t.languageCode}] ${t.name?.simpleText || ''} ${t.kind ? '('+t.kind+')' : ''}`));

    const track = tracks.find(t => t.languageCode === 'en' && !t.kind) 
      || tracks.find(t => t.languageCode?.startsWith('en'))
      || tracks[0];
    console.log(`\n📥 Using track: [${track.languageCode}] ${track.name?.simpleText || ''}`);
    
    const baseUrl = track.baseUrl.startsWith('http') ? track.baseUrl : `https://www.youtube.com${track.baseUrl}`;
    const xmlRes = await fetch(baseUrl + '&fmt=xml&hl=en', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const xml = await xmlRes.text();
    const words = parseXML(xml);
    
    if (words.length > 0) {
      console.log(`✅ Transcript fetched! (${words.length} segments)`);
      console.log(`📄 Sample: "${words.slice(0, 10).join(' ')}..."`);
    } else {
      console.log('❌ XML parsed but no words found');
    }
  } catch(e) {
    console.log('❌ Error:', e.message);
  }
}

await testPageScrape();
