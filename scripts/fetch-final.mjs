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

// Try multiple URL variants per product, return first that has an image
async function fetchWithFallbacks(slug, urls) {
  for (const url of urls) {
    const { status, html } = await get(url);
    if (status === 200) {
      const img = extractImg(html);
      if (img) return { slug, img, url };
    }
  }
  return { slug, img: null };
}

const products = [
  // GPUs — try without -model suffix and with /rog-strix/ subfolder
  ['rog-strix-rtx-4080-super-oc', [
    'https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx4080s-o16g-gaming-model/',
    'https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx4080s-o16g-gaming/',
    'https://rog.asus.com/us/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx4080s-o16g-gaming/',
  ]],
  ['rog-strix-rtx-4070-ti-super-oc', [
    'https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx4070tis-o16g-gaming-model/',
    'https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx4070tis-o16g-gaming/',
  ]],
  ['rog-strix-rtx-4070-super-oc', [
    'https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx4070s-o12g-gaming-model/',
    'https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx4070s-o12g-gaming/',
  ]],
  ['rog-strix-rtx-4060-ti-oc', [
    'https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx4060ti-o8g-gaming-model/',
    'https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx4060ti-o8g-gaming/',
  ]],
  ['rog-strix-rx-7900-xtx-oc', [
    'https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rxw7900xtx-o24g-gaming-model/',
    'https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rxw7900xtx-o24g-gaming/',
    'https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rx7900xtx-o24g-gaming-model/',
  ]],
  // Monitors
  ['rog-swift-pro-pg248qp', [
    'https://rog.asus.com/monitors/24-to-27-inches/rog-swift-pro-pg248qp-model/',
    'https://rog.asus.com/monitors/monitors/24-to-27-inches/rog-swift-pro-pg248qp-model/',
    'https://rog.asus.com/monitors/24-and-below/rog-swift-pro-pg248qp-model/',
  ]],
  ['rog-strix-xg32aq', [
    'https://rog.asus.com/monitors/32-and-above/rog-strix-xg32aq-model/',
    'https://rog.asus.com/monitors/monitors/32-and-above/rog-strix-xg32aq-model/',
  ]],
  // Laptops
  ['rog-zephyrus-g16-2024-rtx4090', [
    'https://rog.asus.com/laptops/rog-zephyrus/rog-zephyrus-g16-2024-series/',
    'https://rog.asus.com/laptops/rog-zephyrus/rog-zephyrus-g16-2024-series/rog-zephyrus-g16-2024-gu605mz/',
  ]],
  ['rog-strix-scar-17-2024', [
    'https://rog.asus.com/laptops/rog-strix/rog-strix-scar-17-2024-series/',
    'https://rog.asus.com/laptops/rog-strix/rog-strix-scar-17-2024-series/rog-strix-scar-17-2024-g733pyr/',
  ]],
  ['rog-zephyrus-g14-2024', [
    'https://rog.asus.com/laptops/rog-zephyrus/rog-zephyrus-g14-2024-series/',
    'https://rog.asus.com/laptops/rog-zephyrus/rog-zephyrus-g14-2024-series/rog-zephyrus-g14-2024-ga403uv/',
  ]],
  ['rog-flow-x13-2024', [
    'https://rog.asus.com/laptops/rog-flow/rog-flow-x13-2024-series/',
    'https://rog.asus.com/laptops/rog-flow/rog-flow-x13-2024-series/rog-flow-x13-2024-gv302xv/',
  ]],
  ['rog-strix-g16-2024', [
    'https://rog.asus.com/laptops/rog-strix/rog-strix-g16-2024-series/',
    'https://rog.asus.com/laptops/rog-strix/rog-strix-g16-2024-series/rog-strix-g16-2024-g614jvr/',
  ]],
  // Mice — correct category paths
  ['rog-chakram-x-origin-wireless', [
    'https://rog.asus.com/mice-mouse-pads/mice/ergonomic-right-handed/rog-chakram-x-origin-model/',
  ]],
  ['rog-gladius-iii-wireless', [
    'https://rog.asus.com/mice-mouse-pads/mice/ergonomic-right-handed/rog-gladius-iii-wireless-aimpoint-model/',
    'https://rog.asus.com/mice-mouse-pads/mice/wireless/rog-gladius-iii-wireless-aimpoint-model/',
  ]],
  ['rog-keris-ii-ace-wireless', [
    'https://rog.asus.com/us/mice-mouse-pads/mice/wireless/rog-keris-ii-ace/',
    'https://rog.asus.com/mice-mouse-pads/mice/wireless/rog-keris-ii-ace/',
    'https://rog.asus.com/mice-mouse-pads/mice/ergonomic-right-handed/rog-keris-ii-ace-wireless-model/',
  ]],
  ['rog-harpe-ace-aim-lab', [
    'https://rog.asus.com/mice-mouse-pads/mice/ambidextrous/rog-harpe-ace-aim-lab-edition-model/',
    'https://rog.asus.com/mice-mouse-pads/mice/ambidextrous/rog-harpe-ace/',
  ]],
  ['rog-strix-impact-iii-wireless', [
    'https://rog.asus.com/mice-mouse-pads/mice/ambidextrous/rog-strix-impact-iii-wireless-model/',
    'https://rog.asus.com/mice-mouse-pads/mice/ambidextrous/rog-strix-impact-iii/',
  ]],
  // Keyboards — correct category paths
  ['rog-azoth-wireless', [
    'https://rog.asus.com/keyboards/keyboards/compact/rog-azoth-model/',
  ]],
  ['rog-falchion-ace-wireless', [
    'https://rog.asus.com/keyboards/keyboards/compact/rog-falchion-ace-model/',
    'https://rog.asus.com/keyboards/keyboards/wireless/rog-falchion-ace-model/',
    'https://rog.asus.com/keyboards/keyboards/65-percent/rog-falchion-ace-model/',
  ]],
  ['rog-claymore-ii-wireless', [
    'https://rog.asus.com/keyboards/keyboards/full-size/rog-claymore-ii-model/',
    'https://rog.asus.com/keyboards/keyboards/wireless/rog-claymore-ii-model/',
  ]],
  ['rog-strix-scope-ii-rx-tkl', [
    'https://rog.asus.com/keyboards/keyboards/tkl/rog-strix-scope-ii-rx-tkl-model/',
    'https://rog.asus.com/keyboards/keyboards/aura-rgb/rog-strix-scope-ii-rx-tkl-model/',
    'https://rog.asus.com/keyboards/keyboards/pbt-keycaps/rog-strix-scope-ii-rx-tkl-model/',
  ]],
  ['rog-strix-flare-ii-animate', [
    'https://rog.asus.com/keyboards/keyboards/full-size/rog-strix-flare-ii-animate-model/',
    'https://rog.asus.com/keyboards/keyboards/aura-rgb/rog-strix-flare-ii-animate-model/',
  ]],
  // Headsets
  ['rog-delta-s-wireless', [
    'https://rog.asus.com/headsets-audio/headsets/wireless-headsets/rog-delta-s-wireless-model/',
  ]],
  ['rog-strix-go-2-4', [
    'https://rog.asus.com/headsets-audio/headsets/wireless-headsets/rog-strix-go-2-4-model/',
    'https://rog.asus.com/headsets-audio/headsets/usb-c-headsets/rog-strix-go-2-4-model/',
    'https://rog.asus.com/headsets-audio/headsets/usb-headsets/rog-strix-go-2-4-model/',
  ]],
  ['rog-fusion-ii-500', [
    'https://rog.asus.com/headsets-audio/headsets/usb-headsets/rog-fusion-ii-500-model/',
  ]],
  ['rog-cetra-true-wireless-pro', [
    'https://rog.asus.com/us/headsets-audio/earbuds/rog-cetra-true-wireless-model/',
    'https://rog.asus.com/headsets-audio/earbuds/rog-cetra-true-wireless-model/',
    'https://rog.asus.com/headsets-audio/earbuds/true-wireless/rog-cetra-true-wireless-pro-model/',
  ]],
  // Cooling
  ['rog-ryujin-iii-360', [
    'https://rog.asus.com/cpu-cooling/rog-ryujin/rog-ryujin-iii-360-argb-model/',
    'https://rog.asus.com/cpu-cooling/rog-ryujin/rog-ryujin-iii-360/',
    'https://rog.asus.com/cpu-cooling/rog-ryujin/rog-ryujin-iii-360-argb/',
  ]],
  ['rog-strix-lc-iii-360', [
    'https://rog.asus.com/cpu-cooling/rog-strix-lc/rog-strix-lc-iii-360-argb-model/',
    'https://rog.asus.com/cpu-cooling/rog-strix-lc/rog-strix-lc-iii-360-argb/',
    'https://rog.asus.com/cpu-cooling/rog-strix-lc/rog-strix-lc-iii-360/',
  ]],
  // Cases
  ['rog-hyperion-gr701-btf', [
    'https://rog.asus.com/cases/rog-hyperion/rog-hyperion-gr701-btf-model/',
    'https://rog.asus.com/cases/rog-hyperion/rog-hyperion-gr701-btf/',
    'https://rog.asus.com/cases/rog-hyperion/rog-hyperion-gr701/',
  ]],
  ['rog-strix-helios-gx601-white', [
    'https://rog.asus.com/cases/rog-strix-helios/rog-strix-helios-gx601-white-edition-model/',
    'https://rog.asus.com/cases/rog-strix-helios/rog-strix-helios-gx601-white/',
  ]],
  // Networking
  ['rog-rapture-gt-be98-wifi7', [
    'https://rog.asus.com/networking/rog-rapture/rog-rapture-gt-be98-model/',
    'https://rog.asus.com/networking/rog-rapture/rog-rapture-gt-be98/',
  ]],
  ['rog-rapture-gt-ax11000-pro', [
    'https://rog.asus.com/networking/rog-rapture/rog-rapture-gt-ax11000-pro-model/',
    'https://rog.asus.com/networking/rog-rapture/rog-rapture-gt-ax11000-pro/',
  ]],
  ['rog-rapture-gt-ax6000', [
    'https://rog.asus.com/networking/rog-rapture/rog-rapture-gt-ax6000-model/',
    'https://rog.asus.com/networking/rog-rapture/rog-rapture-gt-ax6000/',
  ]],
  ['rog-strix-gs-ax5400', [
    'https://rog.asus.com/networking/rog-strix/rog-strix-gs-ax5400-model/',
    'https://rog.asus.com/networking/rog-strix/rog-strix-gs-ax5400/',
  ]],
  // Memory
  ['rog-lancer-ddr5-6000-32gb', [
    'https://rog.asus.com/memory/rog-lancer/rog-lancer-ddr5-6000-model/',
    'https://rog.asus.com/memory/rog-lancer/rog-lancer-ddr5-6000/',
    'https://rog.asus.com/memory/rog-lancer/rog-lancer-ddr5/',
  ]],
  ['rog-lancer-ddr5-6000-16gb', [
    'https://rog.asus.com/memory/rog-lancer/rog-lancer-ddr5-6000-model/',
    'https://rog.asus.com/memory/rog-lancer/rog-lancer-ddr5/',
  ]],
  ['rog-strix-ddr4-3600-32gb', [
    'https://rog.asus.com/memory/rog-strix/rog-strix-ddr4-3600-model/',
    'https://rog.asus.com/memory/rog-strix/rog-strix-ddr4-3600/',
  ]],
  // SSDs
  ['rog-thor-1tb-pcie5', [
    'https://rog.asus.com/solid-state-drive/rog-thor/rog-thor-ssd-model/',
    'https://rog.asus.com/solid-state-drive/rog-thor/rog-thor/',
    'https://rog.asus.com/solid-state-drive/rog-thor/rog-thor-2t-p5/',
  ]],
  ['rog-strix-sq7-2tb', [
    'https://rog.asus.com/solid-state-drive/rog-strix/rog-strix-sq7-model/',
    'https://rog.asus.com/solid-state-drive/rog-strix/rog-strix-sq7/',
  ]],
  ['rog-strix-sq7-1tb', [
    'https://rog.asus.com/solid-state-drive/rog-strix/rog-strix-sq7-model/',
    'https://rog.asus.com/solid-state-drive/rog-strix/rog-strix-sq7/',
  ]],
];

const results = await Promise.all(products.map(([slug, urls]) => fetchWithFallbacks(slug, urls)));
const found = results.filter(r => r.img);
const missing = results.filter(r => !r.img).map(r => r.slug);

console.error(`\nFound: ${found.length}/${results.length}`);
console.error('Missing:', missing);
console.log(JSON.stringify(results));
