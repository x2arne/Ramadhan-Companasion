import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  ShieldCheck,
  Layers,
  Sparkles,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { QuranReaderModal } from './QuranReaderModal';
import { ALL_30_JUZ } from '../../data/juzData';
import {
  getSurahList,
  getLastRead,
  getBookmarks,
  removeBookmarkById,
  BookmarkItem,
  LastReadItem,
} from '../../services/quranService';
import { useToast } from '../../context/ToastContext';

export const QuranPage: React.FC = () => {
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'surah' | 'juz' | 'bookmark'>('surah');
  const [filterType, setFilterType] = useState<'all' | 'Makkiyah' | 'Madaniyah'>('all');
  const [selectedJuzFilter, setSelectedJuzFilter] = useState<number | undefined>(undefined);

  // Active Reader Modal state
  const [activeSurahNumber, setActiveSurahNumber] = useState<number | null>(null);
  const [targetVerseNumber, setTargetVerseNumber] = useState<number | undefined>(undefined);
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  // Bookmarks & Last read states
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [lastRead, setLastRead] = useState<LastReadItem | null>(null);

  const loadLocalUserData = () => {
    setBookmarks(getBookmarks());
    setLastRead(getLastRead());
  };

  useEffect(() => {
    loadLocalUserData();
  }, [isReaderOpen]);

  const filteredSurahs = getSurahList(searchQuery, filterType, selectedJuzFilter);

  const handleOpenReader = (surahNum: number, verseNum?: number) => {
    setActiveSurahNumber(surahNum);
    setTargetVerseNumber(verseNum);
    setIsReaderOpen(true);
  };

  const handleDeleteBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeBookmarkById(id);
    setBookmarks(getBookmarks());
    showToast({ title: 'Bookmark Dihapus', message: 'Tanda baca telah dihapus dari daftar.', type: 'info' });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-ink-100">Al-Qur'an Al-Karim</h1>
            <Badge variant="emerald" dot>
              114 Surah & 30 Juz Terverifikasi
            </Badge>
          </div>
          <p className="text-xs text-ink-400 mt-1">
            Teks Arab resmi Rasm Utsmani dan terjemahan bahasa Indonesia standar Kementerian Agama RI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="violet" size="md">
            Mushaf Madinah Kemenag
          </Badge>
        </div>
      </div>

      {/* Last Read Resume Card */}
      {lastRead && (
        <Card className="bg-surface border-accent-500/30">
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-accent-600/20 border border-accent-500/40 flex items-center justify-center text-accent-700">
                <BookmarkCheck className="w-5 h-5 text-accent-700" />
              </div>
              <div>
                <div className="text-xs text-accent-700 font-semibold ">
                  Lanjutkan Bacaan Terakhir
                </div>
                <div className="text-base font-bold text-ink-100 mt-0.5">
                  Surat {lastRead.surahName} : Ayat {lastRead.verseNumber}
                </div>
                <div className="text-xs text-ink-400">
                  Surat ke-{lastRead.surahNumber} • Tercatat di perangkat ini
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => handleOpenReader(lastRead.surahNumber, lastRead.verseNumber)}
            >
              Buka Bacaan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Tab Navigation */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-ink-800 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('surah');
              setSelectedJuzFilter(undefined);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'surah' && !selectedJuzFilter
                ? 'bg-accent-400/20 text-accent-700 border border-accent-500/30'
                : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800/40'
            }`}
          >
            Daftar 114 Surah
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('juz')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'juz'
                ? 'bg-accent-400/20 text-accent-700 border border-accent-500/30'
                : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800/40'
            }`}
          >
            30 Juz
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bookmark')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'bookmark'
                ? 'bg-accent-400/20 text-accent-700 border border-accent-500/30'
                : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800/40'
            }`}
          >
            Penanda / Bookmark ({bookmarks.length})
          </button>
        </div>

        {/* Search & Filter Controls (Khusus Tab Surah) */}
        {activeTab === 'surah' && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <Input
                placeholder="Cari nama surat (cth: Al-Baqarah, Yasin, Al-Mulk), nomor, atau arti..."
                leftIcon={<Search className="w-4 h-4 text-ink-400" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  filterType === 'all'
                    ? 'bg-surface-elevated text-ink-50 border border-ink-700'
                    : 'text-ink-400 hover:text-ink-200'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setFilterType('Makkiyah')}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  filterType === 'Makkiyah'
                    ? 'bg-ink-800/40 text-accent-700 border border-accent-500/30'
                    : 'text-ink-400 hover:text-ink-200'
                }`}
              >
                Makkiyah
              </button>
              <button
                type="button"
                onClick={() => setFilterType('Madaniyah')}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  filterType === 'Madaniyah'
                    ? 'bg-ink-800/40 text-accent-700 border border-accent-500/30'
                    : 'text-ink-400 hover:text-ink-200'
                }`}
              >
                Madaniyah
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VIEW: Surah List (114 Surah) */}
      {activeTab === 'surah' && (
        <>
          {selectedJuzFilter && (
            <div className="p-3 rounded-lg bg-ink-800/30 border border-accent-800/40 flex items-center justify-between text-xs">
              <span className="text-accent-700">
                Menampilkan surah pada <strong>Juz {selectedJuzFilter}</strong>
              </span>
              <button
                type="button"
                onClick={() => setSelectedJuzFilter(undefined)}
                className="text-accent-700 hover:text-ink-50 underline"
              >
                Hapus Filter Juz
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredSurahs.map((surah) => (
              <div
                key={surah.nomor}
                onClick={() => handleOpenReader(surah.nomor)}
                className="p-4 rounded-xl bg-surface/60 border border-ink-800/80 hover:border-accent-500/40 hover:bg-surface-elevated/40 transition-all flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-surface-elevated/80 border border-ink-700/60 flex items-center justify-center text-xs font-bold text-accent-700 group-hover:border-accent-500/40 shrink-0">
                    {surah.nomor}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-ink-100 group-hover:text-accent-800 transition-colors truncate">
                      {surah.namaLatin}
                    </h3>
                    <p className="text-xs text-ink-400 truncate mt-0.5">
                      {surah.arti} • {surah.jumlahAyat} Ayat
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-arabic text-xl text-ink-200 group-hover:text-accent-800 block">
                    {surah.nama}
                  </span>
                  <span className="text-xs text-ink-400 tracking-tight">
                    {surah.tempatTurun}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredSurahs.length === 0 && (
            <EmptyState
              icon={<Search className="w-6 h-6 text-accent-700" />}
              title="Surat Tidak Ditemukan"
              description={`Tidak ada surat yang sesuai dengan kata kunci "${searchQuery}". Coba periksa ejaan atau cari berdasarkan nomor surat.`}
              actionLabel="Reset Pencarian"
              onAction={() => {
                setSearchQuery('');
                setFilterType('all');
                setSelectedJuzFilter(undefined);
              }}
            />
          )}
        </>
      )}

      {/* VIEW: 30 Juz Matrix */}
      {activeTab === 'juz' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {ALL_30_JUZ.map((juz) => (
            <div
              key={juz.juzNumber}
              onClick={() => handleOpenReader(juz.startSurahNumber, juz.startVerse)}
              className="p-5 rounded-xl bg-surface/60 border border-ink-800 hover:border-accent-500/40 hover:bg-surface-elevated/40 transition-all cursor-pointer group flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex items-center justify-between">
                  <Badge variant="violet" size="sm">
                    Juz {juz.juzNumber}
                  </Badge>
                  <span className="font-arabic text-sm text-ink-400 group-hover:text-accent-800">
                    {juz.arabicName}
                  </span>
                </div>

                <h3 className="text-base font-bold text-ink-100 mt-3 group-hover:text-accent-800 transition-colors">
                  {juz.name}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs text-ink-400 bg-surface-elevated/40 p-2.5 rounded-lg border border-ink-700/40">
                  <div className="flex justify-between">
                    <span>Mulai:</span>
                    <span className="text-ink-200 font-medium">
                      QS. {juz.startSurahName}: {juz.startVerse}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Selesai:</span>
                    <span className="text-ink-200 font-medium">
                      QS. {juz.endSurahName}: {juz.endVerse}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-ink-800/80 flex items-center justify-between text-xs text-accent-700 font-medium">
                <span>Buka Juz {juz.juzNumber}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW: Bookmarks & Favorites */}
      {activeTab === 'bookmark' && (
        <div className="space-y-4">
          {bookmarks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {bookmarks.map((bm) => (
                <div
                  key={bm.id}
                  onClick={() => handleOpenReader(bm.surahNumber, bm.verseNumber)}
                  className="p-5 rounded-xl bg-surface/60 border border-ink-800 hover:border-accent-500/40 hover:bg-surface-elevated/40 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookmarkCheck className="w-4 h-4 text-accent-700" />
                        <h3 className="text-sm font-bold text-ink-100 group-hover:text-accent-800 transition-colors">
                          Surat {bm.surahName} : Ayat {bm.verseNumber}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteBookmark(bm.id, e)}
                        className="text-ink-400 hover:text-rose-700 p-1 rounded-lg transition-colors"
                        title="Hapus bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="font-arabic text-lg text-accent-700 text-right line-clamp-2 leading-relaxed">
                      {bm.verseTextArab}
                    </p>

                    <p className="text-xs text-ink-300 line-clamp-2 leading-relaxed">
                      "{bm.verseTranslation}"
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-ink-800/80 flex items-center justify-between text-xs text-ink-400">
                    <span>
                      Disimpan: {new Date(bm.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="text-accent-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform font-medium">
                      Baca Ayat Ini <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Bookmark className="w-6 h-6 text-accent-700" />}
              title="Belum Ada Ayat yang Ditandai"
              description="Ketika Anda membaca Al-Qur'an, klik ikon bookmark di samping ayat mana saja untuk menyimpannya ke daftar ini."
              actionLabel="Buka Surat Al-Fatihah"
              onAction={() => handleOpenReader(1)}
            />
          )}
        </div>
      )}

      {/* Reader Modal Overlay */}
      <QuranReaderModal
        isOpen={isReaderOpen}
        surahNumber={activeSurahNumber}
        targetVerseNumber={targetVerseNumber}
        onClose={() => setIsReaderOpen(false)}
        onNavigateSurah={(num, verse) => handleOpenReader(num, verse)}
      />
    </div>
  );
};
