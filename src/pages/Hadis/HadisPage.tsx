import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Scale,
  Utensils,
  Moon,
  BookMarked,
  HeartHandshake,
  ChevronRight,
  Clock,
  FileText,
  X,
  Lightbulb,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { HadisDetailModal } from './HadisDetailModal';
import { ArticleDetailModal } from './ArticleDetailModal';
import type { HadisItem, EducationalArticle, HadisTopic, HadisGrade } from '../../types/hadis';
import {
  getAllHadis,
  searchHadis,
  getAllArticles,
  getArticleById,
  getFavoriteHadisIds,
  toggleFavoriteHadis,
  copyHadisToClipboard,
} from '../../services/hadisService';
import { useToast } from '../../context/ToastContext';

type MainTab = 'hadis' | 'edukasi' | 'favorit';

export const HadisPage: React.FC = () => {
  const { showToast } = useToast();

  const [activeMainTab, setActiveMainTab] = useState<MainTab>('hadis');
  const [activeTopic, setActiveTopic] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [selectedHadis, setSelectedHadis] = useState<HadisItem | null>(null);
  const [isHadisDetailOpen, setIsHadisDetailOpen] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<EducationalArticle | null>(null);
  const [isArticleDetailOpen, setIsArticleDetailOpen] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load favorites from localStorage
  const loadFavorites = () => {
    setFavoriteIds(getFavoriteHadisIds());
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleToggleFav = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isNowFav = toggleFavoriteHadis(id);
    loadFavorites();
    showToast({
      title: isNowFav ? 'Disimpan ke Favorit' : 'Dihapus dari Favorit',
      message: isNowFav
        ? 'Hadits tersimpan di tab Favorit Saya.'
        : 'Hadits telah dikeluarkan dari daftar favorit.',
      type: isNowFav ? 'success' : 'info',
      duration: 2000,
    });
  };

  const handleQuickCopy = async (hadis: HadisItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyHadisToClipboard(hadis);
    if (ok) {
      setCopiedId(hadis.id);
      showToast({
        title: 'Hadits Disalin',
        message: `${hadis.title} siap dibagikan.`,
        type: 'success',
        duration: 2000,
      });
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const allHadisList = getAllHadis();
  const allArticlesList = getAllArticles();

  // Filter Hadith
  const filteredHadis = searchHadis(search, activeTopic).filter((item) => {
    if (activeMainTab === 'favorit') {
      return favoriteIds.includes(item.id);
    }
    return true;
  });

  // Filter Educational Articles
  const filteredArticles = allArticlesList.filter((art) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      art.title.toLowerCase().includes(q) ||
      art.summary.toLowerCase().includes(q) ||
      art.content.some(
        (c) =>
          c.sectionTitle.toLowerCase().includes(q) || c.body.toLowerCase().includes(q)
      )
    );
  });

  const TOPIC_PILLS: Array<{ id: string; label: string; icon: React.ReactNode }> = [
    { id: 'all', label: 'Semua Hadits', icon: <BookOpen className="w-3.5 h-3.5" /> },
    {
      id: 'keutamaan-ramadan',
      label: 'Keutamaan Ramadan',
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
    { id: 'fiqih-puasa', label: 'Fiqih Puasa', icon: <Scale className="w-3.5 h-3.5" /> },
    { id: 'sahur-iftar', label: 'Sahur & Iftar', icon: <Utensils className="w-3.5 h-3.5" /> },
    {
      id: 'tarawih-lailatul-qadar',
      label: 'Tarawih & Qadar',
      icon: <Moon className="w-3.5 h-3.5" />,
    },
    {
      id: 'quran-tilawah',
      label: "Al-Qur'an",
      icon: <BookMarked className="w-3.5 h-3.5" />,
    },
    {
      id: 'zakat-sedekah',
      label: 'Zakat & Sedekah',
      icon: <HeartHandshake className="w-3.5 h-3.5" />,
    },
    {
      id: 'adab-akhlak',
      label: 'Adab & Akhlak',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
    },
  ];

  const getGradeBadge = (grade: HadisGrade) => {
    switch (grade) {
      case "Muttafaq 'Alaih":
        return (
          <Badge variant="gold" size="sm">
            Muttafaq 'Alaih
          </Badge>
        );
      case 'Shahih Bukhari':
        return (
          <Badge variant="emerald" size="sm">
            Shahih Bukhari
          </Badge>
        );
      case 'Shahih Muslim':
        return (
          <Badge variant="emerald" size="sm">
            Shahih Muslim
          </Badge>
        );
      case 'Shahih':
        return (
          <Badge variant="blue" size="sm">
            Shahih
          </Badge>
        );
      default:
        return (
          <Badge variant="violet" size="sm">
            {grade}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-ink-100">Hadits & Edukasi Ramadan</h1>
            <Badge variant="emerald">Kutubus Sittah</Badge>
          </div>
          <p className="text-xs text-ink-400 mt-1">
            Mutiara sunnah shahih dan panduan fiqih praktis berdasarkan Al-Qur'an dan Sunnah Rasulullah ﷺ.
          </p>
        </div>

        {/* Counter Summary Badges */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-ink-900/60 border border-ink-800 text-xs flex items-center gap-2">
            <span className="text-ink-400">Hadits:</span>
            <span className="font-semibold text-accent-700 font-mono">
              {allHadisList.length}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-ink-900/60 border border-ink-800 text-xs flex items-center gap-2">
            <span className="text-ink-400">Kajian:</span>
            <span className="font-semibold text-accent-700 font-mono">
              {allArticlesList.length}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-ink-900/60 border border-ink-800 text-xs flex items-center gap-2">
            <span className="text-ink-400">Favorit:</span>
            <span className="font-semibold text-accent-700 font-mono">
              {favoriteIds.length}
            </span>
          </div>
        </div>
      </div>

      {/* Authenticity Standard Banner */}
      <div className="p-4 rounded-xl bg-ink-800/20 border border-accent-800/30 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-accent-700 shrink-0 mt-0.5" />
        <div className="text-xs text-accent-700 space-y-1">
          <p className="font-semibold text-accent-700">
            Standar Keotentikan & Rujukan Klasik
          </p>
          <p className="text-accent-700 leading-relaxed">
            Seluruh hadits telah ditakhrij langsung dari sumber kitab induk (Shahih Al-Bukhari, Shahih Muslim, At-Tirmidzi, Abu Dawud, An-Nasa'i, Ibnu Majah, dan Musnad Ahmad) lengkap dengan perawi sahabat, nomor hadits, derajat sanad, serta faedah fikih yang dibedakan secara visual.
          </p>
        </div>
      </div>

      {/* Main Tabs (Hadits vs Edukasi vs Favorit) */}
      <div className="flex items-center gap-2 border-b border-ink-800/80 pb-3 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => {
            setActiveMainTab('hadis');
            setSearch('');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg text-xs font-semibold transition-all shrink-0 touch-manipulation cursor-pointer active:scale-95 ${
            activeMainTab === 'hadis'
              ? 'bg-accent-400 text-on-accent font-semibold'
              : 'bg-surface-elevated/40 text-ink-400 hover:text-ink-200 hover:bg-ink-800/50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Koleksi Hadits Shahih</span>
          <span className="px-1.5 py-0.5 rounded-md bg-black/25 text-xs font-mono">
            {allHadisList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveMainTab('edukasi');
            setSearch('');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg text-xs font-semibold transition-all shrink-0 touch-manipulation cursor-pointer active:scale-95 ${
            activeMainTab === 'edukasi'
              ? 'bg-accent-400 text-on-accent font-semibold'
              : 'bg-surface-elevated/40 text-ink-400 hover:text-ink-200 hover:bg-ink-800/50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Artikel Fiqih & Edukasi</span>
          <span className="px-1.5 py-0.5 rounded-md bg-black/25 text-xs font-mono">
            {allArticlesList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveMainTab('favorit');
            setSearch('');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg text-xs font-semibold transition-all shrink-0 touch-manipulation cursor-pointer active:scale-95 ${
            activeMainTab === 'favorit'
              ? 'bg-accent-400 text-on-accent font-semibold'
              : 'bg-surface-elevated/40 text-ink-400 hover:text-ink-200 hover:bg-ink-800/50'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Hadits Tersimpan</span>
          <span className="px-1.5 py-0.5 rounded-md bg-black/25 text-xs font-mono">
            {favoriteIds.length}
          </span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            id="search-hadis-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              activeMainTab === 'edukasi'
                ? 'Cari kajian fiqih, rukun puasa, zakat fitrah, lailatul qadar...'
                : 'Cari hadits, nomor rujukan (HR. Bukhari), kata kunci, atau perawi...'
            }
            leftIcon={<Search className="w-4 h-4" />}
            rightIcon={
              search ? (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="hover:text-ink-200 p-1"
                  title="Hapus pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : undefined
            }
          />
        </div>
      </div>

      {/* Sub-Filters: Topic Pills (Only visible when viewing Hadits / Favorit) */}
      {activeMainTab !== 'edukasi' && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            {TOPIC_PILLS.map((pill) => {
              const count =
                pill.id === 'all'
                  ? allHadisList.length
                  : allHadisList.filter((h) => h.topic === pill.id).length;

              const isSelected = activeTopic === pill.id;

              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setActiveTopic(pill.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-medium transition-all shrink-0 border touch-manipulation cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-accent-500/20 text-accent-700 border-accent-500/40'
                      : 'bg-ink-900/60 text-ink-400 border-ink-800 hover:text-ink-200 hover:bg-ink-800/60'
                  }`}
                >
                  {pill.icon}
                  <span>{pill.label}</span>
                  <span className="text-xs opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-ink-400 px-1">
            <span>
              Menampilkan{' '}
              <strong className="text-ink-200 font-mono">{filteredHadis.length}</strong>{' '}
              hadits {activeTopic !== 'all' ? `kategori ${activeTopic}` : ''}
            </span>
            {search && (
              <span className="text-accent-700">
                Filter: "<strong>{search}</strong>"
              </span>
            )}
          </div>
        </div>
      )}

      {/* Content Rendering */}
      {activeMainTab === 'edukasi' ? (
        /* ================= KAJIAN FIQIH & EDUKASI ================= */
        filteredArticles.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-8 h-8 text-accent-700" />}
            title="Tidak Ada Artikel Ditemukan"
            description={`Tidak ada kajian fiqih yang cocok dengan kata kunci "${search}".`}
            actionLabel="Reset Pencarian"
            onAction={() => setSearch('')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                interactive
                onClick={() => {
                  setSelectedArticle(article);
                  setIsArticleDetailOpen(true);
                }}
                className="group flex flex-col justify-between hover:border-accent-500/40"
              >
                <div>
                  <CardHeader>
                    <Badge variant="blue" size="sm">
                      {article.category.replace('-', ' ').toUpperCase()}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-ink-400">
                      <Clock className="w-3.5 h-3.5 text-accent-700" />
                      <span>{article.readTimeMinutes} menit</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <CardTitle className="text-base group-hover:text-accent-800 transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {article.summary}
                    </CardDescription>

                    {/* Section Count Badge */}
                    <div className="pt-2 flex items-center gap-2 text-xs text-ink-400">
                      <span className="px-2 py-0.5 rounded-md bg-ink-900/60 border border-ink-800 text-xs font-mono text-ink-300">
                        {article.content.length} Bab Kajian
                      </span>
                      <span>•</span>
                      <span className="text-xs text-ink-400 truncate max-w-[180px]">
                        {article.sources.length} Rujukan Ulama
                      </span>
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="pt-3 border-t border-ink-800/80">
                  <span className="text-xs text-accent-700 font-medium group-hover:underline flex items-center gap-1">
                    Baca Kajian Lengkap
                  </span>
                  <ChevronRight className="w-4 h-4 text-accent-700 group-hover:translate-x-0.5 transition-transform" />
                </CardFooter>
              </Card>
            ))}
          </div>
        )
      ) : (
        /* ================= HADITS CARDS ================= */
        filteredHadis.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-8 h-8 text-accent-700" />}
            title={
              activeMainTab === 'favorit'
                ? 'Belum Ada Hadits Tersimpan'
                : 'Hadits Tidak Ditemukan'
            }
            description={
              activeMainTab === 'favorit'
                ? 'Klik ikon bookmark pada hadits pilihan untuk menyimpannya ke daftar favorit Anda.'
                : `Tidak ada hadits shahih yang sesuai dengan pencarian "${search}".`
            }
            actionLabel={
              search ? 'Reset Pencarian' : activeMainTab === 'favorit' ? 'Lihat Semua Hadits' : undefined
            }
            onAction={() => {
              setSearch('');
              if (activeMainTab === 'favorit') setActiveMainTab('hadis');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHadis.map((hadis) => {
              const isFav = favoriteIds.includes(hadis.id);
              const isCopied = copiedId === hadis.id;

              return (
                <Card
                  key={hadis.id}
                  interactive
                  onClick={() => {
                    setSelectedHadis(hadis);
                    setIsHadisDetailOpen(true);
                  }}
                  className="group flex flex-col justify-between hover:border-accent-500/40"
                >
                  <div>
                    {/* Card Header */}
                    <CardHeader>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {getGradeBadge(hadis.grade)}
                        <span className="text-xs text-ink-400 font-semibold">
                          {hadis.topic.replace('-', ' ')}
                        </span>
                      </div>

                      {/* Favorite Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleFav(hadis.id, e)}
                        className={`min-h-[40px] min-w-[40px] p-2 rounded-lg border flex items-center justify-center transition-all touch-manipulation cursor-pointer active:scale-95 ${
                          isFav
                            ? 'bg-accent-500/20 text-accent-700 border-accent-500/30'
                            : 'bg-ink-800/40 text-ink-400 border-ink-700/50 hover:text-ink-200 hover:bg-ink-700/50'
                        }`}
                        title={isFav ? 'Hapus dari favorit' : 'Simpan ke favorit'}
                      >
                        {isFav ? (
                          <BookmarkCheck className="w-4 h-4 text-accent-700" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </CardHeader>

                    {/* Card Content */}
                    <CardContent className="space-y-2.5">
                      <CardTitle className="text-base group-hover:text-accent-800 transition-colors">
                        {hadis.title}
                      </CardTitle>

                      <div className="text-xs text-accent-700 font-medium">
                        Dari {hadis.narrator}
                      </div>

                      {/* Arabic Preview */}
                      <div className="p-3 rounded-lg bg-ink-900/50 border border-ink-800/80">
                        <p
                          dir="rtl"
                          lang="ar"
                          className="font-arabic text-accent-700 text-right text-base leading-relaxed line-clamp-2"
                        >
                          {hadis.arabicText}
                        </p>
                      </div>

                      {/* Translation Excerpt */}
                      <p className="text-xs text-ink-300 leading-relaxed italic line-clamp-2">
                        "{hadis.translation}"
                      </p>

                      {/* Explanation Teaser */}
                      {hadis.explanation && (
                        <div className="flex items-center gap-1.5 text-xs text-ink-400 pt-1">
                          <Lightbulb className="w-3.5 h-3.5 text-accent-700 shrink-0" />
                          <span className="truncate">
                            Faedah: {hadis.explanation}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </div>

                  {/* Card Footer */}
                  <CardFooter className="pt-3 border-t border-ink-800/80">
                    <div className="text-xs text-ink-400 font-mono truncate max-w-[180px]">
                      {hadis.referenceNumber}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleQuickCopy(hadis, e)}
                        className={`min-h-[38px] px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all touch-manipulation cursor-pointer active:scale-95 ${
                          isCopied
                            ? 'bg-accent-500/20 text-accent-700 border-accent-500/30'
                            : 'bg-ink-800/50 text-ink-400 border-ink-700/50 hover:text-ink-200 hover:bg-ink-700'
                        }`}
                        title="Salin hadits"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-accent-700" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {isCopied ? 'Tersalin' : 'Salin'}
                        </span>
                      </button>

                      <div className="text-xs text-accent-700 font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform pl-1">
                        <span>Baca</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )
      )}

      {/* Hadis Detail Focus Modal */}
      <HadisDetailModal
        hadis={selectedHadis}
        isOpen={isHadisDetailOpen}
        onClose={() => setIsHadisDetailOpen(false)}
        isFavorite={selectedHadis ? favoriteIds.includes(selectedHadis.id) : false}
        onToggleFavorite={handleToggleFav}
      />

      {/* Educational Article Reading Modal */}
      <ArticleDetailModal
        article={selectedArticle}
        isOpen={isArticleDetailOpen}
        onClose={() => setIsArticleDetailOpen(false)}
      />
    </div>
  );
};
