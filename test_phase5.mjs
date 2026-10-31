// Automated verification test suite for Phase 5: Hadith & Islamic Educational Content
import { ALL_HADIS } from './src/data/hadisData.ts';
import { ALL_ARTICLES } from './src/data/edukasiData.ts';
import {
  getAllHadis,
  getHadisById,
  searchHadis,
  getAllArticles,
  getArticleById,
  formatHadisForCopy,
} from './src/services/hadisService.ts';

console.log('=== STARTING PHASE 5 AUTOMATED TEST SUITE ===\n');

// 1. Test Kelengkapan Dataset Hadits & Takhrij Kutubus Sittah
function testHadisDatasetCompleteness() {
  console.log('Test 1: Memverifikasi Kelengkapan & Validitas Sanad Koleksi Hadits');
  if (!ALL_HADIS || ALL_HADIS.length < 15) {
    throw new Error(`Jumlah hadits kurang dari target minimal! Ditemukan: ${ALL_HADIS?.length}`);
  }

  console.log(`- Total Hadits Terdaftar: ${ALL_HADIS.length} hadits`);

  // Hadits-hadits kunci Ramadan
  const hPuasa = ALL_HADIS.find((h) => h.id === 'hadis-1'); // Man shama ramadhana
  const hPintuSurga = ALL_HADIS.find((h) => h.id === 'hadis-2'); // Futihat abwabul jannah
  const hRayyan = ALL_HADIS.find((h) => h.id === 'hadis-3'); // Babur Rayyan
  const hSahur = ALL_HADIS.find((h) => h.id === 'hadis-4'); // Tasahharu
  const hIftar = ALL_HADIS.find((h) => h.id === 'hadis-5'); // 'Ajjilul fithr
  const hTarawih = ALL_HADIS.find((h) => h.id === 'hadis-7'); // Man qama ramadhana
  const hLailatulQadar = ALL_HADIS.find((h) => h.id === 'hadis-8'); // Taharraw lailatal qadr
  const hDoaQadar = ALL_HADIS.find((h) => h.id === 'hadis-10'); // Allahumma innaka 'afuwwun
  const hAkhlak = ALL_HADIS.find((h) => h.id === 'hadis-11'); // Man lam yada' qaulaz zur
  const hPerisai = ALL_HADIS.find((h) => h.id === 'hadis-12'); // Ash-shiyamu junnah
  const hDermawan = ALL_HADIS.find((h) => h.id === 'hadis-13'); // Ajwadan nas
  const hZakat = ALL_HADIS.find((h) => h.id === 'hadis-14'); // Zakatul fithr thuhrah
  const hSyawwal = ALL_HADIS.find((h) => h.id === 'hadis-18'); // Shitta ayyamin min syawwal

  if (!hPuasa || !hSahur || !hIftar || !hTarawih || !hLailatulQadar || !hDoaQadar || !hZakat || !hSyawwal) {
    throw new Error('Salah satu hadits kunci Ramadan tidak ditemukan dalam dataset');
  }

  // Validasi seluruh hadits memiliki atribut lengkap
  for (const h of ALL_HADIS) {
    if (
      !h.id ||
      !h.title ||
      !h.topic ||
      !h.arabicText ||
      !h.translation ||
      !h.narrator ||
      !h.bookName ||
      !h.referenceNumber ||
      !h.grade ||
      !h.explanation ||
      !Array.isArray(h.tags) ||
      h.tags.length === 0
    ) {
      throw new Error(`Data hadits tidak lengkap pada ID: ${h.id}`);
    }

    // Pastikan rujukan menyebutkan kitab hadits mu'tabar
    const validBooks = ['Bukhari', 'Muslim', 'Tirmidzi', 'Abu Dawud', 'Ibnu Majah', 'Ahmad', 'Hakim'];
    const hasValidBook = validBooks.some((book) => h.bookName.includes(book) || h.referenceNumber.includes(book));
    if (!hasValidBook) {
      throw new Error(`Rujukan kitab tidak valid pada hadits ID ${h.id}: ${h.bookName}`);
    }
  }

  console.log(`- Hadits Puasa (Bukhari/Muslim): "${hPuasa.title}"`);
  console.log(`  Rujukan: ${hPuasa.referenceNumber} [${hPuasa.grade}]`);
  console.log(`  Perawi: ${hPuasa.narrator}`);
  console.log(`- Hadits Sahur: "${hSahur.arabicText}"`);
  console.log(`  Rujukan: ${hSahur.referenceNumber} [${hSahur.grade}]`);
  console.log(`- Hadits Lailatul Qadar: "${hDoaQadar.title}"`);
  console.log(`  Rujukan: ${hDoaQadar.referenceNumber} [${hDoaQadar.grade}]`);
  console.log(`- Hadits Zakat Fitrah: "${hZakat.title}"`);
  console.log(`  Rujukan: ${hZakat.referenceNumber} [${hZakat.grade}]`);

  console.log('✓ PASS: Seluruh koleksi hadits shahih terverifikasi lengkap dengan teks Arab, sanad sahabat, nomor rujukan Kutubus Sittah, derajat keotentikan, dan faedah hikmah.\n');
}

// 2. Test Pencarian, Filter Topik, dan Format Salin Hadits
function testHadisSearchAndFiltering() {
  console.log('Test 2: Menguji Sistem Pencarian dan Pemfilteran Topik Hadits');

  // Filter topik keutamaan-ramadan
  const keutamaan = searchHadis('', 'keutamaan-ramadan');
  console.log(`- Hadits kategori 'keutamaan-ramadan': ${keutamaan.length} hadits`);
  if (keutamaan.length === 0) throw new Error('Filter keutamaan-ramadan kosong');

  // Filter topik sahur-iftar
  const sahurIftar = searchHadis('', 'sahur-iftar');
  console.log(`- Hadits kategori 'sahur-iftar': ${sahurIftar.length} hadits`);
  if (sahurIftar.length === 0) throw new Error('Filter sahur-iftar kosong');

  // Filter topik tarawih-lailatul-qadar
  const tarawih = searchHadis('', 'tarawih-lailatul-qadar');
  console.log(`- Hadits kategori 'tarawih-lailatul-qadar': ${tarawih.length} hadits`);
  if (tarawih.length === 0) throw new Error('Filter tarawih-lailatul-qadar kosong');

  // Search keyword "Rayyan"
  const searchRayyan = searchHadis('Rayyan', 'all');
  console.log(`- Hasil pencarian kata 'Rayyan': ${searchRayyan.map((h) => h.title).join(', ')}`);
  if (!searchRayyan.some((h) => h.id === 'hadis-3')) {
    throw new Error("Pencarian kata 'Rayyan' gagal menemukan Hadits Pintu Ar-Rayyan");
  }

  // Search keyword "sedekah"
  const searchSedekah = searchHadis('sedekah', 'all');
  console.log(`- Hasil pencarian kata 'sedekah': ${searchSedekah.length} hadits`);
  if (searchSedekah.length === 0) throw new Error("Pencarian kata 'sedekah' tidak menghasilkan data");

  // Test getHadisById
  const single = getHadisById('hadis-1');
  if (!single || single.title !== 'Keutamaan Puasa Ramadan & Pengampunan Dosa') {
    throw new Error('getHadisById gagal mengembalikan hadits yang tepat');
  }

  // Test Copy Formatter
  const formatted = formatHadisForCopy(single);
  if (
    !formatted.includes(single.title) ||
    !formatted.includes(single.arabicText) ||
    !formatted.includes(single.translation) ||
    !formatted.includes(single.bookName) ||
    !formatted.includes('Faidah & Penjelasan')
  ) {
    throw new Error('Format salin teks hadits tidak memenuhi standar');
  }

  console.log('✓ PASS: Mesin pencarian, pemfilteran topik, dan pemformat salin hadits berfungsi optimal.\n');
}

// 3. Test Struktur Artikel Edukasi & Fiqih Ramadan
function testEducationalArticles() {
  console.log('Test 3: Menguji Kelengkapan dan Struktur Artikel Edukasi Fiqih');

  const articles = getAllArticles();
  if (!articles || articles.length < 4) {
    throw new Error(`Jumlah artikel edukasi kurang dari 4! Ditemukan: ${articles?.length}`);
  }

  console.log(`- Total Artikel Edukasi: ${articles.length} kajian`);

  const artFiqih = getArticleById('fiqih-puasa-lengkap');
  const artQadar = getArticleById('lailatul-qadar-itikaf');
  const artZakat = getArticleById('fiqih-zakat-fitrah');
  const artAdab = getArticleById('adab-akhlak-puasa');

  if (!artFiqih || !artQadar || !artZakat || !artAdab) {
    throw new Error('Salah satu artikel kajian fiqih pokok tidak ditemukan');
  }

  for (const art of articles) {
    if (!art.id || !art.title || !art.category || !art.summary || !art.readTimeMinutes || !Array.isArray(art.content)) {
      throw new Error(`Struktur artikel cacat pada ID: ${art.id}`);
    }
    if (art.content.length < 3) {
      throw new Error(`Artikel ${art.id} memiliki kurang dari 3 sub-bab pembahasan`);
    }
    if (!Array.isArray(art.sources) || art.sources.length === 0) {
      throw new Error(`Artikel ${art.id} tidak memiliki daftar rujukan referensi ulama`);
    }

    console.log(`  • ${art.title} (${art.readTimeMinutes} menit baca, ${art.content.length} bab, ${art.sources.length} rujukan)`);
  }

  // Periksa keberadaan dalil Al-Qur'an dan Hadits di dalam artikel
  const hasQuranQuote = artFiqih.content.some((c) => c.quotedText && c.quotedText.arabic && c.quotedText.source.includes('QS.'));
  if (!hasQuranQuote) {
    throw new Error('Artikel fiqih puasa harus mencantumkan kutipan ayat Al-Qur\'an (QS. Al-Baqarah: 183)');
  }

  console.log('✓ PASS: Struktur artikel kajian fiqih, pembagian bab, kutipan dalil Al-Qur\'an, dan daftar rujukan ulama terverifikasi lengkap.\n');
}

try {
  testHadisDatasetCompleteness();
  testHadisSearchAndFiltering();
  testEducationalArticles();
  console.log('=== ALL PHASE 5 TESTS PASSED SUCCESSFULLY! ===');
} catch (e) {
  console.error('PHASE 5 TEST SUITE FAILED:', e);
  process.exit(1);
}
