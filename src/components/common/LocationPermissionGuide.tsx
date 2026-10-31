import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Wifi,
  Navigation,
  ExternalLink,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { Badge } from './Badge';
import { useAppSettings } from '../../context/AppSettingsContext';
import { LocationPermissionInfo } from '../../services/locationService';
import { useToast } from '../../context/ToastContext';

export interface LocationPermissionGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationDetected?: () => void;
}

export const LocationPermissionGuide: React.FC<LocationPermissionGuideProps> = ({
  isOpen,
  onClose,
  onLocationDetected,
}) => {
  const { checkLocationPermission, detectDeviceLocation, isDetectingLocation } = useAppSettings();
  const { showToast } = useToast();
  const [permInfo, setPermInfo] = useState<LocationPermissionInfo | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const refreshPermission = async () => {
    setIsChecking(true);
    try {
      const info = await checkLocationPermission();
      setPermInfo(info);
    } catch (e) {
      console.warn('Failed to check permission', e);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshPermission();
    }
  }, [isOpen]);

  const handleTryGPS = async () => {
    try {
      const res = await detectDeviceLocation({ preferGPSOnly: true });
      showToast({
        title: 'GPS Berhasil Dideteksi',
        message: `Koordinat satelit aktif di sekitar ${res.location.city}.`,
        type: 'success',
      });
      onLocationDetected?.();
      onClose();
    } catch (err: any) {
      showToast({
        title: 'Sensor GPS Belum Dapat Diakses',
        message: err.message || 'Periksa izin lokasi peramban.',
        type: 'error',
      });
      refreshPermission();
    }
  };

  const handleTryIP = async () => {
    try {
      const res = await detectDeviceLocation();
      showToast({
        title: 'Lokasi Berhasil Ditetapkan',
        message: res.note || `Terdeteksi di sekitar ${res.location.city}.`,
        type: 'success',
      });
      onLocationDetected?.();
      onClose();
    } catch (err: any) {
      showToast({
        title: 'Gagal Deteksi Lokasi',
        message: err.message,
        type: 'error',
      });
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Panduan Izin Lokasi & GPS di HP"
      description="Penjelasan dan solusi agar penetapan lokasi waktu sholat berjalan lancar di peramban ponsel Anda."
    >
      <div className="space-y-4 text-xs">
        {/* Status Diagnostik Peramban */}
        <div className="p-3.5 rounded-xl bg-surface-elevated/60 border border-ink-700/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ink-200 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-accent-700" />
              Status Diagnostik Browser
            </span>
            <button
              type="button"
              onClick={refreshPermission}
              disabled={isChecking}
              className="text-xs text-accent-700 hover:text-accent-800 underline"
            >
              {isChecking ? 'Memeriksa...' : 'Perbarui Status'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-ink-900/60 border border-ink-800">
              <div className="text-ink-400">Protokol Keamanan:</div>
              <div className="font-medium mt-0.5 flex items-center gap-1">
                {permInfo?.isSecureContext ? (
                  <Badge variant="emerald" size="sm">
                    HTTPS / Localhost (Aman)
                  </Badge>
                ) : (
                  <Badge variant="gold" size="sm">
                    HTTP (Non-Secure)
                  </Badge>
                )}
              </div>
            </div>

            <div className="p-2 rounded-lg bg-ink-900/60 border border-ink-800">
              <div className="text-ink-400">Izin Sensor GPS:</div>
              <div className="font-medium mt-0.5">
                {permInfo?.state === 'granted' ? (
                  <Badge variant="emerald" size="sm">
                    Diizinkan (Aktif)
                  </Badge>
                ) : permInfo?.state === 'insecure_origin' ? (
                  <Badge variant="gold" size="sm">
                    Dibatasi Browser
                  </Badge>
                ) : permInfo?.state === 'denied' ? (
                  <Badge variant="rose" size="sm">
                    Ditolak Browser
                  </Badge>
                ) : (
                  <Badge variant="blue" size="sm">
                    Perlu Konfirmasi
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {permInfo && (
            <p className="text-xs text-ink-300 leading-relaxed bg-ink-800/40 p-2.5 rounded-lg border border-ink-700/30">
              {permInfo.message}
            </p>
          )}
        </div>

        {/* Kenapa GPS HP Sering Gagal di Browser? */}
        <div className="p-3.5 rounded-xl bg-ink-800/20 border border-accent-800/40 text-accent-700 space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-accent-700">
            <AlertTriangle className="w-4 h-4 text-accent-700 shrink-0" />
            <span>Mengapa GPS di HP Gagal Padahal Sudah Dinyalakan?</span>
          </div>
          <p className="leading-relaxed text-xs text-accent-700">
            Ketika Anda membuka web via alamat IP lokal (contoh: <code className="bg-ink-800/60 px-1 py-0.5 rounded text-accent-700 font-mono">http://192.168.x.x:3000</code>), 
            <strong> Google Chrome & Safari secara otomatis memblokir sensor GPS fisik</strong> karena alasan keamanan (aturan resmi W3C: Geolocation hanya diizinkan di HTTPS atau localhost).
          </p>
        </div>

        {/* Solusi 1: Deteksi Cerdas Jaringan IP */}
        <div className="p-3.5 rounded-xl bg-ink-800/25 border border-accent-800/40 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-accent-700">
            <Wifi className="w-4 h-4 text-accent-700 shrink-0" />
            <span>Solusi 1 (Paling Mudah): Deteksi Jaringan IP</span>
          </div>
          <p className="leading-relaxed text-xs text-accent-700">
            Sistem kami dapat mendeteksi kota dan koordinat Anda secara otomatis melalui koneksi WiFi/seluler tanpa memerlukan izin GPS hardware browser.
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-center bg-ink-800/30 hover:bg-ink-800/40 border-accent-600/40 text-accent-700 mt-1"
            leftIcon={<Wifi className="w-3.5 h-3.5 text-accent-700" />}
            isLoading={isDetectingLocation}
            onClick={handleTryIP}
          >
            Gunakan Deteksi Jaringan IP Sekarang
          </Button>
        </div>

        {/* Solusi 2: Langkah Mengaktifkan Izin di Browser */}
        <div className="p-3.5 rounded-xl bg-surface-elevated/40 border border-ink-700/50 space-y-2.5">
          <div className="flex items-center gap-2 font-semibold text-ink-200">
            <Smartphone className="w-4 h-4 text-accent-700 shrink-0" />
            <span>Solusi 2: Langkah Izinkan GPS Fisik di HP</span>
          </div>

          <div className="space-y-2 text-xs text-ink-300">
            <div className="p-2.5 rounded-lg bg-ink-900/40 border border-ink-800 space-y-1">
              <strong className="text-ink-100 flex items-center gap-1">
                <span>Di Google Chrome (Android):</span>
              </strong>
              <ol className="list-decimal list-inside space-y-0.5 text-ink-400">
                <li>Ketuk ikon setelan situs / tune di samping URL address bar.</li>
                <li>Pilih <strong>Izin (Permissions)</strong> → <strong>Lokasi</strong> → ubah ke <strong>Izinkan</strong>.</li>
                <li>Jika dibuka via IP HTTP, jalankan versi HTTPS (<code className="text-accent-700 font-mono">npm run dev:https</code>).</li>
              </ol>
            </div>

            <div className="p-2.5 rounded-lg bg-ink-900/40 border border-ink-800 space-y-1">
              <strong className="text-ink-100 flex items-center gap-1">
                <span>Di Safari (iPhone / iOS):</span>
              </strong>
              <ol className="list-decimal list-inside space-y-0.5 text-ink-400">
                <li>Buka <strong>Pengaturan iPhone</strong> → <strong>Privasi & Keamanan</strong> → <strong>Layanan Lokasi</strong> (Nyalakan).</li>
                <li>Pilih <strong>Situs Web Safari</strong> → pilih <strong>Saat Menggunakan App</strong>.</li>
              </ol>
            </div>
          </div>

          {permInfo?.canUseHardwareGPS && (
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center border-accent-500/40 text-accent-700 hover:bg-ink-800/30"
              leftIcon={<Navigation className="w-3.5 h-3.5 text-accent-700" />}
              isLoading={isDetectingLocation}
              onClick={handleTryGPS}
            >
              Coba Minta Izin GPS Satelit Sekarang
            </Button>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Tutup Panduan
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
