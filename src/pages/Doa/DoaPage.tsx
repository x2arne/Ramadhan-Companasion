import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  BookOpen,
  ShieldCheck,
  Heart,
  Moon,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { DoaDetailModal } from './DoaDetailModal';
import { DoaItem, DoaCategory } from '../../types/doa';
import {
  getAllDoas,
  searchDoas,
  getFavoriteDoaIds,
  toggleFavoriteDoa,
  copyDoaToClipboard,
} from '../../services/doaService';
import { useToast } from '../../context/ToastContext';

type TabType = 'all' | 'ramadan' | 'lailatul-qadar' | 'ibadah' | 'harian' | 'quran' | 'favorite';

export const DoaPage: React.FC = () => {
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [selectedDoa, setSelectedDoa] = useState<DoaItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Muat daftar favorit dari localStorage
  const loadFavorites = () => {
    setFavoriteIds(getFavoriteDoaIds());
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleToggleFav = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isNowFav = toggleFavoriteDoa(id);
    loadFavorites();
    showToast({
      title: isNowFav ? 'Ditambahkan ke Favorit' : 'Dihapus dari Favorit',
      message: isNowFav
        ? 'Doa tersimpan di tab Favorit Saya.'
        : 'Doa telah dikeluarkan dari daftar favorit.',
      type: isNowFav ? 'success' : 'info',
      duration: 2000,
    });
  };

  const handleQuickCopy = async (doa: DoaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyDoaToClipboard(doa);
    if (ok) {
      setCopiedId(doa.id);
      showToast({
        title: 'Teks Doa Disalin',
        message: `Teks ${doa.title} siap dibagikan.`,
        type: 'success',
        duration: 2000,
      });
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleOpenDetail = (doa: DoaItem) => {
    setSelectedDoa(doa);
    setIsDetailOpen(true);
  };

  const allDoas = getAllDoas();
  const filteredDoas = searchDoas(search, activeTab);

  const CATEGORY_TABS: Array<{ id: TabType; label: string; count: number }> = [
    { id: 'all', label: 'Semua Doa', count: allDoas.length },
    {
      id: 'ramadan',
      label: 'Ramadan & Puasa',
      count: allDoas.filter((d) => d.category === 'ramadan').length,
    },
    {
      id: 'lailatul-qadar',
      label: 'Lailatul Qadar',
      count: allDoas.filter((d) => d.category === 'lailatul-qadar').length,
    },
    {
      id: 'ibadah',
      label: 'Sholat & Ibadah',
      count: allDoas.filter((d) => d.category === 'ibadah').length,
    },
    {
      id: 'harian',
      label: 'Doa Harian',
      count: allDoas.filter((d) => d.category === 'harian').length,
    },
    {
      id: 'quran',
      label: "Al-Qur'an (Rabbana)",
      count: allDoas.filter((d) => d.category === 'quran').length,
    },
    {
      id: 'favorite',
      label: 'Favorit Saya',
      count: favoriteIds.length,
    },
  ];

  const getAuthenticityBadge = (auth: DoaItem['authenticity']) => {
    switch (auth) {
      case 'Shahih':
        return <Badge variant="emerald" size="sm">Shahih</Badge>;
      case 'Hasan':
        return <Badge variant="blue" size="sm">Hasan</Badge>;
      case "Ayat Al-Qur'an":
        return <Badge variant="gold" size="sm">Al-Qur'an</Badge>;
      default:
        return <Badge variant="violet" size="sm">Ma'tsur</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-ink-100">Kumpulan Doa Ramadan & Harian</h1>
            <Badge variant="emerald">{allDoas.length} Doa Shahih & Ma'tsur</Badge>
          </div>
          <p className="text-xs text-ink-400 mt-1">
            Koleksi munajat puasa, lailatul qadar, ibadah harian, dan doa mustajab beserta sanad rujukan hadits terpercaya.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <Input
          placeholder="Cari nama doa, arti bahasa Indonesia, rujukan hadits, atau tema..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4 text-ink-400" />}
          rightIcon={
            search ? (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-xs text-ink-400 hover:text-ink-200 px-1"
              >
                Hapus
              </button>
            ) : undefined
          }
        />

        {/* Category Filter Pills (Horizontal scrollable on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 touch-manipulation cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-accent-400 text-on-accent font-semibold'
                    : 'bg-surface-elevated/50 hover:bg-surface-elevated border border-ink-800 text-ink-300 hover:text-ink-50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-accent-700 text-accent-700' : 'bg-ink-800 text-ink-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Doa Cards Grid */}
      {filteredDoas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDoas.map((doa) => {
            const isFav = favoriteIds.includes(doa.id);
            const isCopied = copiedId === doa.id;

            return (
              <Card
                key={doa.id}
                onClick={() => handleOpenDetail(doa)}
                className="hover:border-accent-500/40 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <CardContent className="p-5 space-y-3.5">
                  {/* Top Badges & Favorite Action */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {getAuthenticityBadge(doa.authenticity)}
                      <Badge variant="slate" size="sm">
                        {doa.category.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleQuickCopy(doa, e)}
                        className="min-h-[40px] min-w-[40px] p-2 rounded-lg flex items-center justify-center hover:bg-ink-800/80 active:scale-95 text-ink-400 hover:text-accent-800 transition-all touch-manipulation cursor-pointer"
                        title="Salin Teks Doa"
                      >
                        {isCopied ? (
                          <Check className="w-4 h-4 text-accent-700" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleToggleFav(doa.id, e)}
                        className={`min-h-[40px] min-w-[40px] p-2 rounded-lg flex items-center justify-center hover:bg-ink-800/80 active:scale-95 transition-all touch-manipulation cursor-pointer ${
                          isFav
                            ? 'text-rose-700'
                            : 'text-ink-400 hover:text-ink-200'
                        }`}
                        title={isFav ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
                      >
                        {isFav ? (
                          <BookmarkCheck className="w-4 h-4 fill-rose-500/20 text-rose-700" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="font-bold text-ink-100 text-sm group-hover:text-accent-800 transition-colors">
                      {doa.title}
                    </h3>
                    {doa.arabicTitle && (
                      <div className="text-xs text-ink-400 font-arabic mt-0.5 text-right" dir="rtl">
                        {doa.arabicTitle}
                      </div>
                    )}
                  </div>

                  {/* Arabic Text Snippet */}
                  <div className="p-3.5 rounded-lg bg-surface-elevated/40 border border-ink-800/80">
                    <p
                      dir="rtl"
                      lang="ar"
                      className="font-arabic text-accent-700 text-right text-base leading-relaxed line-clamp-2"
                    >
                      {doa.arabicText}
                    </p>
                  </div>

                  {/* Indonesian Translation Snippet */}
                  <p className="text-xs text-ink-300 line-clamp-2 leading-relaxed">
                    "{doa.translation}"
                  </p>

                  {/* Footer Source info */}
                  <div className="pt-2 border-t border-ink-800/80 flex items-center justify-between text-xs text-ink-400">
                    <div className="flex items-center gap-1.5 truncate max-w-[240px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent-700 shrink-0" />
                      <span className="truncate">{doa.source}</span>
                    </div>

                    <div className="flex items-center gap-0.5 text-accent-700 font-medium group-hover:translate-x-1 transition-transform">
                      <span>Detail</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={
            activeTab === 'favorite' ? (
              <Bookmark className="w-6 h-6 text-rose-700" />
            ) : (
              <Search className="w-6 h-6 text-accent-700" />
            )
          }
          title={
            activeTab === 'favorite'
              ? 'Belum Ada Doa Favorit'
              : 'Tidak Ditemukan Doa yang Cocok'
          }
          description={
            activeTab === 'favorite'
              ? 'Tekan ikon penanda (bookmark) pada kartu doa untuk menyimpannya di sini agar mudah dibaca kapan saja.'
              : `Tidak ada doa yang sesuai dengan pencarian "${search}". Coba kata kunci lain atau pilih tab kategori lain.`
          }
          actionLabel={activeTab !== 'all' ? 'Lihat Semua Doa' : undefined}
          onAction={
            activeTab !== 'all'
              ? () => {
                  setActiveTab('all');
                  setSearch('');
                }
              : undefined
          }
        />
      )}

      {/* Detail Modal */}
      <DoaDetailModal
        doa={selectedDoa}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        isFavorite={selectedDoa ? favoriteIds.includes(selectedDoa.id) : false}
        onToggleFavorite={handleToggleFav}
      />
    </div>
  );
};
