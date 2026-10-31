import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Moon,
  Clock,
  BookOpen,
  Sparkles,
  Calendar,
  Compass,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Utensils,
  Sun,
  Sunrise,
  Sunset,
  Info,
  CalendarDays,
  Camera,
  Radio,
  Disc,
  Palette,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useAppSettings } from '../../context/AppSettingsContext';
import { calculateDailyPrayers, getNextPrayerInfo, getMethodDescription } from '../../services/prayerService';
import { getHijriDate, getRamadanCountdown } from '../../services/hijriService';
import { LocationModal } from '../../components/common/LocationModal';
import { DailyPrayerTimes, NextPrayerInfo, PrayerKey } from '../../types';

export const HomePage: React.FC = () => {
  const { settings } = useAppSettings();
  const [now, setNow] = useState<Date>(new Date());
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tz = settings.location.timezone || 'Asia/Jakarta';
  const hijri = getHijriDate(now, tz);
  const countdown = getRamadanCountdown(now);
  const dailyPrayers: DailyPrayerTimes = calculateDailyPrayers(
    now,
    settings.location,
    settings.prayerMethod,
    settings.ihtiyatMinutes || 2
  );
  const nextPrayer: NextPrayerInfo = getNextPrayerInfo(
    dailyPrayers,
    now,
    settings.location,
    settings.prayerMethod,
    settings.ihtiyatMinutes || 2
  );

  const getPrayerIcon = (key: PrayerKey) => {
    switch (key) {
      case 'imsak':
        return <Moon className="w-4 h-4 text-accent-700" />;
      case 'subuh':
        return <Sunrise className="w-4 h-4 text-accent-700" />;
      case 'terbit':
        return <Sun className="w-4 h-4 text-accent-700" />;
      case 'dhuha':
        return <Sun className="w-4 h-4 text-accent-700" />;
      case 'dzuhur':
        return <Sun className="w-4 h-4 text-accent-700" />;
      case 'ashar':
        return <Sunset className="w-4 h-4 text-accent-700" />;
      case 'maghrib':
        return <Utensils className="w-4 h-4 text-accent-700" />;
      case 'isya':
        return <Moon className="w-4 h-4 text-accent-700" />;
    }
  };

  const timeOf = (key: PrayerKey) =>
    dailyPrayers.items.find((i) => i.key === key)?.time ?? '--:--';

  const dayStory = [
    { time: timeOf('imsak'), title: 'Sahur dan imsak', desc: 'Bangun, makan sahur, dan berhenti makan sebelum imsak.', path: '/jadwal', cta: 'Lihat imsakiyah' },
    { time: timeOf('dhuha'), title: 'Tilawah dan Dhuha', desc: 'Baca Al-Qur’an sedikit demi sedikit. Satu juz per hari menamatkannya dalam sebulan.', path: '/quran', cta: 'Buka Al-Qur’an' },
    { time: timeOf('maghrib'), title: 'Berbuka puasa', desc: 'Berbuka bersama keluarga setelah adzan Maghrib, diawali doa.', path: '/doa', cta: 'Baca doa' },
    { time: timeOf('isya'), title: 'Tarawih dan dzikir', desc: 'Tutup hari dengan tarawih, lalu dzikir dan tasbih.', path: '/tasbih', cta: 'Mulai dzikir' },
    { time: 'Seharian', title: 'Berbagi', desc: 'Sedekah kecil yang rutin, ucapan untuk keluarga, dan kenangan yang layak disimpan.', path: '/ibadah', cta: 'Catat ibadah' },
  ];

  const quickLinks = [
    {
      title: 'Jadwal Sholat & Imsak',
      desc: 'Jadwal harian & imsakiyah 1 bulan penuh',
      path: '/jadwal',
      icon: Clock,
      color: 'text-accent-700',
      bgColor: 'bg-accent-500/10',
      borderColor: 'border-accent-500/20',
    },
    {
      title: "Al-Qur'an 30 Juz",
      desc: 'Bacaan 114 surah & terjemahan Kemenag',
      path: '/quran',
      icon: BookOpen,
      color: 'text-accent-700',
      bgColor: 'bg-accent-500/10',
      borderColor: 'border-accent-500/20',
    },
    {
      title: 'Pelacak Ibadah',
      desc: 'Checklist sholat fardhu, tilawah, & sedekah',
      path: '/ibadah',
      icon: Sparkles,
      color: 'text-accent-700',
      bgColor: 'bg-accent-500/10',
      borderColor: 'border-accent-500/20',
    },
    {
      title: 'Arah Kiblat Digital',
      desc: 'Kompas akurat ke Ka\'bah Makkah',
      path: '/kiblat',
      icon: Compass,
      color: 'text-accent-700',
      bgColor: 'bg-accent-500/10',
      borderColor: 'border-accent-500/20',
    },
    {
      title: 'Tasbih Digital',
      desc: 'Wirid & dzikir dengan getaran haptic',
      path: '/tasbih',
      icon: Disc,
      color: 'text-accent-700',
      bgColor: 'bg-accent-500/10',
      borderColor: 'border-accent-500/20',
    },
    {
      title: 'Kartu Ucapan',
      desc: 'Bikin ucapan estetik, download & WA',
      path: '/kartu-ucapan',
      icon: Palette,
      color: 'text-accent-700',
      bgColor: 'bg-accent-500/10',
      borderColor: 'border-accent-500/20',
    },
    {
      title: 'Kalender Hijriah',
      desc: 'Perkiraan tanggal & fase bulan Ramadan',
      path: '/kalender',
      icon: CalendarDays,
      color: 'text-accent-700',
      bgColor: 'bg-accent-500/10',
      borderColor: 'border-accent-500/20',
    },
    {
      title: 'Galeri Kenangan',
      desc: 'Foto sahur, buka, & momen Ramadan',
      path: '/galeri',
      icon: Camera,
      color: 'text-accent-700',
      bgColor: 'bg-accent-500/10',
      borderColor: 'border-accent-500/20',
    },
    {
      title: 'Podcast Islami',
      desc: 'Audio pengantar tidur, buka, & sahur',
      path: '/podcast',
      icon: Radio,
      color: 'text-accent-700',
      bgColor: 'bg-accent-500/10',
      borderColor: 'border-accent-500/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Banner Ramadan Mubarak */}
      <figure className="overflow-hidden rounded-xl border border-surface-border bg-background-darker">
        <img
          src="/ramadan-mubarak.webp"
          srcSet="/ramadan-mubarak-960.webp 960w, /ramadan-mubarak.webp 1672w"
          sizes="(min-width: 1024px) 960px, 100vw"
          width={1672}
          height={941}
          alt="Ramadan Mubarak. Bulan sabit di atas masjid pada malam hari, diapit dua lentera."
          loading="eager"
          decoding="async"
          className="block h-auto w-full"
        />
      </figure>

      {/* Hero: hitung mundur menuju 1 Ramadan */}
      <section
        aria-labelledby="hero-title"
        className="rounded-xl border border-surface-border bg-surface p-6 sm:p-10"
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-300">
          <span>{hijri.formatted}</span>
          <button
            type="button"
            onClick={() => setIsLocationModalOpen(true)}
            className="inline-flex items-center gap-1.5 min-h-[44px] -my-2 text-accent-700 hover:text-accent-800 underline-offset-4 hover:underline cursor-pointer"
          >
            <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{settings.location.city}</span>
          </button>
        </div>

        <h1 id="hero-title" className="mt-8 text-xl sm:text-2xl font-semibold text-ink-100">
          Menuju Ramadan 1448 H
        </h1>
        <p className="mt-1 text-sm text-ink-300">{countdown.description}</p>

        <dl
          className="mt-6 flex flex-wrap items-end gap-x-8 sm:gap-x-12 gap-y-4"
          aria-label="Sisa waktu menuju Ramadan"
        >
          <div className="flex flex-col-reverse">
            <dt className="mt-2 text-sm text-ink-300">Hari</dt>
            <dd className="text-7xl sm:text-9xl font-extrabold leading-[0.9] tabular-nums text-accent-700">
              {countdown.days}
            </dd>
          </div>
          {[
            { label: 'Jam', value: countdown.hours },
            { label: 'Menit', value: countdown.minutes },
            { label: 'Detik', value: countdown.seconds },
          ].map((unit) => (
            <div key={unit.label} className="flex flex-col-reverse">
              <dt className="mt-1 text-sm text-ink-300">{unit.label}</dt>
              <dd className="text-3xl sm:text-5xl font-bold leading-none tabular-nums text-ink-100">
                {String(unit.value).padStart(2, '0')}
              </dd>
            </div>
          ))}
        </dl>

        <dl className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2 border-t border-surface-border pt-5 text-sm">
          <div>
            <dt className="text-ink-400">Perkiraan awal puasa</dt>
            <dd className="mt-0.5 font-medium text-ink-100">{countdown.targetDateFormatted}</dd>
          </div>
          <div>
            <dt className="text-ink-400">Status penetapan</dt>
            <dd className="mt-0.5 font-medium text-ink-100">Estimasi Hisab (Isbat Tertunda)</dd>
          </div>
        </dl>
        <p className="mt-4 max-w-prose text-sm text-ink-400">
          Penetapan resmi 1 Ramadan di Indonesia mengacu pada Keputusan Menteri Agama RI melalui
          Sidang Isbat rukyatul hilal menjelang bulan Ramadan.
        </p>
      </section>

      {/* Sholat berikutnya */}
      <section
        aria-label="Sholat berikutnya"
        className="rounded-xl border border-surface-border bg-surface px-5 py-4"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <p className="text-sm text-ink-300">
            {nextPrayer.nextPrayer === 'maghrib' ? 'Waktu berbuka' : 'Sholat berikutnya'}
          </p>
          <p className="flex items-baseline gap-3">
            <span className="text-lg font-semibold text-ink-100">{nextPrayer.nextPrayerName}</span>
            <span className="text-lg font-bold tabular-nums text-accent-700">{nextPrayer.nextPrayerTime}</span>
            <span className="text-sm tabular-nums text-ink-300">-{nextPrayer.formattedCountdown}</span>
          </p>
        </div>
        <div
          className="mt-3 h-1 w-full rounded-full bg-ink-800"
          role="progressbar"
          aria-label="Kemajuan menuju waktu sholat berikutnya"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(nextPrayer.progressPercent)}
        >
          <div className="h-1 rounded-full bg-accent-400" style={{ width: `${nextPrayer.progressPercent}%` }} />
        </div>
      </section>

      {/* Satu hari di bulan Ramadan */}
      <section aria-labelledby="story-title">
        <h2 id="story-title" className="text-2xl font-semibold text-ink-100">
          Satu hari di bulan Ramadan
        </h2>
        <p className="mt-2 max-w-prose text-base text-ink-300">
          Dari sahur sampai berbagi. Waktunya mengikuti lokasimu di {settings.location.city}.
        </p>
        <ol className="mt-6 divide-y divide-ink-700 border-y border-ink-700">
          {dayStory.map((step) => (
            <li key={step.title}>
              <Link
                to={step.path}
                className="group grid grid-cols-[6.5rem_1fr] sm:grid-cols-[8rem_1fr_auto] items-baseline gap-x-4 gap-y-1 py-5"
              >
                <span className="text-xl font-bold tabular-nums text-ink-100">{step.time}</span>
                <span>
                  <span className="block text-base font-semibold text-ink-100 group-hover:underline underline-offset-4 decoration-accent-500">
                    {step.title}
                  </span>
                  <span className="mt-1 block text-sm text-ink-300">{step.desc}</span>
                </span>
                <span className="hidden sm:block text-sm font-medium text-accent-700">{step.cta}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Jadwal sholat hari ini */}
      <Card>
          <CardHeader>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <CardTitle>Jadwal Sholat Hari Ini</CardTitle>
              </div>
              <CardDescription>
                {dailyPrayers.dateFormatted} • {dailyPrayers.methodDescription}
              </CardDescription>
            </div>
            <Link to="/jadwal">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Jadwal Lengkap
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {/* 7 Prayer Slots Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {dailyPrayers.items.map((prayer) => {
                const isNext = nextPrayer.nextPrayer === prayer.key;
                const isIftar = prayer.key === 'maghrib';

                return (
                  <div
                    key={prayer.key}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isNext
                        ? 'bg-ink-800/60 border-accent-400'
                        : isIftar
                        ? 'bg-ink-800/20 border-accent-500/40'
                        : 'bg-surface-elevated/40 border-ink-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 text-xs font-medium text-ink-400">
                      {getPrayerIcon(prayer.key)}
                      <span>{prayer.name}</span>
                    </div>
                    <div className="text-base font-bold text-ink-100 my-1 tabular-nums">
                      {prayer.time}
                    </div>
                    <div className="text-xs text-ink-400 truncate">
                      {isIftar ? 'Buka Puasa' : prayer.key === 'imsak' ? 'Tahan Sahur' : prayer.isObligatory ? 'Wajib' : 'Sunnah'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Source authenticity info */}
            <div className="mt-4 p-3 rounded-lg bg-ink-800/40 border border-ink-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-ink-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent-700 shrink-0" />
                <span>
                  Metode: <strong>{settings.prayerMethod}</strong> (Koreksi ikhtiyat +{settings.ihtiyatMinutes || 2}m).
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="inline-flex items-center gap-1 min-h-[38px] px-3 py-1.5 rounded-lg text-accent-700 hover:text-accent-800 hover:bg-ink-800/40 active:scale-95 touch-manipulation font-medium transition-all cursor-pointer self-start sm:self-auto"
              >
                Ganti Lokasi
              </button>
            </div>
          </CardContent>
        </Card>

      {/* Berbagi */}
      <section
        aria-labelledby="share-title"
        className="rounded-xl border border-accent-400/50 bg-accent-400/15 p-6 sm:p-10"
      >
        <h2 id="share-title" className="text-2xl font-semibold text-ink-100">
          Ramadan itu berbagi
        </h2>
        <p className="mt-3 max-w-prose text-base text-ink-200">
          Sedekah kecil yang rutin lebih mudah dijaga kalau dicatat. Catat sedekahmu di Pelacak
          Ibadah, lalu kirim ucapan ke keluarga dan teman.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/ibadah"
            className="inline-flex min-h-[44px] items-center rounded-lg bg-accent-400 px-5 text-sm font-semibold text-ink-50 hover:bg-accent-500"
          >
            Catat sedekah
          </Link>
          <Link
            to="/kartu-ucapan"
            className="inline-flex min-h-[44px] items-center rounded-lg border border-ink-600 px-5 text-sm font-semibold text-ink-100 hover:bg-ink-800"
          >
            Buat kartu ucapan
          </Link>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <div>
        <h2 className="text-2xl font-semibold text-ink-100 mb-2">
          Semua alat Ramadan di satu tempat
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="group flex items-start gap-4 border-t border-ink-700/70 py-5"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-base font-semibold text-ink-100 group-hover:underline underline-offset-4 decoration-accent-400">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-sm text-ink-300">{item.desc}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
};
