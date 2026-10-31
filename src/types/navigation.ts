import {
  Home,
  Clock,
  BookOpen,
  Sparkles,
  BookMarked,
  CalendarDays,
  Camera,
  Radio,
  Settings,
  Compass,
  Disc,
  Palette,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: any;
}

export interface KhazanahMenuItem extends NavItem {
  sublabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badge: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', path: '/', icon: Home },
  { id: 'jadwal', label: 'Jadwal', path: '/jadwal', icon: Clock },
  { id: 'quran', label: "Al-Qur'an", path: '/quran', icon: BookOpen },
  { id: 'ibadah', label: 'Ibadah', path: '/ibadah', icon: Sparkles },
];

export const KHAZANAH_MENU_ITEMS: KhazanahMenuItem[] = [
  {
    id: 'doa',
    label: 'Koleksi Doa',
    sublabel: 'Doa iftar, sahur, Lailatul Qadar & harian',
    path: '/doa',
    icon: Sparkles,
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    badge: 'Doa Shahih',
  },
  {
    id: 'hadis',
    label: 'Hadits Shahih & Fiqih',
    sublabel: 'Kutubus Sittah & artikel panduan puasa',
    path: '/hadis',
    icon: BookMarked,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    badge: 'Kutubus Sittah',
  },
  {
    id: 'kalender',
    label: 'Kalender Ramadan',
    sublabel: 'Fase bulan astronomis & estimasi Idul Fitri',
    path: '/kalender',
    icon: CalendarDays,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    badge: '1448 H',
  },
  {
    id: 'kiblat',
    label: 'Arah Kiblat Digital',
    sublabel: 'Kompas akurat & jarak ke Ka\'bah Makkah',
    path: '/kiblat',
    icon: Compass,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    badge: 'Kompas Ka\'bah',
  },
  {
    id: 'tasbih',
    label: 'Tasbih Digital',
    sublabel: 'Penghitung wirid bergetar & siklus ba\'da sholat',
    path: '/tasbih',
    icon: Disc,
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    badge: 'Haptic Touch',
  },
  {
    id: 'kartu-ucapan',
    label: 'Kartu Ucapan Ramadan',
    sublabel: 'Generator ucapan estetik, unduh PNG & WA',
    path: '/kartu-ucapan',
    icon: Palette,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    badge: 'Download PNG',
  },
  {
    id: 'galeri',
    label: 'Galeri Kenangan',
    sublabel: 'Jurnal foto sahur, bukber, & tarawih',
    path: '/galeri',
    icon: Camera,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    badge: 'Album Foto',
  },
  {
    id: 'podcast',
    label: 'Podcast Islami',
    sublabel: 'Mode MP4 (Video) & MP3 (Audio Banner)',
    path: '/podcast',
    icon: Radio,
    color: 'text-sky-400',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/30',
    badge: 'MP4 / MP3',
  },
  {
    id: 'pengaturan',
    label: 'Pengaturan & Cadangan',
    sublabel: 'Alarm adzan, metode hisab, & ekspor data',
    path: '/pengaturan',
    icon: Settings,
    color: 'text-slate-300',
    bgColor: 'bg-slate-700/20',
    borderColor: 'border-slate-700/40',
    badge: 'Sistem',
  },
];

export const mainNavItems = MAIN_NAV_ITEMS;
export const khazanahMenuItems = KHAZANAH_MENU_ITEMS;

