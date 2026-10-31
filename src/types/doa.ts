export type DoaCategory = 'ramadan' | 'lailatul-qadar' | 'ibadah' | 'harian' | 'quran';

export type DoaAuthenticity = 'Shahih' | 'Hasan' | 'Ayat Al-Qur\'an' | 'Doa Ma\'tsur';

export interface DoaItem {
  id: string;
  title: string;
  arabicTitle?: string;
  category: DoaCategory;
  arabicText: string;
  transliteration: string;
  translation: string;
  source: string; // e.g. "HR. Abu Dawud no. 2357", "QS. Al-Baqarah: 201"
  authenticity: DoaAuthenticity;
  context?: string; // Anjuran waktu membaca
  tags: string[];
}
