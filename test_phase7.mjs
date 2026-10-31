// Phase 7 Automated Test Suite: PWA, Service Worker, Khazanah 3-Dots Tab, and Launch Readiness
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { khazanahMenuItems, mainNavItems } from './src/types/navigation.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== STARTING PHASE 7 AUTOMATED TEST SUITE ===\n');

// 1. Test Web App Manifest
function testManifest() {
  console.log('Test 1: Memverifikasi Validitas Web App Manifest (PWA)');
  const manifestPath = path.join(__dirname, 'public', 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error('public/manifest.json tidak ditemukan!');
  }

  const content = fs.readFileSync(manifestPath, 'utf-8');
  const manifest = JSON.parse(content);

  console.log(`- App Name: "${manifest.name}"`);
  console.log(`- Short Name: "${manifest.short_name}"`);
  console.log(`- Display Mode: "${manifest.display}"`);
  console.log(`- Theme Color: "${manifest.theme_color}"`);
  console.log(`- Start URL: "${manifest.start_url}"`);
  console.log(`- Total Icons: ${manifest.icons.length}`);
  console.log(`- Shortcuts: ${manifest.shortcuts.map(s => s.name).join(', ')}`);

  if (manifest.display !== 'standalone') {
    throw new Error('Manifest display harus "standalone" untuk pengalaman native PWA');
  }
  if (!manifest.theme_color || !manifest.background_color) {
    throw new Error('Manifest wajib memiliki theme_color dan background_color');
  }
  if (manifest.shortcuts.length < 4) {
    throw new Error('PWA Shortcuts minimal mencakup 4 fitur utama');
  }

  console.log('✓ PASS: manifest.json tervalidasi memenuhi kriteria installable PWA.\n');
}

// 2. Test Service Worker Implementation
function testServiceWorker() {
  console.log('Test 2: Memverifikasi Skrip Service Worker & Offline Cache (sw.js)');
  const swPath = path.join(__dirname, 'public', 'sw.js');
  if (!fs.existsSync(swPath)) {
    throw new Error('public/sw.js tidak ditemukan!');
  }

  const swContent = fs.readFileSync(swPath, 'utf-8');
  const hasInstall = swContent.includes("addEventListener('install'");
  const hasActivate = swContent.includes("addEventListener('activate'");
  const hasFetch = swContent.includes("addEventListener('fetch'");
  const hasOfflineFallback = swContent.includes('caches.match');

  console.log(`- Event Listener Install: ${hasInstall ? 'OK' : 'MISSING'}`);
  console.log(`- Event Listener Activate: ${hasActivate ? 'OK' : 'MISSING'}`);
  console.log(`- Event Listener Fetch: ${hasFetch ? 'OK' : 'MISSING'}`);
  console.log(`- Offline Fallback Support: ${hasOfflineFallback ? 'OK' : 'MISSING'}`);

  if (!hasInstall || !hasActivate || !hasFetch || !hasOfflineFallback) {
    throw new Error('Implementasi Service Worker tidak lengkap!');
  }

  console.log('✓ PASS: Service Worker siap bekerja offline dan meng-cache app shell.\n');
}

// 3. Test HTML PWA & Meta Tags
function testIndexHtmlPwaMeta() {
  console.log('Test 3: Memverifikasi Meta Tags PWA & SW Registration di index.html');
  const indexPath = path.join(__dirname, 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf-8');

  const hasManifestLink = indexContent.includes('<link rel="manifest" href="/manifest.json"');
  const hasAppleMobile = indexContent.includes('name="apple-mobile-web-app-capable"');
  const hasAppleStatusBar = indexContent.includes('name="apple-mobile-web-app-status-bar-style"');
  const hasSwRegister = indexContent.includes('navigator.serviceWorker.register');

  console.log(`- Manifest Link: ${hasManifestLink ? 'OK' : 'MISSING'}`);
  console.log(`- Apple Mobile Web App Meta: ${hasAppleMobile ? 'OK' : 'MISSING'}`);
  console.log(`- Apple Status Bar Meta: ${hasAppleStatusBar ? 'OK' : 'MISSING'}`);
  console.log(`- Service Worker Registration: ${hasSwRegister ? 'OK' : 'MISSING'}`);

  if (!hasManifestLink || !hasAppleMobile || !hasSwRegister) {
    throw new Error('index.html belum lengkap dengan tag PWA dan pendaftaran SW');
  }

  console.log('✓ PASS: index.html terkonfigurasi penuh untuk instalasi PWA di Android & iOS.\n');
}

// 4. Test Khazanah Ramadan & Mobile 3-Dots More Tab
function testKhazanahAndMoreTab() {
  console.log('Test 4: Memverifikasi Tab "Lainnya" (Titik Tiga) & Khazanah Ramadan');
  console.log(`- Tab Navigasi Utama: ${mainNavItems.map(i => i.label).join(', ')}`);
  console.log(`- Menu Khazanah Ramadan: ${khazanahMenuItems.map(i => i.label).join(', ')}`);

  const expectedKhazanah = ['doa', 'hadis', 'kalender', 'galeri', 'podcast', 'pengaturan'];
  for (const exp of expectedKhazanah) {
    const item = khazanahMenuItems.find(k => k.id === exp);
    if (!item) {
      throw new Error(`Item Khazanah ${exp} tidak ditemukan di khazanahMenuItems`);
    }
    console.log(`  ✓ Khazanah [${item.id}]: "${item.label}" -> ${item.path} (${item.badge})`);
  }

  // Check BottomNav file contains logo titik tiga (MoreHorizontal)
  const bottomNavFile = fs.readFileSync(path.join(__dirname, 'src', 'components', 'layout', 'BottomNav.tsx'), 'utf-8');
  const hasMoreHorizontal = bottomNavFile.includes('MoreHorizontal');
  const hasNavMobileMore = bottomNavFile.includes('nav-mobile-more');
  const hasKhazanahDrawer = bottomNavFile.includes('Khazanah Ramadan & Fitur Lengkap');

  console.log(`- Logo Titik Tiga (MoreHorizontal): ${hasMoreHorizontal ? 'OK' : 'MISSING'}`);
  console.log(`- ID Button nav-mobile-more: ${hasNavMobileMore ? 'OK' : 'MISSING'}`);
  console.log(`- Khazanah Ramadan Drawer Sheet: ${hasKhazanahDrawer ? 'OK' : 'MISSING'}`);

  if (!hasMoreHorizontal || !hasNavMobileMore || !hasKhazanahDrawer) {
    throw new Error('Tab More logo titik tiga / Drawer Khazanah Ramadan belum terpasang dengan benar di BottomNav');
  }

  console.log('✓ PASS: Tab Lainnya (logo titik tiga) dan Drawer Khazanah Ramadan terverifikasi 100% aktif.\n');
}

// 5. Test Vite Config Optimization
function testViteChunkSplitting() {
  console.log('Test 5: Memverifikasi Chunk Splitting Rollup di vite.config.ts');
  const viteConfigPath = path.join(__dirname, 'vite.config.ts');
  const content = fs.readFileSync(viteConfigPath, 'utf-8');

  const hasManualChunks = content.includes('manualChunks');
  const hasVendorReact = content.includes('vendor-react');
  const hasVendorIcons = content.includes('vendor-icons');

  console.log(`- Manual Chunks Config: ${hasManualChunks ? 'OK' : 'MISSING'}`);
  console.log(`- React Vendor Split: ${hasVendorReact ? 'OK' : 'MISSING'}`);
  console.log(`- Icons Vendor Split: ${hasVendorIcons ? 'OK' : 'MISSING'}`);

  if (!hasManualChunks || !hasVendorReact) {
    throw new Error('vite.config.ts belum mengonfigurasi manualChunks untuk optimalisasi performa');
  }

  console.log('✓ PASS: Optimasi ukuran bundle dan chunk splitting terverifikasi.\n');
}

try {
  testManifest();
  testServiceWorker();
  testIndexHtmlPwaMeta();
  testKhazanahAndMoreTab();
  testViteChunkSplitting();
  console.log('=== ALL PHASE 7 TESTS PASSED SUCCESSFULLY! ===');
} catch (e) {
  console.error('TEST FAILED:', e);
  process.exit(1);
}
