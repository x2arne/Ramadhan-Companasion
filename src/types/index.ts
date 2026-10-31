export type NavItem = {
  id: string;
  label: string;
  path: string;
  icon: string;
  badge?: string;
};

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export interface UserLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isCustom?: boolean;
  detectionSource?: 'gps' | 'ip' | 'preset' | 'manual';
  accuracy?: number;
}

export type PrayerMethod =
  | 'KEMENAG'      // Kementerian Agama RI (Subuh 20°, Isya 18°, +2m ihtiyat)
  | 'MUHAMMADIYAH' // Majelis Tarjih Muhammadiyah (Subuh 18°, Isya 18°, +2m ihtiyat)
  | 'NU'           // Lembaga Falakiyah PBNU (Subuh 20°, Isya 18°, +2m ihtiyat)
  | 'MWL'          // Muslim World League (Subuh 18°, Isya 17°)
  | 'MAKKAH'       // Umm al-Qura University, Makkah (Subuh 18.5°, Isya +90m)
  | 'ISNA'         // Islamic Society of North America (Subuh 15°, Isya 15°)
  | 'EGYPT'        // Egyptian General Authority (Subuh 19.5°, Isya 17.5°)
  | 'CUSTOM';

export type PrayerKey = 'imsak' | 'subuh' | 'terbit' | 'dhuha' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';

export interface PrayerTimeItem {
  key: PrayerKey;
  name: string;
  arabicName: string;
  time: string; // HH:mm format
  date: Date;
  description: string;
  isObligatory: boolean;
  isIftar?: boolean;
  isImsak?: boolean;
}

export interface DailyPrayerTimes {
  date: Date;
  dateFormatted: string;
  hijriFormatted: string;
  locationName: string;
  method: PrayerMethod;
  methodDescription: string;
  times: Record<PrayerKey, string>;
  rawDates: Record<PrayerKey, Date>;
  items: PrayerTimeItem[];
}

export interface NextPrayerInfo {
  currentPrayer: PrayerKey | null;
  currentPrayerName: string;
  nextPrayer: PrayerKey;
  nextPrayerName: string;
  nextPrayerTime: string;
  nextPrayerDate: Date;
  remainingSeconds: number;
  formattedCountdown: string; // "02:45:10"
  progressPercent: number; // 0 to 100 between previous prayer and next prayer
  isTomorrow: boolean;
}

export interface HijriDateInfo {
  day: number;
  month: number;
  monthName: string;
  year: number;
  formatted: string; // e.g. "14 Jumadilawal 1448 H"
  isRamadan: boolean;
  ramadanDay?: number;
}

export interface RamadanDaySchedule {
  ramadanDay: number; // 1 - 30
  gregorianDate: Date;
  dateFormatted: string;
  hijriFormatted: string;
  imsak: string;
  subuh: string;
  terbit: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
  isToday: boolean;
  note?: string;
}

export interface PrayerNotificationToggles {
  imsak: boolean;
  subuh: boolean;
  terbit: boolean;
  dhuha: boolean;
  dzuhur: boolean;
  ashar: boolean;
  maghrib: boolean;
  isya: boolean;
}

export const DEFAULT_NOTIFICATION_TOGGLES: PrayerNotificationToggles = {
  imsak: true,
  subuh: true,
  terbit: false,
  dhuha: false,
  dzuhur: true,
  ashar: true,
  maghrib: true,
  isya: true,
};

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  location: UserLocation;
  prayerMethod: PrayerMethod;
  arabicFontSize: number;
  translationFontSize: number;
  notificationsEnabled: boolean;
  notificationToggles?: PrayerNotificationToggles;
  reminderMinutesBefore?: number; // 0, 5, 10, 15
  notificationSoundEnabled?: boolean;
  ihtiyatMinutes: number; // default 2
}

export * from './ibadah.ts';
export * from './doa.ts';
export * from './hadis.ts';
export * from './galeri.ts';
export * from './podcast.ts';

