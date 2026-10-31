import React, { useState } from 'react';
import {
  CalendarDays,
  Moon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
  Info,
  Calendar as CalendarIcon,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useAppSettings } from '../../context/AppSettingsContext';
import {
  getHijriDate,
  IMPORTANT_RAMADAN_DATES,
  ImportantDateItem,
} from '../../services/hijriService';
import { calculateDailyPrayers } from '../../services/prayerService';
import { LocationModal } from '../../components/common/LocationModal';

export const KalenderPage: React.FC = () => {
  const { settings } = useAppSettings();
  const tz = settings.location.timezone || 'Asia/Jakarta';

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2027, 1, 1)); // Default Feb 2027 (Bulan Ramadan 1448 H)
  const [selectedDayDate, setSelectedDayDate] = useState<Date>(new Date(2027, 1, 8)); // 1 Ramadan
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Hitung jumlah hari di bulan ini dan hari pertama (0 = Minggu)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleCurrentMonth = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDayDate(today);
  };

  const selectedDayPrayers = calculateDailyPrayers(
    selectedDayDate,
    settings.location,
    settings.prayerMethod,
    settings.ihtiyatMinutes || 2
  );

  const selectedDayHijri = getHijriDate(selectedDayDate, tz);

  // Periksa apakah ada peristiwa penting di tanggal terpilih
  const matchedEvent = IMPORTANT_RAMADAN_DATES.find(
    (ev) =>
      selectedDayDate.getDate() === 8 && selectedDayDate.getMonth() === 1 && ev.id === 'awal-ramadan'
        ? true
        : selectedDayDate.getDate() === 24 && selectedDayDate.getMonth() === 1 && ev.id === 'nuzulul-quran'
        ? true
        : selectedDayDate.getDate() === 9 && selectedDayDate.getMonth() === 2 && ev.id === 'idul-fitri'
        ? true
        : false
  );

  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-ink-100">Kalender Ramadan & Hijriah</h1>
            <Badge variant="gold">Tahun 1448 H</Badge>
          </div>
          <p className="text-xs text-ink-400 mt-1">
            Penanggalan Masehi terintegrasi dengan kalender astronomis Hijriah dan jadwal sholat harian.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<MapPin className="w-3.5 h-3.5 text-accent-700" />}
            onClick={() => setIsLocationModalOpen(true)}
          >
            {settings.location.city}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleCurrentMonth}>
            Bulan Ini
          </Button>
        </div>
      </div>

      {/* Grid: Interactive Calendar & Selected Day Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Calendar Grid */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-accent-700" />
                <CardTitle>
                  {currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </CardTitle>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={handlePrevMonth} title="Bulan Sebelumnya">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleNextMonth} title="Bulan Berikutnya">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day of Week Headers */}
            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-ink-400 pb-2 border-b border-ink-800">
              {dayNames.map((d, i) => (
                <div key={d} className={i === 5 ? 'text-accent-700' : i === 0 ? 'text-rose-700' : ''}>
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-1 mt-2">
              {/* Empty padding days for month start */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="h-16 sm:h-20 p-1 opacity-20 pointer-events-none" />
              ))}

              {/* Days in Month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateObj = new Date(year, month, dayNum);
                const hijriDateObj = getHijriDate(dateObj, tz);
                const isSelected =
                  dateObj.toDateString() === selectedDayDate.toDateString();
                const isCurrentDate =
                  dateObj.toDateString() === new Date().toDateString();

                // Ramadan identification (Month 1 = Feb 2027 starting day 8)
                const isRamadanDay =
                  (year === 2027 && month === 1 && dayNum >= 8) ||
                  (year === 2027 && month === 2 && dayNum <= 8);

                const ramadanNumber =
                  year === 2027 && month === 1 && dayNum >= 8
                    ? dayNum - 7
                    : year === 2027 && month === 2 && dayNum <= 8
                    ? dayNum + 21
                    : null;

                return (
                  <button
                    key={`day-${dayNum}`}
                    type="button"
                    onClick={() => setSelectedDayDate(dateObj)}
                    className={`h-16 sm:h-20 p-1.5 rounded-lg border text-left transition-all flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-ink-800/40 border-accent-500 ring-1 ring-accent-500/50'
                        : isCurrentDate
                        ? 'bg-ink-800/30 border-accent-500/50'
                        : isRamadanDay
                        ? 'bg-surface-elevated/50 border-accent-500/20 hover:border-accent-500/40'
                        : 'bg-surface/40 border-ink-800/80 hover:bg-surface-elevated/40 hover:border-ink-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-xs font-bold ${
                          isSelected
                            ? 'text-ink-50'
                            : isCurrentDate
                            ? 'text-accent-700 font-bold'
                            : 'text-ink-200'
                        }`}
                      >
                        {dayNum}
                      </span>

                      {ramadanNumber && (
                        <span className="text-xs font-bold px-1 rounded bg-accent-500/20 text-accent-700">
                          R-{ramadanNumber}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-ink-400 font-arabic truncate w-full text-right mt-auto">
                      {hijriDateObj.day} {hijriDateObj.monthName.substring(0, 6)}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Prayer & Fasting Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Rincian Hari Terpilih</CardTitle>
                <CardDescription>
                  {selectedDayPrayers.dateFormatted}
                </CardDescription>
              </div>
              <Badge variant="violet" size="sm">
                {selectedDayHijri.formatted}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {matchedEvent && (
                <div className="p-3 rounded-lg bg-ink-800/30 border border-accent-800/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-accent-700">
                    <Sparkles className="w-3.5 h-3.5 text-accent-700" />
                    <span>{matchedEvent.name}</span>
                  </div>
                  <p className="text-xs text-accent-700 leading-relaxed">
                    {matchedEvent.description}
                  </p>
                </div>
              )}

              {/* Fasting times highlight */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 rounded-lg bg-ink-800/30 border border-accent-800/40">
                  <div className="text-xs font-semibold text-accent-700">Imsak (Sahur)</div>
                  <div className="text-lg font-bold text-ink-100 my-0.5 tabular-nums">
                    {selectedDayPrayers.times.imsak}
                  </div>
                  <div className="text-xs text-ink-400">Mulai Menahan Diri</div>
                </div>

                <div className="p-3 rounded-lg bg-ink-800/30 border border-accent-800/40">
                  <div className="text-xs font-semibold text-accent-700">Maghrib (Buka)</div>
                  <div className="text-lg font-bold text-ink-100 my-0.5 tabular-nums">
                    {selectedDayPrayers.times.maghrib}
                  </div>
                  <div className="text-xs text-ink-400">Waktu Berbuka Puasa</div>
                </div>
              </div>

              {/* Full prayer times for this date */}
              <div className="space-y-1 pt-2 border-t border-ink-800/80">
                <div className="text-xs font-semibold text-ink-400 mb-2">
                  Jadwal Sholat {settings.location.city}
                </div>
                {[
                  { name: 'Subuh', time: selectedDayPrayers.times.subuh },
                  { name: 'Terbit', time: selectedDayPrayers.times.terbit },
                  { name: 'Dzuhur', time: selectedDayPrayers.times.dzuhur },
                  { name: 'Ashar', time: selectedDayPrayers.times.ashar },
                  { name: 'Isya', time: selectedDayPrayers.times.isya },
                ].map((p) => (
                  <div
                    key={p.name}
                    className="flex justify-between py-1 px-2 rounded text-xs text-ink-300 hover:bg-ink-800/30"
                  >
                    <span>{p.name}</span>
                    <span className="font-mono font-bold text-ink-100">{p.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Important Dates List */}
          <Card>
            <CardHeader>
              <CardTitle>Hari Penting Ramadan 1448 H</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {IMPORTANT_RAMADAN_DATES.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-surface-elevated/40 border border-ink-800 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-ink-200">
                    <span>{item.name}</span>
                    <Badge variant={item.isConfirmed ? 'emerald' : 'gold'} size="sm" className="text-xs">
                      {item.isConfirmed ? 'Pasti' : 'Estimasi'}
                    </Badge>
                  </div>
                  <div className="text-xs text-accent-700">{item.gregorianDate}</div>
                  <p className="text-xs text-ink-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
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
