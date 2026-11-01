import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  HeartHandshake,
  ShieldCheck,
  ShieldAlert,
  Moon,
  Edit3,
  Flame,
  Check,
  Plus,
  Info,
  Clock,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { SyncHint } from '../../components/common/SyncHint';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Dialog } from '../../components/common/Dialog';
import { FastingModal } from './FastingModal';
import {
  DEFAULT_WORSHIP_ITEMS,
  FASTING_REASONS_CONFIG,
  getLocalDateString,
  formatDisplayDate,
  getDailyWorshipRecord,
  toggleWorshipItem,
  updateSedekahRecord,
  updateQuranProgress,
  updateFastingRecord,
  pullLastReadToToday,
  resetDailyWorship,
  getWorshipSummary,
  get30DaysRamadanSlots,
  getRamadanMonthlyStats,
  getRamadanDayNumber,
} from '../../services/ibadahService';
import { getLastRead } from '../../services/quranService';
import { useToast } from '../../context/ToastContext';
import type {
  WorshipCategory,
  DailyWorshipRecord,
  FastingRecord,
} from '../../types/ibadah';

export const IbadahPage: React.FC = () => {
  const { showToast } = useToast();

  const todayStr = getLocalDateString();
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [record, setRecord] = useState<DailyWorshipRecord>(() => getDailyWorshipRecord(todayStr));
  const [activeCategory, setActiveCategory] = useState<WorshipCategory | 'all'>('all');

  // Modal dialog states
  const [isFastingModalOpen, setIsFastingModalOpen] = useState(false);

  const [isSedekahModalOpen, setIsSedekahModalOpen] = useState(false);
  const [sedekahInputNote, setSedekahInputNote] = useState('');
  const [sedekahInputAmount, setSedekahInputAmount] = useState('');

  const [isQuranModalOpen, setIsQuranModalOpen] = useState(false);
  const [quranSurahName, setQuranSurahName] = useState('');
  const [quranVerseNum, setQuranVerseNum] = useState('');
  const [quranPagesRead, setQuranPagesRead] = useState('');

  // Reload record whenever selectedDate changes
  useEffect(() => {
    const current = getDailyWorshipRecord(selectedDate);
    setRecord(current);
    setSedekahInputNote(current.sedekahNote || '');
    setSedekahInputAmount(current.sedekahAmount ? current.sedekahAmount.toString() : '');
    setQuranSurahName(current.quranProgress?.surahName || '');
    setQuranVerseNum(
      current.quranProgress?.verseNumber ? current.quranProgress.verseNumber.toString() : ''
    );
    setQuranPagesRead(
      current.quranProgress?.pagesRead ? current.quranProgress.pagesRead.toString() : ''
    );
  }, [selectedDate]);

  const summary = getWorshipSummary(selectedDate);
  const ramadanSlots = get30DaysRamadanSlots();
  const monthlyStats = getRamadanMonthlyStats();
  const activeRamadanDay = getRamadanDayNumber(selectedDate);
  const lastReadQuran = getLastRead();

  // Navigation handlers
  const handlePreviousDay = () => {
    const parts = selectedDate.split('-');
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    d.setDate(d.getDate() - 1);
    setSelectedDate(getLocalDateString(d));
  };

  const handleNextDay = () => {
    const parts = selectedDate.split('-');
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    d.setDate(d.getDate() + 1);
    setSelectedDate(getLocalDateString(d));
  };

  const handleTodayJump = () => {
    setSelectedDate(todayStr);
  };

  const handleToggleItem = (itemId: string, label: string) => {
    const updated = toggleWorshipItem(selectedDate, itemId);
    setRecord(updated);

    const isDone = updated.completedItemIds.includes(itemId);
    showToast({
      title: isDone ? 'Alhamdulillah Tercapai' : 'Diperbarui',
      message: `${label} ${isDone ? 'ditandai selesai' : 'dibatalkan'}.`,
      type: isDone ? 'success' : 'info',
      duration: 2000,
    });
  };

  const handleSaveFasting = (fasting: FastingRecord) => {
    const updated = updateFastingRecord(selectedDate, fasting);
    setRecord(updated);

    if (fasting.status === 'puasa') {
      showToast({
        title: 'Status Puasa Disimpan',
        message: 'Alhamdulillah, semoga Allah menerima ibadah puasa hari ini.',
        type: 'success',
      });
    } else if (fasting.status === 'tidak_puasa') {
      const cfg = fasting.reason ? FASTING_REASONS_CONFIG[fasting.reason] : null;
      showToast({
        title: 'Catatan Udzur Disimpan',
        message: cfg
          ? `Alasan: ${cfg.label} (${cfg.obligation}). Tetap semangat beribadah lainnya.`
          : 'Catatan tidak berpuasa telah disimpan.',
        type: 'info',
        duration: 3000,
      });
    } else {
      showToast({
        title: 'Status Puasa Diperbarui',
        message: 'Puasa setengah hari telah dicatat.',
        type: 'info',
      });
    }
  };

  const handleQuickMarkFasting = () => {
    handleSaveFasting({
      status: 'puasa',
      obligationType: 'tidak_ada',
    });
  };

  const handleReset = () => {
    const resetRec = resetDailyWorship(selectedDate);
    setRecord(resetRec);
    showToast({
      title: 'Catatan Direset',
      message: `Seluruh target ibadah untuk ${formatDisplayDate(selectedDate)} telah dikembalikan ke awal.`,
      type: 'info',
    });
  };

  const handleSaveSedekah = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = sedekahInputAmount ? parseInt(sedekahInputAmount, 10) : undefined;
    const updated = updateSedekahRecord(selectedDate, sedekahInputNote, amount);
    setRecord(updated);
    setIsSedekahModalOpen(false);
    showToast({
      title: 'Sedekah Dicatat',
      message: 'Catatan amalan sedekah berhasil disimpan.',
      type: 'success',
    });
  };

  const handleSaveQuranProgress = (e: React.FormEvent) => {
    e.preventDefault();
    const vNum = quranVerseNum ? parseInt(quranVerseNum, 10) : undefined;
    const pNum = quranPagesRead ? parseInt(quranPagesRead, 10) : undefined;

    const updated = updateQuranProgress(selectedDate, {
      surahName: quranSurahName.trim(),
      verseNumber: vNum,
      pagesRead: pNum,
    });
    setRecord(updated);
    setIsQuranModalOpen(false);
    showToast({
      title: 'Progres Tilawah Disimpan',
      message: 'Capaian baca Al-Qur\'an hari ini telah dicatat.',
      type: 'success',
    });
  };

  const handleSyncQuranLastRead = () => {
    if (!lastReadQuran) {
      showToast({
        title: 'Belum Ada Riwayat Baca',
        message: 'Buka menu Al-Qur\'an dan baca ayat untuk menyinkronkan posisi terakhir.',
        type: 'info',
      });
      return;
    }

    const updated = pullLastReadToToday();
    if (updated) {
      if (selectedDate === todayStr) {
        setRecord(updated);
      }
      showToast({
        title: 'Tersinkron dengan Al-Qur\'an',
        message: `Posisi terakhir: QS. ${lastReadQuran.surahName} ayat ${lastReadQuran.verseNumber}.`,
        type: 'success',
      });
    }
  };

  // Filter items
  const filteredItems = DEFAULT_WORSHIP_ITEMS.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const isSelectedDateToday = selectedDate === todayStr;
  const currentFastingReasonMeta = record.fasting?.reason
    ? FASTING_REASONS_CONFIG[record.fasting.reason]
    : null;

  return (
    <div className="space-y-6">
      <SyncHint />
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-ink-100">Pelacak Ibadah & Puasa</h1>
            <Badge variant="emerald">Mutaba'ah Yaumiyah</Badge>
          </div>
          <p className="text-xs text-ink-400 mt-1">
            Pantau puasa harian, catat alasan udzur syar'i, serta istiqamah dalam sholat, tilawah, dan sedekah 30 hari penuh.
          </p>
        </div>

        {/* Date Navigator Header */}
        <div className="flex items-center gap-1.5 bg-surface-elevated/70 p-1 rounded-xl border border-ink-700/60 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handlePreviousDay}
            title="Hari Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4 text-ink-300" />
          </Button>

          <button
            type="button"
            onClick={handleTodayJump}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              isSelectedDateToday
                ? 'bg-accent-600/30 text-accent-700 border border-accent-500/40'
                : 'text-ink-300 hover:text-ink-50 hover:bg-ink-800/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-accent-700" />
            <span>
              {activeRamadanDay ? `Hari ke-${activeRamadanDay}` : isSelectedDateToday ? 'Hari Ini' : selectedDate}
            </span>
          </button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleNextDay}
            title="Hari Selanjutnya"
          >
            <ChevronRight className="w-4 h-4 text-ink-300" />
          </Button>
        </div>
      </div>

      {/* ================= SECTION KOTAK HARI 1 SAMPAI HARI 30 RAMADAN ================= */}
      <Card className="border-ink-800 bg-ink-900/40">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Moon className="w-4 h-4 text-accent-700" />
                  <span>Jurnal 30 Hari Ramadan 1448 H</span>
                </CardTitle>
                <Badge variant="blue" size="sm">
                  30 Hari Lengkap
                </Badge>
              </div>
              <CardDescription>
                Pilih kotak hari (Hari 1 s/d Hari 30) untuk mengontrol catatan puasa dan amalan harian secara rapi.
              </CardDescription>
            </div>

            {/* Quick Stat Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="px-2.5 py-1 rounded-lg bg-ink-800/40 border border-accent-800/50 text-accent-700 flex items-center gap-1.5 font-medium">
                <Moon className="w-3 h-3 text-accent-700" />
                <span>Puasa:</span>
                <strong className="font-mono text-accent-700">
                  {monthlyStats.totalPuasa}/30
                </strong>
              </div>

              {monthlyStats.totalTidakPuasa > 0 && (
                <div className="px-2.5 py-1 rounded-lg bg-ink-800/40 border border-accent-800/50 text-accent-700 flex items-center gap-1.5 font-medium">
                  <ShieldAlert className="w-3 h-3 text-accent-700" />
                  <span>Udzur:</span>
                  <strong className="font-mono text-accent-700">
                    {monthlyStats.totalTidakPuasa}
                  </strong>
                  {monthlyStats.totalQadha > 0 && (
                    <span className="text-xs text-accent-700">
                      (Qadha: {monthlyStats.totalQadha})
                    </span>
                  )}
                </div>
              )}

              <div className="px-2.5 py-1 rounded-lg bg-ink-800/60 border border-ink-700/60 text-ink-300 flex items-center gap-1.5 font-medium">
                <Flame className="w-3 h-3 text-accent-700" />
                <span>Rerata:</span>
                <strong className="font-mono text-ink-100">
                  {monthlyStats.averagePercentage}%
                </strong>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Responsive 30-Day Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
            {ramadanSlots.map((slot) => {
              const isSelected = slot.dateStr === selectedDate;
              const hasFasting = !!slot.fasting;
              const isPuasa = slot.fasting?.status === 'puasa';
              const isTidakPuasa = slot.fasting?.status === 'tidak_puasa';
              const isSetengah = slot.fasting?.status === 'setengah_hari';

              return (
                <button
                  key={slot.day}
                  type="button"
                  onClick={() => setSelectedDate(slot.dateStr)}
                  className={`p-2 rounded-lg text-left transition-all relative flex flex-col justify-between min-h-[72px] border ${
                    isSelected
                      ? 'bg-ink-800/50 border-accent-500 ring-2 ring-accent-500/80'
                      : slot.isToday
                      ? 'bg-ink-800/30 border-accent-500/50 hover:bg-ink-800/20'
                      : 'bg-surface-elevated/40 border-ink-800/80 hover:bg-surface-elevated hover:border-ink-700'
                  }`}
                  title={`${slot.hijriFormatted} (${slot.dateFormatted}) - Capaian: ${slot.summary.percentage}%`}
                >
                  {/* Top: Day Number & Date */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-bold ${
                        isSelected
                          ? 'text-accent-700'
                          : slot.isToday
                          ? 'text-accent-700'
                          : 'text-ink-200'
                      }`}
                    >
                      H-{slot.day}
                    </span>
                    <span className="text-xs text-ink-400 font-mono">
                      {slot.dateFormatted}
                    </span>
                  </div>

                  {/* Middle: Fasting Status Pill */}
                  <div className="my-1">
                    {isPuasa && (
                      <span className="inline-flex items-center gap-0.5 text-xs px-1 py-0.2 rounded bg-accent-500/20 text-accent-700 font-medium border border-accent-500/30">
                        <Moon className="w-2.5 h-2.5 text-accent-700" />
                        <span>Puasa</span>
                      </span>
                    )}
                    {isTidakPuasa && (
                      <span className="inline-flex items-center gap-0.5 text-xs px-1 py-0.2 rounded bg-accent-500/20 text-accent-700 font-medium border border-accent-500/30 truncate max-w-full">
                        <ShieldAlert className="w-2.5 h-2.5 text-accent-700 shrink-0" />
                        <span className="truncate">
                          {slot.fasting?.reason
                            ? FASTING_REASONS_CONFIG[slot.fasting.reason]?.shortLabel
                            : 'Udzur'}
                        </span>
                      </span>
                    )}
                    {isSetengah && (
                      <span className="inline-flex items-center text-xs px-1 py-0.2 rounded bg-accent-500/20 text-accent-700 font-medium border border-accent-500/30">
                        ½ Hari
                      </span>
                    )}
                    {!hasFasting && (
                      <span className="text-xs text-ink-400 italic">
                        Belum
                      </span>
                    )}
                  </div>

                  {/* Bottom: Progress bar */}
                  <div className="w-full space-y-0.5">
                    <div className="flex items-center justify-between text-[8px] text-ink-400 font-mono">
                      <span>Amalan</span>
                      <span
                        className={
                          slot.summary.percentage >= 80
                            ? 'text-accent-700 font-bold'
                            : slot.summary.percentage > 0
                            ? 'text-ink-300'
                            : 'text-ink-400'
                        }
                      >
                        {slot.summary.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-ink-800 rounded-full h-1 overflow-hidden">
                      <div
                        className={`h-1 rounded-full transition-all ${
                          slot.summary.percentage >= 80
                            ? 'bg-accent-400'
                            : slot.summary.percentage >= 40
                            ? 'bg-accent-400'
                            : slot.summary.percentage > 0
                            ? 'bg-accent-400'
                            : 'bg-transparent'
                        }`}
                        style={{ width: `${slot.summary.percentage}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ================= STATUS PUASA HARI INI / TERPILIH ================= */}
      <Card
        className={`border transition-colors ${
          record.fasting?.status === 'puasa'
            ? 'bg-surface border-accent-500/30'
            : record.fasting?.status === 'tidak_puasa'
            ? 'bg-surface border-accent-500/30'
            : 'bg-surface-elevated/40 border-ink-800'
        }`}
      >
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                  record.fasting?.status === 'puasa'
                    ? 'bg-accent-500/20 text-accent-700 border-accent-500/40'
                    : record.fasting?.status === 'tidak_puasa'
                    ? 'bg-accent-500/20 text-accent-700 border-accent-500/40'
                    : 'bg-ink-800/60 text-ink-400 border-ink-700/60'
                }`}
              >
                {record.fasting?.status === 'puasa' ? (
                  <Moon className="w-6 h-6 text-accent-700" />
                ) : record.fasting?.status === 'tidak_puasa' ? (
                  <ShieldAlert className="w-6 h-6 text-accent-700" />
                ) : (
                  <HelpCircle className="w-6 h-6 text-ink-400" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-ink-400">
                    Status Puasa {activeRamadanDay ? `Hari ke-${activeRamadanDay}` : ''}
                  </span>
                  {record.fasting?.status === 'puasa' && (
                    <Badge variant="emerald" size="sm">
                      Alhamdulillah Berpuasa
                    </Badge>
                  )}
                  {record.fasting?.status === 'tidak_puasa' && (
                    <Badge variant="gold" size="sm">
                      Tidak Berpuasa (Udzur)
                    </Badge>
                  )}
                  {record.fasting?.status === 'setengah_hari' && (
                    <Badge variant="blue" size="sm">
                      Setengah Hari
                    </Badge>
                  )}
                </div>

                {record.fasting?.status === 'puasa' && (
                  <div>
                    <h3 className="text-base font-bold text-ink-100">
                      Ibadah Puasa Sedang Dijalankan
                    </h3>
                    <p className="text-xs text-ink-300 leading-relaxed mt-0.5">
                      Menahan makan, minum, dan perkara yang membatalkan puasa mulai terbit fajar shadiq hingga terbenam matahari semata mengharap ridha Allah Ta'ala.
                    </p>
                  </div>
                )}

                {record.fasting?.status === 'tidak_puasa' && (
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-accent-700 flex items-center gap-2">
                      <span>Alasan: {currentFastingReasonMeta?.label || 'Udzur Syar\'i'}</span>
                      <Badge variant="gold" size="sm" className="text-xs">
                        {currentFastingReasonMeta?.obligation}
                      </Badge>
                    </h3>
                    <p className="text-xs text-ink-300 leading-relaxed">
                      {currentFastingReasonMeta?.description}
                    </p>
                    {record.fasting.reasonNote && (
                      <p className="text-xs text-accent-700 italic border-l-2 border-accent-500/40 pl-2 mt-1">
                        Catatan: "{record.fasting.reasonNote}"
                      </p>
                    )}
                  </div>
                )}

                {!record.fasting && (
                  <div>
                    <h3 className="text-sm font-semibold text-ink-200">
                      Status Puasa Hari Ini Belum Dicatat
                    </h3>
                    <p className="text-xs text-ink-400 leading-relaxed mt-0.5">
                      Tentukan apakah Anda berpuasa penuh atau berhalangan karena udzur syar'i (sakit, safar, haid, dsb).
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons for Fasting */}
            <div className="flex items-center gap-2 shrink-0 sm:self-center">
              {record.fasting ? (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                  onClick={() => setIsFastingModalOpen(true)}
                >
                  Ubah Status Puasa
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Moon className="w-3.5 h-3.5" />}
                    onClick={handleQuickMarkFasting}
                  >
                    Saya Berpuasa
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<ShieldAlert className="w-3.5 h-3.5 text-accent-700" />}
                    onClick={() => setIsFastingModalOpen(true)}
                  >
                    Ada Udzur
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================= RINGKASAN CAPAIAN HARI INI ================= */}
      <Card className="bg-surface border-accent-500/25">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-accent-700">
                  {isSelectedDateToday
                    ? 'Capaian Hari Ini'
                    : `Capaian (${formatDisplayDate(selectedDate)})`}
                </span>
                <Badge variant={summary.percentage >= 80 ? 'emerald' : 'blue'} size="sm">
                  {summary.percentage >= 80
                    ? 'Luar Biasa'
                    : summary.percentage >= 50
                    ? 'Terus Istiqamah'
                    : 'Awali Kebaikan'}
                </Badge>
              </div>

              <div className="text-2xl font-bold text-ink-100 mt-1">
                {summary.completedCount} dari {summary.totalItems} Amalan Tertunaikan
              </div>

              <p className="text-xs text-ink-300/90 mt-1 leading-relaxed max-w-xl">
                "Amalan yang paling dicintai oleh Allah adalah amalan yang berkelanjutan (istiqamah) meskipun sedikit." (HR. Al-Bukhari No. 6464)
              </p>
            </div>

            <div className="text-right">
              <span className="text-4xl font-bold text-accent-700 tabular-nums">
                {summary.percentage}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-ink-800/80 rounded-full h-3 mt-4 overflow-hidden border border-ink-700/50">
            <div
              className="bg-accent-400 h-3 rounded-full transition-all duration-300"
              style={{ width: `${summary.percentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* ================= TILAWAH & SEDEKAH WIDGET ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quran Tilawah Progress Card */}
        <Card className="border-accent-500/20 bg-surface">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent-700" />
                <CardTitle className="text-sm">Tilawah Al-Qur'an</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="min-h-[38px] text-xs px-3 text-accent-700 border-accent-600/40 active:scale-95 touch-manipulation"
                onClick={() => setIsQuranModalOpen(true)}
              >
                <Edit3 className="w-3.5 h-3.5 mr-1" />
                {record.quranProgress ? 'Ubah' : 'Catat'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {record.quranProgress ? (
              <div className="p-3 rounded-lg bg-ink-900/60 border border-ink-800 space-y-1">
                <div className="text-xs font-semibold text-ink-100 flex items-center justify-between">
                  <span>QS. {record.quranProgress.surahName || "Al-Qur'an"}</span>
                  {record.quranProgress.verseNumber && (
                    <Badge variant="blue" size="sm">
                      Ayat {record.quranProgress.verseNumber}
                    </Badge>
                  )}
                </div>
                {record.quranProgress.pagesRead && (
                  <div className="text-xs text-ink-400">
                    Membaca {record.quranProgress.pagesRead} lembar/halaman
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-ink-400 leading-relaxed">
                Belum ada catatan tilawah hari ini. Anda dapat menyinkronkan posisi terakhir dari Quran Reader.
              </p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="secondary"
                size="sm"
                className="text-xs flex-1 justify-center bg-ink-800/60 hover:bg-ink-800"
                onClick={handleSyncQuranLastRead}
              >
                Tarik Posisi Terakhir
              </Button>
              <Link to="/quran" className="flex-1">
                <Button variant="primary" size="sm" className="w-full text-xs justify-center">
                  Buka Al-Qur'an
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Sedekah Tracker Card */}
        <Card className="border-accent-500/20 bg-surface">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-accent-700" />
                <CardTitle className="text-sm">Sedekah & Kebaikan</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="min-h-[38px] text-xs px-3 text-accent-700 border-accent-600/40 active:scale-95 touch-manipulation"
                onClick={() => setIsSedekahModalOpen(true)}
              >
                <Edit3 className="w-3.5 h-3.5 mr-1" />
                {record.sedekahNote || record.sedekahAmount ? 'Ubah' : 'Catat'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {record.sedekahNote || record.sedekahAmount ? (
              <div className="p-3 rounded-lg bg-ink-900/60 border border-ink-800 space-y-1">
                {record.sedekahAmount && (
                  <div className="text-xs font-bold text-accent-700">
                    Rp {record.sedekahAmount.toLocaleString('id-ID')}
                  </div>
                )}
                {record.sedekahNote && (
                  <p className="text-xs text-ink-300 italic">"{record.sedekahNote}"</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-ink-400 leading-relaxed">
                Belum ada catatan sedekah hari ini. Setiap senyum, infaq, dan bantuan kecil bernilai sedekah.
              </p>
            )}

            <Button
              variant="secondary"
              size="sm"
              className="w-full text-xs justify-center bg-ink-800/60 hover:bg-ink-800"
              onClick={() => setIsSedekahModalOpen(true)}
            >
              + Tambah Catatan Sedekah
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ================= DAFTAR AMALAN HARIAN ================= */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            <div>
              <CardTitle>
                Daftar Amalan: {formatDisplayDate(selectedDate)}
              </CardTitle>
              <CardDescription>
                Ketuk amalan untuk menandai ibadah yang telah Anda kerjakan hari ini
              </CardDescription>
            </div>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5 text-ink-400" />}
              onClick={handleReset}
            >
              Reset Hari Ini
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'Semua Amalan' },
              { id: 'fardhu', label: 'Sholat Fardhu' },
              { id: 'sunnah', label: 'Sholat Sunnah' },
              { id: 'quran', label: "Al-Qur'an" },
              { id: 'sedekah', label: 'Sedekah' },
              { id: 'dzikir', label: 'Dzikir & Doa' },
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-semibold whitespace-nowrap transition-all touch-manipulation cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-accent-400 text-on-accent font-semibold'
                      : 'bg-surface-elevated/40 hover:bg-surface-elevated text-ink-300 hover:text-ink-50 border border-ink-800'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Checklist Items */}
          <div className="divide-y divide-ink-800/80">
            {filteredItems.map((item) => {
              const isCompleted = record.completedItemIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleItem(item.id, item.label)}
                  className="py-3.5 px-3 min-h-[52px] flex items-center justify-between gap-3 hover:bg-ink-800/40 active:scale-[0.99] rounded-lg cursor-pointer transition-all touch-manipulation group"
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      className="mt-0.5 shrink-0 focus:outline-none"
                      aria-label={isCompleted ? 'Selesai' : 'Belum Selesai'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-accent-700" />
                      ) : (
                        <Circle className="w-5 h-5 text-ink-400 group-hover:text-ink-400" />
                      )}
                    </button>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm font-medium transition-colors ${
                            isCompleted
                              ? 'text-ink-400 line-through'
                              : 'text-ink-100 group-hover:text-accent-800'
                          }`}
                        >
                          {item.label}
                        </span>

                        {item.arabicLabel && (
                          <span
                            className="text-xs text-ink-400 font-arabic hidden sm:inline"
                            dir="rtl"
                          >
                            ({item.arabicLabel})
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-xs text-ink-400 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <Badge
                    variant={
                      item.category === 'fardhu'
                        ? 'blue'
                        : item.category === 'sunnah'
                        ? 'violet'
                        : item.category === 'sedekah'
                        ? 'emerald'
                        : item.category === 'quran'
                        ? 'gold'
                        : 'slate'
                    }
                    size="sm"
                    className="shrink-0"
                  >
                    {item.category.toUpperCase()}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Fasting & Udzur Modal */}
      <FastingModal
        isOpen={isFastingModalOpen}
        onClose={() => setIsFastingModalOpen(false)}
        dateStr={selectedDate}
        dayDisplay={
          activeRamadanDay
            ? `Hari ke-${activeRamadanDay} Ramadan`
            : formatDisplayDate(selectedDate)
        }
        currentFasting={record.fasting}
        onSave={handleSaveFasting}
      />

      {/* Sedekah Input Modal */}
      <Dialog
        isOpen={isSedekahModalOpen}
        onClose={() => setIsSedekahModalOpen(false)}
        title="Catatan Sedekah Harian"
        description="Catat kebaikan atau infaq yang Anda keluarkan hari ini untuk memotivasi istiqamah diri."
      >
        <form onSubmit={handleSaveSedekah} className="space-y-4 text-xs">
          <Input
            label="Nominal Sedekah (Rupiah - Opsional)"
            placeholder="Contoh: 10000 / 50000"
            type="number"
            min="0"
            value={sedekahInputAmount}
            onChange={(e) => setSedekahInputAmount(e.target.value)}
          />

          <div className="space-y-1">
            <label className="block text-xs font-medium text-ink-300">
              Keterangan / Niat Sedekah
            </label>
            <textarea
              rows={3}
              placeholder="Contoh: Sedekah subuh, berbagi takjil musholla, infaq anak yatim..."
              value={sedekahInputNote}
              onChange={(e) => setSedekahInputNote(e.target.value)}
              className="w-full bg-surface-elevated/70 border border-ink-700/60 rounded-lg px-4 py-2.5 text-xs text-ink-100 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsSedekahModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan Catatan Sedekah
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Quran Progress Input Modal */}
      <Dialog
        isOpen={isQuranModalOpen}
        onClose={() => setIsQuranModalOpen(false)}
        title="Catat Progres Tilawah Al-Qur'an"
        description="Dokumentasikan capaian surat dan lembar yang berhasil dibaca hari ini."
      >
        <form onSubmit={handleSaveQuranProgress} className="space-y-4 text-xs">
          <Input
            label="Nama Surat Terakhir"
            placeholder="Contoh: Al-Baqarah / Yasin"
            value={quranSurahName}
            onChange={(e) => setQuranSurahName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nomor Ayat Terakhir"
              placeholder="Contoh: 255"
              type="number"
              min="1"
              value={quranVerseNum}
              onChange={(e) => setQuranVerseNum(e.target.value)}
            />
            <Input
              label="Jumlah Lembar / Halaman"
              placeholder="Contoh: 10"
              type="number"
              min="1"
              value={quranPagesRead}
              onChange={(e) => setQuranPagesRead(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsQuranModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan Progres Tilawah
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
