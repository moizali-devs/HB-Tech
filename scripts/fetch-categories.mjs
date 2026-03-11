import https from 'https';

function get(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122' }
    }, (res) => {
      if ([301,302,307,308].includes(res.statusCode) && res.headers.location) {
        const loc = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href;
        return get(loc).then(resolve);
      }
      let d = '';
      res.on('data', c => { if (d.length < 500000) d += c; });
      res.on('end', () => resolve({ status: res.statusCode, html: d }));
    });
    req.on('error', () => resolve({ status: 0, html: '' }));
    req.setTimeout(15000, () => { req.destroy(); resolve({ status: 0, html: '' }); });
  });
}

// Extract all slug->image mappings from a category page
function extractProductImages(html) {
  const results = {};
  // Pattern: find product slugs near CDN image URLs in the same JSON/data block
  const nuxtMatch = html.match(/window\.__NUXT__\s*=\s*(\{[\s\S]+?\})\s*;?\s*<\/script>/);
  if (nuxtMatch) {
    const json = nuxtMatch[1];
    const imgMatches = [...json.matchAll(/"(dlcdnwebimgs\.asus\.com\/gain\/[A-Za-z0-9\-]+)"/g)];
    const slugMatches = [...json.matchAll(/"slug"\s*:\s*"([a-z0-9\-]+)"/g)];
    console.error(`Found ${imgMatches.length} images, ${slugMatches.length} slugs in NUXT data`);
  }
  // Also find all CDN URLs
  const allImgs = [...html.matchAll(/https?:\/\/dlcdnwebimgs\.asus\.com\/gain\/[A-Za-z0-9\-]+/gi)].map(m => m[0]);
  console.error(`Total CDN URLs on page: ${allImgs.length}`);
  if (allImgs.length > 0) console.error('Sample:', allImgs.slice(0,5));
  return allImgs;
}

const categoryPages = [
  ['keyboards', 'https://rog.asus.com/keyboards/keyboards/all-series/'],
  ['mice', 'https://rog.asus.com/mice-mouse-pads/mice/gaming/'],
  ['headsets', 'https://rog.asus.com/headsets-audio/headsets/'],
  ['gpus', 'https://rog.asus.com/graphics-cards/graphics-cards/all-series/'],
  ['laptops-zephyrus', 'https://rog.asus.com/laptops/rog-zephyrus/all-series/'],
  ['laptops-strix', 'https://rog.asus.com/laptops/rog-strix/all-series/'],
  ['laptops-flow', 'https://rog.asus.com/laptops/rog-flow/all-series/'],
  ['monitors', 'https://rog.asus.com/monitors/all-series/'],
  ['cooling', 'https://rog.asus.com/cpu-cooling/all-series/'],
  ['networking', 'https://rog.asus.com/networking/all-series/'],
  ['memory', 'https://rog.asus.com/memory/all-series/'],
  ['ssd', 'https://rog.asus.com/solid-state-drive/all-series/'],
  ['cases', 'https://rog.asus.com/cases/all-series/'],
];

for (const [name, url] of categoryPages) {
  console.error(`\nFetching ${name}: ${url}`);
  const { status, html } = await get(url);
  console.error(`Status: ${status}, HTML length: ${html.length}`);
  extractProductImages(html);
}
