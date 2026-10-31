export type MemoryCategory =
  | 'buka-puasa'
  | 'sahur'
  | 'tarawih'
  | 'tilawah'
  | 'sedekah'
  | 'silaturahmi'
  | 'idul-fitri'
  | 'lainnya';

export interface RamadanMemory {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string; // YYYY-MM-DD
  day: number; // 1-31
  month: number; // 1-12
  monthName: string; // e.g. "Februari"
  year: number; // e.g. 2027
  hijriFormatted: string; // e.g. "15 Ramadan 1448 H"
  ramadanDay?: number; // e.g. 15
  location?: string;
  category: MemoryCategory;
  categoryLabel: string;
  createdAt: string;
}

export const MEMORY_CATEGORIES: { id: MemoryCategory; label: string; icon: string }[] = [
  { id: 'buka-puasa', label: 'Buka Puasa', icon: 'Utensils' },
  { id: 'sahur', label: 'Momen Sahur', icon: 'Moon' },
  { id: 'tarawih', label: 'Sholat Tarawih', icon: 'Sparkles' },
  { id: 'tilawah', label: 'Tadarus / Khatam', icon: 'BookOpen' },
  { id: 'sedekah', label: 'Sedekah & Berbagi', icon: 'HeartHandshake' },
  { id: 'silaturahmi', label: 'Bukber & Silaturahmi', icon: 'Users' },
  { id: 'idul-fitri', label: 'Hari Raya Idul Fitri', icon: 'Smile' },
  { id: 'lainnya', label: 'Kenangan Lainnya', icon: 'Camera' },
];

