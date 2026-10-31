import type {
  WorshipItem,
  DailyWorshipRecord,
  WorshipSummary,
  QuranProgressRecord,
  FastingRecord,
  FastingStatus,
  FastingReason,
  RamadanDayWorshipSlot,
} from '../types/ibadah';

const STORAGE_WORSHIP_KEY = 'ramadan_worship_history_v1';

// Konfigurasi Alasan Udzur Syar'i & Konsekuensi Hukum Fiqih
export const FASTING_REASONS_CONFIG: Record<
  FastingReason,
  {
    label: string;
    shortLabel: string;
    obligation: string;
    obligationType: 'qadha' | 'fidyah' | 'qadha_fidyah' | 'tidak_ada';
    description: string;
    dalilSummary: string;
  }
> = {
  haid_nifas: {
    label: 'Haid / Nifas (Khusus Wanita)',
    shortLabel: 'Haid',
    obligation: 'Wajib Qadha',
    obligationType: 'qadha',
    description:
      'Muslimah yang sedang haid atau nifas diharamkan berpuasa dan wajib mengganti (qadha) sejumlah hari yang ditinggalkan setelah bulan Ramadan selesai.',
    dalilSummary:
      'Dari Aisyah RA: "Kami dahulu diperintahkan untuk mengqadha puasa dan tidak diperintahkan mengqadha shalat." (HR. Muslim No. 335)',
  },
  sakit: {
    label: 'Sakit / Perawatan Medis',
    shortLabel: 'Sakit',
    obligation: 'Wajib Qadha',
    obligationType: 'qadha',
    description:
      'Sakit yang membutuhkan konsumsi obat terjadwal atau jika berpuasa dapat memperparah kondisi fisik, diperbolehkan berbuka dan wajib qadha saat telah pulih.',
    dalilSummary:
      'QS. Al-Baqarah: 185: "...Maka barangsiapa di antara kamu sakit atau dalam perjalanan, (wajib mengganti) sebanyak hari yang ditinggalkannya pada hari-hari yang lain."',
  },
  safar: {
    label: 'Safar / Perjalanan Jauh',
    shortLabel: 'Safar',
    obligation: 'Wajib Qadha',
    obligationType: 'qadha',
    description:
      'Perjalanan musafir yang memenuhi jarak masafatul qashr (±81 km) mendapatkan rukhshah (keringanan) untuk tidak berpuasa dan wajib qadha di hari lain.',
    dalilSummary:
      'Rasulullah ﷺ bersabda: "Sesungguhnya Allah meringankan separuh shalat bagi musafir, serta meringankan puasa bagi musafir..." (HR. Tirmidzi No. 715)',
  },
  hamil_menyusui: {
    label: 'Hamil atau Menyusui',
    shortLabel: 'Hamil/Menyusui',
    obligation: 'Qadha / Fidyah',
    obligationType: 'qadha_fidyah',
    description:
      'Ibu hamil atau menyusui yang mengkhawatirkan kesehatan dirinya dan/atau bayinya boleh tidak berpuasa. Kewajiban qadha dan/atau fidyah berlaku sesuai tinjauan fiqih.',
    dalilSummary:
      'Fatwa jumhur ulama berlandaskan hadits riwayat Abu Dawud & Tirmidzi mengenai rukhshah bagi wanita hamil dan menyusui.',
  },
  lansia_lemah: {
    label: 'Lanjut Usia / Lemah Fisik Menahun',
    shortLabel: 'Fidyah',
    obligation: 'Wajib Fidyah',
    obligationType: 'fidyah',
    description:
      'Orang tua lanjut usia atau penderita sakit menahun yang tidak ada harapan sembuh tidak wajib berpuasa dan tidak wajib qadha, melainkan cukup membayar fidyah (1 mud / ±675 gram makanan pokok per hari).',
    dalilSummary:
      'QS. Al-Baqarah: 184: "Dan bagi orang yang berat menjalankannya, wajib membayar fidyah, yaitu memberi makan seorang miskin..."',
  },
  lainnya: {
    label: 'Udzur Syar\'i Lainnya / Halangan Tertentu',
    shortLabel: 'Lainnya',
    obligation: 'Sesuai Kaidah Fiqih',
    obligationType: 'qadha',
    description:
      'Kondisi darurat atau halangan khusus lainnya yang dibenarkan oleh syariat Islam.',
    dalilSummary: 'Kaidah Fiqih: Al-Masyaqqatu tajlibut taysir (Kesukaran mendatangkan kemudahan).',
  },
};

export const DEFAULT_WORSHIP_ITEMS: WorshipItem[] = [
  // Fardhu
  {
    id: 'fardhu-subuh',
    label: 'Sholat Subuh Tepat Waktu / Berjamaah',
    arabicLabel: 'صَلَاةُ الصُّبْحِ',
    category: 'fardhu',
    description: 'Menjaga sholat fardhu di awal waktu adalah amalan paling dicintai Allah.',
  },
  {
    id: 'fardhu-dzuhur',
    label: 'Sholat Dzuhur',
    arabicLabel: 'صَلَاةُ الظُّهْرِ',
    category: 'fardhu',
    description: 'Empat rakaat di tengah aktivitas siang hari.',
  },
  {
    id: 'fardhu-ashar',
    label: 'Sholat Ashar',
    arabicLabel: 'صَلَاةُ العَصْرِ',
    category: 'fardhu',
    description: 'Sholat Wustha penenang jiwa di waktu sore.',
  },
  {
    id: 'fardhu-maghrib',
    label: 'Sholat Maghrib',
    arabicLabel: 'صَلَاةُ المَغْرِبِ',
    category: 'fardhu',
    description: 'Menunaikan sholat setelah menyempurnakan ibadah puasa dan berbuka.',
  },
  {
    id: 'fardhu-isya',
    label: 'Sholat Isya',
    arabicLabel: 'صَلَاةُ العِشَاءِ',
    category: 'fardhu',
    description: 'Penutup sholat fardhu sebelum melangkah ke sholat malam.',
  },

  // Sunnah Ramadan & Sholat Malam
  {
    id: 'sunnah-tarawih-witir',
    label: 'Sholat Tarawih & Witir Berjamaah',
    arabicLabel: 'صَلَاةُ التَّرَاوِيحِ وَالوِتْرِ',
    category: 'sunnah',
    description: 'Qiyam Ramadan berpahala diampuni dosa-dosa yang telah lalu.',
  },
  {
    id: 'sunnah-dhuha',
    label: 'Sholat Sunnah Dhuha (2 - 8 Rakaat)',
    arabicLabel: 'صَلَاةُ الضُّحَى',
    category: 'sunnah',
    description: 'Sedekah bagi 360 persendian tubuh di pagi hari.',
  },
  {
    id: 'sunnah-rawatib',
    label: 'Sholat Sunnah Rawatib (Qabliyah / Ba\'diyah)',
    arabicLabel: 'السُّنَنُ الرَّوَاتِبُ',
    category: 'sunnah',
    description: 'Menyempurnakan dan menambal kekurangan pada sholat fardhu.',
  },
  {
    id: 'sunnah-tahajjud',
    label: 'Qiyamul Lail / Tahajjud di Waktu Sahur',
    arabicLabel: 'قِيَامُ اللَّيْلِ',
    category: 'sunnah',
    description: 'Munajat mustajab sepertiga malam menjelang santap sahur.',
  },

  // Al-Qur'an
  {
    id: 'quran-tilawah',
    label: 'Tilawah Al-Qur\'an (1 Juz / Lembar Harian)',
    arabicLabel: 'تِلَاوَةُ القُرْآنِ الكَرِيمِ',
    category: 'quran',
    description: 'Setiap huruf dilipatgandakan pahalanya sepuluh kebaikan di bulan mulia.',
  },
  {
    id: 'quran-tadabbur',
    label: 'Tadabbur Ayat & Membaca Terjemahan',
    arabicLabel: 'تَدَبُّرُ الآيَاتِ',
    category: 'quran',
    description: 'Memahami makna petunjuk hidup firman Allah Ta\'ala.',
  },

  // Sedekah & Kebaikan
  {
    id: 'sedekah-harian',
    label: 'Sedekah Harian / Sedekah Subuh',
    arabicLabel: 'الصَّدَقَةُ الجَارِيَةُ',
    category: 'sedekah',
    description: 'Kedermawanan Rasulullah SAW paling melimpah di bulan Ramadan.',
  },
  {
    id: 'sedekah-berbagi-iftar',
    label: 'Berbagi Iftar / Memberi Makan yang Berpuasa',
    arabicLabel: 'إِفْطَارُ صَائِمٍ',
    category: 'sedekah',
    description: 'Memperoleh pahala semisal orang yang berpuasa tanpa mengurangi pahalanya.',
  },

  // Dzikir & Doa
  {
    id: 'dzikir-pagi-petang',
    label: 'Dzikir Pagi & Petang / Al-Ma\'tsurat',
    arabicLabel: 'أَذْكَارُ الصَّبَاحِ وَالمَسَاءِ',
    category: 'dzikir',
    description: 'Benteng perlindungan diri sepanjang siang dan malam.',
  },
  {
    id: 'dzikir-istighfar',
    label: 'Memperbanyak Istighfar & Doa Ampunan',
    arabicLabel: 'الاِسْتِغْفَارُ وَالتَّوْبَةُ',
    category: 'dzikir',
    description: 'Mengetuk pintu ampunan Allah di waktu sahur dan menjelang berbuka.',
  },
];

// Tanggal awal Ramadan 1448 H (8 Februari 2027) sebagai basis 30 hari Ramadan
export const RAMADAN_1448_START_YEAR = 2027;
export const RAMADAN_1448_START_MONTH = 1; // 0-indexed: 1 = Februari
export const RAMADAN_1448_START_DAY = 8;

/**
 * Mendapatkan string tanggal format 'YYYY-MM-DD' untuk Hari ke-1 s/d Hari ke-30 Ramadan 1448 H
 */
export function getRamadanDayDate(dayNumber: number): string {
  const safeDay = Math.max(1, Math.min(30, dayNumber));
  const base = new Date(RAMADAN_1448_START_YEAR, RAMADAN_1448_START_MONTH, RAMADAN_1448_START_DAY);
  base.setDate(base.getDate() + (safeDay - 1));
  return getLocalDateString(base);
}

/**
 * Mencari tahu apakah tanggal YYYY-MM-DD bertepatan dengan salah satu hari Ramadan 1448 H (1-30)
 */
export function getRamadanDayNumber(dateStr: string): number | null {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;
  const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  const start = new Date(RAMADAN_1448_START_YEAR, RAMADAN_1448_START_MONTH, RAMADAN_1448_START_DAY);
  const diffTime = d.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays >= 0 && diffDays < 30) {
    return diffDays + 1;
  }
  return null;
}

/**
 * Dapatkan string tanggal format 'YYYY-MM-DD' lokal
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format tanggal ramah pengguna bahasa Indonesia (e.g. "Selasa, 27 Oktober 2026")
 */
export function formatDisplayDate(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  } catch {
    // fallback
  }
  return dateStr;
}

/**
 * Baca seluruh riwayat catatan ibadah dari localStorage
 */
export function getAllWorshipRecords(): Record<string, DailyWorshipRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_WORSHIP_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Gagal membaca ramadan_worship_history_v1 dari localStorage', e);
  }
  return {};
}

/**
 * Simpan seluruh riwayat catatan ibadah ke localStorage
 */
function saveAllWorshipRecords(records: Record<string, DailyWorshipRecord>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_WORSHIP_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Gagal menyimpan ramadan_worship_history_v1 ke localStorage', e);
  }
}

/**
 * Dapatkan catatan ibadah spesifik untuk tanggal tertentu
 */
export function getDailyWorshipRecord(dateStr: string): DailyWorshipRecord {
  const all = getAllWorshipRecords();
  if (all[dateStr]) {
    return all[dateStr];
  }

  const rDay = getRamadanDayNumber(dateStr);

  return {
    date: dateStr,
    ramadanDay: rDay || undefined,
    fasting: undefined,
    completedItemIds: [],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Update status puasa dan alasan udzur syar'i untuk tanggal tertentu
 */
export function updateFastingRecord(
  dateStr: string,
  fasting: FastingRecord
): DailyWorshipRecord {
  const all = getAllWorshipRecords();
  const current = all[dateStr] || {
    date: dateStr,
    ramadanDay: getRamadanDayNumber(dateStr) || undefined,
    completedItemIds: [],
    updatedAt: new Date().toISOString(),
  };

  const updated: DailyWorshipRecord = {
    ...current,
    fasting,
    updatedAt: new Date().toISOString(),
  };

  all[dateStr] = updated;
  saveAllWorshipRecords(all);
  return updated;
}

/**
 * Toggle checklist amalan ibadah untuk tanggal tertentu
 */
export function toggleWorshipItem(dateStr: string, itemId: string): DailyWorshipRecord {
  const all = getAllWorshipRecords();
  const current = all[dateStr] || {
    date: dateStr,
    ramadanDay: getRamadanDayNumber(dateStr) || undefined,
    completedItemIds: [],
    updatedAt: new Date().toISOString(),
  };

  const set = new Set(current.completedItemIds);
  if (set.has(itemId)) {
    set.delete(itemId);
  } else {
    set.add(itemId);
  }

  const updated: DailyWorshipRecord = {
    ...current,
    completedItemIds: Array.from(set),
    updatedAt: new Date().toISOString(),
  };

  all[dateStr] = updated;
  saveAllWorshipRecords(all);
  return updated;
}

/**
 * Simpan / perbarui catatan sedekah harian
 */
export function updateSedekahRecord(
  dateStr: string,
  note: string,
  amount?: number
): DailyWorshipRecord {
  const all = getAllWorshipRecords();
  const current = all[dateStr] || {
    date: dateStr,
    ramadanDay: getRamadanDayNumber(dateStr) || undefined,
    completedItemIds: [],
    updatedAt: new Date().toISOString(),
  };

  // Otomatis centang item sedekah jika nominal atau catatan diisi
  const completedSet = new Set(current.completedItemIds);
  if (note.trim() || (amount && amount > 0)) {
    completedSet.add('sedekah-harian');
  }

  const updated: DailyWorshipRecord = {
    ...current,
    completedItemIds: Array.from(completedSet),
    sedekahNote: note,
    sedekahAmount: amount,
    updatedAt: new Date().toISOString(),
  };

  all[dateStr] = updated;
  saveAllWorshipRecords(all);
  return updated;
}

/**
 * Sinkronkan atau simpan progres baca Al-Qur'an hari ini
 */
export function updateQuranProgress(
  dateStr: string,
  progress: QuranProgressRecord
): DailyWorshipRecord {
  const all = getAllWorshipRecords();
  const current = all[dateStr] || {
    date: dateStr,
    ramadanDay: getRamadanDayNumber(dateStr) || undefined,
    completedItemIds: [],
    updatedAt: new Date().toISOString(),
  };

  const completedSet = new Set(current.completedItemIds);
  if (progress.surahName || (progress.pagesRead && progress.pagesRead > 0)) {
    completedSet.add('quran-tilawah');
  }

  const updated: DailyWorshipRecord = {
    ...current,
    completedItemIds: Array.from(completedSet),
    quranProgress: progress,
    updatedAt: new Date().toISOString(),
  };

  all[dateStr] = updated;
  saveAllWorshipRecords(all);
  return updated;
}

/**
 * Tarik posisi baca Quran terakhir (dari Quran Reader) ke catatan ibadah hari ini
 */
export function pullLastReadToToday(): DailyWorshipRecord | null {
  if (typeof window === 'undefined') return null;
  const todayStr = getLocalDateString();
  try {
    const raw = localStorage.getItem('ramadan_quran_last_read');
    if (raw) {
      const lastRead = JSON.parse(raw);
      if (lastRead && lastRead.surahName) {
        return updateQuranProgress(todayStr, {
          surahNumber: lastRead.surahNumber,
          surahName: lastRead.surahName,
          verseNumber: lastRead.verseNumber,
          notes: `Sinkron otomatis dari posisi baca terakhir (QS. ${lastRead.surahName}:${lastRead.verseNumber})`,
        });
      }
    }
  } catch (e) {
    console.warn('Gagal membaca last read dari localStorage', e);
  }
  return null;
}

/**
 * Reset catatan ibadah untuk tanggal tertentu saja
 */
export function resetDailyWorship(dateStr: string): DailyWorshipRecord {
  const all = getAllWorshipRecords();
  const resetRecord: DailyWorshipRecord = {
    date: dateStr,
    ramadanDay: getRamadanDayNumber(dateStr) || undefined,
    fasting: undefined,
    completedItemIds: [],
    sedekahNote: undefined,
    sedekahAmount: undefined,
    quranProgress: undefined,
    notes: undefined,
    updatedAt: new Date().toISOString(),
  };

  all[dateStr] = resetRecord;
  saveAllWorshipRecords(all);
  return resetRecord;
}

/**
 * Hitung ringkasan capaian harian
 */
export function getWorshipSummary(dateStr: string): WorshipSummary {
  const record = getDailyWorshipRecord(dateStr);
  const total = DEFAULT_WORSHIP_ITEMS.length;
  const completed = record.completedItemIds.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const todayStr = getLocalDateString();

  return {
    date: dateStr,
    ramadanDay: record.ramadanDay,
    totalItems: total,
    completedCount: completed,
    percentage,
    isToday: dateStr === todayStr,
    fastingStatus: record.fasting?.status,
    fastingReason: record.fasting?.reason,
  };
}

/**
 * Menghasilkan struktur 30 kotak hari Ramadan (Hari 1 s/d Hari 30)
 */
export function get30DaysRamadanSlots(): RamadanDayWorshipSlot[] {
  const all = getAllWorshipRecords();
  const todayStr = getLocalDateString();
  const slots: RamadanDayWorshipSlot[] = [];

  for (let day = 1; day <= 30; day++) {
    const dateStr = getRamadanDayDate(day);
    const parts = dateStr.split('-');
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));

    const record = all[dateStr];
    const total = DEFAULT_WORSHIP_ITEMS.length;
    const completed = record ? record.completedItemIds.length : 0;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    slots.push({
      day,
      dateStr,
      dateFormatted: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      dayName: d.toLocaleDateString('id-ID', { weekday: 'short' }),
      hijriFormatted: `${day} Ramadan 1448 H`,
      summary: {
        date: dateStr,
        ramadanDay: day,
        totalItems: total,
        completedCount: completed,
        percentage,
        isToday: dateStr === todayStr,
        fastingStatus: record?.fasting?.status,
        fastingReason: record?.fasting?.reason,
      },
      fasting: record?.fasting,
      isToday: dateStr === todayStr,
    });
  }

  return slots;
}

/**
 * Dapatkan statistik akumulatif ibadah & puasa selama 30 hari Ramadan
 */
export function getRamadanMonthlyStats() {
  const slots = get30DaysRamadanSlots();
  let totalPuasa = 0;
  let totalTidakPuasa = 0;
  let totalSetengahHari = 0;
  let totalBelumDicatat = 0;
  let totalQadha = 0;
  let totalFidyah = 0;
  let sumPercentage = 0;

  for (const s of slots) {
    sumPercentage += s.summary.percentage;
    if (s.fasting?.status === 'puasa') {
      totalPuasa++;
    } else if (s.fasting?.status === 'tidak_puasa') {
      totalTidakPuasa++;
      const reasonMeta = s.fasting.reason ? FASTING_REASONS_CONFIG[s.fasting.reason] : null;
      if (reasonMeta?.obligationType === 'qadha' || reasonMeta?.obligationType === 'qadha_fidyah') {
        totalQadha++;
      }
      if (reasonMeta?.obligationType === 'fidyah' || reasonMeta?.obligationType === 'qadha_fidyah') {
        totalFidyah++;
      }
    } else if (s.fasting?.status === 'setengah_hari') {
      totalSetengahHari++;
    } else {
      totalBelumDicatat++;
    }
  }

  const averagePercentage = Math.round(sumPercentage / 30);

  return {
    totalDays: 30,
    totalPuasa,
    totalTidakPuasa,
    totalSetengahHari,
    totalBelumDicatat,
    totalQadha,
    totalFidyah,
    averagePercentage,
  };
}

/**
 * Dapatkan riwayat 7 hari terakhir untuk grafik mini konsistensi
 */
export function getRecent7DaysSummary(): Array<{
  dateStr: string;
  dayLabel: string;
  percentage: number;
  completedCount: number;
  isToday: boolean;
}> {
  const result = [];
  const today = new Date();
  const all = getAllWorshipRecords();
  const totalItems = DEFAULT_WORSHIP_ITEMS.length;

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = getLocalDateString(d);
    const dayName = d.toLocaleDateString('id-ID', { weekday: 'narrow' });

    const record = all[dateStr];
    const completedCount = record ? record.completedItemIds.length : 0;
    const percentage = Math.round((completedCount / totalItems) * 100);

    result.push({
      dateStr,
      dayLabel: dayName,
      percentage,
      completedCount,
      isToday: i === 0,
    });
  }

  return result;
}
