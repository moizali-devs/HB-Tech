/**
 * Migrates all product images from external CDNs (ASUS, etc.)
 * into Supabase Storage (Mumbai region — fast for Pakistan).
 *
 * Run once: node scripts/migrate-images.mjs
 */

import https from 'https';
import http from 'http';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://fezlxkwwfjwwmqmgywar.supabase.co',
  // Service role key (needed for storage writes)
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlemx4a3d3Zmp3d21xbWd5d2FyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjgyMTA4MSwiZXhwIjoyMDg4Mzk3MDgxfQ.NwXqdmHZPxkFaHMfVoXhEk9HFvFJhXaLHO4kFvFzXEo'
);

function download(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({
        buffer: Buffer.concat(chunks),
        contentType: res.headers['content-type'] || 'image/png',
      }));
    }).on('error', reject);
  });
}

// Fetch all products that have external images
const { data: products } = await supabase
  .from('products')
  .select('id, slug, images')
  .not('images', 'eq', '{}');

console.log(`Found ${products.length} products with images to migrate`);

let migrated = 0;
let failed = 0;

for (const product of products) {
  const newImages = [];

  for (const imgUrl of product.images) {
    // Skip if already on Supabase
    if (imgUrl.includes('supabase.co')) {
      newImages.push(imgUrl);
      continue;
    }

    try {
      console.log(`  Downloading: ${product.slug}`);
      const { buffer, contentType } = await download(imgUrl);
      const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
      const fileName = `products/${product.slug}.${ext}`;

      const { error } = await supabase.storage
        .from('product-images')
        .upload(fileName, buffer, {
          contentType,
          upsert: true,
          cacheControl: '31536000', // 1 year cache
        });

      if (error) {
        console.error(`  Upload failed for ${product.slug}:`, error.message);
        newImages.push(imgUrl); // keep original
        failed++;
      } else {
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
        newImages.push(data.publicUrl);
        migrated++;
        console.log(`  ✓ ${product.slug}`);
      }
    } catch (err) {
      console.error(`  Download failed for ${product.slug}:`, err.message);
      newImages.push(imgUrl);
      failed++;
    }
  }

  // Update the product with new image URLs
  await supabase
    .from('products')
    .update({ images: newImages })
    .eq('id', product.id);
}

console.log(`\nDone. Migrated: ${migrated}, Failed: ${failed}`);
