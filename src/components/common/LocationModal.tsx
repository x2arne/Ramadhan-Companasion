import React, { useState } from 'react';
import { MapPin, Navigation, Search, Check, Globe, HelpCircle, Wifi, ShieldCheck } from 'lucide-react';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { Input } from './Input';
import { Badge } from './Badge';
import { INDONESIAN_CITIES, CityPreset } from '../../services/locationService';
import { useAppSettings } from '../../context/AppSettingsContext';
import { useToast } from '../../context/ToastContext';
import { UserLocation } from '../../types';
import { LocationPermissionGuide } from './LocationPermissionGuide';

export interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateLocation, detectDeviceLocation, isDetectingLocation } = useAppSettings();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [customCity, setCustomCity] = useState(settings.location.city);
  const [customLat, setCustomLat] = useState(settings.location.latitude.toString());
  const [customLon, setCustomLon] = useState(settings.location.longitude.toString());
  const [customTz, setCustomTz] = useState(settings.location.timezone);

  const filteredCities = INDONESIAN_CITIES.filter(
    (c) =>
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      (c.province && c.province.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelectCity = (preset: CityPreset) => {
    updateLocation({ ...preset, detectionSource: 'preset' });
    showToast({
      title: 'Lokasi Diperbarui',
      message: `Jadwal sholat kini disesuaikan untuk kota ${preset.city}.`,
      type: 'success',
    });
    onClose();
  };

  const handleDetectGPS = async () => {
    try {
      const res = await detectDeviceLocation();
      const isGPS = res.source === 'gps';
      showToast({
        title: isGPS ? 'Lokasi GPS Berhasil Ditetapkan' : 'Lokasi Ditetapkan via Jaringan IP',
        message:
          res.note ||
          `Terdeteksi di sekitar ${res.location.city} (${res.location.latitude}, ${res.location.longitude}).`,
        type: 'success',
      });
      onClose();
    } catch (err: any) {
      showToast({
        title: 'Gagal Mendeteksi Lokasi',
        message: err.message || 'Pastikan GPS dan izin lokasi diaktifkan di peramban Anda.',
        type: 'error',
      });
    }
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      showToast({ title: 'Latitude Tidak Valid', message: 'Latitude harus antara -90 dan 90.', type: 'error' });
      return;
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      showToast({ title: 'Longitude Tidak Valid', message: 'Longitude harus antara -180 dan 180.', type: 'error' });
      return;
    }

    const customLoc: UserLocation = {
      city: customCity.trim() || 'Lokasi Kustom',
      country: 'Indonesia',
      latitude: lat,
      longitude: lon,
      timezone: customTz,
      isCustom: true,
      detectionSource: 'manual',
    };

    updateLocation(customLoc);
    showToast({
      title: 'Koordinat Kustom Disimpan',
      message: `Waktu sholat dihitung berdasarkan titik ${lat.toFixed(4)}, ${lon.toFixed(4)}.`,
      type: 'success',
    });
    onClose();
  };

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        title="Pilih Lokasi & Koordinat"
        description="Penetapan waktu sholat akurat bergantung pada titik garis lintang dan garis bujur Anda."
      >
        <div className="space-y-4">
          {/* Action Row: Tombol GPS Auto Detect + Tombol Bantuan Izin HP */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="md"
                className="flex-1 justify-center bg-surface-elevated border-ink-700 hover:border-accent-500/50"
                leftIcon={<Navigation className="w-4 h-4 text-accent-700" />}
                isLoading={isDetectingLocation}
                onClick={handleDetectGPS}
              >
                {isDetectingLocation ? 'Mencari Koordinat...' : 'Deteksi Otomatis (GPS / IP)'}
              </Button>

              <Button
                variant="outline"
                size="md"
                className="shrink-0 px-3 border-ink-700 hover:border-accent-500/50 text-ink-300 hover:text-accent-800"
                title="Panduan Izin Lokasi di HP"
                onClick={() => setIsGuideOpen(true)}
              >
                <HelpCircle className="w-4 h-4 text-accent-700" />
              </Button>
            </div>

            {/* Micro banner notice */}
            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-ink-900/50 border border-ink-800 text-xs text-ink-400">
              <span className="flex items-center gap-1.5">
                <Wifi className="w-3 h-3 text-accent-700" />
                <span>Mendukung GPS satelit & estimasi IP otomatis</span>
              </span>
              <button
                type="button"
                onClick={() => setIsGuideOpen(true)}
                className="text-accent-700 hover:text-accent-800 underline font-medium"
              >
                Izin HP gagal?
              </button>
            </div>
          </div>

        {/* Tab Toggle: Daftar Kota vs Koordinat Manual */}
        <div className="flex border-b border-ink-800 pb-1">
          <button
            type="button"
            onClick={() => setIsCustomMode(false)}
            className={`flex-1 py-1.5 text-xs font-semibold text-center border-b-2 transition-colors ${
              !isCustomMode
                ? 'border-accent-500 text-accent-700'
                : 'border-transparent text-ink-400 hover:text-ink-200'
            }`}
          >
            Daftar 38+ Kota Indonesia
          </button>
          <button
            type="button"
            onClick={() => setIsCustomMode(true)}
            className={`flex-1 py-1.5 text-xs font-semibold text-center border-b-2 transition-colors ${
              isCustomMode
                ? 'border-accent-500 text-accent-700'
                : 'border-transparent text-ink-400 hover:text-ink-200'
            }`}
          >
            Input Koordinat Manual
          </button>
        </div>

        {!isCustomMode ? (
          <div className="space-y-3">
            <Input
              placeholder="Cari nama kota atau provinsi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-ink-400" />}
            />

            {/* City Preset List */}
            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
              {filteredCities.map((city) => {
                const isSelected =
                  settings.location.city.toLowerCase() === city.city.toLowerCase() &&
                  !settings.location.isCustom;
                return (
                  <button
                    key={`${city.city}-${city.latitude}`}
                    type="button"
                    onClick={() => handleSelectCity(city)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-ink-800/30 border border-accent-500/50 text-ink-100'
                        : 'bg-surface-elevated/40 hover:bg-surface-elevated border border-ink-800 text-ink-300 hover:text-ink-100'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm flex items-center gap-1.5">
                        <span>{city.city}</span>
                        {city.province && (
                          <span className="text-xs font-normal text-ink-400">
                            ({city.province})
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-ink-400 font-mono mt-0.5">
                        Lat: {city.latitude.toFixed(2)}, Lon: {city.longitude.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="blue" size="sm">
                        {city.timezone === 'Asia/Jakarta'
                          ? 'WIB'
                          : city.timezone === 'Asia/Makassar'
                          ? 'WITA'
                          : city.timezone === 'Asia/Jayapura'
                          ? 'WIT'
                          : 'UTC'}
                      </Badge>
                      {isSelected && <Check className="w-4 h-4 text-accent-700 shrink-0" />}
                    </div>
                  </button>
                );
              })}

              {filteredCities.length === 0 && (
                <div className="p-6 text-center text-xs text-ink-400">
                  Tidak ditemukan kota yang cocok dengan "{search}". Coba gunakan opsi koordinat manual.
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveCustom} className="space-y-3">
            <Input
              label="Nama Lokasi / Tempat"
              placeholder="Contoh: Rumah / Masjid Al-Ikhlas"
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Garis Lintang (Latitude)"
                placeholder="-6.2088"
                type="number"
                step="any"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                required
              />
              <Input
                label="Garis Bujur (Longitude)"
                placeholder="106.8456"
                type="number"
                step="any"
                value={customLon}
                onChange={(e) => setCustomLon(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-ink-300">Zona Waktu</label>
              <select
                value={customTz}
                onChange={(e) => setCustomTz(e.target.value)}
                className="w-full bg-surface-elevated/70 border border-ink-700/60 rounded-lg px-4 py-2 text-xs text-ink-100"
              >
                <option value="Asia/Jakarta">WIB (UTC+7) — Asia/Jakarta</option>
                <option value="Asia/Makassar">WITA (UTC+8) — Asia/Makassar</option>
                <option value="Asia/Jayapura">WIT (UTC+9) — Asia/Jayapura</option>
                <option value="Asia/Riyadh">AST (UTC+3) — Makkah / Madinah</option>
              </select>
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full mt-2">
              Terapkan Koordinat Kustom
            </Button>
          </form>
        )}
      </div>
    </Dialog>

    <LocationPermissionGuide
      isOpen={isGuideOpen}
      onClose={() => setIsGuideOpen(false)}
      onLocationDetected={onClose}
    />
  </>
);
};
