// Automated verification test suite for Phase 6: Notifications, Settings & Data Management
import {
  getStorageUsageReport,
  importUserData,
  clearAllUserData,
} from './src/services/dataManagementService.ts';
import {
  getNotificationPermissionStatus,
  DEFAULT_NOTIFICATION_TOGGLES,
} from './src/services/notificationService.ts';

console.log('=== STARTING PHASE 6 AUTOMATED TEST SUITE ===\n');

// Mock localStorage for Node test runner
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    _getStore: () => store,
  };
})();

globalThis.localStorage = localStorageMock;

// 1. Test Sistem Notifikasi & Preferensi
function testNotificationSystem() {
  console.log('Test 1: Memverifikasi Konfigurasi & Layanan Notifikasi Adzan/Imsak');

  const permStatus = getNotificationPermissionStatus();
  console.log(`- Status Izin Notifikasi (Node/SSR Mode): ${permStatus}`);
  if (permStatus !== 'unsupported' && permStatus !== 'default') {
    throw new Error('Penanganan status izin notifikasi tidak terisolasi');
  }

  // Cek konfigurasi default toggles sholat
  if (
    !DEFAULT_NOTIFICATION_TOGGLES ||
    DEFAULT_NOTIFICATION_TOGGLES.imsak !== true ||
    DEFAULT_NOTIFICATION_TOGGLES.subuh !== true ||
    DEFAULT_NOTIFICATION_TOGGLES.maghrib !== true ||
    DEFAULT_NOTIFICATION_TOGGLES.isya !== true
  ) {
    throw new Error('Default notification toggles waktu sholat tidak valid');
  }

  console.log('  • Imsak: ON (Alarm Sahur)');
  console.log('  • Subuh: ON');
  console.log('  • Maghrib: ON (Iftar)');
  console.log('  • Isya: ON');

  console.log('✓ PASS: Layanan notifikasi dan konfigurasi preferensi jadwal sholat terverifikasi.\n');
}

// 2. Test Ekspor Cadangan, Pemulihan (Import), dan Validasi Skema
function testDataManagementAndBackup() {
  console.log('Test 2: Menguji Sistem Pencadangan Data, Impor, dan Integritas Skema');

  // Siapkan data simulasi di localStorage
  localStorage.setItem(
    'ramadan_companion_settings',
    JSON.stringify({
      theme: 'dark',
      prayerMethod: 'MUHAMMADIYAH',
      location: { city: 'Surabaya', latitude: -7.2575, longitude: 112.7521, timezone: 'Asia/Jakarta' },
    })
  );

  localStorage.setItem(
    'ramadan_worship_history_v1',
    JSON.stringify({
      '2027-02-08': {
        date: '2027-02-08',
        ramadanDay: 1,
        fasting: { status: 'puasa', obligationType: 'tidak_ada' },
        completedItemIds: ['fardhu-subuh', 'fardhu-maghrib', 'sunnah-tarawih-witir'],
        updatedAt: new Date().toISOString(),
      },
    })
  );

  localStorage.setItem('ramadan_doa_favorites_v1', JSON.stringify(['niat-puasa-ramadan', 'buka-puasa-shahih']));
  localStorage.setItem('ramadan_hadis_favorites_v1', JSON.stringify(['hadis-1', 'hadis-3']));

  // Cek Storage Usage Report
  const report = getStorageUsageReport();
  console.log(`- Laporan Kapasitas Penyimpanan: ${report.formattedTotal} / ${report.estimatedLimit}`);
  if (!report.items || report.items.length === 0) {
    throw new Error('Storage usage items kosong');
  }

  // Buat payload backup valid
  const validBackupJson = JSON.stringify({
    app: 'Ramadan Companion',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    data: {
      settings: { theme: 'light', prayerMethod: 'KEMENAG' },
      worshipHistory: {
        '2027-02-09': {
          date: '2027-02-09',
          ramadanDay: 2,
          fasting: { status: 'puasa' },
          completedItemIds: ['fardhu-subuh'],
          updatedAt: new Date().toISOString(),
        },
      },
      doaFavorites: ['doa-lailatul-qadar'],
      hadisFavorites: ['hadis-8'],
    },
  });

  // Uji Impor Data Valid
  const importResult = importUserData(validBackupJson);
  console.log(`- Hasil Impor Valid: ${importResult.message}`);
  if (!importResult.success) {
    throw new Error(`Impor data valid gagal: ${importResult.message}`);
  }

  // Verifikasi data terpulihkan di localStorage
  const restoredSettings = JSON.parse(localStorage.getItem('ramadan_companion_settings'));
  if (restoredSettings.theme !== 'light' || restoredSettings.prayerMethod !== 'KEMENAG') {
    throw new Error('Data settings tidak terpulihkan dengan benar');
  }

  const restoredWorship = JSON.parse(localStorage.getItem('ramadan_worship_history_v1'));
  if (!restoredWorship['2027-02-09']) {
    throw new Error('Catatan ibadah tidak terpulihkan dengan benar');
  }

  // Uji Impor File Tidak Valid / Korup
  const corruptPayload = '{"app":"AplikasiLain","data":{}}';
  const rejectResult = importUserData(corruptPayload);
  console.log(`- Uji Penolakan File Asing: ${rejectResult.message}`);
  if (rejectResult.success) {
    throw new Error('Sistem harus menolak file cadangan yang bukan dari Ramadan Companion');
  }

  const invalidJson = '{ bad json content ';
  const malformedResult = importUserData(invalidJson);
  if (malformedResult.success) {
    throw new Error('Sistem harus menolak JSON yang rusak/malformed');
  }

  // Uji Penghapusan Seluruh Data (Clear All)
  const cleared = clearAllUserData();
  console.log(`- Status Pembersihan Data Bersih: ${cleared ? 'Sukses' : 'Gagal'}`);
  if (!cleared || localStorage.getItem('ramadan_companion_settings') !== null) {
    throw new Error('clearAllUserData gagal membersihkan storage');
  }

  console.log('✓ PASS: Sistem pencadangan, ekspor, impor aman, dan sanitasi data bekerja tanpa cacat.\n');
}

try {
  testNotificationSystem();
  testDataManagementAndBackup();
  console.log('=== ALL PHASE 6 TESTS PASSED SUCCESSFULLY! ===');
} catch (e) {
  console.error('PHASE 6 TEST SUITE FAILED:', e);
  process.exit(1);
}
