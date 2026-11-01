import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Plus,
  Calendar,
  MapPin,
  Trash2,
  X,
  Upload,
  Sparkles,
  Heart,
  Share2,
  Eye,
  Filter,
  Search,
  Check,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Dialog } from '../../components/common/Dialog';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import { useAppSettings } from '../../context/AppSettingsContext';
import {
  RamadanMemory,
  MemoryCategory,
  MEMORY_CATEGORIES,
} from '../../types/galeri';
import {
  getAllMemories,
  addMemory,
  deleteMemory,
  compressImage,
  calculateHijriFromDate,
} from '../../services/galeriService';

export const GaleriPage: React.FC = () => {
  const { showToast } = useToast();
  const { settings } = useAppSettings();

  const [memories, setMemories] = useState<RamadanMemory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<RamadanMemory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formImage, setFormImage] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDate, setFormDate] = useState(() => {
    // Default to current date or 2027 Ramadan date
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [formCategory, setFormCategory] = useState<MemoryCategory>('buka-puasa');
  const [formLocation, setFormLocation] = useState(settings.location.city || '');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load memories
  const loadMemories = async () => {
    setIsLoading(true);
    try {
      const data = await getAllMemories();
      setMemories(data);
    } catch (e) {
      console.error('Failed to load memories', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMemories();
  }, []);

  // Handle image upload with auto-compression
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast({
        title: 'Format Tidak Didukung',
        message: 'Silakan pilih berkas foto berupa JPG, PNG, atau WebP.',
        type: 'error',
      });
      return;
    }

    try {
      const compressed = await compressImage(file);
      setFormImage(compressed);
      showToast({
        title: 'Foto Siap',
        message: 'Foto berhasil diproses dan dikompresi dengan optimal.',
        type: 'success',
        duration: 2000,
      });
    } catch (err) {
      showToast({
        title: 'Gagal Memproses Foto',
        message: 'Terjadi kesalahan saat memproses gambar.',
        type: 'error',
      });
    }
  };

  // Handle Form Submit
  const handleSaveMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formImage) {
      showToast({
        title: 'Foto Belum Dipilih',
        message: 'Silakan unggah foto kenangan terlebih dahulu.',
        type: 'warning',
      });
      return;
    }

    if (!formTitle.trim()) {
      showToast({
        title: 'Judul Diperlukan',
        message: 'Berikan judul singkat untuk momen kenangan ini.',
        type: 'warning',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const dateObj = new Date(formDate);
      const day = dateObj.getDate();
      const month = dateObj.getMonth() + 1;
      const year = dateObj.getFullYear();

      const hijriInfo = calculateHijriFromDate(dateObj, settings.location.timezone);

      const saved = await addMemory({
        title: formTitle.trim(),
        description: formDescription.trim(),
        imageUrl: formImage,
        date: formDate,
        day,
        month,
        year,
        hijriFormatted: hijriInfo.hijriFormatted,
        ramadanDay: hijriInfo.ramadanDay,
        location: formLocation.trim() || undefined,
        category: formCategory,
      });

      setMemories((prev) => [saved, ...prev]);
      setIsAddModalOpen(false);

      // Reset form
      setFormImage(null);
      setFormTitle('');
      setFormDescription('');

      showToast({
        title: 'Kenangan Tersimpan!',
        message: `Foto momen "${saved.title}" pada ${saved.day} ${saved.monthName} ${saved.year} berhasil diabadikan.`,
        type: 'success',
      });
    } catch (err: any) {
      showToast({
        title: 'Gagal Menyimpan',
        message: err.message || 'Terjadi kesalahan saat menyimpan kenangan.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDeleteMemory = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm('Hapus kenangan foto ini dari galeri Anda?')) return;

    try {
      await deleteMemory(id);
      setMemories((prev) => prev.filter((m) => m.id !== id));
      if (selectedPhoto?.id === id) {
        setSelectedPhoto(null);
      }
      showToast({
        title: 'Kenangan Dihapus',
        message: 'Foto kenangan berhasil dihapus dari galeri.',
        type: 'info',
      });
    } catch {
      showToast({
        title: 'Gagal Menghapus',
        message: 'Tidak dapat menghapus berkas kenangan.',
        type: 'error',
      });
    }
  };

  // Filter memories
  const filteredMemories = memories.filter((m) => {
    const matchCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchSearch =
      searchQuery.trim() === '' ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.location && m.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.hijriFormatted.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.monthName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl p-6 sm:p-8 bg-surface border border-accent-500/20">

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="violet" dot>
                Galeri Kenangan Ramadan
              </Badge>
              <Badge variant="blue">{memories.length} Momen Terabadikan</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink-100 tracking-tight">
              Abadikan Momen Indah di Bulan Suci
            </h1>
            <p className="text-xs sm:text-sm text-ink-300 leading-relaxed">
              Simpan setiap kenangan sahur hangat bersama keluarga, buka puasa bersama sahabat,
              malam tarawih yang khusyuk, dan keceriaan Idul Fitri lengkap dengan tanggal dan rujukan harinya.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            leftIcon={<Plus className="w-5 h-5" />}
            onClick={() => setIsAddModalOpen(true)}
            className=" shrink-0 w-full sm:w-auto min-h-[48px] justify-center active:scale-95 touch-manipulation"
          >
            Tambah Kenangan
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-ink-800/80 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-semibold whitespace-nowrap transition-all touch-manipulation cursor-pointer active:scale-95 ${
              selectedCategory === 'all'
                ? 'bg-accent-400 text-on-accent font-semibold'
                : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800/40'
            }`}
          >
            Semua Momen ({memories.length})
          </button>
          {MEMORY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-semibold whitespace-nowrap transition-all touch-manipulation cursor-pointer active:scale-95 ${
                selectedCategory === cat.id
                  ? 'bg-accent-400 text-on-accent font-semibold'
                  : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="w-full sm:max-w-md">
          <Input
            placeholder="Cari kenangan (judul, lokasi, tanggal, Ramadan)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-ink-400" />}
          />
        </div>
      </div>

      {/* Grid of Photo Cards */}
      {filteredMemories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMemories.map((memory) => (
            <Card
              key={memory.id}
              className="overflow-hidden group cursor-pointer hover:border-accent-500/50 transition-all duration-300 flex flex-col justify-between"
              onClick={() => setSelectedPhoto(memory)}
            >
              <div>
                {/* Photo Image Frame */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-900">
                  <img
                    src={memory.imageUrl}
                    alt={memory.title}
                    className="w-full h-full object-cover transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <Badge variant="violet" size="sm" className="bg-background-darker/80">
                      {memory.categoryLabel}
                    </Badge>

                    {memory.ramadanDay && (
                      <Badge variant="gold" size="sm" className="bg-background-darker/80">
                        Hari ke-{memory.ramadanDay} Ramadan
                      </Badge>
                    )}
                  </div>

                  {/* Floating Date Overlay on Image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-ink-200">
                    <span className="flex items-center gap-1 bg-surface/90 px-2 py-1 rounded-lg border border-ink-700/40">
                      <Calendar className="w-3.5 h-3.5 text-accent-700" />
                      <strong>
                        {memory.day} {memory.monthName} {memory.year}
                      </strong>
                    </span>

                    {memory.location && (
                      <span className="flex items-center gap-1 bg-surface/90 px-2 py-1 rounded-lg border border-ink-700/40 max-w-[130px] truncate">
                        <MapPin className="w-3 h-3 text-accent-700 shrink-0" />
                        <span className="truncate">{memory.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-ink-100 group-hover:text-accent-800 transition-colors line-clamp-1">
                      {memory.title}
                    </h3>
                  </div>

                  {/* Hijri Date Display */}
                  <div className="text-xs text-accent-700 font-medium flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-accent-700" />
                    <span>{memory.hijriFormatted}</span>
                  </div>

                  <p className="text-xs text-ink-300 line-clamp-2 leading-relaxed">
                    {memory.description || 'Tidak ada catatan tambahan untuk kenangan ini.'}
                  </p>
                </CardContent>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 pt-0 flex items-center justify-between border-t border-ink-800/60 mt-2 text-xs">
                <span className="text-ink-400 text-xs">
                  Tersimpan di perangkat
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleDeleteMemory(memory.id, e)}
                    className="p-1.5 rounded-lg text-ink-400 hover:text-rose-700 hover:bg-rose-950/30 transition-colors"
                    title="Hapus foto kenangan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="text-accent-700 flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform">
                    Lihat <Eye className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Camera className="w-8 h-8 text-accent-700" />}
          title={searchQuery ? 'Tidak Ada Kenangan yang Cocok' : 'Belum Ada Kenangan Ramadan'}
          description={
            searchQuery
              ? `Tidak ditemukan kenangan dengan kata kunci "${searchQuery}". Coba gunakan kata kunci lain.`
              : 'Abadikan foto momen berbuka puasa, sahur, tarawih, atau khatam Al-Qur\'an bersama orang tercinta di sini.'
          }
          actionLabel="Tambah Foto Kenangan Sekarang"
          onAction={() => setIsAddModalOpen(true)}
        />
      )}

      {/* Modal: Tambah Kenangan Baru */}
      <Dialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Abadikan Kenangan Ramadan"
        description="Tambahkan foto momen puasa dengan tanggal, bulan, tahun, dan cerita berharga Anda."
      >
        <form onSubmit={handleSaveMemory} className="space-y-4">
          {/* File Upload Box */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-ink-300">
              Pilih Foto Kenangan
            </label>

            {formImage ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-accent-500/40 bg-ink-900 group">
                <img src={formImage} alt="Pratinjau" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setFormImage(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-background-darker/80 text-rose-700 hover:text-ink-50 transition-colors"
                  title="Ganti Foto"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-ink-700 hover:border-accent-500/60 rounded-xl p-6 text-center cursor-pointer bg-surface-elevated/40 hover:bg-surface-elevated/70 transition-all flex flex-col items-center justify-center gap-2"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-600/20 border border-accent-500/30 flex items-center justify-center text-accent-700">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-200">
                    Klik untuk memilih foto dari galeri HP atau PC
                  </p>
                  <p className="text-xs text-ink-400 mt-0.5">
                    Mendukung JPG, PNG, atau WebP (Otomatis dikompresi hemat penyimpanan)
                  </p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Tanggal, Bulan, Tahun */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-ink-300">
                Tanggal Pengambilan Foto (Tgl / Bln / Thn)
              </label>
              <input
                type="date"
                required
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full bg-surface-elevated/70 border border-ink-700/60 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-accent-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-ink-300">
                Kategori Momen
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as MemoryCategory)}
                className="w-full bg-surface-elevated/70 border border-ink-700/60 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-accent-500"
              >
                {MEMORY_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id} className="bg-surface text-ink-100">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Judul & Lokasi */}
          <Input
            label="Judul Momen Kenangan"
            placeholder="Contoh: Bukber Alumni di Surabaya / Sahur Malam 21"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            required
          />

          <Input
            label="Lokasi Tempat (Opsional)"
            placeholder="Contoh: Masjid Agung / Rumah Nenek di Malang"
            value={formLocation}
            onChange={(e) => setFormLocation(e.target.value)}
            leftIcon={<MapPin className="w-4 h-4 text-accent-700" />}
          />

          {/* Cerita Kenangan */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-ink-300">
              Cerita / Catatan Momen (Opsional)
            </label>
            <textarea
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Ceritakan momen berkesan ini, siapa saja yang hadir, atau hikmah yang dirasakan..."
              className="w-full bg-surface-elevated/70 border border-ink-700/60 rounded-lg p-3 text-xs text-ink-100 placeholder-ink-400 focus:outline-none focus:border-accent-500"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-ink-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Simpan ke Galeri
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Modal: Fullscreen Photo Lightbox */}
      {selectedPhoto && (
        <Dialog
          isOpen={true}
          onClose={() => setSelectedPhoto(null)}
          className="max-w-3xl"
        >
          <div className="space-y-4">
            {/* Full Image */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl overflow-hidden bg-black border border-ink-700/60">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Photo Info Banner */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ink-800 pb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="violet">{selectedPhoto.categoryLabel}</Badge>
                    <Badge variant="gold">
                      {selectedPhoto.hijriFormatted}
                    </Badge>
                  </div>
                  <h2 className="text-xl font-bold text-ink-100 mt-1">
                    {selectedPhoto.title}
                  </h2>
                </div>

                <div className="text-left sm:text-right">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-accent-700">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {selectedPhoto.day} {selectedPhoto.monthName} {selectedPhoto.year}
                    </span>
                  </div>
                  {selectedPhoto.location && (
                    <div className="flex items-center gap-1 text-xs text-ink-400 mt-0.5">
                      <MapPin className="w-3 h-3 text-accent-700" />
                      <span>{selectedPhoto.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Story / Description */}
              <div className="p-4 rounded-lg bg-surface-elevated/40 border border-ink-700/40 text-xs text-ink-300 leading-relaxed">
                {selectedPhoto.description || 'Tidak ada catatan cerita untuk foto ini.'}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={() => handleDeleteMemory(selectedPhoto.id)}
                >
                  Hapus Kenangan
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPhoto(null)}
                >
                  Tutup
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

