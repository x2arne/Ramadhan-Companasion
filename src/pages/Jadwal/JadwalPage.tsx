import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Compass,
  Utensils,
  Moon,
  Sunrise,
  Sun,
  Sunset,
  Printer,
  Info,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useAppSettings } from '../../context/AppSettingsContext';
import {
  calculateDailyPrayers,
  getNextPrayerInfo,
  generateRamadanSchedule,
  generateMonthlySchedule,
  getMethodDescription,
} from '../../services/prayerService';
import { getHijriDate } from '../../services/hijriService';
import { LocationModal } from '../../components/common/LocationModal';
import { PrayerMethod, PrayerKey } from '../../types';

export const JadwalPage: React.FC = () => {
  const { settings, updatePrayerMethod } = useAppSettings();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'harian' | 'ramadan' | 'bulanan'>('harian');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const tz = settings.location.timezone || 'Asia/Jakarta';

  // Hitung jadwal hari yang dipilih
  const dailyPrayers = calculateDailyPrayers(
    selectedDate,
    settings.location,
    settings.prayerMethod,
    settings.ihtiyatMinutes || 2
  );

  const hijriInfo = getHijriDate(selectedDate, tz);

  // Next prayer dari waktu sekarang
  const nextPrayer = getNextPrayerInfo(
    dailyPrayers,
    new Date(),
    settings.location,
    settings.prayerMethod,
    settings.ihtiyatMinutes || 2
  );

  // Jadwal Imsakiyah 30 hari Ramadan
  const ramadanSchedule = generateRamadanSchedule(
    settings.location,
    settings.prayerMethod,
    settings.ihtiyatMinutes || 2
  );

  // Jadwal 1 bulan masehi saat ini
  const monthlySchedule = generateMonthlySchedule(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    settings.location,
    settings.prayerMethod,
    settings.ihtiyatMinutes || 2
  );

  const handlePrevDay = () => {
    setSelectedDate((prev) => new Date(prev.getTime() - 24 * 60 * 60 * 1000));
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => new Date(prev.getTime() + 24 * 60 * 60 * 1000));
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const isToday =
    selectedDate.toDateString() === new Date().toDateString();

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

  return (
    <div className="space-y-6">
      {/* Header & Location / Method Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-ink-100">Jadwal Sholat & Imsakiyah</h1>
            <Badge variant="emerald" dot>
              Hisab Terverifikasi
            </Badge>
          </div>
          <p className="text-xs text-ink-400 mt-1">
            Waktu sholat fardhu, imsak, dan buka puasa terhitung akurat sesuai titik koordinat{' '}
            <strong className="text-ink-200">{settings.location.city}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<MapPin className="w-3.5 h-3.5 text-accent-700" />}
            onClick={() => setIsLocationModalOpen(true)}
          >
            {settings.location.city}
          </Button>

          <select
            value={settings.prayerMethod}
            onChange={(e) => updatePrayerMethod(e.target.value as PrayerMethod)}
            className="bg-surface-elevated/70 border border-ink-700/60 rounded-lg px-3 py-1.5 text-xs text-accent-700 font-medium focus:outline-none focus:border-accent-500 cursor-pointer"
          >
            <option value="KEMENAG">Kemenag RI (Subuh 20°)</option>
            <option value="MUHAMMADIYAH">Muhammadiyah (Subuh 18°)</option>
            <option value="NU">PBNU / MABIMS (Subuh 20°)</option>
            <option value="MWL">Muslim World League</option>
            <option value="MAKKAH">Umm al-Qura Makkah</option>
          </select>
        </div>
      </div>

      {/* Navigation View Tabs */}
      <div className="flex items-center gap-2 border-b border-ink-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setViewMode('harian')}
          className={`px-4 py-2.5 min-h-[42px] rounded-lg text-xs font-semibold whitespace-nowrap transition-all touch-manipulation cursor-pointer active:scale-95 ${
            viewMode === 'harian'
              ? 'bg-accent-400/25 text-accent-700 border border-accent-500/40'
              : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800/40'
          }`}
        >
          Jadwal Harian
        </button>
        <button
          type="button"
          onClick={() => setViewMode('ramadan')}
          className={`px-4 py-2.5 min-h-[42px] rounded-lg text-xs font-semibold whitespace-nowrap transition-all touch-manipulation cursor-pointer active:scale-95 ${
            viewMode === 'ramadan'
              ? 'bg-accent-400/25 text-accent-700 border border-accent-500/40'
              : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800/40'
          }`}
        >
          Imsakiyah 30 Hari Ramadan
        </button>
        <button
          type="button"
          onClick={() => setViewMode('bulanan')}
          className={`px-4 py-2.5 min-h-[42px] rounded-lg text-xs font-semibold whitespace-nowrap transition-all touch-manipulation cursor-pointer active:scale-95 ${
            viewMode === 'bulanan'
              ? 'bg-accent-400/25 text-accent-700 border border-accent-500/40'
              : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800/40'
          }`}
        >
          Jadwal Kalender Bulanan
        </button>
      </div>

      {viewMode === 'harian' ? (
        <div className="space-y-6">
          {/* Date Selector Bar */}
          <div className="p-3 rounded-xl bg-surface/70 border border-ink-800 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="icon" onClick={handlePrevDay} title="Hari Sebelumnya">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant={isToday ? 'primary' : 'outline'}
                size="sm"
                onClick={handleToday}
              >
                Hari Ini
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNextDay} title="Hari Berikutnya">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-center sm:text-right">
              <div className="text-sm font-bold text-ink-100">{dailyPrayers.dateFormatted}</div>
              <div className="text-xs text-accent-700 font-medium">{hijriInfo.formatted}</div>
            </div>
          </div>

          {/* Daily Prayer List Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {dailyPrayers.items.map((prayer) => {
              const isNext = isToday && nextPrayer.nextPrayer === prayer.key;
              const isIftar = prayer.key === 'maghrib';

              return (
                <Card
                  key={prayer.key}
                  className={`p-4 transition-all ${
                    isNext
                      ? 'bg-ink-800/40 border-accent-500/60 ring-2 ring-accent-500/40'
                      : isIftar
                      ? 'bg-ink-800/30 border-accent-500/40'
                      : 'bg-surface-elevated/40 border-ink-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-ink-800/60 border border-ink-700/50">
                        {getPrayerIcon(prayer.key)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-ink-100">{prayer.name}</h3>
                        <span className="font-arabic text-xs text-ink-400">
                          {prayer.arabicName}
                        </span>
                      </div>
                    </div>

                    <Badge
                      variant={isIftar ? 'emerald' : prayer.key === 'imsak' ? 'gold' : prayer.isObligatory ? 'blue' : 'slate'}
                      size="sm"
                    >
                      {isIftar ? 'Iftar' : prayer.key === 'imsak' ? 'Imsak' : prayer.isObligatory ? 'Wajib' : 'Sunnah'}
                    </Badge>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-ink-100 tabular-nums tracking-tight">
                      {prayer.time}
                    </span>
                    <span className="text-xs text-ink-400 font-mono">
                      {tz.includes('Jakarta') ? 'WIB' : tz.includes('Makassar') ? 'WITA' : 'WIT'}
                    </span>
                  </div>

                  <p className="text-xs text-ink-400 mt-2 leading-relaxed line-clamp-2">
                    {prayer.description}
                  </p>
                </Card>
              );
            })}
          </div>

          {/* Information & Methodology Card */}
          <div className="p-4 rounded-xl bg-surface-elevated/40 border border-ink-800 space-y-2 text-xs text-ink-300">
            <div className="flex items-center gap-2 text-accent-700 font-semibold">
              <Compass className="w-4 h-4" />
              <span>Rujukan & Parameter Hisab Falak</span>
            </div>
            <p className="leading-relaxed text-ink-400">
              {getMethodDescription(settings.prayerMethod)}. Perhitungan ini menggunakan posisi matahari
              hakiki (solar position calculation) yang telah divalidasi dengan standar astronomis modern
              serta koreksi ikhtiyat sebesar +{settings.ihtiyatMinutes || 2} menit demi kehati-hatian ibadah.
            </p>
            {settings.prayerMethod === 'MUHAMMADIYAH' && (
              <p className="text-accent-700 text-xs bg-ink-800/20 p-2.5 rounded-lg border border-accent-800/30">
                Catatan: Majelis Tarjih dan Tajdid PP Muhammadiyah menetapkan awal waktu Subuh pada sudut
                matahari -18 derajat di bawah ufuk timur (keputusan Munas Tarjih ke-31 tahun 2020),
                berbeda sekitar 8 menit lebih lambat dibandingkan kriteria Kemenag RI (-20 derajat).
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Table View: Imsakiyah 30 Hari Ramadan atau Bulanan */
        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                {viewMode === 'ramadan'
                  ? 'Jadwal Imsakiyah 30 Hari Penuh Ramadan 1448 H'
                  : `Jadwal Sholat Bulan ${selectedDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`}
              </CardTitle>
              <CardDescription>
                Wilayah: <span className="text-ink-200 font-medium">{settings.location.city}</span>{' '}
                • Metode: <span className="text-ink-200 font-medium">{settings.prayerMethod}</span>
              </CardDescription>
            </div>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<Printer className="w-3.5 h-3.5" />}
              onClick={() => window.print()}
            >
              Cetak Jadwal
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-ink-800 text-ink-400 text-xs font-semibold bg-surface-elevated/40">
                    <th className="py-3 px-3">
                      {viewMode === 'ramadan' ? 'Ramadan' : 'Tanggal'}
                    </th>
                    <th className="py-3 px-3">Masehi</th>
                    <th className="py-3 px-3 text-accent-700">Imsak</th>
                    <th className="py-3 px-3">Subuh</th>
                    <th className="py-3 px-3 text-ink-400">Terbit</th>
                    <th className="py-3 px-3">Dzuhur</th>
                    <th className="py-3 px-3">Ashar</th>
                    <th className="py-3 px-3 text-accent-700 font-bold">Maghrib (Buka)</th>
                    <th className="py-3 px-3">Isya</th>
                    {viewMode === 'ramadan' && <th className="py-3 px-3">Keterangan</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-800/60 font-mono">
                  {(viewMode === 'ramadan' ? ramadanSchedule : monthlySchedule).map((row) => (
                    <tr
                      key={row.ramadanDay}
                      className={`hover:bg-ink-800/30 transition-colors ${
                        row.isToday ? 'bg-ink-800/30 font-semibold' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-sans font-medium text-ink-200">
                        {viewMode === 'ramadan' ? `Hari ke-${row.ramadanDay}` : row.ramadanDay}
                        {row.isToday && (
                          <Badge variant="violet" size="sm" className="ml-2 text-xs">
                            Hari Ini
                          </Badge>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-ink-400 whitespace-nowrap">
                        {row.dateFormatted}
                      </td>
                      <td className="py-2.5 px-3 text-accent-700 font-bold">{row.imsak}</td>
                      <td className="py-2.5 px-3 text-ink-200">{row.subuh}</td>
                      <td className="py-2.5 px-3 text-ink-400">{row.terbit}</td>
                      <td className="py-2.5 px-3 text-ink-200">{row.dzuhur}</td>
                      <td className="py-2.5 px-3 text-ink-200">{row.ashar}</td>
                      <td className="py-2.5 px-3 text-accent-700 font-bold">{row.maghrib}</td>
                      <td className="py-2.5 px-3 text-ink-200">{row.isya}</td>
                      {viewMode === 'ramadan' && (
                        <td className="py-2.5 px-3 font-sans text-xs text-ink-400 whitespace-nowrap">
                          {row.note ? (
                            <span className="text-accent-700 font-medium">{row.note}</span>
                          ) : (
                            '-'
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
};
