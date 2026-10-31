// Automated verification test suite for Phase 4: Ibadah Tracker & Doa Collection
import { ALL_DOAS } from './src/data/doaData.ts';
import { searchDoas, formatDoaForCopy } from './src/services/doaService.ts';
import {
  DEFAULT_WORSHIP_ITEMS,
  FASTING_REASONS_CONFIG,
  getLocalDateString,
  formatDisplayDate,
  getWorshipSummary,
  get30DaysRamadanSlots,
  getRamadanMonthlyStats,
  updateFastingRecord,
  getDailyWorshipRecord,
} from './src/services/ibadahService.ts';

console.log('=== STARTING PHASE 4 AUTOMATED TEST SUITE ===\n');

// 1. Test Kelengkapan Dataset Doa & Validitas Sanad Rujukan
function testDuaDatasetCompleteness() {
  console.log('Test 1: Memverifikasi Kelengkapan & Validitas Sanad Kumpulan Doa');
  if (!ALL_DOAS || ALL_DOAS.length < 15) {
    throw new Error(`Jumlah doa kurang memadai! Ditemukan: ${ALL_DOAS?.length}`);
  }

  console.log(`- Total Doa Terdaftar: ${ALL_DOAS.length} doa`);

  // Periksa beberapa doa kunci
  const niat = ALL_DOAS.find((d) => d.id === 'niat-puasa-ramadan');
  const bukaShahih = ALL_DOAS.find((d) => d.id === 'buka-puasa-shahih');
  const lailatulQadar = ALL_DOAS.find((d) => d.id === 'doa-lailatul-qadar');
  const sayyidulIstighfar = ALL_DOAS.find((d) => d.id === 'doa-sayyidul-istighfar');
  const sapuJagat = ALL_DOAS.find((d) => d.id === 'doa-sapu-jagat');

  if (!niat || !bukaShahih || !lailatulQadar || !sayyidulIstighfar || !sapuJagat) {
    throw new Error('Salah satu doa kunci Ramadan/Harian tidak ditemukan');
  }

  // Validasi teks Arab & Terjemahan tidak kosong dan punya rujukan
  for (const d of ALL_DOAS) {
    if (!d.id || !d.title || !d.arabicText || !d.translation || !d.source || !d.authenticity) {
      throw new Error(`Data doa tidak lengkap pada ID: ${d.id}`);
    }
  }

  console.log(`- Doa Buka Puasa (Shahih): "${bukaShahih.arabicText}"`);
  console.log(`  Rujukan: ${bukaShahih.source} (${bukaShahih.authenticity})`);
  console.log(`- Doa Lailatul Qadar: "${lailatulQadar.arabicText}"`);
  console.log(`  Rujukan: ${lailatulQadar.source} (${lailatulQadar.authenticity})`);
  console.log(`- Sayyidul Istighfar: "${sayyidulIstighfar.title}"`);
  console.log(`  Rujukan: ${sayyidulIstighfar.source} (${sayyidulIstighfar.authenticity})`);

  console.log('✓ PASS: Kumpulan Doa terverifikasi lengkap dengan teks Arab, terjemahan, dan rujukan sanad.\n');
}

// 2. Test Pencarian dan Pemfilteran Doa
function testDuaSearchAndFilter() {
  console.log('Test 2: Menguji Sistem Pencarian dan Filter Kategori Doa');

  // Filter kategori ramadan
  const ramadanDoas = searchDoas('', 'ramadan');
  console.log(`- Doa kategori 'ramadan': ${ramadanDoas.length} item`);
  if (ramadanDoas.length === 0) throw new Error('Filter ramadan kosong');

  // Filter kategori lailatul-qadar
  const lqDoas = searchDoas('', 'lailatul-qadar');
  console.log(`- Doa kategori 'lailatul-qadar': ${lqDoas.length} item`);
  if (lqDoas.length === 0) throw new Error('Filter lailatul-qadar kosong');

  // Search keyword "haus" (arti buka puasa dzahaba)
  const searchHaus = searchDoas('haus', 'all');
  console.log(`- Hasil cari 'haus': ${searchHaus.map((d) => d.title).join(', ')}`);
  if (!searchHaus.some((d) => d.id === 'buka-puasa-shahih')) {
    throw new Error("Pencarian kata 'haus' gagal menemukan doa buka puasa shahih");
  }

  // Test format text copy
  const sample = ramadanDoas[0];
  const copyFormatted = formatDoaForCopy(sample);
  if (!copyFormatted.includes(sample.title) || !copyFormatted.includes(sample.arabicText)) {
    throw new Error('Format salin teks doa tidak sesuai');
  }

  console.log('✓ PASS: Pencarian kata kunci, pemfilteran kategori, dan format salin teks bekerja optimal.\n');
}

// 3. Test Struktur Pelacak Ibadah (Mutaba'ah Yaumiyah)
function testIbadahTrackerStructure() {
  console.log('Test 3: Menguji Struktur Item Pelacak Ibadah Harian');

  if (!DEFAULT_WORSHIP_ITEMS || DEFAULT_WORSHIP_ITEMS.length < 10) {
    throw new Error('Daftar target amalan ibadah kurang dari 10');
  }

  console.log(`- Total Target Amalan Harian: ${DEFAULT_WORSHIP_ITEMS.length} amalan`);

  const fardhuItems = DEFAULT_WORSHIP_ITEMS.filter((i) => i.category === 'fardhu');
  const sunnahItems = DEFAULT_WORSHIP_ITEMS.filter((i) => i.category === 'sunnah');
  const quranItems = DEFAULT_WORSHIP_ITEMS.filter((i) => i.category === 'quran');
  const sedekahItems = DEFAULT_WORSHIP_ITEMS.filter((i) => i.category === 'sedekah');

  console.log(`  • Sholat Fardhu: ${fardhuItems.length} waktu`);
  console.log(`  • Sholat Sunnah: ${sunnahItems.length} amalan (Tarawih, Dhuha, Rawatib, Tahajjud)`);
  console.log(`  • Al-Qur'an: ${quranItems.length} amalan (Tilawah, Tadabbur)`);
  console.log(`  • Sedekah & Kebaikan: ${sedekahItems.length} amalan`);

  if (fardhuItems.length !== 5) {
    throw new Error('Sholat fardhu harus 5 waktu!');
  }

  // Test date string format YYYY-MM-DD
  const today = getLocalDateString(new Date(2026, 9, 27));
  if (today !== '2026-10-27') {
    throw new Error(`Format tanggal salah: ${today}`);
  }

  const displayDate = formatDisplayDate('2026-10-27');
  console.log(`- Format Tanggal Tampilan: ${displayDate}`);
  if (!displayDate.includes('2026') || !displayDate.includes('Oktober')) {
    throw new Error(`Format tanggal bahasa Indonesia tidak sesuai: ${displayDate}`);
  }

  console.log('✓ PASS: Struktur checklist amalan ibadah dan penanganan tanggal terverifikasi.\n');
}

// 4. Test Sistem Kotak 30 Hari Ramadan & Pelacak Puasa Udzur Syar'i
function testFastingAnd30DaySlots() {
  console.log('Test 4: Menguji Sistem Kotak 30 Hari Ramadan & Pelacak Puasa/Udzur');

  // Test 30 slots
  const slots = get30DaysRamadanSlots();
  if (!slots || slots.length !== 30) {
    throw new Error(`Kotak hari Ramadan harus berjumlah 30! Ditemukan: ${slots?.length}`);
  }

  console.log(`- Total Kotak Hari Ramadan: ${slots.length} kotak (Hari 1 s/d Hari 30)`);
  console.log(`  • Hari 1: ${slots[0].dateStr} (${slots[0].hijriFormatted})`);
  console.log(`  • Hari 17 (Nuzulul Quran): ${slots[16].dateStr} (${slots[16].hijriFormatted})`);
  console.log(`  • Hari 30: ${slots[29].dateStr} (${slots[29].hijriFormatted})`);

  // Test Alasan Udzur Syar'i & Fiqih Rulings
  const requiredReasons = ['haid_nifas', 'sakit', 'safar', 'hamil_menyusui', 'lansia_lemah', 'lainnya'];
  for (const r of requiredReasons) {
    const cfg = FASTING_REASONS_CONFIG[r];
    if (!cfg || !cfg.label || !cfg.obligation || !cfg.description) {
      throw new Error(`Konfigurasi alasan udzur tidak lengkap untuk: ${r}`);
    }
  }

  console.log('- Alasan Udzur Puasa Terkonfigurasi:');
  console.log(`  • Haid/Nifas: ${FASTING_REASONS_CONFIG.haid_nifas.obligation}`);
  console.log(`  • Sakit: ${FASTING_REASONS_CONFIG.sakit.obligation}`);
  console.log(`  • Safar: ${FASTING_REASONS_CONFIG.safar.obligation}`);
  console.log(`  • Lansia/Lemah: ${FASTING_REASONS_CONFIG.lansia_lemah.obligation}`);

  // Test pencatatan status puasa
  const testDate = slots[0].dateStr;
  const recordedFasting = updateFastingRecord(testDate, {
    status: 'puasa',
    obligationType: 'tidak_ada',
  });

  if (recordedFasting.fasting?.status !== 'puasa') {
    throw new Error('Gagal mencatat status puasa');
  }

  // Test pencatatan tidak puasa dengan alasan udzur
  const testDate2 = slots[1].dateStr;
  const recordedUdzur = updateFastingRecord(testDate2, {
    status: 'tidak_puasa',
    reason: 'sakit',
    reasonNote: 'Demam tinggi perlu antibiotik',
    obligationType: 'qadha',
  });

  if (
    recordedUdzur.fasting?.status !== 'tidak_puasa' ||
    recordedUdzur.fasting?.reason !== 'sakit' ||
    recordedUdzur.fasting?.reasonNote !== 'Demam tinggi perlu antibiotik'
  ) {
    throw new Error('Gagal mencatat status tidak puasa dengan alasan udzur sakit');
  }

  const stats = getRamadanMonthlyStats();
  console.log(`- Statistik Akumulatif: Total Hari=${stats.totalDays}, Rerata Amalan=${stats.averagePercentage}%`);

  console.log('✓ PASS: Sistem 30 kotak hari Ramadan, status puasa, dan pencatatan alasan udzur syar\'i terverifikasi berfungsi sempurna.\n');
}

try {
  testDuaDatasetCompleteness();
  testDuaSearchAndFilter();
  testIbadahTrackerStructure();
  testFastingAnd30DaySlots();
  console.log('=== ALL PHASE 4 TESTS PASSED SUCCESSFULLY! ===');
} catch (e) {
  console.error('PHASE 4 TEST SUITE FAILED:', e);
  process.exit(1);
}
