export type PodcastCategory = 'tidur' | 'buka' | 'sahur' | 'kajian';
export type PodcastMediaMode = 'mp3' | 'mp4';

export interface PodcastEpisode {
  id: string;
  title: string;
  speaker: string;
  category: PodcastCategory;
  categoryLabel: string;
  suitableFor: string;
  description: string;
  duration: string; // e.g. "48:30"
  durationSeconds: number;
  audioUrl?: string; // Direct audio mp3 stream if available
  youtubeId?: string; // YouTube Video ID (e.g. "ik82ZtQG5Ls")
  imageUrl: string;
  tags: string[];
  isCustom?: boolean;
}

export const PODCAST_CATEGORIES = [
  {
    id: 'all',
    label: 'Semua Podcast',
    description: 'Seluruh koleksi audio kajian dan penyejuk jiwa Ramadan',
    icon: 'Radio',
  },
  {
    id: 'tidur',
    label: 'Pengantar Tidur 🌙',
    description: 'Suara tenang & kisah penyejuk kalbu untuk istirahat malam yang damai',
    icon: 'Moon',
  },
  {
    id: 'buka',
    label: 'Menunggu Buka (Ngabuburit) 🌅',
    description: 'Tausiyah santai & tadabbur penuh hikmah menyambut adzan Maghrib',
    icon: 'Sunset',
  },
  {
    id: 'sahur',
    label: 'Menemani Sahur 🥣',
    description: 'Pembangkit semangat sahur & munajat sepertiga malam terakhir',
    icon: 'Sunrise',
  },
  {
    id: 'kajian',
    label: 'Tadabbur & Fiqih 📖',
    description: 'Pendalaman makna Al-Qur\'an dan amalan utama bulan suci',
    icon: 'BookOpen',
  },
];

