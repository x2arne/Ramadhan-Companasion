import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  BookMarked,
  CalendarDays,
  Camera,
  Radio,
  Settings,
  ArrowRight,
  Download,
  Smartphone,
  ShieldCheck,
  Heart,
  Moon,
  Info,
  Compass,
  Disc,
  Palette,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { PWAInstallModal } from '../../components/common/PWAInstallModal';
import { useToast } from '../../context/ToastContext';
import { isPWAInstallable, promptPWAInstall, isAppRunningStandalone } from '../../services/pwaService';

export const KhazanahPage: React.FC = () => {
  const { showToast } = useToast();
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setCanInstall(isPWAInstallable());
    setIsStandalone(isAppRunningStandalone());
  }, []);

  const handleInstallClick = async () => {
    const installed = await promptPWAInstall();
    if (installed) {
      showToast({
        title: 'Aplikasi Terpasang',
        message: 'Ramadan Companion berhasil ditambahkan ke layar utama ponsel Anda.',
        type: 'success',
      });
      setCanInstall(false);
    } else {
      setIsInstallModalOpen(true);
    }
  };

  const khazanahItems = [
    {
      title: 'Koleksi Doa Ramadan & Harian',
      desc: 'Doa mustajab menjelang buka, sahur, Lailatul Qadar, dan doa harian dengan teks Arab & rujukan sanad shahih.',
      path: '/doa',
      icon: Sparkles,
      color: 'text-accent-700',
      bgColor: 'bg-accent-500/10',
      borderColor: 'border-accent-500/25',
      badge: '21 Doa Shahih',
      badgeVariant: 'violet' as const,
    },
    {
      title: 'Hadits Shahih & Fiqih Ramadan',
      desc: 'Hadits Kutubus Sittah bertakhrij sanad resmi serta 4 artikel panduan fiqih puasa, zakat fitrah, dan akhlak.',
      path: '/hadis',
      icon: BookMarked,
      color: 'text-accent-700',
      bgColor: 'bg-accent-500/10',
      borderColor: 'border-accent-500/25',
      badge: 'Kutubus Sittah',
      badgeVariant: 'emerald' as const,
    },
    {
      title: 'Kalender Ramadan & Fase Bulan',
      desc: 'Kalender hisab falakiyah 1448 H, visualisasi fase bulan astronomis, dan hitung mundur Hari Raya Idul Fitri.',
      path: '/kalender',
      icon: CalendarDays,
      color: 'text-accent-700',
      bgColor: 'bg-accent-500/10',
      borderColor: 'border-accent-500/25',
      badge: 'Hisab Falakiyah',
      badgeVariant: 'gold' as const,
    },
    {
      title: 'Arah Kiblat Digital',
      desc: 'Kompas penunjuk arah Ka\'bah presisi dengan sensor magnetik ponsel dan perhitungan jarak langsung ke Makkah.',
      path: '/kiblat',
      icon: Compass,
      color: 'text-accent-700',
      bgColor: 'bg-accent-500/10',
      borderColor: 'border-accent-500/25',
      badge: 'Kompas Ka\'bah',
      badgeVariant: 'emerald' as const,
    },
    {
      title: 'Tasbih Digital & Dzikir',
      desc: 'Hitung wirid dan dzikir harian dengan getaran jempol haptic touch, audio klik lembut, serta siklus otomatis ba\'da sholat.',
      path: '/tasbih',
      icon: Disc,
      color: 'text-accent-700',
      bgColor: 'bg-accent-500/10',
      borderColor: 'border-accent-500/25',
      badge: 'Haptic Touch',
      badgeVariant: 'violet' as const,
    },
    {
      title: 'Kartu Ucapan Ramadan & Idul Fitri',
      desc: 'Buat kartu ucapan estetik dengan nama pribadi Anda, unduh sebagai gambar resolusi tinggi PNG atau bagikan ke WhatsApp.',
      path: '/kartu-ucapan',
      icon: Palette,
      color: 'text-accent-700',
      bgColor: 'bg-accent-500/10',
      borderColor: 'border-accent-500/25',
      badge: 'Download PNG',
      badgeVariant: 'gold' as const,
    },
    {
      title: 'Galeri Kenangan Ramadan',
      desc: 'Abadikan dan simpan foto hangat momen sahur bersama keluarga, buka puasa bersama, dan tarawih di masjid.',
      path: '/galeri',
      icon: Camera,
      color: 'text-accent-700',
      bgColor: 'bg-accent-500/10',
      borderColor: 'border-accent-500/25',
      badge: 'Album Foto',
      badgeVariant: 'slate' as const,
    },
    {
      title: 'Podcast & Kajian Islami',
      desc: 'Dengarkan obrolan inspiratif dalam mode Video (MP4) atau Audio Banner (MP3) untuk pengantar tidur, buka, & sahur.',
      path: '/podcast',
      icon: Radio,
      color: 'text-accent-700',
      bgColor: 'bg-accent-500/10',
      borderColor: 'border-accent-500/25',
      badge: 'Mode MP4 / MP3',
      badgeVariant: 'blue' as const,
    },
    {
      title: 'Pengaturan & Cadangan Data',
      desc: 'Kustomisasi alarm adzan, pengingat imsak, koreksi ikhtiyat, tema tampilan, serta ekspor & impor data ibadah.',
      path: '/pengaturan',
      icon: Settings,
      color: 'text-ink-300',
      bgColor: 'bg-ink-700/20',
      borderColor: 'border-ink-700/40',
      badge: 'Konfigurasi',
      badgeVariant: 'slate' as const,
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-xl p-6 sm:p-8 bg-surface border border-accent-500/25">

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="violet" dot>
              Khazanah Ramadan
            </Badge>
            <Badge variant="blue">Fitur Lengkap Pelengkap Ibadah</Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-ink-100 tracking-tight">
            Khazanah & Ruang Ibadah Tambahan
          </h1>

          <p className="text-xs sm:text-sm text-ink-300 leading-relaxed">
            Akses cepat ke seluruh kekayaan ilmu dan sarana ibadah Ramadan: kumpulan doa shahih,
            hadits rujukan ulama, kalender fase bulan, album galeri kenangan, hingga podcast audio-visual.
          </p>

          {!isStandalone && (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Smartphone className="w-4 h-4 text-accent-700" />}
                onClick={handleInstallClick}
                className="border-accent-500/40 text-accent-700 hover:bg-ink-800/30"
              >
                Pasang Aplikasi ke Layar Utama (PWA)
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Khazanah Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {khazanahItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} className="group">
              <Card
                interactive
                className="h-full flex flex-col justify-between p-5 hover:border-accent-500/50 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-xl ${item.bgColor} ${item.borderColor} border flex items-center justify-center shrink-0 transition-transform`}
                    >
                      <Icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <Badge variant={item.badgeVariant} size="sm">
                      {item.badge}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-ink-100 group-hover:text-accent-800 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-ink-400 mt-1.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-ink-800/80 flex items-center justify-between text-xs font-semibold text-accent-700 group-hover:text-accent-800">
                  <span>Buka Fitur</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* PWA Install Guide Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
};

