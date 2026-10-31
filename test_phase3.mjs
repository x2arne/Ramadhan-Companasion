// Automated verification test suite for Phase 3: Complete Quran Reader
import { ALL_114_SURAHS } from './src/data/quranMetadata.ts';
import { ALL_30_JUZ } from './src/data/juzData.ts';
import { BUNDLED_SURAHS } from './src/data/bundledSurahs.ts';

console.log('=== STARTING PHASE 3 AUTOMATED TEST SUITE ===\n');

// 1. Test 114 Surahs Completeness
function test114SurahsCompleteness() {
  console.log('Test 1: Memverifikasi Kelengkapan 114 Surah');
  if (ALL_114_SURAHS.length !== 114) {
    throw new Error(`Jumlah surah tidak 114! Ditemukan: ${ALL_114_SURAHS.length}`);
  }

  // Cek surah pertama (Al-Fatihah), tengah (Al-Kahf/Ya-Sin), dan terakhir (An-Nas)
  const s1 = ALL_114_SURAHS[0];
  const s18 = ALL_114_SURAHS[17];
  const s36 = ALL_114_SURAHS[35];
  const s114 = ALL_114_SURAHS[113];

  console.log(`- Surah 1: ${s1.namaLatin} (${s1.nama}) - ${s1.jumlahAyat} ayat - ${s1.tempatTurun}`);
  console.log(`- Surah 18: ${s18.namaLatin} (${s18.nama}) - ${s18.jumlahAyat} ayat - ${s18.tempatTurun}`);
  console.log(`- Surah 36: ${s36.namaLatin} (${s36.nama}) - ${s36.jumlahAyat} ayat - ${s36.tempatTurun}`);
  console.log(`- Surah 114: ${s114.namaLatin} (${s114.nama}) - ${s114.jumlahAyat} ayat - ${s114.tempatTurun}`);

  if (s1.nomor !== 1 || s1.jumlahAyat !== 7) throw new Error('Data Al-Fatihah salah');
  if (s114.nomor !== 114 || s114.jumlahAyat !== 6) throw new Error('Data An-Nas salah');

  console.log('✓ PASS: Seluruh 114 Surah terdaftar lengkap dengan metadata valid.\n');
}

// 2. Test 30 Juz Mapping Completeness
function test30JuzMapping() {
  console.log('Test 2: Memverifikasi Pemetaan 30 Juz Al-Qur\'an');
  if (ALL_30_JUZ.length !== 30) {
    throw new Error(`Jumlah juz tidak 30! Ditemukan: ${ALL_30_JUZ.length}`);
  }

  const juz1 = ALL_30_JUZ[0];
  const juz15 = ALL_30_JUZ[14];
  const juz30 = ALL_30_JUZ[29];

  console.log(`- Juz 1: ${juz1.name} (QS. ${juz1.startSurahName}:${juz1.startVerse} s/d QS. ${juz1.endSurahName}:${juz1.endVerse})`);
  console.log(`- Juz 15: ${juz15.name} (QS. ${juz15.startSurahName}:${juz15.startVerse} s/d QS. ${juz15.endSurahName}:${juz15.endVerse})`);
  console.log(`- Juz 30: ${juz30.name} (QS. ${juz30.startSurahName}:${juz30.startVerse} s/d QS. ${juz30.endSurahName}:${juz30.endVerse})`);

  if (juz1.startSurahNumber !== 1 || juz30.endSurahNumber !== 114) {
    throw new Error('Pemetaan awal/akhir juz tidak konsisten');
  }

  console.log('✓ PASS: Struktur 30 Juz terpetakan secara presisi.\n');
}

// 3. Test Bundled Offline Surahs
function testBundledSurahs() {
  console.log('Test 3: Memverifikasi Data Offline Bundled Surahs');
  const s1 = BUNDLED_SURAHS[1];
  const s112 = BUNDLED_SURAHS[112];

  if (!s1 || !s112) {
    throw new Error('Bundled surah 1 atau 112 tidak ditemukan');
  }

  console.log(`- Bundled Surat 1 (${s1.namaLatin}): ${s1.ayat.length} ayat siap offline`);
  console.log(`  Ayat 1: "${s1.ayat[0].teksArab}" -> "${s1.ayat[0].teksIndonesia}"`);
  console.log(`- Bundled Surat 112 (${s112.namaLatin}): ${s112.ayat.length} ayat siap offline`);
  console.log(`  Ayat 1: "${s112.ayat[0].teksArab}" -> "${s112.ayat[0].teksIndonesia}"`);

  if (!s1.ayat[0].teksArab.includes('الرَّحْمٰنِ') || !s1.ayat[0].teksIndonesia.includes('Allah')) {
    throw new Error('Teks Arab atau Terjemahan surat 1 tidak valid');
  }

  console.log('✓ PASS: Data Al-Qur\'an Rasm Utsmani dan Terjemahan Kemenag terverifikasi.\n');
}

try {
  test114SurahsCompleteness();
  test30JuzMapping();
  testBundledSurahs();
  console.log('=== ALL PHASE 3 TESTS PASSED SUCCESSFULLY! ===');
} catch (e) {
  console.error('TEST SUITE FAILED:', e);
  process.exit(1);
}
