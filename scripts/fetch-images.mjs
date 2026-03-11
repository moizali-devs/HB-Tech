import https from 'https';

function fetchImg(slug, url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122' }
    }, (res) => {
      if ([301,302,307,308].includes(res.statusCode) && res.headers.location) {
        const loc = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href;
        return fetchImg(slug, loc).then(resolve);
      }
      let d = '';
      res.on('data', c => { if (d.length < 60000) d += c; });
      res.on('end', () => {
        const m = d.match(/https?:\/\/dlcdnwebimgs\.asus\.com\/gain\/[A-Za-z0-9\-]+/i);
        resolve({ slug, img: m ? m[0] : null });
      });
    });
    req.on('error', () => resolve({ slug, img: null }));
    req.setTimeout(12000, () => { req.destroy(); resolve({ slug, img: null }); });
  });
}

// Already-known ROG image URLs (from previous fetches)
const known = [
  ['rog-maximus-z790-hero',          'https://dlcdnwebimgs.asus.com/gain/A3777166-EF70-4D33-915B-EC65CF77CAE5'],
  ['rog-strix-z790-e-gaming-wifi',   'https://dlcdnwebimgs.asus.com/gain/A14B0E0C-2EF6-4A28-9E30-089DCE5BF278'],
  ['rog-strix-b760-f-gaming-wifi',   'https://dlcdnwebimgs.asus.com/gain/69159885-AADB-444B-B17B-C1809F91A343'],
  ['rog-crosshair-x670e-hero',       'https://dlcdnwebimgs.asus.com/gain/F17834FA-586C-40FA-A2AD-24D07A3431A0'],
  ['rog-strix-b650e-gaming-wifi',    'https://dlcdnwebimgs.asus.com/gain/566A4DF8-85E5-4958-9CEE-21F4629E53AB'],
  ['rog-strix-z690-a-gaming-wifi-d4','https://dlcdnwebimgs.asus.com/gain/FB48BC7C-8F85-4D70-9BF7-0DCB46804069'],
  ['rog-strix-rtx-4090-oc',         'https://dlcdnwebimgs.asus.com/gain/EFF9D6D8-2F6C-4E76-989F-E5DB594052BA'],
  ['rog-strix-rtx-3080-oc',         'https://dlcdnwebimgs.asus.com/gain/18306F07-8796-408A-94DF-316149D3E5B9'],
  ['rog-swift-pg279qm',             'https://dlcdnwebimgs.asus.com/gain/72C16A36-4EE3-4AC4-A58A-35F6B8A2FB6F'],
  ['rog-strix-xg27aqm',             'https://dlcdnwebimgs.asus.com/gain/926C60B6-01FC-4147-B4CC-8AD9F3EFADF2'],
  ['rog-strix-xg27uqr',             'https://dlcdnwebimgs.asus.com/gain/1FBE116D-1688-423B-8EE7-5E88E86FD892'],
  ['rog-thor-1000w-platinum-ii',    'https://dlcdnwebimgs.asus.com/gain/F40C3AEA-D458-41E6-BF27-045C0C8D5086'],
  ['rog-strix-850w-gold',           'https://dlcdnwebimgs.asus.com/gain/ECB79DEC-A4F3-4F96-9411-6D2690B8E573'],
];

// Pages to fetch for ROG
const rogToFetch = [
  ['rog-strix-rtx-4080-super-oc',      'https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx4080s-o16g-gaming-model/'],
  ['rog-strix-rtx-4070-ti-super-oc',   'https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx4070tis-o16g-gaming-model/'],
  ['rog-strix-rtx-4070-super-oc',      'https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx4070s-o12g-gaming-model/'],
  ['rog-strix-rtx-4060-ti-oc',         'https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx4060ti-o8g-gaming-model/'],
  ['rog-strix-rx-7900-xtx-oc',         'https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rxw7900xtx-o24g-gaming-model/'],
  ['rog-swift-pro-pg248qp',            'https://rog.asus.com/monitors/24-to-27-inches/rog-swift-pro-pg248qp-model/'],
  ['rog-strix-xg32aq',                 'https://rog.asus.com/monitors/32-and-above/rog-strix-xg32aq-model/'],
  ['rog-zephyrus-g16-2024-rtx4090',    'https://rog.asus.com/laptops/rog-zephyrus/rog-zephyrus-g16-2024-series/rog-zephyrus-g16-2024-gu605mz-model/'],
  ['rog-strix-scar-17-2024',           'https://rog.asus.com/laptops/rog-strix/rog-strix-scar-17-2024-series/rog-strix-scar-17-2024-g733pyr-model/'],
  ['rog-zephyrus-g14-2024',            'https://rog.asus.com/laptops/rog-zephyrus/rog-zephyrus-g14-2024-series/rog-zephyrus-g14-2024-ga403uv-model/'],
  ['rog-flow-x13-2024',                'https://rog.asus.com/laptops/rog-flow/rog-flow-x13-2024-series/rog-flow-x13-2024-gv302xv-model/'],
  ['rog-strix-g16-2024',               'https://rog.asus.com/laptops/rog-strix/rog-strix-g16-2024-series/rog-strix-g16-2024-g614jvr-model/'],
  ['rog-chakram-x-origin-wireless',    'https://rog.asus.com/mice-mouse-pads/mice/gaming/rog-chakram-x-origin-model/'],
  ['rog-gladius-iii-wireless',         'https://rog.asus.com/mice-mouse-pads/mice/gaming/rog-gladius-iii-wireless-aimpoint-model/'],
  ['rog-keris-ii-ace-wireless',        'https://rog.asus.com/mice-mouse-pads/mice/gaming/rog-keris-ii-ace-wireless-model/'],
  ['rog-harpe-ace-aim-lab',            'https://rog.asus.com/mice-mouse-pads/mice/gaming/rog-harpe-ace-aim-lab-edition-model/'],
  ['rog-strix-impact-iii-wireless',    'https://rog.asus.com/mice-mouse-pads/mice/gaming/rog-strix-impact-iii-wireless-model/'],
  ['rog-azoth-wireless',               'https://rog.asus.com/keyboards/keyboards/all-series/rog-azoth-model/'],
  ['rog-falchion-ace-wireless',        'https://rog.asus.com/keyboards/keyboards/all-series/rog-falchion-ace-model/'],
  ['rog-claymore-ii-wireless',         'https://rog.asus.com/keyboards/keyboards/all-series/rog-claymore-ii-model/'],
  ['rog-strix-scope-ii-rx-tkl',        'https://rog.asus.com/keyboards/keyboards/all-series/rog-strix-scope-ii-rx-tkl-model/'],
  ['rog-strix-flare-ii-animate',       'https://rog.asus.com/keyboards/keyboards/all-series/rog-strix-flare-ii-animate-model/'],
  ['rog-delta-s-wireless',             'https://rog.asus.com/headsets-audio/headsets/rog-delta-s-wireless-model/'],
  ['rog-strix-go-2-4',                 'https://rog.asus.com/headsets-audio/headsets/rog-strix-go-2-4-model/'],
  ['rog-fusion-ii-500',                'https://rog.asus.com/headsets-audio/headsets/rog-fusion-ii-500-model/'],
  ['rog-cetra-true-wireless-pro',      'https://rog.asus.com/headsets-audio/in-ear-headphone/rog-cetra-true-wireless-pro-model/'],
  ['rog-ryujin-iii-360',               'https://rog.asus.com/cpu-cooling/rog-ryujin/rog-ryujin-iii-360-argb-model/'],
  ['rog-strix-lc-iii-360',             'https://rog.asus.com/cpu-cooling/rog-strix-lc/rog-strix-lc-iii-360-argb-model/'],
  ['rog-hyperion-gr701-btf',           'https://rog.asus.com/cases/rog-hyperion/rog-hyperion-gr701-btf-model/'],
  ['rog-strix-helios-gx601-white',     'https://rog.asus.com/cases/rog-strix-helios/rog-strix-helios-gx601-white-edition-model/'],
  ['rog-rapture-gt-be98-wifi7',        'https://rog.asus.com/networking/rog-rapture/rog-rapture-gt-be98-model/'],
  ['rog-rapture-gt-ax11000-pro',       'https://rog.asus.com/networking/rog-rapture/rog-rapture-gt-ax11000-pro-model/'],
  ['rog-rapture-gt-ax6000',            'https://rog.asus.com/networking/rog-rapture/rog-rapture-gt-ax6000-model/'],
  ['rog-strix-gs-ax5400',              'https://rog.asus.com/networking/rog-strix/rog-strix-gs-ax5400-model/'],
  ['rog-lancer-ddr5-6000-32gb',        'https://rog.asus.com/memory/rog-lancer/rog-lancer-ddr5-6000-model/'],
  ['rog-lancer-ddr5-6000-16gb',        'https://rog.asus.com/memory/rog-lancer/rog-lancer-ddr5-6000-model/'],
  ['rog-strix-ddr4-3600-32gb',         'https://rog.asus.com/memory/rog-strix/rog-strix-ddr4-3600-model/'],
  ['rog-thor-1tb-pcie5',               'https://rog.asus.com/solid-state-drive/rog-thor/rog-thor-ssd-model/'],
  ['rog-strix-sq7-2tb',                'https://rog.asus.com/solid-state-drive/rog-strix/rog-strix-sq7-model/'],
  ['rog-strix-sq7-1tb',                'https://rog.asus.com/solid-state-drive/rog-strix/rog-strix-sq7-model/'],
];

// MSI product pages
function fetchMsiImg(slug, url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122' }
    }, (res) => {
      if ([301,302,307,308].includes(res.statusCode) && res.headers.location) {
        const loc = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href;
        return fetchMsiImg(slug, loc).then(resolve);
      }
      let d = '';
      res.on('data', c => { if (d.length < 60000) d += c; });
      res.on('end', () => {
        const m = d.match(/https?:\/\/storage-asset\.msi\.com\/[^\s"'<>]+\.(jpg|png|webp)/i)
               || d.match(/https?:\/\/[^\s"'<>]*msi[^\s"'<>]+\.(jpg|png|webp)/i)
               || d.match(/content="(https?:\/\/[^"]+\.(jpg|png|webp))"/i);
        resolve({ slug, img: m ? (m[1] || m[0]) : null });
      });
    });
    req.on('error', () => resolve({ slug, img: null }));
    req.setTimeout(12000, () => { req.destroy(); resolve({ slug, img: null }); });
  });
}

const msiToFetch = [
  ['msi-meg-z790-ace',                'https://www.msi.com/Motherboard/MEG-Z790-ACE'],
  ['msi-mag-z790-tomahawk-wifi',      'https://www.msi.com/Motherboard/MAG-Z790-TOMAHAWK-WIFI'],
  ['msi-pro-b760m-a-wifi',            'https://www.msi.com/Motherboard/PRO-B760M-A-WIFI'],
  ['msi-mag-b760-mortar-wifi-ddr5',   'https://www.msi.com/Motherboard/MAG-B760-MORTAR-WIFI'],
  ['msi-mpg-x670e-carbon-wifi',       'https://www.msi.com/Motherboard/MPG-X670E-CARBON-WIFI'],
  ['msi-mag-b650-tomahawk-wifi',      'https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI'],
  ['msi-rtx-4090-gaming-x-trio',      'https://www.msi.com/Graphics-Card/GeForce-RTX-4090-GAMING-X-TRIO-24G'],
  ['msi-rtx-4080-super-gaming-x-slim','https://www.msi.com/Graphics-Card/GeForce-RTX-4080-SUPER-16G-GAMING-X-SLIM'],
  ['msi-rtx-4070-ti-super-gaming-x-trio','https://www.msi.com/Graphics-Card/GeForce-RTX-4070-Ti-SUPER-16G-GAMING-X-TRIO'],
  ['msi-rtx-4070-gaming-x-trio',      'https://www.msi.com/Graphics-Card/GeForce-RTX-4070-GAMING-X-TRIO-12G'],
  ['msi-rtx-4060-gaming-x',           'https://www.msi.com/Graphics-Card/GeForce-RTX-4060-GAMING-X-8G'],
  ['msi-rx-7900-gre-gaming-x-trio',   'https://www.msi.com/Graphics-Card/Radeon-RX-7900-GRE-GAMING-X-TRIO-16G'],
  ['msi-rx-7600-gaming-x',            'https://www.msi.com/Graphics-Card/Radeon-RX-7600-GAMING-X-8G'],
  ['msi-meg-342c-qd-oled',            'https://www.msi.com/Monitor/MEG-342C-QD-OLED'],
  ['msi-mpg-321urx-qd-oled',          'https://www.msi.com/Monitor/MPG-321URX-QD-OLED'],
  ['msi-mag-274qrf-qd',               'https://www.msi.com/Monitor/MAG-274QRF-QD'],
  ['msi-g274qpf-e2',                  'https://www.msi.com/Monitor/G274QPF-E2'],
  ['msi-g241-24-fhd-144hz',           'https://www.msi.com/Monitor/G241'],
  ['msi-titan-gt77-hx-rtx4090',       'https://www.msi.com/Laptop/GT77-HX-13V'],
  ['msi-raider-ge78-hx-rtx4080',      'https://www.msi.com/Laptop/Raider-GE78-HX-14V'],
  ['msi-stealth-16-mercedes-amg',     'https://www.msi.com/Laptop/Stealth-16-Mercedes-AMG-Motorsport-A13V'],
  ['msi-katana-15-rtx4060',           'https://www.msi.com/Laptop/Katana-15-B13V'],
  ['msi-cyborg-15-rtx4050',           'https://www.msi.com/Laptop/Cyborg-15-A13V'],
  ['msi-clutch-gm41-lightweight-wireless','https://www.msi.com/Gaming-Gear/Clutch-GM41-LIGHTWEIGHT-WIRELESS'],
  ['msi-clutch-gm51-lightweight-wireless','https://www.msi.com/Gaming-Gear/Clutch-GM51-LIGHTWEIGHT-WIRELESS'],
  ['msi-clutch-gm30',                 'https://www.msi.com/Gaming-Gear/Clutch-GM30'],
  ['msi-clutch-gm08',                 'https://www.msi.com/Gaming-Gear/Clutch-GM08'],
  ['msi-accolade-em30',               'https://www.msi.com/Gaming-Gear/Accolade-EM30'],
  ['msi-vigor-gk71-sonic-red',        'https://www.msi.com/Gaming-Gear/Vigor-GK71-SONIC'],
  ['msi-vigor-gk50-elite-tkl',        'https://www.msi.com/Gaming-Gear/Vigor-GK50-ELITE-TKL'],
  ['msi-vigor-gk30',                  'https://www.msi.com/Gaming-Gear/Vigor-GK30'],
  ['msi-vigor-gk20',                  'https://www.msi.com/Gaming-Gear/Vigor-GK20'],
  ['msi-vigor-gk60-tkl',              'https://www.msi.com/Gaming-Gear/Vigor-GK60'],
  ['msi-immerse-gh50-wireless',       'https://www.msi.com/Gaming-Gear/Immerse-GH50-Wireless'],
  ['msi-immerse-gh30-v2',             'https://www.msi.com/Gaming-Gear/Immerse-GH30-V2'],
  ['msi-immerse-gh20',                'https://www.msi.com/Gaming-Gear/Immerse-GH20'],
  ['msi-immerse-hs01-wireless',       'https://www.msi.com/Gaming-Gear/Immerse-HS01'],
  ['msi-parity-ddr5-5600-32gb',       'https://www.msi.com/Memory/Parity-DDR5'],
  ['msi-parity-ddr5-4800-16gb',       'https://www.msi.com/Memory/Parity-DDR5'],
  ['msi-ddr4-3200-16gb',              'https://www.msi.com/Memory/Parity-DDR4'],
  ['msi-spatium-m570-pro-2tb',        'https://www.msi.com/Storage/SPATIUM-M570-PRO-PCIe-5.0-NVMe-M.2'],
  ['msi-spatium-m470-1tb',            'https://www.msi.com/Storage/SPATIUM-M470-PCIe-4.0-NVMe-M.2'],
  ['msi-spatium-s270-480gb',          'https://www.msi.com/Storage/SPATIUM-S270-SATA-2.5'],
  ['msi-mpg-a1000g-pcie5',            'https://www.msi.com/Power-Supply/MPG-A1000G-PCIE5'],
  ['msi-mag-a650bn',                  'https://www.msi.com/Power-Supply/MAG-A650BN'],
  ['msi-mag-coreliquid-360r-v2',      'https://www.msi.com/Liquid-Cooling/MAG-CoreLiquid-360R-V2'],
  ['msi-mag-coreliquid-240r-v2',      'https://www.msi.com/Liquid-Cooling/MAG-CoreLiquid-240R-V2'],
  ['msi-meg-prospect-700r',           'https://www.msi.com/PC-Case/MEG-PROSPECT-700R'],
  ['msi-mag-forge-320r-airflow',      'https://www.msi.com/PC-Case/MAG-FORGE-320R-AIRFLOW'],
];

const rogFetched = await Promise.all(rogToFetch.map(([s,u]) => fetchImg(s,u)));
const msiFetched = await Promise.all(msiToFetch.map(([s,u]) => fetchMsiImg(s,u)));

const all = [
  ...known.map(([slug, img]) => ({ slug, img })),
  ...rogFetched,
  ...msiFetched,
];

console.log(JSON.stringify(all));
