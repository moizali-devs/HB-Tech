import https from 'https';

// All confirmed image URLs collected across all fetch sessions
const imageMap = {
  // ── ROG Motherboards ─────────────────────────────
  'rog-maximus-z790-hero':          'https://dlcdnwebimgs.asus.com/gain/A3777166-EF70-4D33-915B-EC65CF77CAE5',
  'rog-strix-z790-e-gaming-wifi':   'https://dlcdnwebimgs.asus.com/gain/A14B0E0C-2EF6-4A28-9E30-089DCE5BF278',
  'rog-strix-b760-f-gaming-wifi':   'https://dlcdnwebimgs.asus.com/gain/69159885-AADB-444B-B17B-C1809F91A343',
  'rog-crosshair-x670e-hero':       'https://dlcdnwebimgs.asus.com/gain/F17834FA-586C-40FA-A2AD-24D07A3431A0',
  'rog-strix-b650e-gaming-wifi':    'https://dlcdnwebimgs.asus.com/gain/566A4DF8-85E5-4958-9CEE-21F4629E53AB',
  'rog-strix-z690-a-gaming-wifi-d4':'https://dlcdnwebimgs.asus.com/gain/FB48BC7C-8F85-4D70-9BF7-0DCB46804069',
  // ── ROG GPUs ─────────────────────────────────────
  'rog-strix-rtx-4090-oc':          'https://dlcdnwebimgs.asus.com/gain/EFF9D6D8-2F6C-4E76-989F-E5DB594052BA',
  'rog-strix-rtx-4080-super-oc':    'https://dlcdnwebimgs.asus.com/gain/CD41F925-4CD0-4D43-8722-0BBA1953E46D',
  'rog-strix-rtx-4070-ti-super-oc': 'https://dlcdnwebimgs.asus.com/gain/E0F17D10-DCBB-4681-BA9B-9045E5F7D1F2',
  'rog-strix-rtx-4070-super-oc':    'https://dlcdnwebimgs.asus.com/gain/0B774449-F209-469E-9876-8E2DB6BE658B',
  'rog-strix-rtx-4060-ti-oc':       'https://dlcdnwebimgs.asus.com/gain/BEE1D3BF-C32E-4370-B21B-F6AC49D484C6',
  'rog-strix-rtx-3080-oc':          'https://dlcdnwebimgs.asus.com/gain/18306F07-8796-408A-94DF-316149D3E5B9',
  // ── ROG Monitors ─────────────────────────────────
  'rog-swift-pg279qm':              'https://dlcdnwebimgs.asus.com/gain/72C16A36-4EE3-4AC4-A58A-35F6B8A2FB6F',
  'rog-strix-xg27aqm':              'https://dlcdnwebimgs.asus.com/gain/926C60B6-01FC-4147-B4CC-8AD9F3EFADF2',
  'rog-strix-xg27uqr':              'https://dlcdnwebimgs.asus.com/gain/1FBE116D-1688-423B-8EE7-5E88E86FD892',
  // ── ROG Laptops ──────────────────────────────────
  'rog-zephyrus-g16-2024-rtx4090':  'https://dlcdnwebimgs.asus.com/gain/CD8E933A-10C0-4E13-91D3-AB4A248A19A1',
  'rog-zephyrus-g14-2024':          'https://dlcdnwebimgs.asus.com/gain/E0275281-F18B-42C3-A025-3331C35A888F',
  'rog-strix-g16-2024':             'https://dlcdnwebimgs.asus.com/gain/C0280928-8FA3-4166-8F3F-FDEB3FBF0CDF',
  // ── ROG Mice ─────────────────────────────────────
  'rog-chakram-x-origin-wireless':  'https://dlcdnwebimgs.asus.com/gain/1D8DDBF3-F053-40BB-96F4-CD8712A80EEB',
  'rog-gladius-iii-wireless':       'https://dlcdnwebimgs.asus.com/gain/293663B4-274A-413F-AE7F-3F343BCC4C51',
  'rog-keris-ii-ace-wireless':      'https://dlcdnwebimgs.asus.com/gain/9B783ACB-999D-41F3-AC55-7859FB30C90B',
  'rog-harpe-ace-aim-lab':          'https://dlcdnwebimgs.asus.com/gain/0F9B888C-4649-4829-B3C9-BDD8734907A4',
  'rog-strix-impact-iii-wireless':  'https://dlcdnwebimgs.asus.com/gain/D23E776A-0090-43C8-8937-3918EE73C42F',
  // ── ROG Keyboards ────────────────────────────────
  'rog-azoth-wireless':             'https://dlcdnwebimgs.asus.com/gain/145896AC-B462-4466-A1FE-935F085741F3',
  'rog-falchion-ace-wireless':      'https://dlcdnwebimgs.asus.com/gain/BAA03A74-6267-44B5-BFC7-22136E9AF51D',
  'rog-claymore-ii-wireless':       'https://dlcdnwebimgs.asus.com/gain/7BDBE811-9350-400C-BE5E-AB1614972EC4',
  'rog-strix-flare-ii-animate':     'https://dlcdnwebimgs.asus.com/gain/7001B47D-BD67-4A07-BD1D-0ECE65169330',
  // ── ROG Headsets ─────────────────────────────────
  'rog-delta-s-wireless':           'https://dlcdnwebimgs.asus.com/gain/F223AA9E-DC85-421B-990A-EA07C27D19E5',
  'rog-strix-go-2-4':               'https://dlcdnwebimgs.asus.com/gain/B47A68E6-068E-47C6-A67A-84DDC7C7D733',
  'rog-fusion-ii-500':              'https://dlcdnwebimgs.asus.com/gain/0B6F7E0D-DE7D-48BC-BBB1-75F35E2D5CC9',
  'rog-cetra-true-wireless-pro':    'https://dlcdnwebimgs.asus.com/gain/DDB1FED2-DAD2-4BB3-9F9F-7449831E0B51',
  // ── ROG Power Supplies ───────────────────────────
  'rog-thor-1000w-platinum-ii':     'https://dlcdnwebimgs.asus.com/gain/F40C3AEA-D458-41E6-BF27-045C0C8D5086',
  'rog-strix-850w-gold':            'https://dlcdnwebimgs.asus.com/gain/ECB79DEC-A4F3-4F96-9411-6D2690B8E573',
  // ── ROG Cooling ──────────────────────────────────
  'rog-ryujin-iii-360':             'https://dlcdnwebimgs.asus.com/gain/1DBF119B-0A69-4AB1-B1C3-3B80EE800200',
  'rog-strix-lc-iii-360':           'https://dlcdnwebimgs.asus.com/gain/2C8479A2-448A-4643-B5CE-578B44E37792',
};

// Build SQL
const setClauses = Object.entries(imageMap).map(([slug, img]) =>
  `WHEN slug = '${slug}' THEN ARRAY['${img}']`
).join('\n  ');

const slugList = Object.keys(imageMap).map(s => `'${s}'`).join(', ');

const sql = `
UPDATE products
SET images = CASE
  ${setClauses}
  ELSE images
END
WHERE slug IN (${slugList});
`;

// Run via Supabase Management API
function runSQL(query) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ query });
    const req = https.request({
      hostname: 'api.supabase.com',
      path: '/v1/projects/fezlxkwwfjwwmqmgywar/database/query',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer sbp_cd0fc8c6d0ffe3b265014d48c103abf36594b6c1',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', e => resolve({ status: 0, body: e.message }));
    req.write(body);
    req.end();
  });
}

console.log(`Updating ${Object.keys(imageMap).length} products with images...`);
const result = await runSQL(sql);
console.log('Status:', result.status, result.body.slice(0, 200));

// Verify
const check = await runSQL("SELECT count(*) as updated FROM products WHERE array_length(images, 1) > 0;");
console.log('Products with images now:', check.body);
