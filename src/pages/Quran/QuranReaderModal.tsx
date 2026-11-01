import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Play,
  Pause,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Volume2,
  Copy,
  Check,
  Info,
  Sparkles,
  ArrowDown,
  Gauge,
  Sliders,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { useAppSettings } from '../../context/AppSettingsContext';
import { useToast } from '../../context/ToastContext';
import {
  fetchSurahDetail,
  SurahDetail,
  Ayat,
  saveLastRead,
  toggleBookmark,
  isVerseBookmarked,
} from '../../services/quranService';

export interface QuranReaderModalProps {
  surahNumber: number | null;
  targetVerseNumber?: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigateSurah: (surahNumber: number, targetVerse?: number) => void;
}

export const QuranReaderModal: React.FC<QuranReaderModalProps> = ({
  surahNumber,
  targetVerseNumber,
  isOpen,
  onClose,
  onNavigateSurah,
}) => {
  const { settings, updateSettings } = useAppSettings();
  const { showToast } = useToast();

  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Audio Player State
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null);
  const [isPlayingFullSurah, setIsPlayingFullSurah] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Copy feedback state
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);

  // Bookmark change trigger
  const [bookmarkTick, setBookmarkTick] = useState(0);

  // Auto Scroll States
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(1); // 0.5x, 1x, 1.5x, 2x, 3x
  const [showSpeedControls, setShowSpeedControls] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Auto Scroll Loop
  useEffect(() => {
    if (!isAutoScrolling) {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      return;
    }

    let lastTimestamp = performance.now();

    const scrollStep = (timestamp: number) => {
      const elapsed = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        // Base speed: 50 pixels per second for 1x
        const pixelsToScroll = (50 * scrollSpeed * elapsed) / 1000;
        container.scrollTop += pixelsToScroll;

        // Check if bottom reached
        if (container.scrollTop + container.clientHeight >= container.scrollHeight - 5) {
          setIsAutoScrolling(false);
          showToast({
            title: 'Akhir Surat Tercapai',
            message: 'Auto scroll dihentikan karena telah mencapai akhir surat.',
            type: 'info',
            duration: 2500,
          });
          return;
        }
      }

      animFrameIdRef.current = requestAnimationFrame(scrollStep);
    };

    animFrameIdRef.current = requestAnimationFrame(scrollStep);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isAutoScrolling, scrollSpeed, showToast]);

  // Stop auto scroll when modal closes or surah changes
  useEffect(() => {
    setIsAutoScrolling(false);
  }, [surahNumber, isOpen]);

  // Fetch Surah Details
  useEffect(() => {
    if (!isOpen || !surahNumber) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setSurah(null);

    // Stop audio if running
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingAudioUrl(null);
      setIsPlayingFullSurah(false);
    }

    fetchSurahDetail(surahNumber)
      .then((data) => {
        if (!isMounted) return;
        setSurah(data);
        setIsLoading(false);

        // Auto-save last read
        saveLastRead(data.nomor, data.namaLatin, targetVerseNumber || 1);

        // Scroll to target verse after render if specified
        if (targetVerseNumber && targetVerseNumber > 1) {
          setTimeout(() => {
            const el = document.getElementById(`verse-${targetVerseNumber}`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 300);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Gagal memuat surat. Periksa jaringan internet Anda.');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isOpen, surahNumber, targetVerseNumber]);

  // Audio Playback Handler
  const handlePlayAudio = (url: string, isFull: boolean = false) => {
    if (playingAudioUrl === url) {
      // Pause
      audioRef.current?.pause();
      setPlayingAudioUrl(null);
      setIsPlayingFullSurah(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingAudioUrl(url);
    setIsPlayingFullSurah(isFull);

    audio.play().catch((err) => {
      console.warn('Audio play failed', err);
      showToast({ title: 'Gagal Memutar Audio', message: 'Audio murottal tidak dapat diputar.', type: 'warning' });
      setPlayingAudioUrl(null);
      setIsPlayingFullSurah(false);
    });

    audio.onended = () => {
      setPlayingAudioUrl(null);
      setIsPlayingFullSurah(false);
    };
  };

  const handleToggleBookmark = (ayat: Ayat) => {
    if (!surah) return;
    const added = toggleBookmark(
      surah.nomor,
      surah.namaLatin,
      ayat.nomorAyat,
      ayat.teksArab,
      ayat.teksIndonesia
    );
    setBookmarkTick((t) => t + 1);
    showToast({
      title: added ? 'Bookmark Ditambahkan' : 'Bookmark Dihapus',
      message: `Surat ${surah.namaLatin} Ayat ${ayat.nomorAyat} ${added ? 'disimpan ke bookmark' : 'dihapus dari bookmark'}.`,
      type: added ? 'success' : 'info',
      duration: 2500,
    });
  };

  const handleMarkAsLastRead = (verseNumber: number) => {
    if (!surah) return;
    saveLastRead(surah.nomor, surah.namaLatin, verseNumber);
    showToast({
      title: 'Posisi Terakhir Dibaca Disimpan',
      message: `Surat ${surah.namaLatin} Ayat ${verseNumber} tercatat sebagai bacaan terakhir Anda.`,
      type: 'success',
      duration: 2500,
    });
  };

  const handleCopyVerse = (ayat: Ayat) => {
    if (!surah) return;
    const text = `${ayat.teksArab}\n\n"${ayat.teksIndonesia}"\n(QS. ${surah.namaLatin} [${surah.nomor}]: ${ayat.nomorAyat})`;
    navigator.clipboard.writeText(text);
    setCopiedVerse(ayat.nomorAyat);
    showToast({ title: 'Ayat Disalin', message: `QS. ${surah.namaLatin}: ${ayat.nomorAyat} disalin ke clipboard.`, type: 'info', duration: 2000 });
    setTimeout(() => setCopiedVerse(null), 2500);
  };

  const handleZoomIn = () => {
    updateSettings({
      arabicFontSize: Math.min(42, (settings.arabicFontSize || 24) + 2),
      translationFontSize: Math.min(22, (settings.translationFontSize || 14) + 1),
    });
  };

  const handleZoomOut = () => {
    updateSettings({
      arabicFontSize: Math.max(18, (settings.arabicFontSize || 24) - 2),
      translationFontSize: Math.max(12, (settings.translationFontSize || 14) - 1),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background overflow-hidden">
      {/* Top Sticky Header */}
      <div className="glass-panel border-b border-ink-800/80 px-4 py-3 shrink-0 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose} title="Kembali ke Daftar Surah">
            <X className="w-5 h-5 text-ink-300" />
          </Button>

          {surah ? (
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-ink-100 flex items-center gap-1.5">
                  <span>{surah.nomor}. {surah.namaLatin}</span>
                  <span className="font-arabic text-accent-700 text-lg">({surah.nama})</span>
                </h2>
                <Badge variant="violet" size="sm">
                  {surah.tempatTurun}
                </Badge>
              </div>
              <p className="text-xs text-ink-400">
                {surah.arti} • {surah.jumlahAyat} Ayat
              </p>
            </div>
          ) : (
            <div className="h-8 flex items-center">
              <span className="text-sm font-semibold text-ink-300">Memuat Al-Qur'an...</span>
            </div>
          )}
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5">
          {/* Auto Scroll Toggle Button */}
          <div className="relative">
            <Button
              variant={isAutoScrolling ? 'primary' : 'outline'}
              size="sm"
              leftIcon={isAutoScrolling ? <Pause className="w-3.5 h-3.5 animate-pulse" /> : <ArrowDown className="w-3.5 h-3.5 text-accent-700" />}
              onClick={() => {
                setIsAutoScrolling(!isAutoScrolling);
                if (!isAutoScrolling) {
                  showToast({
                    title: 'Auto Scroll Aktif',
                    message: `Membaca otomatis dengan kecepatan ${scrollSpeed}x. Klik lagi untuk jeda.`,
                    type: 'info',
                    duration: 2000,
                  });
                }
              }}
              className="gap-1.5"
            >
              <span className="hidden sm:inline">Auto Scroll</span>
              <span className="text-xs font-mono opacity-80">{scrollSpeed}x</span>
            </Button>
          </div>

          {/* Speed Selector Toggle */}
          <Button
            variant={showSpeedControls ? 'secondary' : 'ghost'}
            size="icon"
            className="min-h-[40px] min-w-[40px] h-10 w-10 text-ink-300 active:scale-95 touch-manipulation"
            onClick={() => setShowSpeedControls(!showSpeedControls)}
            title="Pengaturan Kecepatan Auto Scroll"
          >
            <Gauge className="w-4 h-4 text-accent-700" />
          </Button>

          {/* Zoom Buttons */}
          <div className="hidden sm:flex items-center gap-1 bg-surface-elevated/60 p-1 rounded-lg border border-ink-700/50">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomOut} title="Perkecil Font">
              <ZoomOut className="w-3.5 h-3.5 text-ink-300" />
            </Button>
            <span className="text-xs font-mono text-ink-400 px-1">
              {settings.arabicFontSize || 24}px
            </span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomIn} title="Perbesar Font">
              <ZoomIn className="w-3.5 h-3.5 text-ink-300" />
            </Button>
          </div>

          {/* Full Murottal Audio Button */}
          {surah?.audioFull && (
            <Button
              variant={isPlayingFullSurah ? 'primary' : 'outline'}
              size="sm"
              leftIcon={isPlayingFullSurah ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-accent-700" />}
              onClick={() => {
                const url =
                  surah.audioFull?.['05'] ||
                  surah.audioFull?.['01'] ||
                  Object.values(surah.audioFull || {})[0];
                if (url) handlePlayAudio(url, true);
              }}
            >
              <span className="hidden sm:inline">{isPlayingFullSurah ? 'Jeda Murottal' : 'Putar Surah'}</span>
            </Button>
          )}

          {/* Surah Navigation (Prev / Next) */}
          {surah && (
            <div className="flex items-center gap-1">
              {surah.nomor > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onNavigateSurah(surah.nomor - 1)}
                  title="Surat Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              )}
              {surah.nomor < 114 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onNavigateSurah(surah.nomor + 1)}
                  title="Surat Selanjutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Subheader: Auto Scroll Speed Control Bar */}
      {(showSpeedControls || isAutoScrolling) && (
        <div className="bg-surface-elevated/95 border-b border-accent-500/30 px-4 py-2 flex items-center justify-between gap-3 text-xs z-30 shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-medium text-ink-200">
              <span className={`w-2 h-2 rounded-full ${isAutoScrolling ? 'bg-accent-400 animate-ping' : 'bg-ink-500'}`} />
              Auto Scroll:
            </span>
            <span className="text-accent-700 font-mono font-bold">{scrollSpeed}x</span>
            {isAutoScrolling ? (
              <Badge variant="emerald" size="sm" className="text-xs">
                Sedang Berjalan
              </Badge>
            ) : (
              <Badge variant="slate" size="sm" className="text-xs">
                Dijeda
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-ink-400 text-xs hidden sm:inline mr-1">Pilih Kecepatan:</span>
            {[0.5, 1, 1.5, 2, 3].map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => {
                  setScrollSpeed(speed);
                  showToast({
                    title: 'Kecepatan Diubah',
                    message: `Kecepatan auto scroll diset ke ${speed}x`,
                    type: 'info',
                    duration: 1500,
                  });
                }}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all touch-manipulation cursor-pointer active:scale-95 ${
                  scrollSpeed === speed
                    ? 'bg-accent-400 text-on-accent font-semibold'
                    : 'bg-surface/80 text-ink-300 hover:text-ink-50 hover:bg-ink-700/60 border border-ink-700/60'
                }`}
              >
                {speed}x
              </button>
            ))}

            <Button
              variant={isAutoScrolling ? 'danger' : 'primary'}
              size="sm"
              className="min-h-[38px] text-xs px-3.5 ml-2"
              leftIcon={isAutoScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            >
              {isAutoScrolling ? 'Jeda' : 'Mulai'}
            </Button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6 py-6">
            <Skeleton className="h-28 w-full rounded-xl" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-6 rounded-xl bg-surface/40 border border-ink-800 space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-7 w-12 rounded-lg" />
                  <Skeleton className="h-7 w-20 rounded-lg" />
                </div>
                <Skeleton className="h-14 w-full rounded-lg" />
                <Skeleton className="h-8 w-3/4 rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-8 text-center rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-900/30 flex items-center justify-center text-rose-700">
              <X className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-rose-700">Koneksi Ayat Terputus</h3>
            <p className="text-xs text-rose-700 max-w-md mx-auto leading-relaxed">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (surahNumber) onNavigateSurah(surahNumber, targetVerseNumber);
              }}
            >
              Coba Muat Ulang
            </Button>
          </div>
        )}

        {/* Surah Detail View */}
        {surah && (
          <>
            {/* Surah Header Card & Bismillah */}
            <div className="rounded-xl p-6 sm:p-8 text-center bg-surface border border-accent-500/20 space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Badge variant="violet">Surat ke-{surah.nomor}</Badge>
                <Badge variant="blue">{surah.jumlahAyat} Ayat</Badge>
                <Badge variant="emerald">{surah.tempatTurun}</Badge>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-ink-100">{surah.namaLatin}</h1>
                <p className="text-sm text-accent-700 mt-1">"{surah.arti}"</p>
              </div>

              {/* Bismillah Banner (Semua surat kecuali At-Taubah no 9) */}
              {surah.nomor !== 9 && (
                <div className="pt-4 border-t border-ink-800/80">
                  <p className="font-arabic text-2xl sm:text-3xl text-accent-700 leading-relaxed">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  <p className="text-xs text-ink-400 mt-1 italic">
                    "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang."
                  </p>
                </div>
              )}
            </div>

            {/* Ayat-Ayat List */}
            <div className="space-y-4">
              {surah.ayat.map((ayat) => {
                const bookmarked = isVerseBookmarked(surah.nomor, ayat.nomorAyat);
                const verseAudioUrl =
                  ayat.audio?.['05'] ||
                  ayat.audio?.['01'] ||
                  Object.values(ayat.audio || {})[0];
                const isPlayingThisVerse = playingAudioUrl === verseAudioUrl;

                return (
                  <div
                    key={ayat.nomorAyat}
                    id={`verse-${ayat.nomorAyat}`}
                    className={`p-5 sm:p-6 rounded-xl border transition-all ${
                      targetVerseNumber === ayat.nomorAyat
                        ? 'bg-ink-800/30 border-accent-500/60 ring-2 ring-accent-500/30'
                        : 'bg-surface/60 border-ink-800/80 hover:border-ink-700/80'
                    }`}
                  >
                    {/* Verse Header Controls */}
                    <div className="flex items-center justify-between pb-4 border-b border-ink-800/60 gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-surface-elevated border border-ink-700/60 flex items-center justify-center text-xs font-bold text-accent-700">
                          {ayat.nomorAyat}
                        </span>
                        <span className="text-xs text-ink-400 font-mono">
                          QS. {surah.nomor}:{ayat.nomorAyat}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Audio Murottal Ayat */}
                        {verseAudioUrl && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="min-h-[40px] min-w-[40px] h-10 w-10 text-ink-400 hover:text-accent-800 active:scale-95 touch-manipulation"
                            onClick={() => handlePlayAudio(verseAudioUrl)}
                            title={isPlayingThisVerse ? 'Jeda Audio Ayat' : 'Putar Audio Ayat'}
                          >
                            {isPlayingThisVerse ? (
                              <Pause className="w-4 h-4 text-accent-700" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </Button>
                        )}

                        {/* Copy Verse */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="min-h-[40px] min-w-[40px] h-10 w-10 text-ink-400 hover:text-ink-200 active:scale-95 touch-manipulation"
                          onClick={() => handleCopyVerse(ayat)}
                          title="Salin Ayat & Terjemahan"
                        >
                          {copiedVerse === ayat.nomorAyat ? (
                            <Check className="w-4 h-4 text-accent-700" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>

                        {/* Bookmark Verse */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`min-h-[40px] min-w-[40px] h-10 w-10 active:scale-95 touch-manipulation ${
                            bookmarked ? 'text-accent-700' : 'text-ink-400 hover:text-accent-800'
                          }`}
                          onClick={() => handleToggleBookmark(ayat)}
                          title={bookmarked ? 'Hapus Bookmark' : 'Tandai Bookmark'}
                        >
                          {bookmarked ? (
                            <BookmarkCheck className="w-4 h-4 text-accent-700" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </Button>

                        {/* Set as Last Read */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs min-h-[40px] px-2.5 text-ink-400 hover:text-accent-800 active:scale-95 touch-manipulation"
                          onClick={() => handleMarkAsLastRead(ayat.nomorAyat)}
                          title="Tandai Sebagai Bacaan Terakhir"
                        >
                          <span className="hidden sm:inline">Tandai Terakhir</span>
                          <span className="sm:hidden text-xs">Terakhir</span>
                        </Button>
                      </div>
                    </div>

                    {/* Arabic Text (Rasm Utsmani) */}
                    <div className="py-6 text-right">
                      <p
                        className="font-arabic text-ink-100 select-text font-normal"
                        style={{
                          fontSize: `${settings.arabicFontSize || 26}px`,
                          lineHeight: `${(settings.arabicFontSize || 26) * 2.1}px`,
                        }}
                        dir="rtl"
                      >
                        {ayat.teksArab}
                      </p>
                    </div>

                    {/* Transliterasi Latin */}
                    {ayat.teksLatin && (
                      <div className="text-xs text-accent-700 italic font-sans leading-relaxed mb-2">
                        {ayat.teksLatin}
                      </div>
                    )}

                    {/* Terjemahan Bahasa Indonesia Resmi Kemenag */}
                    <div
                      className="text-ink-300 font-sans leading-relaxed pt-2 border-t border-ink-800/40"
                      style={{ fontSize: `${settings.translationFontSize || 14}px` }}
                    >
                      {ayat.teksIndonesia}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Next/Prev Surah Navigator */}
            <div className="pt-6 border-t border-ink-800 flex items-center justify-between gap-4">
              {surah.nomor > 1 ? (
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                  onClick={() => onNavigateSurah(surah.nomor - 1)}
                >
                  Surat Sebelumnya
                </Button>
              ) : (
                <div />
              )}

              {surah.nomor < 114 && (
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                  onClick={() => onNavigateSurah(surah.nomor + 1)}
                >
                  Surat Selanjutnya
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
