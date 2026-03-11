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
      res.on('data', c => { if (d.length < 80000) d += c; });
      res.on('end', () => resolve({ status: res.statusCode, html: d }));
    });
    req.on('error', () => resolve({ status: 0, html: '' }));
    req.setTimeout(10000, () => { req.destroy(); resolve({ status: 0, html: '' }); });
  });
}

function extractImg(html) {
  const m = html.match(/https?:\/\/dlcdnwebimgs\.asus\.com\/gain\/[A-Za-z0-9\-]+/i);
  return m ? m[0] : null;
}

async function fetchWithFallbacks(slug, urls) {
  for (const url of urls) {
    const { status, html } = await get(url);
    if (status === 200) {
      const img = extractImg(html);
      if (img) return { slug, img };
    }
  }
  return { slug, img: null };
}

const products = [
  // Laptops — new URL format without /series/
  ['rog-zephyrus-g16-2024-rtx4090', [
    'https://rog.asus.com/laptops/rog-zephyrus/rog-zephyrus-g16-2024/',
    'https://rog.asus.com/us/laptops/rog-zephyrus/rog-zephyrus-g16-2024/',
  ]],
  ['rog-zephyrus-g14-2024', [
    'https://rog.asus.com/laptops/rog-zephyrus/rog-zephyrus-g14-2024/',
    'https://rog.asus.com/us/laptops/rog-zephyrus/rog-zephyrus-g14-2024/',
  ]],
  ['rog-strix-scar-17-2024', [
    'https://rog.asus.com/laptops/rog-strix/rog-strix-scar-17-2024/',
    'https://rog.asus.com/us/laptops/rog-strix/rog-strix-scar-17-2024/',
    'https://rog.asus.com/laptops/rog-strix/rog-strix-scar-17-2024-series/',
  ]],
  ['rog-flow-x13-2024', [
    'https://rog.asus.com/laptops/rog-flow/rog-flow-x13-2024/',
    'https://rog.asus.com/us/laptops/rog-flow/rog-flow-x13-2024/',
  ]],
  ['rog-strix-g16-2024', [
    'https://rog.asus.com/laptops/rog-strix/rog-strix-g16-2024/',
    'https://rog.asus.com/us/laptops/rog-strix/rog-strix-g16-2024/',
  ]],
  // Cooling — new path /cooling/cpu-liquid-coolers/
  ['rog-ryujin-iii-360', [
    'https://rog.asus.com/cooling/cpu-liquid-coolers/rog-ryujin/rog-ryujin-iii-360/',
    'https://rog.asus.com/cooling/cpu-liquid-coolers/rog-ryujin/rog-ryujin-iii-360-argb/',
  ]],
  ['rog-strix-lc-iii-360', [
    'https://rog.asus.com/cooling/cpu-liquid-coolers/rog-strix-lc/rog-strix-lc-iii-360/',
    'https://rog.asus.com/cooling/cpu-liquid-coolers/rog-strix-lc/rog-strix-lc-iii-360-argb/',
  ]],
  // Monitors
  ['rog-swift-pro-pg248qp', [
    'https://rog.asus.com/monitors/24-to-27-inches/rog-swift-pro-pg248qp/',
    'https://rog.asus.com/monitors/monitors/24-and-below/rog-swift-pro-pg248qp/',
    'https://rog.asus.com/monitors/monitors/esports/rog-swift-pro-pg248qp/',
  ]],
  ['rog-strix-xg32aq', [
    'https://rog.asus.com/monitors/32-and-above/rog-strix-xg32aq/',
    'https://rog.asus.com/monitors/monitors/32-and-above/rog-strix-xg32aq/',
  ]],
  // GPU
  ['rog-strix-rx-7900-xtx-oc', [
    'https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rx7900xtx-o24g-gaming/',
    'https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rxw7900xtx-o24g-gaming/',
    'https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rx7900xtx-o24g-gaming-model/',
  ]],
  // Mouse
  ['rog-strix-impact-iii-wireless', [
    'https://rog.asus.com/mice-mouse-pads/mice/ambidextrous/rog-strix-impact-iii/',
    'https://rog.asus.com/mice-mouse-pads/mice/ambidextrous/rog-strix-impact-iii-wireless/',
    'https://rog.asus.com/mice-mouse-pads/mice/wireless/rog-strix-impact-iii-wireless-model/',
  ]],
  // Keyboards
  ['rog-claymore-ii-wireless', [
    'https://rog.asus.com/keyboards/keyboards/full-size/rog-claymore-ii/',
    'https://rog.asus.com/keyboards/keyboards/wireless/rog-claymore-ii/',
    'https://rog.asus.com/keyboards/keyboards/aura-rgb/rog-claymore-ii-model/',
  ]],
  ['rog-strix-scope-ii-rx-tkl', [
    'https://rog.asus.com/keyboards/keyboards/aura-rgb/rog-strix-scope-ii-rx-tkl/',
    'https://rog.asus.com/keyboards/keyboards/tkl/rog-strix-scope-ii-rx-tkl/',
    'https://rog.asus.com/keyboards/keyboards/pbt-keycaps/rog-strix-scope-ii-rx-tkl/',
  ]],
  // Cases
  ['rog-hyperion-gr701-btf', [
    'https://rog.asus.com/cases/rog-hyperion/rog-hyperion-gr701/',
    'https://rog.asus.com/cases/rog-hyperion/rog-hyperion-gr701-btf/',
    'https://rog.asus.com/pc-cases/rog-hyperion/rog-hyperion-gr701/',
  ]],
  ['rog-strix-helios-gx601-white', [
    'https://rog.asus.com/cases/rog-strix-helios/rog-strix-helios-gx601/',
    'https://rog.asus.com/cases/rog-strix-helios/rog-strix-helios-gx601-white/',
    'https://rog.asus.com/pc-cases/rog-strix-helios/rog-strix-helios-gx601-white/',
  ]],
  // Networking
  ['rog-rapture-gt-be98-wifi7', [
    'https://rog.asus.com/networking/rog-rapture/rog-rapture-gt-be98/',
    'https://rog.asus.com/wifi-routers/rog-rapture/rog-rapture-gt-be98/',
  ]],
  ['rog-rapture-gt-ax11000-pro', [
    'https://rog.asus.com/networking/rog-rapture/rog-rapture-gt-ax11000-pro/',
    'https://rog.asus.com/wifi-routers/rog-rapture/rog-rapture-gt-ax11000-pro/',
  ]],
  ['rog-rapture-gt-ax6000', [
    'https://rog.asus.com/networking/rog-rapture/rog-rapture-gt-ax6000/',
    'https://rog.asus.com/wifi-routers/rog-rapture/rog-rapture-gt-ax6000/',
  ]],
  ['rog-strix-gs-ax5400', [
    'https://rog.asus.com/networking/rog-strix/rog-strix-gs-ax5400/',
    'https://rog.asus.com/wifi-routers/rog-strix/rog-strix-gs-ax5400/',
  ]],
  // Memory
  ['rog-lancer-ddr5-6000-32gb', [
    'https://rog.asus.com/memory/rog-lancer/rog-lancer-ddr5/',
    'https://rog.asus.com/memory/rog-lancer/rog-lancer-rgb-ddr5/',
    'https://rog.asus.com/components/memory/rog-lancer/rog-lancer-ddr5-6000/',
  ]],
  ['rog-lancer-ddr5-6000-16gb', [
    'https://rog.asus.com/memory/rog-lancer/rog-lancer-ddr5/',
    'https://rog.asus.com/memory/rog-lancer/rog-lancer-rgb-ddr5/',
  ]],
  ['rog-strix-ddr4-3600-32gb', [
    'https://rog.asus.com/memory/rog-strix/rog-strix-ddr4-3600/',
    'https://rog.asus.com/components/memory/rog-strix/rog-strix-ddr4/',
  ]],
  // SSDs
  ['rog-thor-1tb-pcie5', [
    'https://rog.asus.com/solid-state-drive/rog-thor/rog-thor/',
    'https://rog.asus.com/components/ssd/rog-thor/rog-thor/',
    'https://rog.asus.com/solid-state-drive/rog-thor/rog-thor-ssd/',
  ]],
  ['rog-strix-sq7-2tb', [
    'https://rog.asus.com/solid-state-drive/rog-strix/rog-strix-sq7/',
    'https://rog.asus.com/components/ssd/rog-strix/rog-strix-sq7/',
  ]],
  ['rog-strix-sq7-1tb', [
    'https://rog.asus.com/solid-state-drive/rog-strix/rog-strix-sq7/',
  ]],
];

const results = await Promise.all(products.map(([slug, urls]) => fetchWithFallbacks(slug, urls)));
const found = results.filter(r => r.img);
console.error(`Found: ${found.length}/${results.length}`);
console.log(JSON.stringify(results));
