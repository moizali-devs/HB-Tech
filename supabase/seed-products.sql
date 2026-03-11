-- ============================================================
-- HB Tech & Gaming — Product Seed Data
-- ROG & MSI (~100 products across all categories)
-- Run this in the Supabase SQL Editor AFTER schema.sql
-- ============================================================

INSERT INTO products (name, slug, description, price, compare_price, category_id, condition, stock, images, featured, active) VALUES

-- ══════════════════════════════════════════════════════════════
-- MOTHERBOARDS (12 products)
-- ══════════════════════════════════════════════════════════════

('ROG Maximus Z790 Hero',
 'rog-maximus-z790-hero',
 'ROG flagship Z790 motherboard for Intel 13th & 14th Gen. PCIe 5.0, Wi-Fi 6E, 2.5G LAN, Thunderbolt 4, 20+1 power stages, and premium overclocking tools.',
 188000, 205000,
 (SELECT id FROM categories WHERE slug = 'motherboards'),
 'new', 4, '{}', true, true),

('ROG Strix Z790-E Gaming WiFi',
 'rog-strix-z790-e-gaming-wifi',
 'High-performance Z790 board with Wi-Fi 6E, PCIe 5.0 M.2, Thunderbolt 4 header, and 18+1 power stages. Built for serious gaming and content creation.',
 138000, 152000,
 (SELECT id FROM categories WHERE slug = 'motherboards'),
 'new', 6, '{}', false, true),

('ROG Strix B760-F Gaming WiFi',
 'rog-strix-b760-f-gaming-wifi',
 'Mid-range ROG Strix board for Intel 12th/13th/14th Gen. PCIe 4.0 M.2, Wi-Fi 6E, 2.5G LAN, and robust VRM for solid everyday performance.',
 72000, 82000,
 (SELECT id FROM categories WHERE slug = 'motherboards'),
 'new', 10, '{}', false, true),

('ROG Crosshair X670E Hero',
 'rog-crosshair-x670e-hero',
 'Premium AM5 platform motherboard with PCIe 5.0 for CPU and M.2, Wi-Fi 6E, 20+2 power stages, and full support for AMD Ryzen 7000 series.',
 162000, 178000,
 (SELECT id FROM categories WHERE slug = 'motherboards'),
 'new', 3, '{}', true, true),

('ROG Strix B650E-F Gaming WiFi',
 'rog-strix-b650e-gaming-wifi',
 'AM5 motherboard with PCIe 5.0 M.2 support, Wi-Fi 6E, 2.5G LAN, and strong power delivery for AMD Ryzen 7000 CPUs at a competitive price.',
 82000, 92000,
 (SELECT id FROM categories WHERE slug = 'motherboards'),
 'new', 7, '{}', false, true),

('ROG Strix Z690-A Gaming WiFi D4',
 'rog-strix-z690-a-gaming-wifi-d4',
 'Intel Z690 board supporting DDR4 memory with 16+1 power stages, PCIe 5.0 primary slot, Wi-Fi 6E, and clean white aesthetic.',
 78000, 88000,
 (SELECT id FROM categories WHERE slug = 'motherboards'),
 'used', 2, '{}', false, true),

('MSI MEG Z790 ACE',
 'msi-meg-z790-ace',
 'MSI flagship Z790 motherboard with 24+1+1 power stages, PCIe 5.0, Wi-Fi 6E, 10G LAN, Thunderbolt 4, and full EXPO/XMP support.',
 148000, 165000,
 (SELECT id FROM categories WHERE slug = 'motherboards'),
 'new', 3, '{}', true, true),

('MSI MAG Z790 Tomahawk WiFi',
 'msi-mag-z790-tomahawk-wifi',
 'Reliable Z790 board with 16+1+1 power stages, PCIe 5.0 M.2, Wi-Fi 6E, 2.5G LAN, and tool-free M.2 shield. Great value flagship alternative.',
 82000, 92000,
 (SELECT id FROM categories WHERE slug = 'motherboards'),
 'new', 8, '{}', false, true),

('MSI MPG X670E Carbon WiFi',
 'msi-mpg-x670e-carbon-wifi',
 'High-end AM5 board with 18+2+1 power stages, PCIe 5.0 for CPU and M.2, Wi-Fi 6E, 2.5G LAN, and MSI Center software.',
 112000, 125000,
 (SELECT id FROM categories WHERE slug = 'motherboards'),
 'new', 5, '{}', false, true),

('MSI MAG B650 Tomahawk WiFi',
 'msi-mag-b650-tomahawk-wifi',
 'Solid mid-range AM5 board for Ryzen 7000 with 14+2+1 power stages, PCIe 4.0 M.2, Wi-Fi 6E, and 2.5G LAN.',
 58000, 66000,
 (SELECT id FROM categories WHERE slug = 'motherboards'),
 'new', 12, '{}', false, true),

('MSI Pro B760M-A WiFi',
 'msi-pro-b760m-a-wifi',
 'Compact Micro-ATX Intel B760 board with Wi-Fi 6, 2.5G LAN, dual M.2 slots, and DDR5 support. Perfect for compact gaming builds.',
 38000, 44000,
 (SELECT id FROM categories WHERE slug = 'motherboards'),
 'new', 15, '{}', false, true),

('MSI MAG B760 Mortar WiFi DDR5',
 'msi-mag-b760-mortar-wifi-ddr5',
 'B760 mid-range board with DDR5 support, PCIe 4.0 M.2 slots, Wi-Fi 6E, 2.5G LAN, and military-grade components for long-term reliability.',
 52000, 60000,
 (SELECT id FROM categories WHERE slug = 'motherboards'),
 'new', 9, '{}', false, true),


-- ══════════════════════════════════════════════════════════════
-- GRAPHICS CARDS (14 products)
-- ══════════════════════════════════════════════════════════════

('ROG Strix GeForce RTX 4090 OC 24GB',
 'rog-strix-rtx-4090-oc',
 'The ultimate gaming GPU. ROG Strix custom cooler with triple fans, 2.6GHz boost clock OC, 24GB GDDR6X, and full PCIe 5.0 connector support.',
 520000, 560000,
 (SELECT id FROM categories WHERE slug = 'graphics-cards'),
 'new', 2, '{}', true, true),

('ROG Strix GeForce RTX 4080 Super OC 16GB',
 'rog-strix-rtx-4080-super-oc',
 'ROG Strix RTX 4080 Super with enhanced Axial-tech fans, 2625MHz boost, and 16GB GDDR6X. Exceptional 4K performance.',
 320000, 345000,
 (SELECT id FROM categories WHERE slug = 'graphics-cards'),
 'new', 3, '{}', true, true),

('ROG Strix GeForce RTX 4070 Ti Super OC 16GB',
 'rog-strix-rtx-4070-ti-super-oc',
 '16GB GDDR6X memory, triple Axial-tech fans, 2670MHz boost clock OC. Dominates 1440p and handles 4K with ease.',
 235000, 255000,
 (SELECT id FROM categories WHERE slug = 'graphics-cards'),
 'new', 4, '{}', true, true),

('ROG Strix GeForce RTX 4070 Super OC 12GB',
 'rog-strix-rtx-4070-super-oc',
 'Supercharged 1440p gaming. 12GB GDDR6X, 2535MHz OC boost, ROG Strix triple-fan cooling. Outstanding performance-per-watt.',
 175000, 192000,
 (SELECT id FROM categories WHERE slug = 'graphics-cards'),
 'new', 5, '{}', false, true),

('ROG Strix GeForce RTX 4060 Ti OC 8GB',
 'rog-strix-rtx-4060-ti-oc',
 'DLSS 3.0, Frame Generation, and AV1 encoding in ROG Strix form. 8GB GDDR6, 2595MHz OC, triple fan. Ideal 1440p entry GPU.',
 118000, 130000,
 (SELECT id FROM categories WHERE slug = 'graphics-cards'),
 'new', 8, '{}', false, true),

('ROG Strix GeForce RTX 3080 OC 10GB',
 'rog-strix-rtx-3080-oc',
 'Previous-gen powerhouse now available at a great price. 10GB GDDR6X, triple-fan ROG cooling, excellent 4K gaming card.',
 145000, 175000,
 (SELECT id FROM categories WHERE slug = 'graphics-cards'),
 'used', 2, '{}', false, true),

('ROG Strix Radeon RX 7900 XTX OC 24GB',
 'rog-strix-rx-7900-xtx-oc',
 '24GB GDDR6, PCIe 4.0, DisplayPort 2.1, ROG Strix triple-fan cooling. AMD''s flagship in ROG''s best thermal package.',
 285000, 310000,
 (SELECT id FROM categories WHERE slug = 'graphics-cards'),
 'new', 3, '{}', false, true),

('MSI GeForce RTX 4090 Gaming X Trio 24GB',
 'msi-rtx-4090-gaming-x-trio',
 'MSI flagship with TORX Fan 4.0 triple cooling, 2610MHz boost, 24GB GDDR6X. One of the best cooled RTX 4090 cards available.',
 505000, 545000,
 (SELECT id FROM categories WHERE slug = 'graphics-cards'),
 'new', 2, '{}', true, true),

('MSI GeForce RTX 4080 Super Gaming X Slim 16GB',
 'msi-rtx-4080-super-gaming-x-slim',
 'Slim dual-fan design without sacrificing cooling. 2625MHz boost, 16GB GDDR6X, compact enough for small form-factor builds.',
 308000, 335000,
 (SELECT id FROM categories WHERE slug = 'graphics-cards'),
 'new', 3, '{}', false, true),

('MSI GeForce RTX 4070 Ti Super Gaming X Trio 16GB',
 'msi-rtx-4070-ti-super-gaming-x-trio',
 'TORX Fan 4.0, 2670MHz boost OC, 16GB GDDR6X. Outstanding 1440p and solid 4K gaming in MSI''s premium triple-fan cooler.',
 225000, 248000,
 (SELECT id FROM categories WHERE slug = 'graphics-cards'),
 'new', 4, '{}', false, true),

('MSI GeForce RTX 4070 Gaming X Trio 12GB',
 'msi-rtx-4070-gaming-x-trio',
 '12GB GDDR6X, 2535MHz boost OC, triple-fan TORX 4.0 cooling. The sweet spot GPU for high-refresh 1440p gaming.',
 165000, 182000,
 (SELECT id FROM categories WHERE slug = 'graphics-cards'),
 'new', 6, '{}', false, true),

('MSI GeForce RTX 4060 Gaming X 8GB',
 'msi-rtx-4060-gaming-x',
 'Efficient Ada Lovelace GPU with DLSS 3, 8GB GDDR6, 2475MHz OC boost, TORX Fan 3.0 dual cooling. Perfect 1080p gaming card.',
 88000, 98000,
 (SELECT id FROM categories WHERE slug = 'graphics-cards'),
 'new', 10, '{}', false, true),

('MSI Radeon RX 7900 GRE Gaming X Trio 16GB',
 'msi-rx-7900-gre-gaming-x-trio',
 '16GB GDDR6, PCIe 4.0, DisplayPort 2.1, TORX Fan 4.0. High-performance AMD GPU at a competitive price point.',
 225000, 248000,
 (SELECT id FROM categories WHERE slug = 'graphics-cards'),
 'new', 3, '{}', false, true),

('MSI Radeon RX 7600 Gaming X 8GB',
 'msi-rx-7600-gaming-x',
 '8GB GDDR6, DisplayPort 2.1, TORX Fan 3.0 dual cooling. Efficient 1080p card with great price-to-performance ratio.',
 75000, 84000,
 (SELECT id FROM categories WHERE slug = 'graphics-cards'),
 'new', 9, '{}', false, true),


-- ══════════════════════════════════════════════════════════════
-- MONITORS (10 products)
-- ══════════════════════════════════════════════════════════════

('ROG Swift Pro PG248QP 24" 540Hz',
 'rog-swift-pro-pg248qp',
 '24" FHD, 540Hz, 0.2ms GTG, IPS panel. The fastest gaming monitor available. Built for esports professionals who need every frame.',
 168000, 185000,
 (SELECT id FROM categories WHERE slug = 'monitors'),
 'new', 3, '{}', true, true),

('ROG Swift PG279QM 27" 1440p 240Hz',
 'rog-swift-pg279qm',
 '27" QHD IPS, 240Hz, 1ms GTG, G-Sync Compatible. Stunning color accuracy with pro-level refresh rate for competitive gaming.',
 195000, 215000,
 (SELECT id FROM categories WHERE slug = 'monitors'),
 'new', 4, '{}', true, true),

('ROG Strix XG27AQM 27" 1440p 270Hz',
 'rog-strix-xg27aqm',
 '27" QHD IPS, 270Hz, 0.5ms GTG, HDR400. Adaptive Sync compatible, ELMB Sync, and DisplayHDR 400 for vivid gaming sessions.',
 128000, 142000,
 (SELECT id FROM categories WHERE slug = 'monitors'),
 'new', 5, '{}', false, true),

('ROG Strix XG32AQ 32" 1440p 175Hz',
 'rog-strix-xg32aq',
 '32" WQHD IPS, 175Hz, 1ms GTG, DisplayHDR 600. Wide color gamut and impressive size for immersive single-player experiences.',
 115000, 128000,
 (SELECT id FROM categories WHERE slug = 'monitors'),
 'new', 6, '{}', false, true),

('ROG Strix XG27UQR 27" 4K 144Hz',
 'rog-strix-xg27uqr',
 '27" 4K UHD IPS, 144Hz, 1ms GTG, DisplayHDR 600. Exceptional 4K gaming clarity with smooth 144Hz refresh.',
 158000, 175000,
 (SELECT id FROM categories WHERE slug = 'monitors'),
 'new', 4, '{}', false, true),

('MSI MEG 342C QD-OLED 34" Ultrawide',
 'msi-meg-342c-qd-oled',
 '34" UWQHD QD-OLED, 175Hz, 0.03ms. Quantum dot OLED delivers infinite contrast, perfect blacks, and brilliant colors for ultimate immersion.',
 265000, 292000,
 (SELECT id FROM categories WHERE slug = 'monitors'),
 'new', 2, '{}', true, true),

('MSI MPG 321URX QD-OLED 32" 4K 240Hz',
 'msi-mpg-321urx-qd-oled',
 '32" 4K QD-OLED, 240Hz, 0.03ms. High-resolution OLED with blazing refresh rate — the premium choice for 4K gaming.',
 298000, 328000,
 (SELECT id FROM categories WHERE slug = 'monitors'),
 'new', 2, '{}', true, true),

('MSI MAG 274QRF QD 27" 1440p 165Hz',
 'msi-mag-274qrf-qd',
 '27" WQHD Rapid IPS, 165Hz, 1ms GTG, Quantum Dot wide color. Exceptional everyday gaming monitor with vivid colors.',
 98000, 110000,
 (SELECT id FROM categories WHERE slug = 'monitors'),
 'new', 7, '{}', false, true),

('MSI G274QPF-E2 27" 1440p 170Hz',
 'msi-g274qpf-e2',
 '27" QHD IPS, 170Hz, 1ms GTG, HDR Ready. Affordable 1440p gaming with great color accuracy and smooth motion.',
 72000, 82000,
 (SELECT id FROM categories WHERE slug = 'monitors'),
 'new', 8, '{}', false, true),

('MSI G241 24" FHD 144Hz',
 'msi-g241-24-fhd-144hz',
 '24" Full HD IPS, 144Hz, 1ms GTG. Entry-level MSI gaming monitor with solid color and smooth gameplay. Great starter screen.',
 42000, 50000,
 (SELECT id FROM categories WHERE slug = 'monitors'),
 'new', 12, '{}', false, true),


-- ══════════════════════════════════════════════════════════════
-- LAPTOPS (10 products)
-- ══════════════════════════════════════════════════════════════

('ROG Zephyrus G16 (2024) RTX 4090',
 'rog-zephyrus-g16-2024-rtx4090',
 '16" 2560x1600 240Hz OLED, RTX 4090, Intel Core Ultra 9, 32GB DDR5, 2TB NVMe. The pinnacle of thin-and-light gaming laptops.',
 560000, 605000,
 (SELECT id FROM categories WHERE slug = 'laptops'),
 'new', 2, '{}', true, true),

('ROG Strix SCAR 17 (2024) RTX 4090',
 'rog-strix-scar-17-2024',
 '17.3" QHD 240Hz, RTX 4090 175W, Core i9-14900HX, 32GB DDR5, 2TB. No-compromise desktop-replacement gaming powerhouse.',
 695000, 745000,
 (SELECT id FROM categories WHERE slug = 'laptops'),
 'new', 2, '{}', true, true),

('ROG Zephyrus G14 (2024) RTX 4060',
 'rog-zephyrus-g14-2024',
 '14" 2880x1800 120Hz OLED, RTX 4060, AMD Ryzen 9 8945HS, 16GB LPDDR5, 1TB. Premium compact gaming with all-day battery life.',
 295000, 325000,
 (SELECT id FROM categories WHERE slug = 'laptops'),
 'new', 4, '{}', true, true),

('ROG Flow X13 (2024) RTX 4060',
 'rog-flow-x13-2024',
 '13.4" 2560x1600 165Hz, RTX 4060, Ryzen 9 8945HS, 16GB, 1TB. Ultraportable 2-in-1 gaming laptop with XG Mobile eGPU support.',
 312000, 342000,
 (SELECT id FROM categories WHERE slug = 'laptops'),
 'new', 3, '{}', false, true),

('ROG Strix G16 (2024) RTX 4070',
 'rog-strix-g16-2024',
 '16" FHD 165Hz, RTX 4070, Core i7-13650HX, 16GB DDR5, 512GB. Solid mid-range gaming with strong thermals and ROG Strix style.',
 265000, 292000,
 (SELECT id FROM categories WHERE slug = 'laptops'),
 'new', 5, '{}', false, true),

('MSI Titan GT77 HX RTX 4090',
 'msi-titan-gt77-hx-rtx4090',
 '17.3" 4K 144Hz Mini-LED, RTX 4090, Core i9-13980HX, 64GB DDR5, 4TB RAID. MSI''s most powerful laptop ever created.',
 845000, 905000,
 (SELECT id FROM categories WHERE slug = 'laptops'),
 'new', 1, '{}', true, true),

('MSI Raider GE78 HX RTX 4080',
 'msi-raider-ge78-hx-rtx4080',
 '17" QHD+ 240Hz, RTX 4080, Core i9-14900HX, 32GB DDR5, 2TB. Next-gen performance in a sleek chassis with MUX Switch.',
 555000, 598000,
 (SELECT id FROM categories WHERE slug = 'laptops'),
 'new', 2, '{}', true, true),

('MSI Stealth 16 Mercedes-AMG RTX 4070 Ti',
 'msi-stealth-16-mercedes-amg',
 '16" QHD+ 240Hz OLED, RTX 4070 Ti, Core i9-13900H, 32GB DDR5, 2TB. Ultra-slim luxury gaming laptop in collaboration with Mercedes-AMG.',
 498000, 545000,
 (SELECT id FROM categories WHERE slug = 'laptops'),
 'new', 2, '{}', false, true),

('MSI Katana 15 RTX 4060',
 'msi-katana-15-rtx4060',
 '15.6" FHD 144Hz, RTX 4060, Core i7-13620H, 16GB DDR5, 512GB NVMe. Powerful mainstream gaming laptop at an accessible price.',
 195000, 218000,
 (SELECT id FROM categories WHERE slug = 'laptops'),
 'new', 6, '{}', false, true),

('MSI Cyborg 15 RTX 4050',
 'msi-cyborg-15-rtx4050',
 '15.6" FHD 144Hz, RTX 4050, Core i7-12650H, 8GB DDR5, 512GB. Entry-level gaming with a bold translucent chassis design.',
 148000, 168000,
 (SELECT id FROM categories WHERE slug = 'laptops'),
 'new', 8, '{}', false, true),


-- ══════════════════════════════════════════════════════════════
-- MICE (10 products)
-- ══════════════════════════════════════════════════════════════

('ROG Chakram X Origin Wireless',
 'rog-chakram-x-origin-wireless',
 'Tri-mode wireless gaming mouse with swappable analog joystick, 36000 DPI ROG AimPoint sensor, and 70-hour battery life.',
 46000, 52000,
 (SELECT id FROM categories WHERE slug = 'mice'),
 'new', 8, '{}', true, true),

('ROG Gladius III Wireless AimPoint',
 'rog-gladius-iii-wireless',
 'Tri-mode wireless with 2.4GHz, Bluetooth, and wired modes. 36000 DPI optical sensor, 100-hour battery, swappable switch design.',
 28000, 32000,
 (SELECT id FROM categories WHERE slug = 'mice'),
 'new', 10, '{}', false, true),

('ROG Keris II Ace Wireless',
 'rog-keris-ii-ace-wireless',
 'Ultra-lightweight at 54g, ROG AimPoint Pro 42000 DPI sensor, 2.4GHz wireless. Designed for competitive gaming performance.',
 32000, 36000,
 (SELECT id FROM categories WHERE slug = 'mice'),
 'new', 7, '{}', false, true),

('ROG Harpe Ace Aim Lab Edition',
 'rog-harpe-ace-aim-lab',
 '54g ultra-lightweight, 36000 DPI, Aim Lab co-developed for FPS precision. ROG SpeedNova wireless technology with near-zero latency.',
 30000, 35000,
 (SELECT id FROM categories WHERE slug = 'mice'),
 'new', 9, '{}', false, true),

('ROG Strix Impact III Wireless',
 'rog-strix-impact-iii-wireless',
 'Ambidextrous design, 12000 DPI, tri-mode connectivity. Lightweight at 67g with honeycomb shell for extended gaming comfort.',
 18000, 22000,
 (SELECT id FROM categories WHERE slug = 'mice'),
 'new', 12, '{}', false, true),

('MSI Clutch GM41 Lightweight Wireless',
 'msi-clutch-gm41-lightweight-wireless',
 '60g ultra-light, PixArt PAW3370 16000 DPI sensor, 2.4GHz wireless, up to 70 hours battery. Premium wireless at mid-range price.',
 24000, 28000,
 (SELECT id FROM categories WHERE slug = 'mice'),
 'new', 10, '{}', false, true),

('MSI Clutch GM51 Lightweight Wireless',
 'msi-clutch-gm51-lightweight-wireless',
 '73g lightweight, 26000 DPI PixArt PAW3395, 2.4GHz wireless, RGB, 100-hour battery. Exceptional sensor in a lightweight shell.',
 22000, 26000,
 (SELECT id FROM categories WHERE slug = 'mice'),
 'new', 8, '{}', false, true),

('MSI Clutch GM30',
 'msi-clutch-gm30',
 'Ergonomic right-hand design, 6400 DPI, wired USB, 7 programmable buttons, RGB. Reliable daily-use gaming mouse.',
 8500, 10000,
 (SELECT id FROM categories WHERE slug = 'mice'),
 'new', 18, '{}', false, true),

('MSI Clutch GM08',
 'msi-clutch-gm08',
 'Entry-level gaming mouse with 4800 DPI optical sensor, ergonomic shape, braided cable, and 7 programmable buttons.',
 6500, 7800,
 (SELECT id FROM categories WHERE slug = 'mice'),
 'new', 20, '{}', false, true),

('MSI Accolade EM30',
 'msi-accolade-em30',
 'Ambidextrous wired mouse with PixArt 3327 sensor, 10000 DPI, 6 buttons, ultra-light braided cable. Versatile for work and gaming.',
 9500, 11500,
 (SELECT id FROM categories WHERE slug = 'mice'),
 'new', 15, '{}', false, true),


-- ══════════════════════════════════════════════════════════════
-- KEYBOARDS (10 products)
-- ══════════════════════════════════════════════════════════════

('ROG Azoth Wireless 75% Mechanical',
 'rog-azoth-wireless',
 'Custom gasket mount, tri-mode wireless, ROG NX Snow switches, OLED display, 3-step dampening foam. The ultimate enthusiast keyboard.',
 72000, 82000,
 (SELECT id FROM categories WHERE slug = 'keyboards'),
 'new', 5, '{}', true, true),

('ROG Falchion Ace 65% Wireless',
 'rog-falchion-ace-wireless',
 '65% form factor, tri-mode wireless, ROG NX switches, touch panel, 450-hour battery life, and ultra-compact design.',
 52000, 60000,
 (SELECT id FROM categories WHERE slug = 'keyboards'),
 'new', 6, '{}', false, true),

('ROG Claymore II Full-Size Wireless',
 'rog-claymore-ii-wireless',
 'Full-size or TKL detachable numpad, tri-mode wireless, ROG RX switches, per-key RGB, Aura Sync. Versatile premium keyboard.',
 58000, 68000,
 (SELECT id FROM categories WHERE slug = 'keyboards'),
 'new', 4, '{}', false, true),

('ROG Strix Scope II RX TKL',
 'rog-strix-scope-ii-rx-tkl',
 'Tenkeyless layout, ROG RX Blue optical-mechanical switches, pre-lubed stabilizers, sound-dampening foam. Built for FPS gaming.',
 42000, 50000,
 (SELECT id FROM categories WHERE slug = 'keyboards'),
 'new', 7, '{}', false, true),

('ROG Strix Flare II Animate',
 'rog-strix-flare-ii-animate',
 'Full-size with customizable LED display panel, Cherry MX switches, USB passthrough, per-key RGB, wrist rest included.',
 45000, 52000,
 (SELECT id FROM categories WHERE slug = 'keyboards'),
 'new', 6, '{}', false, true),

('MSI Vigor GK71 Sonic Red',
 'msi-vigor-gk71-sonic-red',
 'Full-size with MSI Sonic Red linear switches, per-key RGB, aluminum faceplate, detachable magnetic wrist rest, USB Hub.',
 25000, 30000,
 (SELECT id FROM categories WHERE slug = 'keyboards'),
 'new', 10, '{}', false, true),

('MSI Vigor GK50 Elite TKL',
 'msi-vigor-gk50-elite-tkl',
 'Tenkeyless with Kailh Box White switches, per-key RGB, detachable cable, aluminum frame. Great compact gaming keyboard.',
 18500, 22000,
 (SELECT id FROM categories WHERE slug = 'keyboards'),
 'new', 12, '{}', false, true),

('MSI Vigor GK30',
 'msi-vigor-gk30',
 'Full-size membrane gaming keyboard with per-key RGB, water-resistant spill design, and 19-key anti-ghosting. Budget-friendly pick.',
 9500, 12000,
 (SELECT id FROM categories WHERE slug = 'keyboards'),
 'new', 20, '{}', false, true),

('MSI Vigor GK20',
 'msi-vigor-gk20',
 'Entry gaming membrane keyboard with 4-zone RGB lighting and tilt-adjust legs. Functional and affordable for new gamers.',
 6800, 8500,
 (SELECT id FROM categories WHERE slug = 'keyboards'),
 'new', 22, '{}', false, true),

('MSI Vigor GK60 TKL',
 'msi-vigor-gk60-tkl',
 'Tenkeyless with Cherry MX Red switches, per-key RGB, IP42 spill resistance, and durable PBT doubleshot keycaps.',
 22000, 26000,
 (SELECT id FROM categories WHERE slug = 'keyboards'),
 'new', 8, '{}', false, true),


-- ══════════════════════════════════════════════════════════════
-- HEADSETS (8 products)
-- ══════════════════════════════════════════════════════════════

('ROG Delta S Wireless',
 'rog-delta-s-wireless',
 'Ultra-low latency 2.4GHz wireless, USB-C, AI noise-cancelling mic, Hi-Res audio ESS 9281 DAC, 50mm drivers, 25-hour battery.',
 42000, 50000,
 (SELECT id FROM categories WHERE slug = 'headsets'),
 'new', 6, '{}', true, true),

('ROG Strix Go 2.4 Wireless',
 'rog-strix-go-2-4',
 '2.4GHz wireless with USB-C dongle, AI noise-cancelling, 3.5mm analog fallback, foldable design, 25-hour battery life.',
 32000, 38000,
 (SELECT id FROM categories WHERE slug = 'headsets'),
 'new', 8, '{}', false, true),

('ROG Fusion II 500 7.1 Surround',
 'rog-fusion-ii-500',
 '7.1 surround with ASUS ESS 9280 Quad DAC, RGB Aura Sync, 50mm drivers, Discord-certified mic, USB-C/3.5mm dual connectivity.',
 35000, 42000,
 (SELECT id FROM categories WHERE slug = 'headsets'),
 'new', 5, '{}', false, true),

('ROG Cetra True Wireless Pro',
 'rog-cetra-true-wireless-pro',
 'In-ear gaming earbuds with ANC, 40ms low-latency 2.4GHz mode, Bluetooth 5.3, 27-hour total battery, IPX4 water resistance.',
 28000, 34000,
 (SELECT id FROM categories WHERE slug = 'headsets'),
 'new', 7, '{}', false, true),

('MSI Immerse GH50 Wireless',
 'msi-immerse-gh50-wireless',
 '2.4GHz wireless gaming headset, virtual 7.1 surround, retractable mic, 20-hour battery, foldable design with USB dongle.',
 22000, 28000,
 (SELECT id FROM categories WHERE slug = 'headsets'),
 'new', 8, '{}', false, true),

('MSI Immerse GH30 V2',
 'msi-immerse-gh30-v2',
 'Wired stereo gaming headset, 40mm drivers, inline mic, 3.5mm + USB adapter, memory foam ear pads, foldable.',
 9500, 12500,
 (SELECT id FROM categories WHERE slug = 'headsets'),
 'new', 15, '{}', false, true),

('MSI Immerse GH20',
 'msi-immerse-gh20',
 'Entry wired headset with 30mm drivers, 3.5mm connectivity, lightweight design. Simple and effective for casual gaming.',
 7200, 9000,
 (SELECT id FROM categories WHERE slug = 'headsets'),
 'new', 18, '{}', false, true),

('MSI Immerse HS01 Wireless',
 'msi-immerse-hs01-wireless',
 'Bluetooth 5.0 wireless headset, 40mm drivers, foldable design, 12-hour battery, built-in mic. Multi-platform compatible.',
 14500, 18000,
 (SELECT id FROM categories WHERE slug = 'headsets'),
 'new', 10, '{}', false, true),


-- ══════════════════════════════════════════════════════════════
-- MEMORY RAM (6 products)
-- ══════════════════════════════════════════════════════════════

('ROG Lancer DDR5-6000 32GB (2x16GB)',
 'rog-lancer-ddr5-6000-32gb',
 'DDR5-6000 CL30, Intel XMP 3.0 & AMD EXPO, aluminum heatspreader, compatible with ROG Maximus and Strix Z790/X670 boards.',
 38000, 44000,
 (SELECT id FROM categories WHERE slug = 'memory-ram'),
 'new', 10, '{}', false, true),

('ROG Lancer DDR5-6000 16GB (2x8GB)',
 'rog-lancer-ddr5-6000-16gb',
 'DDR5-6000 CL30 dual-channel kit with XMP 3.0 support. Ideal entry into DDR5 with ROG-grade reliability.',
 22000, 26000,
 (SELECT id FROM categories WHERE slug = 'memory-ram'),
 'new', 12, '{}', false, true),

('ROG Strix DDR4-3600 32GB (2x16GB)',
 'rog-strix-ddr4-3600-32gb',
 'DDR4-3600 CL18 with ROG Strix RGB heatspreader, Intel XMP 2.0, compatible with most Z490/Z590/Z690 DDR4 platforms.',
 18500, 22000,
 (SELECT id FROM categories WHERE slug = 'memory-ram'),
 'new', 8, '{}', false, true),

('MSI Parity DDR5-5600 32GB (2x16GB)',
 'msi-parity-ddr5-5600-32gb',
 'DDR5-5600 CL36, Intel XMP 3.0 & AMD EXPO certified. Reliable high-speed DDR5 memory for AMD and Intel platforms.',
 28000, 33000,
 (SELECT id FROM categories WHERE slug = 'memory-ram'),
 'new', 10, '{}', false, true),

('MSI Parity DDR5-4800 16GB (2x8GB)',
 'msi-parity-ddr5-4800-16gb',
 'DDR5-4800 baseline dual-channel kit. Solid entry DDR5 with XMP 3.0 support and MSI quality assurance.',
 16500, 20000,
 (SELECT id FROM categories WHERE slug = 'memory-ram'),
 'new', 14, '{}', false, true),

('MSI DDR4-3200 16GB (2x8GB)',
 'msi-ddr4-3200-16gb',
 'DDR4-3200 CL16 dual-channel kit. Reliable budget RAM for B450/B550/B560/H510 builds. XMP 2.0 one-click OC.',
 12500, 15000,
 (SELECT id FROM categories WHERE slug = 'memory-ram'),
 'new', 15, '{}', false, true),


-- ══════════════════════════════════════════════════════════════
-- STORAGE (6 products)
-- ══════════════════════════════════════════════════════════════

('ROG Strix SQ7 2TB NVMe PCIe 4.0',
 'rog-strix-sq7-2tb',
 'PCIe 4.0 x4 NVMe SSD with 7400/6800 MB/s sequential speeds, heat spreader included, ROG ROG aesthetics for open-build systems.',
 52000, 60000,
 (SELECT id FROM categories WHERE slug = 'storage'),
 'new', 8, '{}', false, true),

('ROG Strix SQ7 1TB NVMe PCIe 4.0',
 'rog-strix-sq7-1tb',
 'PCIe 4.0 x4 NVMe with 7100/6000 MB/s speeds, graphene heat spreader, M.2 2280 form factor. Excellent OS + game drive.',
 28000, 34000,
 (SELECT id FROM categories WHERE slug = 'storage'),
 'new', 12, '{}', false, true),

('ROG THOR 1TB PCIe 5.0 NVMe',
 'rog-thor-1tb-pcie5',
 'Blazing PCIe 5.0 speeds up to 10,000/9,500 MB/s. Next-gen storage for Z790 and X670E platforms. Future-proof your build.',
 65000, 75000,
 (SELECT id FROM categories WHERE slug = 'storage'),
 'new', 5, '{}', true, true),

('MSI Spatium M570 Pro 2TB PCIe 5.0',
 'msi-spatium-m570-pro-2tb',
 'PCIe 5.0 NVMe SSD, up to 12,400/11,800 MB/s sequential. The fastest consumer SSD from MSI for top-tier builds.',
 72000, 82000,
 (SELECT id FROM categories WHERE slug = 'storage'),
 'new', 4, '{}', true, true),

('MSI Spatium M470 1TB PCIe 4.0',
 'msi-spatium-m470-1tb',
 'PCIe 4.0 x4 NVMe, 3500/3000 MB/s, M.2 2280. Reliable mid-range storage for gaming PCs needing fast load times.',
 22000, 26500,
 (SELECT id FROM categories WHERE slug = 'storage'),
 'new', 14, '{}', false, true),

('MSI Spatium S270 480GB SATA SSD',
 'msi-spatium-s270-480gb',
 '2.5" SATA III SSD, 500/450 MB/s, DRAM cache, 5-year warranty. Affordable storage upgrade for older systems or secondary drives.',
 9800, 12000,
 (SELECT id FROM categories WHERE slug = 'storage'),
 'new', 20, '{}', false, true),


-- ══════════════════════════════════════════════════════════════
-- POWER SUPPLIES (4 products)
-- ══════════════════════════════════════════════════════════════

('ROG THOR 1000W Platinum II',
 'rog-thor-1000w-platinum-ii',
 '1000W 80 PLUS Platinum, fully modular, Aura Sync RGB, OLED power display, ROG-grade capacitors, PCIe 5.0 16-pin connector.',
 68000, 78000,
 (SELECT id FROM categories WHERE slug = 'power-supplies'),
 'new', 5, '{}', true, true),

('ROG Strix 850W Gold',
 'rog-strix-850w-gold',
 '850W 80 PLUS Gold fully modular PSU with 0dB fan mode, 10-year warranty, and Japanese capacitors. Silent and reliable.',
 48000, 56000,
 (SELECT id FROM categories WHERE slug = 'power-supplies'),
 'new', 7, '{}', false, true),

('MSI MPG A1000G PCIE5 1000W Gold',
 'msi-mpg-a1000g-pcie5',
 '1000W 80 PLUS Gold, fully modular, PCIe 5.0 connector, 120mm fluid bearing fan, 10-year warranty. Built for RTX 4090 systems.',
 52000, 62000,
 (SELECT id FROM categories WHERE slug = 'power-supplies'),
 'new', 6, '{}', false, true),

('MSI MAG A650BN 650W Bronze',
 'msi-mag-a650bn',
 '650W 80 PLUS Bronze semi-modular PSU. Reliable and affordable for mid-range gaming builds. Japanese capacitors and 5-year warranty.',
 20000, 25000,
 (SELECT id FROM categories WHERE slug = 'power-supplies'),
 'new', 14, '{}', false, true),


-- ══════════════════════════════════════════════════════════════
-- COOLING (4 products)
-- ══════════════════════════════════════════════════════════════

('ROG Ryujin III 360 ARGB AIO',
 'rog-ryujin-iii-360',
 '360mm all-in-one liquid cooler with 2.8" LCD display, Asetek Gen 8 pump, three 120mm ARGB fans, and Aura Sync lighting.',
 62000, 72000,
 (SELECT id FROM categories WHERE slug = 'cooling'),
 'new', 4, '{}', true, true),

('ROG Strix LC III 360 ARGB',
 'rog-strix-lc-iii-360',
 '360mm AIO with three ROG ARGB fans, high-performance cold plate, Aura Sync support. Excellent cooling for overclocked CPUs.',
 42000, 50000,
 (SELECT id FROM categories WHERE slug = 'cooling'),
 'new', 6, '{}', false, true),

('MSI MAG CoreLiquid 360R V2',
 'msi-mag-coreliquid-360r-v2',
 '360mm AIO with 2.4" IPS LCD pump head display, three 120mm ARGB fans, Intel/AMD universal mounting. Great value liquid cooler.',
 35000, 42000,
 (SELECT id FROM categories WHERE slug = 'cooling'),
 'new', 8, '{}', false, true),

('MSI MAG CoreLiquid 240R V2',
 'msi-mag-coreliquid-240r-v2',
 '240mm AIO, IPS LCD pump head, dual 120mm ARGB fans, universal socket support. Entry-level liquid cooling with premium look.',
 24000, 30000,
 (SELECT id FROM categories WHERE slug = 'cooling'),
 'new', 10, '{}', false, true),


-- ══════════════════════════════════════════════════════════════
-- PC CASES (4 products)
-- ══════════════════════════════════════════════════════════════

('ROG Hyperion GR701 BTF Edition',
 'rog-hyperion-gr701-btf',
 'Full-tower ATX case with hidden connector motherboard support, tempered glass side panel, 4 pre-installed ARGB fans, PCIe 4.0 riser.',
 115000, 130000,
 (SELECT id FROM categories WHERE slug = 'pc-cases'),
 'new', 2, '{}', true, true),

('ROG Strix Helios GX601 White',
 'rog-strix-helios-gx601-white',
 'Premium mid-tower with dual tempered glass, 3 pre-installed fans, GPU support bracket, tool-free design, and Aura Sync RGB.',
 72000, 85000,
 (SELECT id FROM categories WHERE slug = 'pc-cases'),
 'new', 4, '{}', false, true),

('MSI MEG Prospect 700R',
 'msi-meg-prospect-700r',
 'Full-tower showcase case with 4-sided tempered glass panels, 6 pre-installed ARGB fans, PCIe 4.0 vertical GPU mount included.',
 125000, 142000,
 (SELECT id FROM categories WHERE slug = 'pc-cases'),
 'new', 2, '{}', false, true),

('MSI MAG Forge 320R Airflow',
 'msi-mag-forge-320r-airflow',
 'Mid-tower with three tempered glass panels, 3 pre-installed ARGB fans, mesh front panel, and tool-free drive installation.',
 28000, 34000,
 (SELECT id FROM categories WHERE slug = 'pc-cases'),
 'new', 8, '{}', false, true),


-- ══════════════════════════════════════════════════════════════
-- NETWORKING (4 products — ROG)
-- ══════════════════════════════════════════════════════════════

('ROG Rapture GT-BE98 Wi-Fi 7 Router',
 'rog-rapture-gt-be98-wifi7',
 'Quad-band Wi-Fi 7, 10G + 2.5G WAN ports, 2x 10G LAN, gaming-first QoS, Aura RGB. Next-gen router for the most demanding setups.',
 198000, 225000,
 (SELECT id FROM categories WHERE slug = 'networking'),
 'new', 2, '{}', true, true),

('ROG Rapture GT-AX11000 Pro Wi-Fi 6E',
 'rog-rapture-gt-ax11000-pro',
 'Tri-band Wi-Fi 6E, 2.5G WAN, 2.5G LAN, VPN Fusion, GameFirst VI, Aimesh support. Top-tier gaming router.',
 132000, 152000,
 (SELECT id FROM categories WHERE slug = 'networking'),
 'new', 4, '{}', false, true),

('ROG Rapture GT-AX6000 Wi-Fi 6',
 'rog-rapture-gt-ax6000',
 'Dual-band Wi-Fi 6, AX6000, 2.5G WAN + LAN ports, Aimesh compatible, dedicated gaming port, GameFirst VI QoS.',
 88000, 102000,
 (SELECT id FROM categories WHERE slug = 'networking'),
 'new', 5, '{}', false, true),

('ROG Strix GS-AX5400 Wi-Fi 6 Router',
 'rog-strix-gs-ax5400',
 'AX5400 Wi-Fi 6 gaming router with GameFirst VI, VPN Fusion, Aimesh 3.0, four antennas, and stylish ROG Strix design.',
 58000, 68000,
 (SELECT id FROM categories WHERE slug = 'networking'),
 'new', 7, '{}', false, true);
