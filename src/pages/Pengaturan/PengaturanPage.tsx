import React, { useState, useEffect, useRef } from 'react';
import {
  Settings,
  MapPin,
  Compass,
  Type,
  Moon,
  Sun,
  Laptop,
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  Clock,
  Trash2,
  Download,
  Upload,
  Database,
  ShieldCheck,
  Check,
  AlertTriangle,
  Navigation,
  HelpCircle,
  Wifi,
  Play,
  RotateCcw,
  MessageSquare,
  Send,
  ExternalLink,
  Music,
  FileAudio,
} from 'lucide-react';
import {
  getDiscordSettings,
  saveDiscordSettings,
  sendTestDiscordWebhook,
  DiscordWebhookSettings,
} from '../../services/discordWebhookService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Dialog } from '../../components/common/Dialog';
import { LocationModal } from '../../components/common/LocationModal';
import { LocationPermissionGuide } from '../../components/common/LocationPermissionGuide';
import { useAppSettings } from '../../context/AppSettingsContext';
import { useToast } from '../../context/ToastContext';
import type { PrayerMethod, PrayerNotificationToggles } from '../../types';
import { getMethodDescription } from '../../services/prayerService';
import {
  getNotificationPermissionStatus,
  requestNotificationPermission,
  triggerTestNotification,
  playNotificationSound,
} from '../../services/notificationService';
import {
  getStorageUsageReport,
  exportAllUserData,
  importUserData,
  clearAllUserData,
  StorageUsageReport,
} from '../../services/dataManagementService';

export const PengaturanPage: React.FC = () => {
  const {
    settings,
    updateSettings,
    updatePrayerMethod,
    detectDeviceLocation,
    isDetectingLocation,
    resetSettings,
  } = useAppSettings();
  const { showToast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isPermissionGuideOpen, setIsPermissionGuideOpen] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');
  const [storageReport, setStorageReport] = useState<StorageUsageReport>(() => getStorageUsageReport());
  const [isTestingNotification, setIsTestingNotification] = useState(false);

  // Discord Webhook State
  const [discordSettings, setDiscordSettings] = useState<DiscordWebhookSettings>(() => getDiscordSettings());
  const [isTestingDiscord, setIsTestingDiscord] = useState(false);

  // Custom Audio Alarm State
  const [customAudioName, setCustomAudioName] = useState<string>(() => {
    return localStorage.getItem('ramadan_custom_alarm_name') || '';
  });
  const customAudioInputRef = useRef<HTMLInputElement | null>(null);

  const handleSaveDiscordSettings = (updated: Partial<DiscordWebhookSettings>) => {
    const next = { ...discordSettings, ...updated };
    setDiscordSettings(next);
    saveDiscordSettings(next);
  };

  const handleTestDiscordWebhook = async () => {
    if (!discordSettings.webhookUrl) {
      showToast({
        title: 'URL Webhook Belum Diisi',
        message: 'Masukkan URL Webhook Discord channel Anda terlebih dahulu.',
        type: 'warning',
      });
      return;
    }
    setIsTestingDiscord(true);
    try {
      const res = await sendTestDiscordWebhook(discordSettings.webhookUrl, settings.location.city || 'Indonesia');
      if (res.success) {
        showToast({
          title: 'Webhook Terkirim! 🚀',
          message: 'Pesan uji coba berhasil mendarat di channel Discord Anda.',
          type: 'success',
          duration: 4000,
        });
      } else {
        showToast({
          title: 'Gagal Mengirim Webhook',
          message: res.error || 'Periksa kembali URL Webhook Anda.',
          type: 'error',
          duration: 5000,
        });
      }
    } finally {
      setIsTestingDiscord(false);
    }
  };

  const handleUploadCustomAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('audio') && !file.name.endsWith('.mp3')) {
      showToast({
        title: 'Format Berkas Salah',
        message: 'Harap pilih berkas audio berformat .mp3 atau .wav.',
        type: 'error',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        try {
          localStorage.setItem('ramadan_custom_alarm_audio', base64);
          localStorage.setItem('ramadan_custom_alarm_name', file.name);
          setCustomAudioName(file.name);
          showToast({
            title: 'Audio Kustom Tersimpan! 🎵',
            message: `"${file.name}" kini menjadi nada alarm pilihan Anda.`,
            type: 'success',
          });
        } catch (err) {
          showToast({
            title: 'Ukuran Berkas Terlalu Besar',
            message: 'Gunakan berkas MP3 di bawah 2MB agar muat di penyimpanan browser.',
            type: 'error',
          });
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handlePlayCustomAudio = () => {
    const savedAudio = localStorage.getItem('ramadan_custom_alarm_audio');
    if (savedAudio) {
      const snd = new Audio(savedAudio);
      snd.play().catch(() => {});
      showToast({
        title: 'Memutar Nada Kustom',
        message: customAudioName,
        type: 'info',
      });
    } else {
      showToast({
        title: 'Belum Ada Audio',
        message: 'Silakan unggah berkas MP3 terlebih dahulu.',
        type: 'warning',
      });
    }
  };

  const handleRemoveCustomAudio = () => {
    localStorage.removeItem('ramadan_custom_alarm_audio');
    localStorage.removeItem('ramadan_custom_alarm_name');
    setCustomAudioName('');
    showToast({
      title: 'Audio Kustom Dihapus',
      message: 'Nada alarm kembali ke standar sintesis melodik islami.',
      type: 'info',
    });
  };

  // Refresh status izin notifikasi & penggunaan storage saat mount
  useEffect(() => {
    setPermissionStatus(getNotificationPermissionStatus());
    setStorageReport(getStorageUsageReport());
  }, []);

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermissionStatus(res);
    if (res === 'granted') {
      updateSettings({ notificationsEnabled: true });
      showToast({
        title: 'Izin Notifikasi Diberikan',
        message: 'Pengingat waktu sholat dan imsak siap aktif.',
        type: 'success',
      });
    } else if (res === 'denied') {
      showToast({
        title: 'Izin Notifikasi Ditolak',
        message: 'Anda dapat mengaktifkannya kembali melalui ikon gembok di bilah alamat browser.',
        type: 'warning',
      });
    }
  };

  const handleTestNotification = async () => {
    setIsTestingNotification(true);
    try {
      const res = await triggerTestNotification(settings.notificationSoundEnabled !== false);
      showToast({
        title: res.success ? 'Uji Coba Berhasil' : 'Uji Coba Notifikasi',
        message: res.message,
        type: res.success ? 'success' : 'warning',
      });
      setPermissionStatus(getNotificationPermissionStatus());
    } finally {
      setIsTestingNotification(false);
    }
  };

  const handleTestSound = () => {
    playNotificationSound();
    showToast({
      title: 'Suara Bel Notifikasi Berbunyi',
      message: 'Sintesis nada harmonik islami Web Audio berhasil diputar.',
      type: 'info',
      duration: 2000,
    });
  };

  const handleTogglePrayerNotification = (key: keyof PrayerNotificationToggles) => {
    const current = settings.notificationToggles || {
      imsak: true,
      subuh: true,
      terbit: false,
      dhuha: false,
      dzuhur: true,
      ashar: true,
      maghrib: true,
      isya: true,
    };

    const updated = { ...current, [key]: !current[key] };
    updateSettings({ notificationToggles: updated });
  };

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const method = e.target.value as PrayerMethod;
    updatePrayerMethod(method);
    showToast({
      title: 'Metode Perhitungan Diperbarui',
      message: `Rujukan hisab waktu sholat sekarang: ${method}.`,
      type: 'info',
    });
  };

  const handleIhtiyatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const minutes = parseInt(e.target.value, 10);
    updateSettings({ ihtiyatMinutes: minutes });
    showToast({
      title: 'Koreksi Ikhtiyat Diperbarui',
      message: `Waktu sholat disesuaikan +${minutes} menit untuk kehati-hatian.`,
      type: 'info',
    });
  };

  const handleGPSDetect = async () => {
    try {
      const res = await detectDeviceLocation();
      const isGPS = res.source === 'gps';
      showToast({
        title: isGPS ? 'Lokasi GPS Berhasil Ditetapkan' : 'Lokasi Ditetapkan via Jaringan IP',
        message:
          res.note ||
          `Terdeteksi di sekitar ${res.location.city}. Jadwal sholat telah diperbarui.`,
        type: 'success',
      });
    } catch (err: any) {
      showToast({
        title: 'Gagal Mendeteksi Lokasi',
        message: err.message || 'Pastikan GPS dan izin peramban aktif.',
        type: 'error',
      });
    }
  };

  const handleExportBackup = () => {
    const res = exportAllUserData();
    if (res.success) {
      showToast({
        title: 'Cadangan Data Berhasil Diunduh',
        message: `File cadangan tersimpan sebagai ${res.filename}.`,
        type: 'success',
      });
    } else {
      showToast({
        title: 'Gagal Mengekspor Cadangan',
        message: 'Terjadi kendala saat membuat file JSON cadangan.',
        type: 'error',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = importUserData(content);
        if (res.success) {
          showToast({
            title: 'Impor Cadangan Berhasil',
            message: res.message,
            type: 'success',
            duration: 4000,
          });
          setStorageReport(getStorageUsageReport());
          // Refresh window to re-initialize contexts cleanly
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          showToast({
            title: 'Gagal Memulihkan Data',
            message: res.message,
            type: 'error',
          });
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmReset = () => {
    clearAllUserData();
    resetSettings();
    setIsResetDialogOpen(false);
    setStorageReport(getStorageUsageReport());
    showToast({
      title: 'Seluruh Data Direset',
      message: 'Semua preferensi, riwayat amalan, dan bookmark telah dibersihkan.',
      type: 'warning',
    });
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  const toggles: PrayerNotificationToggles = settings.notificationToggles || {
    imsak: true,
    subuh: true,
    terbit: false,
    dhuha: false,
    dzuhur: true,
    ashar: true,
    maghrib: true,
    isya: true,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-ink-100">Pengaturan Aplikasi</h1>
            <Badge variant="emerald">Phase 7 PWA & Launch Ready</Badge>
          </div>
          <p className="text-xs text-ink-400 mt-1">
            Konfigurasi lengkap notifikasi adzan, metode hisab falakiyah, lokasi, tipografi, instalasi PWA, dan pencadangan data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= TEMA TAMPILAN ================= */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-accent-700" />
              <div>
                <CardTitle>Tema & Tampilan Antarmuka</CardTitle>
                <CardDescription>Pilih preferensi visual tampilan aplikasi</CardDescription>
              </div>
            </div>
            <Badge variant="violet" size="sm">
              {settings.theme.toUpperCase()}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => updateSettings({ theme: 'dark' })}
                className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${
                  settings.theme === 'dark'
                    ? 'bg-ink-800/40 border-accent-500/80 text-accent-700 ring-1 ring-accent-500'
                    : 'bg-surface-elevated/40 border-ink-800 text-ink-400 hover:text-ink-200'
                }`}
              >
                <Moon className="w-4 h-4 text-accent-700" />
                <span className="text-xs font-semibold">Mode Gelap</span>
              </button>

              <button
                type="button"
                onClick={() => updateSettings({ theme: 'light' })}
                className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${
                  settings.theme === 'light'
                    ? 'bg-ink-800/40 border-accent-500/80 text-accent-700 ring-1 ring-accent-500'
                    : 'bg-surface-elevated/40 border-ink-800 text-ink-400 hover:text-ink-200'
                }`}
              >
                <Sun className="w-4 h-4 text-accent-700" />
                <span className="text-xs font-semibold">Mode Terang</span>
              </button>

              <button
                type="button"
                onClick={() => updateSettings({ theme: 'system' })}
                className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${
                  settings.theme === 'system'
                    ? 'bg-ink-800/40 border-accent-500/80 text-accent-700 ring-1 ring-accent-500'
                    : 'bg-surface-elevated/40 border-ink-800 text-ink-400 hover:text-ink-200'
                }`}
              >
                <Laptop className="w-4 h-4 text-accent-700" />
                <span className="text-xs font-semibold">Sistem Otomatis</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* ================= NOTIFIKASI & ALARM SHOLAT ================= */}
        <Card className="border-accent-500/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BellRing className="w-5 h-5 text-accent-700" />
              <div>
                <CardTitle>Notifikasi Adzan & Waktu Imsak</CardTitle>
                <CardDescription>Pengingat waktu ibadah berbasis Web Notification & Audio API</CardDescription>
              </div>
            </div>
            <Badge
              variant={
                permissionStatus === 'granted'
                  ? 'emerald'
                  : permissionStatus === 'denied'
                  ? 'rose'
                  : 'gold'
              }
              size="sm"
            >
              {permissionStatus === 'granted'
                ? 'Izin Aktif'
                : permissionStatus === 'denied'
                ? 'Izin Diblokir'
                : 'Belum Diizinkan'}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Permission Banner */}
            {permissionStatus !== 'granted' && (
              <div className="p-3.5 rounded-lg bg-ink-800/30 border border-accent-800/40 flex items-center justify-between gap-3 text-xs">
                <div className="text-accent-700">
                  Peramban belum mengizinkan notifikasi muncul di layar perangkat Anda.
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRequestPermission}
                >
                  Izinkan Notifikasi
                </Button>
              </div>
            )}

            {/* Master Switch & Sound Switch */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-elevated/40 border border-ink-800">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-ink-200">
                    Aktifkan Pengingat Otomatis
                  </div>
                  <div className="text-xs text-ink-400">
                    Kirim notifikasi setiap masuk waktu sholat & imsak
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => updateSettings({ notificationsEnabled: e.target.checked })}
                  className="w-4 h-4 accent-accent-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-elevated/40 border border-ink-800">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-ink-200 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-accent-700" />
                    <span>Bunyikan Suara Adzan / Bel Lembut</span>
                  </div>
                  <div className="text-xs text-ink-400">
                    Putar sintesis nada harmonik islami saat alarm berbunyi
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-ink-300"
                    onClick={handleTestSound}
                    title="Uji coba dengar suara"
                  >
                    <Play className="w-3 h-3 text-accent-700 mr-1" />
                    Tes Suara
                  </Button>
                  <input
                    type="checkbox"
                    checked={settings.notificationSoundEnabled !== false}
                    onChange={(e) => updateSettings({ notificationSoundEnabled: e.target.checked })}
                    className="w-4 h-4 accent-accent-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Pre-alert minutes selector */}
            <Select
              label="Waktu Munculnya Notifikasi"
              value={settings.reminderMinutesBefore || 0}
              onChange={(e) =>
                updateSettings({ reminderMinutesBefore: parseInt(e.target.value, 10) })
              }
            >
              <option value="0" className="bg-surface text-ink-100">
                Tepat Saat Waktu Sholat Tiba (0 Menit)
              </option>
              <option value="5" className="bg-surface text-ink-100">
                5 Menit Sebelum Waktu Sholat Tiba (Persiapan Wudhu)
              </option>
              <option value="10" className="bg-surface text-ink-100">
                10 Menit Sebelum Waktu Sholat Tiba
              </option>
              <option value="15" className="bg-surface text-ink-100">
                15 Menit Sebelum (Cocok untuk Menuju Masjid)
              </option>
            </Select>

            {/* Checklist Per Waktu Sholat */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-ink-300 block">
                Pilih Jadwal yang Diingatkan:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { key: 'imsak', label: 'Imsak (Sahur)' },
                  { key: 'subuh', label: 'Subuh' },
                  { key: 'terbit', label: 'Syuruq' },
                  { key: 'dhuha', label: 'Dhuha' },
                  { key: 'dzuhur', label: 'Dzuhur' },
                  { key: 'ashar', label: 'Ashar' },
                  { key: 'maghrib', label: 'Maghrib (Iftar)' },
                  { key: 'isya', label: 'Isya' },
                ].map(({ key, label }) => {
                  const isChecked = toggles[key as keyof PrayerNotificationToggles];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleTogglePrayerNotification(key as keyof PrayerNotificationToggles)}
                      className={`min-h-[44px] p-2.5 rounded-lg border text-left flex items-center justify-between transition-all touch-manipulation cursor-pointer active:scale-95 ${
                        isChecked
                          ? 'bg-accent-500/20 border-accent-500/60 text-accent-700'
                          : 'bg-surface-elevated/40 border-ink-800 text-ink-400'
                      }`}
                    >
                      <span className="font-medium text-xs">{label}</span>
                      {isChecked ? (
                        <Check className="w-3.5 h-3.5 text-accent-700" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-ink-700 block" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Test Notification Button */}
            <div className="pt-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-center"
                leftIcon={<Bell className="w-3.5 h-3.5 text-accent-700" />}
                isLoading={isTestingNotification}
                onClick={handleTestNotification}
              >
                Kirim Notifikasi & Suara Uji Coba Sekarang
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ================= LOKASI & KOORDINAT ================= */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent-700" />
              <div>
                <CardTitle>Lokasi & Koordinat Geografis</CardTitle>
                <CardDescription>Titik koordinat penentuan arah kiblat dan jadwal sholat</CardDescription>
              </div>
            </div>
            <Badge
              variant={
                settings.location.detectionSource === 'gps'
                  ? 'emerald'
                  : settings.location.detectionSource === 'ip'
                  ? 'blue'
                  : settings.location.isCustom
                  ? 'violet'
                  : 'slate'
              }
              size="sm"
            >
              {settings.location.detectionSource === 'gps'
                ? 'GPS Satelit'
                : settings.location.detectionSource === 'ip'
                ? 'Jaringan IP'
                : settings.location.isCustom
                ? 'Kustom'
                : 'Preset'}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3.5 rounded-lg bg-surface-elevated/40 border border-ink-700/50 flex items-center justify-between">
              <div>
                <div className="text-base font-bold text-ink-100">{settings.location.city}</div>
                <div className="text-xs text-ink-400 font-mono mt-0.5">
                  Lat: {settings.location.latitude.toFixed(4)} • Lon:{' '}
                  {settings.location.longitude.toFixed(4)}
                </div>
                <div className="text-xs text-accent-700 mt-1">
                  Zona: {settings.location.timezone}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsLocationModalOpen(true)}
                >
                  Pilih Kota
                </Button>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    leftIcon={<Navigation className="w-3.5 h-3.5 text-accent-700" />}
                    isLoading={isDetectingLocation}
                    onClick={handleGPSDetect}
                  >
                    GPS
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-2.5 border-ink-700 hover:border-accent-500/50 text-ink-300"
                    title="Panduan Izin Lokasi di HP"
                    onClick={() => setIsPermissionGuideOpen(true)}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-accent-700" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-ink-400 pt-1">
              <span>Mendukung 38+ kota & deteksi otomatis</span>
              <button
                type="button"
                onClick={() => setIsPermissionGuideOpen(true)}
                className="text-accent-700 hover:text-accent-800 underline font-medium"
              >
                Panduan Izin GPS HP
              </button>
            </div>
          </CardContent>
        </Card>

        {/* ================= METODE HISAB & IKHTIYAT ================= */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-accent-700" />
              <div>
                <CardTitle>Metode Perhitungan Hisab</CardTitle>
                <CardDescription>Standar sudut fajar dan senja rujukan sholat</CardDescription>
              </div>
            </div>
            <Badge variant="violet" size="sm">
              {settings.prayerMethod}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Otoritas / Lembaga Falakiyah"
              value={settings.prayerMethod}
              onChange={handleMethodChange}
            >
              <option value="KEMENAG" className="bg-surface text-ink-100">
                Kementerian Agama RI (Kemenag) — Subuh 20°, Isya 18°
              </option>
              <option value="MUHAMMADIYAH" className="bg-surface text-ink-100">
                Majelis Tarjih Muhammadiyah (Munas 31) — Subuh 18°, Isya 18°
              </option>
              <option value="NU" className="bg-surface text-ink-100">
                Lembaga Falakiyah PBNU — Subuh 20°, Isya 18°
              </option>
              <option value="MWL" className="bg-surface text-ink-100">
                Muslim World League (MWL) — Subuh 18°, Isya 17°
              </option>
              <option value="MAKKAH" className="bg-surface text-ink-100">
                Umm al-Qura University, Makkah — Subuh 18.5°, Isya +90m
              </option>
              <option value="ISNA" className="bg-surface text-ink-100">
                Islamic Society of North America — Subuh 15°, Isya 15°
              </option>
              <option value="EGYPT" className="bg-surface text-ink-100">
                Egyptian General Authority — Subuh 19.5°, Isya 17.5°
              </option>
            </Select>

            <Select
              label="Koreksi Waktu Ikhtiyat (Kehati-hatian)"
              value={settings.ihtiyatMinutes || 2}
              onChange={handleIhtiyatChange}
            >
              <option value="0" className="bg-surface text-ink-100">0 Menit (Hisab Murni tanpa Ihtiyat)</option>
              <option value="1" className="bg-surface text-ink-100">+1 Menit</option>
              <option value="2" className="bg-surface text-ink-100">+2 Menit (Standar Kemenag RI)</option>
              <option value="3" className="bg-surface text-ink-100">+3 Menit</option>
            </Select>

            <div className="p-3 rounded-lg bg-ink-800/20 border border-accent-800/30 text-xs text-accent-700 leading-relaxed">
              {getMethodDescription(settings.prayerMethod)}
            </div>
          </CardContent>
        </Card>

        {/* ================= TIPOGRAFI ================= */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Type className="w-5 h-5 text-accent-700" />
              <div>
                <CardTitle>Ukuran Font Al-Qur'an</CardTitle>
                <CardDescription>Sesuaikan kenyamanan membaca ayat dan terjemahan</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-ink-300">Ukuran Teks Arab: {settings.arabicFontSize}px</span>
              </div>
              <input
                type="range"
                min="20"
                max="36"
                step="2"
                value={settings.arabicFontSize}
                onChange={(e) => updateSettings({ arabicFontSize: Number(e.target.value) })}
                className="w-full accent-accent-400 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-lg bg-surface-elevated/50 border border-ink-700/50 text-center">
              <p
                className="font-arabic text-accent-700 leading-loose"
                style={{ fontSize: `${settings.arabicFontSize}px` }}
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p
                className="text-ink-300 mt-2"
                style={{ fontSize: `${settings.translationFontSize}px` }}
              >
                "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang."
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ================= MANAJEMEN DATA, BACKUP & EXPORT/IMPORT ================= */}
        <Card className="border-accent-500/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-accent-700" />
              <div>
                <CardTitle>Manajemen Data & Pencadangan</CardTitle>
                <CardDescription>Ekspor, impor, dan pantau kapasitas penyimpanan lokal</CardDescription>
              </div>
            </div>
            <Badge variant="blue" size="sm">
              {storageReport.formattedTotal}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Storage Usage Bar */}
            <div className="p-3.5 rounded-lg bg-ink-900/60 border border-ink-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-300 font-semibold">Penyimpanan Terpakai:</span>
                <span className="text-accent-700 font-mono">
                  {storageReport.formattedTotal} / {storageReport.estimatedLimit}
                </span>
              </div>
              <div className="w-full bg-ink-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-accent-400 h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(5, (storageReport.totalBytes / (5 * 1024 * 1024)) * 100)
                    )}%`,
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs text-ink-400 pt-1">
                {storageReport.items.map((it) => (
                  <div key={it.key} className="truncate">
                    • {it.name.split(' ')[0]}: <strong className="text-ink-300 font-mono">{it.formatted}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Export & Import Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Download className="w-4 h-4 text-accent-700" />}
                onClick={handleExportBackup}
              >
                Ekspor Cadangan (JSON)
              </Button>

              <Button
                variant="outline"
                size="sm"
                leftIcon={<Upload className="w-4 h-4 text-accent-700" />}
                onClick={() => fileInputRef.current?.click()}
              >
                Pulihkan / Impor JSON
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Reset All Data Button */}
            <div className="pt-2 border-t border-ink-800 flex justify-between items-center">
              <span className="text-xs text-ink-400">Hapus seluruh data & pengaturan:</span>
              <Button
                variant="danger"
                size="sm"
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                onClick={() => setIsResetDialogOpen(true)}
              >
                Reset Semua Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ================= INTEGRASI DISCORD WEBHOOK ================= */}
        <Card className="border-accent-500/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent-600/20 text-accent-700 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Notifikasi Discord Webhook</CardTitle>
                <CardDescription>Kirim jadwal sholat, imsak, dan iftar ke channel Discord</CardDescription>
              </div>
            </div>
            <Badge variant={discordSettings.enabled && discordSettings.webhookUrl ? 'emerald' : 'slate'} size="sm">
              {discordSettings.enabled && discordSettings.webhookUrl ? 'Aktif' : 'Nonaktif'}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-elevated/40 border border-ink-800">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-ink-200">
                  Aktifkan Webhook Discord
                </div>
                <div className="text-xs text-ink-400">
                  Otomatis kirim pengingat ibadah ke server Discord komunitas / teman
                </div>
              </div>
              <input
                type="checkbox"
                checked={discordSettings.enabled}
                onChange={(e) => handleSaveDiscordSettings({ enabled: e.target.checked })}
                className="w-4 h-4 accent-accent-400 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-300 block mb-1.5">
                Discord Webhook URL:
              </label>
              <div className="flex items-center gap-2">
                <Input
                  value={discordSettings.webhookUrl}
                  onChange={(e) => handleSaveDiscordSettings({ webhookUrl: e.target.value.trim() })}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="bg-ink-900 text-xs"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleTestDiscordWebhook}
                  disabled={isTestingDiscord || !discordSettings.webhookUrl}
                  className="shrink-0 bg-accent-400 hover:bg-accent-500 text-ink-50 font-semibold"
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  {isTestingDiscord ? 'Mengirim...' : 'Tes Webhook'}
                </Button>
              </div>
            </div>

            {/* Checklist options */}
            <div className="space-y-2 pt-1 border-t border-ink-800/80">
              <p className="text-xs font-semibold text-ink-400">
                Pengingat yang Dikirim ke Discord:
              </p>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-ink-900/60 border border-ink-800 text-xs text-ink-300 cursor-pointer hover:bg-ink-800/40">
                <span>Peringatan Waktu Imsak (Tahan Sahur)</span>
                <input
                  type="checkbox"
                  checked={discordSettings.notifyImsak}
                  onChange={(e) => handleSaveDiscordSettings({ notifyImsak: e.target.checked })}
                  className="w-4 h-4 accent-accent-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-ink-900/60 border border-ink-800 text-xs text-ink-300 cursor-pointer hover:bg-ink-800/40">
                <span>Sirine Waktu Maghrib (Buka Puasa)</span>
                <input
                  type="checkbox"
                  checked={discordSettings.notifyMaghrib}
                  onChange={(e) => handleSaveDiscordSettings({ notifyMaghrib: e.target.checked })}
                  className="w-4 h-4 accent-accent-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-ink-900/60 border border-ink-800 text-xs text-ink-300 cursor-pointer hover:bg-ink-800/40">
                <span>Jadwal Lengkap 5 Waktu Sholat</span>
                <input
                  type="checkbox"
                  checked={discordSettings.notifyAllPrayers}
                  onChange={(e) => handleSaveDiscordSettings({ notifyAllPrayers: e.target.checked })}
                  className="w-4 h-4 accent-accent-400 cursor-pointer"
                />
              </label>
            </div>

            <div className="p-3 rounded-lg bg-ink-800/20 border border-accent-800/30 text-xs text-accent-700 leading-relaxed">
              💡 <strong>Cara buat Webhook di Discord:</strong> Buka channel di server Discord Anda $\rightarrow$ Klik ikon Gear ⚙️ (Edit Channel) $\rightarrow$ Menu <strong>Integrations</strong> $\rightarrow$ <strong>Webhooks</strong> $\rightarrow$ <strong>New Webhook</strong> $\rightarrow$ Klik <strong>Copy Webhook URL</strong> lalu tempel di atas.
            </div>
          </CardContent>
        </Card>

        {/* ================= NADA ALARM KUSTOM & SPOTIFY ================= */}
        <Card className="border-accent-500/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent-500/20 text-accent-700 flex items-center justify-center">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Nada Alarm Kustom & Musik Religi</CardTitle>
                <CardDescription>Unggah MP3 adzan sendiri atau buka playlist Spotify Ramadan</CardDescription>
              </div>
            </div>
            <Badge variant="gold" size="sm">
              {customAudioName ? 'MP3 Pribadi' : 'Sintesis Standar'}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Custom MP3 Upload */}
            <div className="p-3.5 rounded-lg bg-surface-elevated/40 border border-ink-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-ink-200 flex items-center gap-1.5">
                    <FileAudio className="w-3.5 h-3.5 text-accent-700" />
                    Unggah Nada Adzan / Alarm Sendiri (.MP3)
                  </h4>
                  <p className="text-xs text-ink-400 mt-0.5">
                    Gunakan file adzan favorit atau suara takbiran pribadi Anda
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => customAudioInputRef.current?.click()}
                  className="border-accent-500/40 text-accent-700 hover:bg-ink-800/30"
                >
                  Pilih File MP3
                </Button>
                <input
                  ref={customAudioInputRef}
                  type="file"
                  accept="audio/mp3,audio/mpeg,audio/wav"
                  className="hidden"
                  onChange={handleUploadCustomAudio}
                />
              </div>

              {customAudioName ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-ink-800/20 border border-accent-800/40 text-xs">
                  <div className="truncate mr-2">
                    <span className="text-ink-400">File Aktif: </span>
                    <strong className="text-accent-700">{customAudioName}</strong>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handlePlayCustomAudio}
                      className="px-2 py-1 rounded bg-accent-600/30 text-accent-700 hover:bg-accent-600/50 flex items-center gap-1"
                    >
                      <Play className="w-3 h-3" /> Tes
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveCustomAudio}
                      className="px-2 py-1 rounded bg-rose-950/40 text-rose-700 hover:bg-rose-900/50"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-ink-400 italic">
                  Belum ada file audio kustom yang diunggah. Saat ini menggunakan nada bawaan.
                </p>
              )}
            </div>

            {/* Spotify Islamic Playlist Recommendations */}
            <div className="space-y-2 pt-1 border-t border-ink-800/80">
              <div className="flex items-center justify-between text-xs font-semibold text-ink-300">
                <span className="flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-accent-700" />
                  Playlist Religi Ramadan (Spotify)
                </span>
                <span className="text-xs text-ink-400">Mendengarkan Ngabuburit</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href="https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-ink-900/70 border border-ink-800 hover:border-accent-500/50 flex items-center justify-between group transition-colors"
                >
                  <div className="truncate">
                    <p className="text-xs font-bold text-ink-200 group-hover:text-accent-800">
                      Lagu Religi & Sholawat
                    </p>
                    <p className="text-xs text-ink-400">Kompilasi Ramadan Spotify</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-ink-400 group-hover:text-accent-800 shrink-0 ml-2" />
                </a>

                <a
                  href="https://open.spotify.com/genre/0JQ5DAqbMKFNf1pL0z8H0s"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-ink-900/70 border border-ink-800 hover:border-accent-500/50 flex items-center justify-between group transition-colors"
                >
                  <div className="truncate">
                    <p className="text-xs font-bold text-ink-200 group-hover:text-accent-800">
                      Murottal Al-Qur'an 30 Juz
                    </p>
                    <p className="text-xs text-ink-400">Tilawah Para Qari Ternama</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-ink-400 group-hover:text-accent-800 shrink-0 ml-2" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      {/* Location Permission Guide Modal */}
      <LocationPermissionGuide
        isOpen={isPermissionGuideOpen}
        onClose={() => setIsPermissionGuideOpen(false)}
      />

      {/* Reset Confirmation Dialog */}
      <Dialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        title="Konfirmasi Reset Seluruh Data"
        description="Tindakan ini akan menghapus semua preferensi, catatan ibadah, dan bookmark."
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/40 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-700 leading-relaxed space-y-1">
              <p className="font-semibold">Peringatan: Data tidak dapat dipulihkan kembali.</p>
              <p>
                Seluruh jurnal ibadah 30 hari, status puasa, daftar doa dan hadits favorit, serta posisi tilawah Al-Qur'an akan dihapus bersih dari perangkat Anda.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsResetDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmReset}>
              Ya, Hapus Bersih Sekarang
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
