import {
  Coordinates,
  CalculationParameters,
  PrayerTimes,
  Madhab,
  HighLatitudeRule,
} from 'adhan';
import {
  UserLocation,
  PrayerMethod,
  DailyPrayerTimes,
  PrayerKey,
  PrayerTimeItem,
  NextPrayerInfo,
  RamadanDaySchedule,
} from '../types';

/**
 * Buat parameter hisab astronomis berdasarkan metode yang dipilih
 */
export function getCalculationParameters(method: PrayerMethod, ihtiyatMinutes: number = 2): CalculationParameters {
  let params: CalculationParameters;

  switch (method) {
    case 'KEMENAG':
    case 'NU':
      // Standar Kemenag RI & Lembaga Falakiyah PBNU / MABIMS
      params = new CalculationParameters('Other', 20, 18);
      params.madhab = Madhab.Shafi;
      params.adjustments.fajr = ihtiyatMinutes;
      params.adjustments.dhuhr = ihtiyatMinutes;
      params.adjustments.asr = ihtiyatMinutes;
      params.adjustments.maghrib = ihtiyatMinutes;
      params.adjustments.isha = ihtiyatMinutes;
      break;

    case 'MUHAMMADIYAH':
      // Keputusan Munas Tarjih ke-31: Sudut Subuh 18° (sebelumnya 20°)
      params = new CalculationParameters('Other', 18, 18);
      params.madhab = Madhab.Shafi;
      params.adjustments.fajr = ihtiyatMinutes;
      params.adjustments.dhuhr = ihtiyatMinutes;
      params.adjustments.asr = ihtiyatMinutes;
      params.adjustments.maghrib = ihtiyatMinutes;
      params.adjustments.isha = ihtiyatMinutes;
      break;

    case 'MWL':
      params = new CalculationParameters('MuslimWorldLeague', 18, 17);
      break;

    case 'MAKKAH':
      // Umm al-Qura University Makkah (Fajr 18.5, Isha +90 min)
      params = new CalculationParameters('UmmAlQura', 18.5, 0);
      params.ishaInterval = 90;
      break;

    case 'ISNA':
      params = new CalculationParameters('NorthAmerica', 15, 15);
      break;

    case 'EGYPT':
      params = new CalculationParameters('Egyptian', 19.5, 17.5);
      break;

    case 'CUSTOM':
    default:
      params = new CalculationParameters('Other', 20, 18);
      params.madhab = Madhab.Shafi;
      params.adjustments.fajr = ihtiyatMinutes;
      params.adjustments.dhuhr = ihtiyatMinutes;
      params.adjustments.asr = ihtiyatMinutes;
      params.adjustments.maghrib = ihtiyatMinutes;
      params.adjustments.isha = ihtiyatMinutes;
      break;
  }

  params.highLatitudeRule = HighLatitudeRule.MiddleOfTheNight;
  return params;
}

export function getMethodDescription(method: PrayerMethod): string {
  switch (method) {
    case 'KEMENAG':
      return 'Kementerian Agama RI / MABIMS (Subuh 20°, Isya 18°, +2m Ihtiyat)';
    case 'MUHAMMADIYAH':
      return 'Majelis Tarjih Muhammadiyah (Munas 31: Subuh 18°, Isya 18°, +2m Ihtiyat)';
    case 'NU':
      return 'Lembaga Falakiyah PBNU / MABIMS (Subuh 20°, Isya 18°, +2m Ihtiyat)';
    case 'MWL':
      return 'Muslim World League (Subuh 18°, Isya 17°)';
    case 'MAKKAH':
      return 'Umm al-Qura University, Makkah (Subuh 18.5°, Isya +90m)';
    case 'ISNA':
      return 'Islamic Society of North America (Subuh 15°, Isya 15°)';
    case 'EGYPT':
      return 'Egyptian General Authority of Survey (Subuh 19.5°, Isya 17.5°)';
    default:
      return 'Kalkulasi Astronomis Adhan Engine';
  }
}

/**
 * Format tanggal ke string waktu (HH:mm) sesuai timezone
 */
export function formatTime(date: Date, timezone: string = 'Asia/Jakarta'): string {
  try {
    return date.toLocaleTimeString('id-ID', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).replace('.', ':');
  } catch (e) {
    // Fallback jika timezone browser tidak cocok
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }
}

/**
 * Hitung seluruh waktu sholat untuk hari dan lokasi tertentu
 */
export function calculateDailyPrayers(
  date: Date,
  location: UserLocation,
  method: PrayerMethod = 'KEMENAG',
  ihtiyatMinutes: number = 2
): DailyPrayerTimes {
  const coords = new Coordinates(location.latitude, location.longitude);
  const params = getCalculationParameters(method, ihtiyatMinutes);
  const pt = new PrayerTimes(coords, date, params);

  // Waktu Subuh dari adhan
  const subuhDate = pt.fajr;
  // Imsak = 10 menit sebelum Subuh
  const imsakDate = new Date(subuhDate.getTime() - 10 * 60 * 1000);
  // Terbit (Sunrise / Syuruq)
  const terbitDate = pt.sunrise;
  // Dhuha = ~20 menit setelah terbit
  const dhuhaDate = new Date(terbitDate.getTime() + 20 * 60 * 1000);
  const dzuhurDate = pt.dhuhr;
  const asharDate = pt.asr;
  const maghribDate = pt.maghrib;
  const isyaDate = pt.isha;

  const tz = location.timezone || 'Asia/Jakarta';

  const rawDates: Record<PrayerKey, Date> = {
    imsak: imsakDate,
    subuh: subuhDate,
    terbit: terbitDate,
    dhuha: dhuhaDate,
    dzuhur: dzuhurDate,
    ashar: asharDate,
    maghrib: maghribDate,
    isya: isyaDate,
  };

  const times: Record<PrayerKey, string> = {
    imsak: formatTime(imsakDate, tz),
    subuh: formatTime(subuhDate, tz),
    terbit: formatTime(terbitDate, tz),
    dhuha: formatTime(dhuhaDate, tz),
    dzuhur: formatTime(dzuhurDate, tz),
    ashar: formatTime(asharDate, tz),
    maghrib: formatTime(maghribDate, tz),
    isya: formatTime(isyaDate, tz),
  };

  const items: PrayerTimeItem[] = [
    {
      key: 'imsak',
      name: 'Imsak',
      arabicName: 'الإمساك',
      time: times.imsak,
      date: imsakDate,
      description: '10 menit sebelum Subuh (peringatan menahan sahur)',
      isObligatory: false,
      isImsak: true,
    },
    {
      key: 'subuh',
      name: 'Subuh',
      arabicName: 'الفجر',
      time: times.subuh,
      date: subuhDate,
      description: 'Awal fajar shadiq & permulaan puasa harian',
      isObligatory: true,
    },
    {
      key: 'terbit',
      name: 'Terbit (Syuruq)',
      arabicName: 'الشروق',
      time: times.terbit,
      date: terbitDate,
      description: 'Piringan atas matahari menyingsing ufuk timur',
      isObligatory: false,
    },
    {
      key: 'dhuha',
      name: 'Dhuha',
      arabicName: 'الضحى',
      time: times.dhuha,
      date: dhuhaDate,
      description: 'Matahari naik setinggi tombak (waktu sholat Dhuha)',
      isObligatory: false,
    },
    {
      key: 'dzuhur',
      name: 'Dzuhur',
      arabicName: 'الظهر',
      time: times.dzuhur,
      date: dzuhurDate,
      description: 'Matahari tergelincir ke arah barat dari zawal',
      isObligatory: true,
    },
    {
      key: 'ashar',
      name: 'Ashar',
      arabicName: 'العصر',
      time: times.ashar,
      date: asharDate,
      description: 'Panjang bayangan matahari sama dengan bendanya',
      isObligatory: true,
    },
    {
      key: 'maghrib',
      name: 'Maghrib',
      arabicName: 'المغرب',
      time: times.maghrib,
      date: maghribDate,
      description: 'Terbenamnya matahari (waktu iftar / berbuka puasa)',
      isObligatory: true,
      isIftar: true,
    },
    {
      key: 'isya',
      name: 'Isya',
      arabicName: 'العشاء',
      time: times.isya,
      date: isyaDate,
      description: 'Hilangnya mega merah (dilanjutkan sholat Tarawih)',
      isObligatory: true,
    },
  ];

  const dateFormatted = date.toLocaleDateString('id-ID', {
    timeZone: tz,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return {
    date,
    dateFormatted,
    hijriFormatted: '', // akan dilengkapi oleh hijriService
    locationName: location.city,
    method,
    methodDescription: getMethodDescription(method),
    times,
    rawDates,
    items,
  };
}

/**
 * Cari waktu sholat berikutnya beserta sisa waktu mundur presisi
 */
export function getNextPrayerInfo(
  dailyPrayers: DailyPrayerTimes,
  now: Date = new Date(),
  location: UserLocation,
  method: PrayerMethod = 'KEMENAG',
  ihtiyatMinutes: number = 2
): NextPrayerInfo {
  const nowMs = now.getTime();
  const { rawDates, times } = dailyPrayers;

  // Urutan sholat dalam sehari
  const prayerSequence: { key: PrayerKey; name: string; date: Date }[] = [
    { key: 'imsak', name: 'Imsak', date: rawDates.imsak },
    { key: 'subuh', name: 'Subuh', date: rawDates.subuh },
    { key: 'terbit', name: 'Terbit (Syuruq)', date: rawDates.terbit },
    { key: 'dhuha', name: 'Dhuha', date: rawDates.dhuha },
    { key: 'dzuhur', name: 'Dzuhur', date: rawDates.dzuhur },
    { key: 'ashar', name: 'Ashar', date: rawDates.ashar },
    { key: 'maghrib', name: 'Maghrib (Buka Puasa)', date: rawDates.maghrib },
    { key: 'isya', name: 'Isya', date: rawDates.isya },
  ];

  // Cari yang date > nowMs
  for (let i = 0; i < prayerSequence.length; i++) {
    const p = prayerSequence[i];
    if (p.date.getTime() > nowMs) {
      const remainingSeconds = Math.max(0, Math.floor((p.date.getTime() - nowMs) / 1000));
      const prevPrayer = i > 0 ? prayerSequence[i - 1] : null;

      // Hitung progress
      let progressPercent = 0;
      if (prevPrayer) {
        const totalSpan = p.date.getTime() - prevPrayer.date.getTime();
        const elapsed = nowMs - prevPrayer.date.getTime();
        progressPercent = Math.min(100, Math.max(0, Math.round((elapsed / totalSpan) * 100)));
      }

      const hours = Math.floor(remainingSeconds / 3600);
      const mins = Math.floor((remainingSeconds % 3600) / 60);
      const secs = remainingSeconds % 60;
      const formattedCountdown = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

      return {
        currentPrayer: prevPrayer ? prevPrayer.key : null,
        currentPrayerName: prevPrayer ? prevPrayer.name : 'Malam Hari',
        nextPrayer: p.key,
        nextPrayerName: p.name,
        nextPrayerTime: times[p.key],
        nextPrayerDate: p.date,
        remainingSeconds,
        formattedCountdown,
        progressPercent,
        isTomorrow: false,
      };
    }
  }

  // Jika sudah melewati Isya hari ini, sholat berikutnya adalah Imsak besok
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowPrayers = calculateDailyPrayers(tomorrow, location, method, ihtiyatMinutes);
  const tomorrowImsak = tomorrowPrayers.rawDates.imsak;
  const remainingSeconds = Math.max(0, Math.floor((tomorrowImsak.getTime() - nowMs) / 1000));

  const totalSpan = tomorrowImsak.getTime() - rawDates.isya.getTime();
  const elapsed = nowMs - rawDates.isya.getTime();
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsed / totalSpan) * 100)));

  const hours = Math.floor(remainingSeconds / 3600);
  const mins = Math.floor((remainingSeconds % 3600) / 60);
  const secs = remainingSeconds % 60;
  const formattedCountdown = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return {
    currentPrayer: 'isya',
    currentPrayerName: 'Isya',
    nextPrayer: 'imsak',
    nextPrayerName: 'Imsak Besok',
    nextPrayerTime: tomorrowPrayers.times.imsak,
    nextPrayerDate: tomorrowImsak,
    remainingSeconds,
    formattedCountdown,
    progressPercent,
    isTomorrow: true,
  };
}

/**
 * Generate 30 hari jadwal Imsakiyah Ramadan (1448 H / Feb-Mar 2027)
 */
export function generateRamadanSchedule(
  location: UserLocation,
  method: PrayerMethod = 'KEMENAG',
  ihtiyatMinutes: number = 2
): RamadanDaySchedule[] {
  const schedule: RamadanDaySchedule[] = [];
  const tz = location.timezone || 'Asia/Jakarta';

  // 1 Ramadan 1448 H = 8 Februari 2027
  const startDate = new Date(2027, 1, 8); // month 1 = Feb

  const today = new Date();
  const todayStr = today.toLocaleDateString('id-ID', { timeZone: tz });

  for (let day = 1; day <= 30; day++) {
    const current = new Date(startDate.getTime() + (day - 1) * 24 * 60 * 60 * 1000);
    const daily = calculateDailyPrayers(current, location, method, ihtiyatMinutes);

    let note: string | undefined;
    if (day === 1) note = '1 Ramadan 1448 H (Awal Puasa)';
    if (day === 17) note = 'Nuzulul Qur\'an';
    if (day >= 21 && day % 2 !== 0) note = `Malam Ganjil (${day} Ramadan)`;
    if (day === 30) note = 'Akhir Ramadan 1448 H';

    const currentStr = current.toLocaleDateString('id-ID', { timeZone: tz });

    schedule.push({
      ramadanDay: day,
      gregorianDate: current,
      dateFormatted: current.toLocaleDateString('id-ID', {
        timeZone: tz,
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
      hijriFormatted: `${day} Ramadan 1448 H`,
      imsak: daily.times.imsak,
      subuh: daily.times.subuh,
      terbit: daily.times.terbit,
      dzuhur: daily.times.dzuhur,
      ashar: daily.times.ashar,
      maghrib: daily.times.maghrib,
      isya: daily.times.isya,
      isToday: todayStr === currentStr,
      note,
    });
  }

  return schedule;
}

/**
 * Generate jadwal sholat 1 bulan masehi penuh (untuk bulan tertentu)
 */
export function generateMonthlySchedule(
  year: number,
  monthIndex: number, // 0 - 11
  location: UserLocation,
  method: PrayerMethod = 'KEMENAG',
  ihtiyatMinutes: number = 2
): RamadanDaySchedule[] {
  const schedule: RamadanDaySchedule[] = [];
  const tz = location.timezone || 'Asia/Jakarta';
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const today = new Date();
  const todayStr = today.toLocaleDateString('id-ID', { timeZone: tz });

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, monthIndex, d);
    const daily = calculateDailyPrayers(date, location, method, ihtiyatMinutes);
    const dateStr = date.toLocaleDateString('id-ID', { timeZone: tz });

    schedule.push({
      ramadanDay: d,
      gregorianDate: date,
      dateFormatted: date.toLocaleDateString('id-ID', {
        timeZone: tz,
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
      hijriFormatted: '',
      imsak: daily.times.imsak,
      subuh: daily.times.subuh,
      terbit: daily.times.terbit,
      dzuhur: daily.times.dzuhur,
      ashar: daily.times.ashar,
      maghrib: daily.times.maghrib,
      isya: daily.times.isya,
      isToday: todayStr === dateStr,
    });
  }

  return schedule;
}
