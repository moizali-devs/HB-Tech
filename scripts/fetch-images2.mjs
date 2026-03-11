import https from 'https';

function head(url) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const req = https.request({ hostname: u.hostname, path: u.pathname + u.search, method: 'HEAD',
      headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve(res.statusCode);
    });
    req.on('error', () => resolve(0));
    req.setTimeout(6000, () => { req.destroy(); resolve(0); });
    req.end();
  });
}

function get(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0) Chrome/122' } }, (res) => {
      if ([301,302,307,308].includes(res.statusCode) && res.headers.location) {
        const loc = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href;
        return get(loc).then(resolve);
      }
      let d = '';
      res.on('data', c => { if (d.length < 80000) d += c; });
      res.on('end', () => resolve(d));
    });
    req.on('error', () => resolve(''));
    req.setTimeout(10000, () => { req.destroy(); resolve(''); });
  });
}

function extractImg(html) {
  const m = html.match(/https?:\/\/dlcdnwebimgs\.asus\.com\/gain\/[A-Za-z0-9\-]+/i)
         || html.match(/https?:\/\/storage-asset\.msi\.com\/[^\s"'<>]+\.(jpg|png|webp)/i)
         || html.match(/content="(https?:\/\/[^"]+\.(jpg|png|webp))"/i);
  return m ? (m[1] || m[0]) : null;
}

// Try multiple MSI CDN URL patterns for a product code
async function tryMsiCdn(productCode) {
  const variants = [
    `https://storage-asset.msi.com/global/picture/image/${productCode}/${productCode}_600.jpg`,
    `https://storage-asset.msi.com/global/picture/image/${productCode}/${productCode}.png`,
    `https://storage-asset.msi.com/global/picture/image/${productCode}/${productCode}_main.jpg`,
  ];
  for (const url of variants) {
    const status = await head(url);
    if (status === 200) return url;
  }
  return null;
}

// MSI product codes map
const msiProducts = [
  ['msi-meg-z790-ace',                 'MEG_Z790_ACE'],
  ['msi-mag-z790-tomahawk-wifi',       'MAG_Z790_TOMAHAWK_WIFI'],
  ['msi-pro-b760m-a-wifi',             'PRO_B760M-A_WIFI'],
  ['msi-mag-b760-mortar-wifi-ddr5',    'MAG_B760_MORTAR_WIFI'],
  ['msi-mpg-x670e-carbon-wifi',        'MPG_X670E_CARBON_WIFI'],
  ['msi-mag-b650-tomahawk-wifi',       'MAG_B650_TOMAHAWK_WIFI'],
  ['msi-rtx-4090-gaming-x-trio',       'GeForce_RTX_4090_GAMING_X_TRIO_24G'],
  ['msi-rtx-4080-super-gaming-x-slim', 'GeForce_RTX_4080_SUPER_16G_GAMING_X_SLIM'],
  ['msi-rtx-4070-ti-super-gaming-x-trio','GeForce_RTX_4070_Ti_SUPER_16G_GAMING_X_TRIO'],
  ['msi-rtx-4070-gaming-x-trio',       'GeForce_RTX_4070_GAMING_X_TRIO_12G'],
  ['msi-rtx-4060-gaming-x',            'GeForce_RTX_4060_GAMING_X_8G'],
  ['msi-rx-7900-gre-gaming-x-trio',    'Radeon_RX_7900_GRE_GAMING_X_TRIO_16G'],
  ['msi-rx-7600-gaming-x',             'Radeon_RX_7600_GAMING_X_8G'],
  ['msi-meg-342c-qd-oled',             'MEG_342C_QD-OLED'],
  ['msi-mpg-321urx-qd-oled',           'MPG_321URX_QD-OLED'],
  ['msi-mag-274qrf-qd',                'MAG_274QRF_QD'],
  ['msi-g274qpf-e2',                   'G274QPF-E2'],
  ['msi-g241-24-fhd-144hz',            'G241'],
  ['msi-titan-gt77-hx-rtx4090',        'GT77_HX_13V'],
  ['msi-raider-ge78-hx-rtx4080',       'Raider_GE78_HX_14V'],
  ['msi-stealth-16-mercedes-amg',      'Stealth_16_Mercedes-AMG_Motorsport_A13V'],
  ['msi-katana-15-rtx4060',            'Katana_15_B13V'],
  ['msi-cyborg-15-rtx4050',            'Cyborg_15_A13V'],
  ['msi-clutch-gm41-lightweight-wireless','Clutch_GM41_Lightweight_Wireless'],
  ['msi-clutch-gm51-lightweight-wireless','Clutch_GM51_Lightweight_Wireless'],
  ['msi-clutch-gm30',                  'Clutch_GM30'],
  ['msi-clutch-gm08',                  'Clutch_GM08'],
  ['msi-accolade-em30',                'Accolade_EM30'],
  ['msi-vigor-gk71-sonic-red',         'Vigor_GK71_Sonic_Red'],
  ['msi-vigor-gk50-elite-tkl',         'Vigor_GK50_Elite_TKL'],
  ['msi-vigor-gk30',                   'Vigor_GK30'],
  ['msi-vigor-gk20',                   'Vigor_GK20'],
  ['msi-vigor-gk60-tkl',               'Vigor_GK60'],
  ['msi-immerse-gh50-wireless',        'Immerse_GH50_Wireless'],
  ['msi-immerse-gh30-v2',              'Immerse_GH30_V2'],
  ['msi-immerse-gh20',                 'Immerse_GH20'],
  ['msi-immerse-hs01-wireless',        'Immerse_HS01'],
  ['msi-parity-ddr5-5600-32gb',        'PARITY_DDR5'],
  ['msi-parity-ddr5-4800-16gb',        'PARITY_DDR5'],
  ['msi-ddr4-3200-16gb',               'PARITY_DDR4'],
  ['msi-spatium-m570-pro-2tb',         'SPATIUM_M570_PRO_PCIE5'],
  ['msi-spatium-m470-1tb',             'SPATIUM_M470'],
  ['msi-spatium-s270-480gb',           'SPATIUM_S270_SATA'],
  ['msi-mpg-a1000g-pcie5',             'MPG_A1000G_PCIE5'],
  ['msi-mag-a650bn',                   'MAG_A650BN'],
  ['msi-mag-coreliquid-360r-v2',       'MAG_CORELIQUID_360R_V2'],
  ['msi-mag-coreliquid-240r-v2',       'MAG_CORELIQUID_240R_V2'],
  ['msi-meg-prospect-700r',            'MEG_PROSPECT_700R'],
  ['msi-mag-forge-320r-airflow',       'MAG_FORGE_320R_AIRFLOW'],
];

// ROG products still needing images — try US site
const rogPages = [
  ['rog-strix-rtx-4080-super-oc',      'https://rog.asus.com/us/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx4080s-o16g-gaming-model/'],
  ['rog-strix-rtx-4070-ti-super-oc',   'https://rog.asus.com/us/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx4070tis-o16g-gaming-model/'],
  ['rog-strix-rtx-4070-super-oc',      'https://rog.asus.com/us/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx4070s-o12g-gaming-model/'],
  ['rog-strix-rtx-4060-ti-oc',         'https://rog.asus.com/us/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx4060ti-o8g-gaming-model/'],
  ['rog-strix-rx-7900-xtx-oc',         'https://rog.asus.com/us/graphics-cards/graphics-cards/rog-strix/rog-strix-rxw7900xtx-o24g-gaming-model/'],
  ['rog-swift-pro-pg248qp',            'https://rog.asus.com/us/monitors/24-to-27-inches/rog-swift-pro-pg248qp-model/'],
  ['rog-strix-xg32aq',                 'https://rog.asus.com/us/monitors/32-and-above/rog-strix-xg32aq-model/'],
  ['rog-zephyrus-g16-2024-rtx4090',    'https://rog.asus.com/us/laptops/rog-zephyrus/rog-zephyrus-g16-2024-series/rog-zephyrus-g16-2024-gu605mz-model/'],
  ['rog-strix-scar-17-2024',           'https://rog.asus.com/us/laptops/rog-strix/rog-strix-scar-17-2024-series/'],
  ['rog-zephyrus-g14-2024',            'https://rog.asus.com/us/laptops/rog-zephyrus/rog-zephyrus-g14-2024-series/'],
  ['rog-flow-x13-2024',                'https://rog.asus.com/us/laptops/rog-flow/rog-flow-x13-2024-series/'],
  ['rog-strix-g16-2024',               'https://rog.asus.com/us/laptops/rog-strix/rog-strix-g16-2024-series/'],
  ['rog-chakram-x-origin-wireless',    'https://rog.asus.com/us/mice-mouse-pads/mice/gaming/rog-chakram-x-origin-model/'],
  ['rog-gladius-iii-wireless',         'https://rog.asus.com/us/mice-mouse-pads/mice/gaming/rog-gladius-iii-wireless-aimpoint-model/'],
  ['rog-keris-ii-ace-wireless',        'https://rog.asus.com/us/mice-mouse-pads/mice/gaming/rog-keris-ii-ace-wireless-model/'],
  ['rog-harpe-ace-aim-lab',            'https://rog.asus.com/us/mice-mouse-pads/mice/gaming/rog-harpe-ace-aim-lab-edition-model/'],
  ['rog-strix-impact-iii-wireless',    'https://rog.asus.com/us/mice-mouse-pads/mice/gaming/rog-strix-impact-iii-wireless-model/'],
  ['rog-azoth-wireless',               'https://rog.asus.com/us/keyboards/keyboards/all-series/rog-azoth-model/'],
  ['rog-falchion-ace-wireless',        'https://rog.asus.com/us/keyboards/keyboards/all-series/rog-falchion-ace-model/'],
  ['rog-claymore-ii-wireless',         'https://rog.asus.com/us/keyboards/keyboards/all-series/rog-claymore-ii-model/'],
  ['rog-strix-scope-ii-rx-tkl',        'https://rog.asus.com/us/keyboards/keyboards/all-series/rog-strix-scope-ii-rx-tkl-model/'],
  ['rog-strix-flare-ii-animate',       'https://rog.asus.com/us/keyboards/keyboards/all-series/rog-strix-flare-ii-animate-model/'],
  ['rog-delta-s-wireless',             'https://rog.asus.com/us/headsets-audio/headsets/rog-delta-s-wireless-model/'],
  ['rog-strix-go-2-4',                 'https://rog.asus.com/us/headsets-audio/headsets/rog-strix-go-2-4-model/'],
  ['rog-fusion-ii-500',                'https://rog.asus.com/us/headsets-audio/headsets/rog-fusion-ii-500-model/'],
  ['rog-cetra-true-wireless-pro',      'https://rog.asus.com/us/headsets-audio/in-ear-headphone/rog-cetra-true-wireless-pro-model/'],
  ['rog-ryujin-iii-360',               'https://rog.asus.com/us/cpu-cooling/rog-ryujin/rog-ryujin-iii-360-argb-model/'],
  ['rog-strix-lc-iii-360',             'https://rog.asus.com/us/cpu-cooling/rog-strix-lc/rog-strix-lc-iii-360-argb-model/'],
  ['rog-hyperion-gr701-btf',           'https://rog.asus.com/us/cases/rog-hyperion/rog-hyperion-gr701-btf-model/'],
  ['rog-strix-helios-gx601-white',     'https://rog.asus.com/us/cases/rog-strix-helios/rog-strix-helios-gx601-white-edition-model/'],
  ['rog-rapture-gt-be98-wifi7',        'https://rog.asus.com/us/networking/rog-rapture/rog-rapture-gt-be98-model/'],
  ['rog-rapture-gt-ax11000-pro',       'https://rog.asus.com/us/networking/rog-rapture/rog-rapture-gt-ax11000-pro-model/'],
  ['rog-rapture-gt-ax6000',            'https://rog.asus.com/us/networking/rog-rapture/rog-rapture-gt-ax6000-model/'],
  ['rog-strix-gs-ax5400',              'https://rog.asus.com/us/networking/rog-strix/rog-strix-gs-ax5400-model/'],
  ['rog-lancer-ddr5-6000-32gb',        'https://rog.asus.com/us/memory/rog-lancer/rog-lancer-ddr5-6000-model/'],
  ['rog-lancer-ddr5-6000-16gb',        'https://rog.asus.com/us/memory/rog-lancer/rog-lancer-ddr5-6000-model/'],
  ['rog-strix-ddr4-3600-32gb',         'https://rog.asus.com/us/memory/rog-strix/rog-strix-ddr4-3600-model/'],
  ['rog-thor-1tb-pcie5',               'https://rog.asus.com/us/solid-state-drive/rog-thor/rog-thor-ssd-model/'],
  ['rog-strix-sq7-2tb',                'https://rog.asus.com/us/solid-state-drive/rog-strix/rog-strix-sq7-model/'],
  ['rog-strix-sq7-1tb',                'https://rog.asus.com/us/solid-state-drive/rog-strix/rog-strix-sq7-model/'],
];

console.error('Fetching ROG pages...');
const rogResults = await Promise.all(rogPages.map(async ([slug, url]) => {
  const html = await get(url);
  return { slug, img: extractImg(html) };
}));

console.error('Testing MSI CDN URLs...');
const msiResults = await Promise.all(msiProducts.map(async ([slug, code]) => {
  const img = await tryMsiCdn(code);
  return { slug, img };
}));

const all = [...rogResults, ...msiResults];
console.log(JSON.stringify(all));
