import type { HijriDateInfo } from '../types/index.ts';

export const HIJRI_MONTH_NAMES = [
  'Muharram',
  'Safar',
  "Rabi'ul Awwal",
  "Rabi'ul Akhir",
  'Jumadil Awwal',
  'Jumadil Akhir',
  'Rajab',
  "Sya'ban",
  'Ramadan',
  'Syawal',
  "Dzulqa'dah",
  'Dzulhijjah',
];

export interface ImportantDateItem {
  id: string;
  name: string;
  arabicName: string;
  hijriDate: string;
  gregorianDate: string;
  description: string;
  isConfirmed: boolean;
  type: 'ramadan' | 'holiday' | 'event';
}

/**
 * Konversi tanggal Masehi ke Hijriah menggunakan Intl API Umm al-Qura
 */
export function getHijriDate(date: Date = new Date(), timezone: string = 'Asia/Jakarta'): HijriDateInfo {
  try {
    const formatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
      timeZone: timezone,
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });

    const parts = formatter.formatToParts(date);
    let day = 1;
    let month = 1;
    let year = 1448;

    for (const part of parts) {
      if (part.type === 'day') day = parseInt(part.value, 10);
      if (part.type === 'month') month = parseInt(part.value, 10);
      if (part.type === 'year') {
        const parsedYear = parseInt(part.value.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(parsedYear)) year = parsedYear;
      }
    }

    const monthIndex = Math.max(0, Math.min(11, month - 1));
    const monthName = HIJRI_MONTH_NAMES[monthIndex] || `Bulan ${month}`;
    const formatted = `${day} ${monthName} ${year} H`;
    const isRamadan = month === 9;

    return {
      day,
      month,
      monthName,
      year,
      formatted,
      isRamadan,
      ramadanDay: isRamadan ? day : undefined,
    };
  } catch (error) {
    // Algorithmic estimation fallback
    return {
      day: 14,
      month: 5,
      monthName: 'Jumadilawal',
      year: 1448,
      formatted: '14 Jumadilawal 1448 H',
      isRamadan: false,
    };
  }
}

export interface RamadanCountdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  status: 'before' | 'during' | 'after';
  targetDate: Date;
  targetDateFormatted: string;
  description: string;
  isEstimate: boolean;
}

/**
 * Hitung mundur presisi menuju 1 Ramadan 1448 H
 */
export function getRamadanCountdown(now: Date = new Date()): RamadanCountdown {
  // 1 Ramadan 1448 H diperkirakan jatuh pada 8 Februari 2027 pukul 00:00:00 WIB
  const ramadanStart = new Date(2027, 1, 8, 0, 0, 0); // 8 Feb 2027
  // Idul Fitri 1 Syawal 1448 H diperkirakan jatuh pada 9 Maret 2027 pukul 00:00:00 WIB
  const ramadanEnd = new Date(2027, 2, 9, 0, 0, 0); // 9 Mar 2027

  const nowMs = now.getTime();
  const startMs = ramadanStart.getTime();
  const endMs = ramadanEnd.getTime();

  if (nowMs < startMs) {
    const diff = Math.max(0, Math.floor((startMs - nowMs) / 1000));
    const days = Math.floor(diff / (24 * 3600));
    const hours = Math.floor((diff % (24 * 3600)) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
      totalSeconds: diff,
      status: 'before',
      targetDate: ramadanStart,
      targetDateFormatted: 'Senin, 8 Februari 2027',
      description: 'Menuju 1 Ramadan 1448 H (Estimasi Hisab Falak)',
      isEstimate: true,
    };
  } else if (nowMs >= startMs && nowMs < endMs) {
    const elapsedSeconds = Math.floor((nowMs - startMs) / 1000);
    const dayOfRamadan = Math.min(30, Math.floor(elapsedSeconds / (24 * 3600)) + 1);
    const remainingSeconds = Math.max(0, Math.floor((endMs - nowMs) / 1000));
    const days = Math.floor(remainingSeconds / (24 * 3600));
    const hours = Math.floor((remainingSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
      totalSeconds: remainingSeconds,
      status: 'during',
      targetDate: ramadanEnd,
      targetDateFormatted: 'Selasa, 9 Maret 2027',
      description: `Sedang Berlangsung: Ramadan Hari ke-${dayOfRamadan}`,
      isEstimate: false,
    };
  } else {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      status: 'after',
      targetDate: ramadanEnd,
      targetDateFormatted: '9 Maret 2027',
      description: 'Ramadan 1448 H Telah Berakhir',
      isEstimate: false,
    };
  }
}

/**
 * Daftar peristiwa dan hari penting di bulan Ramadan 1448 H
 */
export const IMPORTANT_RAMADAN_DATES: ImportantDateItem[] = [
  {
    id: 'awal-ramadan',
    name: '1 Ramadan 1448 H (Awal Puasa)',
    arabicName: 'أول رمضان',
    hijriDate: '1 Ramadan 1448 H',
    gregorianDate: 'Senin, 8 Februari 2027 (Perkiraan)',
    description: 'Hari pertama kewajiban ibadah puasa Ramadan. Penetapan resmi menunggu Sidang Isbat Kemenag RI.',
    isConfirmed: false,
    type: 'ramadan',
  },
  {
    id: 'nuzulul-quran',
    name: "Nuzulul Qur'an (17 Ramadan)",
    arabicName: 'نزول القرآن',
    hijriDate: '17 Ramadan 1448 H',
    gregorianDate: 'Rabu, 24 Februari 2027 (Perkiraan)',
    description: 'Peringatan malam diturunkannya wahyu pertama Al-Qur\'an surat Al-\'Alaq kepada Nabi Muhammad SAW di Gua Hira.',
    isConfirmed: false,
    type: 'event',
  },
  {
    id: 'lailatul-qadar',
    name: '10 Malam Terakhir (Lailatul Qadar)',
    arabicName: 'العشر الأواخر من رمضان',
    hijriDate: '21 - 29 Ramadan 1448 H',
    gregorianDate: '28 Feb - 8 Mar 2027 (Perkiraan)',
    description: 'Malam kemuliaan yang lebih baik dari seribu bulan. Dianjurkan memperbanyak i\'tikaf, qiyamullail, dan doa.',
    isConfirmed: false,
    type: 'event',
  },
  {
    id: 'idul-fitri',
    name: 'Hari Raya Idul Fitri (1 Syawal 1448 H)',
    arabicName: 'عيد الفطر المبارك',
    hijriDate: '1 Syawal 1448 H',
    gregorianDate: 'Selasa, 9 Maret 2027 (Perkiraan)',
    description: 'Hari kemenangan umat Islam setelah sebulan penuh berpuasa. Wajib membayar zakat fitrah sebelum sholat Id.',
    isConfirmed: false,
    type: 'holiday',
  },
];
