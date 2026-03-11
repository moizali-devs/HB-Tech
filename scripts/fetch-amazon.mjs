import https from 'https';

function get(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    }, (res) => {
      if ([301,302,307,308].includes(res.statusCode) && res.headers.location) {
        const loc = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href;
        return get(loc).then(resolve);
      }
      let d = '';
      res.on('data', c => { if (d.length < 100000) d += c; });
      res.on('end', () => resolve(d));
    });
    req.on('error', () => resolve(''));
    req.setTimeout(15000, () => { req.destroy(); resolve(''); });
  });
}

function extractImg(html) {
  // Try og:image first
  const og = html.match(/property="og:image"[^>]+content="([^"]+)"/i)
           || html.match(/content="([^"]+)"[^>]*property="og:image"/i);
  if (og) return og[1];
  // Amazon product images
  const amz = html.match(/https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9+%_\-]+\.(?:jpg|png|webp)/i);
  if (amz) return amz[0];
  // ASUS CDN
  const asus = html.match(/https:\/\/dlcdnwebimgs\.asus\.com\/gain\/[A-Za-z0-9\-]+/i);
  if (asus) return asus[0];
  return null;
}

// Products with known Amazon ASINs
const amazonProducts = [
  // ROG GPUs
  ['rog-strix-rtx-4080-super-oc',        'https://www.amazon.com/dp/B0CM5KLDYW'],
  ['rog-strix-rtx-4070-ti-super-oc',     'https://www.amazon.com/dp/B0CQPWZXY3'],
  // MSI products
  ['msi-rtx-4090-gaming-x-trio',         'https://www.amazon.com/dp/B09YCLG5PB'],
  ['msi-meg-z790-ace',                   'https://www.amazon.com/dp/B0BL8JC76Q'],
];

// Search for more products via Amazon search
async function searchAmazon(query) {
  const url = `https://www.amazon.com/s?k=${encodeURIComponent(query)}&ref=nb_sb_noss`;
  const html = await get(url);
  // Find first product ASIN link
  const m = html.match(/\/dp\/([A-Z0-9]{10})/);
  if (m) {
    const productHtml = await get(`https://www.amazon.com/dp/${m[1]}`);
    return extractImg(productHtml);
  }
  return null;
}

// Products to search on Amazon
const toSearch = [
  ['rog-strix-rtx-4070-super-oc',        'ASUS ROG Strix RTX 4070 Super OC'],
  ['rog-strix-rtx-4060-ti-oc',           'ASUS ROG Strix RTX 4060 Ti OC'],
  ['rog-strix-rx-7900-xtx-oc',           'ASUS ROG Strix RX 7900 XTX OC'],
  ['rog-swift-pro-pg248qp',              'ASUS ROG Swift Pro PG248QP monitor'],
  ['rog-strix-xg32aq',                   'ASUS ROG Strix XG32AQ monitor'],
  ['rog-zephyrus-g16-2024-rtx4090',      'ASUS ROG Zephyrus G16 RTX 4090 2024 laptop'],
  ['rog-strix-scar-17-2024',             'ASUS ROG Strix SCAR 17 2024 G733'],
  ['rog-zephyrus-g14-2024',              'ASUS ROG Zephyrus G14 2024 GA403'],
  ['rog-flow-x13-2024',                  'ASUS ROG Flow X13 2024 GV302'],
  ['rog-strix-g16-2024',                 'ASUS ROG Strix G16 2024 G614JVR'],
  ['rog-chakram-x-origin-wireless',      'ASUS ROG Chakram X Origin wireless mouse'],
  ['rog-gladius-iii-wireless',           'ASUS ROG Gladius III wireless mouse AimPoint'],
  ['rog-keris-ii-ace-wireless',          'ASUS ROG Keris II Ace wireless mouse'],
  ['rog-harpe-ace-aim-lab',              'ASUS ROG Harpe Ace Aim Lab mouse'],
  ['rog-strix-impact-iii-wireless',      'ASUS ROG Strix Impact III wireless mouse'],
  ['rog-azoth-wireless',                 'ASUS ROG Azoth wireless keyboard'],
  ['rog-falchion-ace-wireless',          'ASUS ROG Falchion Ace wireless keyboard'],
  ['rog-claymore-ii-wireless',           'ASUS ROG Claymore II wireless keyboard'],
  ['rog-strix-scope-ii-rx-tkl',          'ASUS ROG Strix Scope II RX TKL keyboard'],
  ['rog-strix-flare-ii-animate',         'ASUS ROG Strix Flare II Animate keyboard'],
  ['rog-delta-s-wireless',               'ASUS ROG Delta S wireless headset'],
  ['rog-strix-go-2-4',                   'ASUS ROG Strix Go 2.4 wireless headset'],
  ['rog-fusion-ii-500',                  'ASUS ROG Fusion II 500 headset'],
  ['rog-cetra-true-wireless-pro',        'ASUS ROG Cetra True Wireless Pro earbuds'],
  ['rog-ryujin-iii-360',                 'ASUS ROG Ryujin III 360 ARGB AIO cooler'],
  ['rog-strix-lc-iii-360',              'ASUS ROG Strix LC III 360 AIO cooler'],
  ['rog-hyperion-gr701-btf',             'ASUS ROG Hyperion GR701 BTF case'],
  ['rog-strix-helios-gx601-white',       'ASUS ROG Strix Helios GX601 white case'],
  ['rog-rapture-gt-be98-wifi7',          'ASUS ROG Rapture GT-BE98 wifi 7 router'],
  ['rog-rapture-gt-ax11000-pro',         'ASUS ROG Rapture GT-AX11000 Pro router'],
  ['rog-rapture-gt-ax6000',              'ASUS ROG Rapture GT-AX6000 router'],
  ['rog-strix-gs-ax5400',                'ASUS ROG Strix GS-AX5400 router'],
  ['rog-lancer-ddr5-6000-32gb',          'ASUS ROG Lancer DDR5-6000 32GB RAM'],
  ['rog-lancer-ddr5-6000-16gb',          'ASUS ROG Lancer DDR5 16GB RAM'],
  ['rog-strix-ddr4-3600-32gb',           'ASUS ROG Strix DDR4-3600 32GB RAM'],
  ['rog-thor-1tb-pcie5',                 'ASUS ROG Thor SSD PCIe 5.0 NVMe'],
  ['rog-strix-sq7-2tb',                  'ASUS ROG Strix SQ7 2TB NVMe SSD'],
  ['rog-strix-sq7-1tb',                  'ASUS ROG Strix SQ7 1TB NVMe SSD'],
  // MSI products
  ['msi-mag-z790-tomahawk-wifi',         'MSI MAG Z790 Tomahawk WiFi motherboard'],
  ['msi-pro-b760m-a-wifi',               'MSI Pro B760M-A WiFi motherboard'],
  ['msi-mag-b760-mortar-wifi-ddr5',      'MSI MAG B760 Mortar WiFi DDR5 motherboard'],
  ['msi-mpg-x670e-carbon-wifi',          'MSI MPG X670E Carbon WiFi motherboard'],
  ['msi-mag-b650-tomahawk-wifi',         'MSI MAG B650 Tomahawk WiFi motherboard'],
  ['msi-rtx-4080-super-gaming-x-slim',   'MSI RTX 4080 Super Gaming X Slim GPU'],
  ['msi-rtx-4070-ti-super-gaming-x-trio','MSI RTX 4070 Ti Super Gaming X Trio GPU'],
  ['msi-rtx-4070-gaming-x-trio',         'MSI RTX 4070 Gaming X Trio GPU'],
  ['msi-rtx-4060-gaming-x',              'MSI RTX 4060 Gaming X GPU'],
  ['msi-rx-7900-gre-gaming-x-trio',      'MSI Radeon RX 7900 GRE Gaming X Trio GPU'],
  ['msi-rx-7600-gaming-x',               'MSI Radeon RX 7600 Gaming X GPU'],
  ['msi-meg-342c-qd-oled',               'MSI MEG 342C QD-OLED ultrawide monitor'],
  ['msi-mpg-321urx-qd-oled',             'MSI MPG 321URX QD-OLED 4K monitor'],
  ['msi-mag-274qrf-qd',                  'MSI MAG 274QRF-QD gaming monitor'],
  ['msi-g274qpf-e2',                     'MSI G274QPF-E2 gaming monitor'],
  ['msi-g241-24-fhd-144hz',              'MSI G241 24 inch gaming monitor'],
  ['msi-titan-gt77-hx-rtx4090',          'MSI Titan GT77 HX RTX 4090 laptop'],
  ['msi-raider-ge78-hx-rtx4080',         'MSI Raider GE78 HX RTX 4080 laptop'],
  ['msi-stealth-16-mercedes-amg',        'MSI Stealth 16 Mercedes-AMG laptop'],
  ['msi-katana-15-rtx4060',              'MSI Katana 15 RTX 4060 laptop'],
  ['msi-cyborg-15-rtx4050',              'MSI Cyborg 15 RTX 4050 laptop'],
  ['msi-clutch-gm41-lightweight-wireless','MSI Clutch GM41 Lightweight Wireless mouse'],
  ['msi-clutch-gm51-lightweight-wireless','MSI Clutch GM51 Lightweight Wireless mouse'],
  ['msi-clutch-gm30',                    'MSI Clutch GM30 gaming mouse'],
  ['msi-clutch-gm08',                    'MSI Clutch GM08 gaming mouse'],
  ['msi-accolade-em30',                  'MSI Accolade EM30 gaming mouse'],
  ['msi-vigor-gk71-sonic-red',           'MSI Vigor GK71 Sonic Red keyboard'],
  ['msi-vigor-gk50-elite-tkl',           'MSI Vigor GK50 Elite TKL keyboard'],
  ['msi-vigor-gk30',                     'MSI Vigor GK30 gaming keyboard'],
  ['msi-vigor-gk20',                     'MSI Vigor GK20 gaming keyboard'],
  ['msi-vigor-gk60-tkl',                 'MSI Vigor GK60 TKL keyboard'],
  ['msi-immerse-gh50-wireless',          'MSI Immerse GH50 wireless gaming headset'],
  ['msi-immerse-gh30-v2',                'MSI Immerse GH30 V2 headset'],
  ['msi-immerse-gh20',                   'MSI Immerse GH20 headset'],
  ['msi-immerse-hs01-wireless',          'MSI Immerse HS01 wireless headset'],
  ['msi-parity-ddr5-5600-32gb',          'MSI Parity DDR5 5600 32GB RAM'],
  ['msi-parity-ddr5-4800-16gb',          'MSI Parity DDR5 4800 16GB RAM'],
  ['msi-ddr4-3200-16gb',                 'MSI Parity DDR4 3200 16GB RAM'],
  ['msi-spatium-m570-pro-2tb',           'MSI Spatium M570 Pro PCIe 5.0 NVMe 2TB SSD'],
  ['msi-spatium-m470-1tb',               'MSI Spatium M470 PCIe 4.0 1TB SSD'],
  ['msi-spatium-s270-480gb',             'MSI Spatium S270 SATA SSD'],
  ['msi-mpg-a1000g-pcie5',               'MSI MPG A1000G PCIe 5 1000W power supply'],
  ['msi-mag-a650bn',                     'MSI MAG A650BN 650W power supply'],
  ['msi-mag-coreliquid-360r-v2',         'MSI MAG CoreLiquid 360R V2 AIO cooler'],
  ['msi-mag-coreliquid-240r-v2',         'MSI MAG CoreLiquid 240R V2 AIO cooler'],
  ['msi-meg-prospect-700r',              'MSI MEG Prospect 700R PC case'],
  ['msi-mag-forge-320r-airflow',         'MSI MAG Forge 320R Airflow PC case'],
];

// Fetch known ASIN pages
console.error('Fetching known ASINs...');
const asinResults = await Promise.all(amazonProducts.map(async ([slug, url]) => {
  const html = await get(url);
  return { slug, img: extractImg(html) };
}));

// Search for rest
console.error('Searching remaining products...');
// Do in small batches to avoid rate limiting
const batchSize = 10;
const searchResults = [];
for (let i = 0; i < toSearch.length; i += batchSize) {
  const batch = toSearch.slice(i, i + batchSize);
  const results = await Promise.all(batch.map(async ([slug, query]) => {
    const img = await searchAmazon(query);
    return { slug, img };
  }));
  searchResults.push(...results);
  if (i + batchSize < toSearch.length) {
    await new Promise(r => setTimeout(r, 1000));
  }
}

const all = [...asinResults, ...searchResults];
console.log(JSON.stringify(all));
