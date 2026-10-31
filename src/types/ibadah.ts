export type WorshipCategory = 'fardhu' | 'sunnah' | 'quran' | 'sedekah' | 'dzikir';

export interface WorshipItem {
  id: string;
  label: string;
  arabicLabel?: string;
  category: WorshipCategory;
  description?: string;
}

export type FastingStatus = 'puasa' | 'tidak_puasa' | 'setengah_hari';

export type FastingReason =
  | 'haid_nifas'      // Haid / Nifas (Khusus Wanita) -> Wajib Qadha
  | 'sakit'           // Sakit yang Butuh Obat/Pengobatan -> Wajib Qadha
  | 'safar'           // Bepergian Jauh (Safar) -> Wajib Qadha
  | 'hamil_menyusui'  // Hamil atau Menyusui -> Qadha / Fidyah
  | 'lansia_lemah'    // Lanjut Usia / Sakit Menahun -> Wajib Fidyah
  | 'lainnya';        // Udzur Syar'i Lainnya

export interface FastingRecord {
  status: FastingStatus;
  reason?: FastingReason;
  reasonNote?: string;
  obligationType?: 'qadha' | 'fidyah' | 'qadha_fidyah' | 'tidak_ada';
}

export interface QuranProgressRecord {
  surahNumber?: number;
  surahName?: string;
  verseNumber?: number;
  juzNumber?: number;
  pagesRead?: number;
  notes?: string;
}

export interface DailyWorshipRecord {
  date: string; // ISO format 'YYYY-MM-DD'
  ramadanDay?: number; // 1 - 30 jika bertepatan dengan hari Ramadan
  fasting?: FastingRecord; // Status puasa & udzur alasan
  completedItemIds: string[];
  quranProgress?: QuranProgressRecord;
  sedekahNote?: string;
  sedekahAmount?: number;
  notes?: string;
  updatedAt: string;
}

export interface WorshipSummary {
  date: string;
  ramadanDay?: number;
  totalItems: number;
  completedCount: number;
  percentage: number;
  isToday: boolean;
  fastingStatus?: FastingStatus;
  fastingReason?: FastingReason;
}

export interface RamadanDayWorshipSlot {
  day: number; // 1 - 30
  dateStr: string; // 'YYYY-MM-DD'
  dateFormatted: string; // e.g. "8 Feb"
  dayName: string; // e.g. "Senin"
  hijriFormatted: string; // e.g. "1 Ramadan 1448 H"
  summary: WorshipSummary;
  fasting?: FastingRecord;
  isToday: boolean;
}
