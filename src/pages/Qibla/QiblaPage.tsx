import React, { useState, useEffect } from 'react';
import {
  Compass,
  MapPin,
  RotateCw,
  Navigation,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Info,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useAppSettings } from '../../context/AppSettingsContext';
import {
  calculateQiblaAngle,
  calculateDistanceToKaaba,
  getCardinalDirection,
  KAABA_COORDINATES,
} from '../../services/qiblaService';

export const QiblaPage: React.FC = () => {
  const { settings } = useAppSettings();

  // Coordinates from user settings (default Jakarta if unset)
  const lat = settings.location.latitude ?? -6.2088;
  const lon = settings.location.longitude ?? 106.8456;
  const cityName = settings.location.city || 'Jakarta';

  // Calculated Qibla Bearing and Distance
  const qiblaAngle = calculateQiblaAngle(lat, lon);
  const distanceKm = calculateDistanceToKaaba(lat, lon);
  const cardinal = getCardinalDirection(qiblaAngle);

  // Device Compass Heading (degrees from True North)
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [hasCompassSensor, setHasCompassSensor] = useState<boolean>(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [manualHeading, setManualHeading] = useState<number>(0);
  const [isManualMode, setIsManualMode] = useState<boolean>(false);

  // Effective Heading
  const currentHeading = isManualMode || !hasCompassSensor ? manualHeading : deviceHeading;

  // Relative rotation of compass dial: Dial rotates counter to device heading so North stays North
  const dialRotation = -currentHeading;
  // Ka'bah indicator angle on the dial
  const kaabaPositionOnDial = qiblaAngle;
  // Difference between current heading and Qibla angle
  const headingDiff = Math.abs(((currentHeading - qiblaAngle + 180 + 360) % 360) - 180);
  const isAligned = headingDiff <= 4;

  // Request Compass Permission (specifically for iOS Safari)
  const requestCompassPermission = async () => {
    if (
      typeof window !== 'undefined' &&
      typeof (DeviceOrientationEvent as any)?.requestPermission === 'function'
    ) {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
          setHasCompassSensor(true);
        }
      } catch (err) {
        console.warn('Compass permission rejected', err);
      }
    }
  };

  // Device Orientation Listener
  useEffect(() => {
    let hasReceivedEvent = false;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      // iOS webkitCompassHeading (0 to 360 from magnetic/true north)
      if ((e as any).webkitCompassHeading !== undefined && (e as any).webkitCompassHeading !== null) {
        hasReceivedEvent = true;
        setHasCompassSensor(true);
        setDeviceHeading(Math.round((e as any).webkitCompassHeading));
        return;
      }

      // Android absolute alpha
      if (e.alpha !== null && e.alpha !== undefined) {
        hasReceivedEvent = true;
        setHasCompassSensor(true);
        // On Android, alpha is counter-clockwise 0-360
        const heading = (360 - e.alpha) % 360;
        setDeviceHeading(Math.round(heading));
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    window.addEventListener('deviceorientationabsolute' as any, handleOrientation, true);

    // Check after 2 seconds if device orientation fired
    const timeout = setTimeout(() => {
      if (!hasReceivedEvent) {
        setHasCompassSensor(false);
      }
    }, 2000);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('deviceorientationabsolute' as any, handleOrientation);
      clearTimeout(timeout);
    };
  }, []);

  // Vibrate phone slightly when aligned
  useEffect(() => {
    if (isAligned && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([25]);
      } catch (_) {}
    }
  }, [isAligned]);

  return (
    <div className="space-y-6 pb-28 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl p-6 sm:p-8 bg-surface border border-accent-500/30">

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="emerald" dot>
              Arah Kiblat Digital 🧭
            </Badge>
            <Badge variant="blue">Presisi Trigonometri Bola Bumi</Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-ink-100 tracking-tight">
            Penunjuk Arah Kiblat & Ka'bah
          </h1>

          <p className="text-xs sm:text-sm text-ink-300 leading-relaxed max-w-2xl">
            Tentukan arah kiblat dengan akurat dari lokasi Anda ke Ka'bah di Masjidil Haram, Makkah Al-Mukarramah. Sangat praktis saat bepergian, mudik, atau berada di luar rumah.
          </p>

          <div className="pt-2 flex items-center gap-3 text-xs text-ink-400 flex-wrap">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink-900/60 border border-ink-800">
              <MapPin className="w-3.5 h-3.5 text-accent-700" />
              Lokasi: <strong className="text-ink-200">{cityName}</strong>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink-900/60 border border-ink-800">
              <Navigation className="w-3.5 h-3.5 text-accent-700" />
              Sudut: <strong className="text-ink-200">{qiblaAngle}° ({cardinal})</strong>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink-900/60 border border-ink-800">
              <Sparkles className="w-3.5 h-3.5 text-accent-700" />
              Jarak ke Makkah: <strong className="text-ink-200">{distanceKm.toLocaleString('id-ID')} km</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Permission Button for iOS if needed */}
      {!permissionGranted && typeof window !== 'undefined' && typeof (DeviceOrientationEvent as any)?.requestPermission === 'function' && (
        <Card className="p-4 bg-ink-800/40 border-accent-500/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-accent-700 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-ink-100">Izinkan Sensor Kompas iPhone</p>
              <p className="text-ink-400">Safari memerlukan izin sekali ketuk untuk membaca orientasi ponsel.</p>
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={requestCompassPermission}>
            Aktifkan Sensor
          </Button>
        </Card>
      )}

      {/* MAIN COMPASS INTERACTION */}
      <div className="flex flex-col items-center justify-center py-4">
        {/* Alignment Notification Banner */}
        <div className="mb-6 h-10 flex items-center justify-center">
          {isAligned ? (
            <div className="px-5 py-2 rounded-full bg-accent-500/20 border border-accent-400/60 text-accent-700 font-bold text-xs sm:text-sm flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-accent-700" />
              <span>ALHAMDULILLAH! TEPAT MENGHADAP KIBLAT ({qiblaAngle}°)</span>
            </div>
          ) : (
            <div className="px-4 py-1.5 rounded-full bg-ink-900/80 border border-ink-800 text-ink-400 text-xs flex items-center gap-2">
              <RotateCw className="w-3.5 h-3.5 text-accent-700 animate-spin-slow" />
              <span>
                Putar ponsel hingga jarum Ka'bah lurus ke atas (Selisih: {Math.round(headingDiff)}°)
              </span>
            </div>
          )}
        </div>

        {/* PHYSICAL COMPASS DIAL */}
        <div className="relative w-72 h-72 sm:w-84 sm:h-84 select-none">
          {/* Outer Glowing Ring */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-500 ${
              isAligned
                ? 'ring-8 ring-accent-500/40 bg-ink-800/20'
                : 'ring-4 ring-ink-800/80 bg-surface'
            }`}
          />

          {/* Compass Top Benchmark / Phone Pointer (Stays fixed at 12 o'clock) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 z-30 flex flex-col items-center">
            <div className="w-4 h-5 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-accent-400" />
            <span className="text-xs font-bold text-accent-700">DEPAN</span>
          </div>

          {/* ROTATING COMPASS BODY (Rotates opposite to phone heading) */}
          <div
            className="w-full h-full rounded-full relative transition-transform duration-200 ease-out"
            style={{ transform: `rotate(${dialRotation}deg)` }}
          >
            {/* Degree Marks */}
            <svg className="w-full h-full" viewBox="0 0 300 300">
              {/* Dial Border Circle */}
              <circle cx="150" cy="150" r="140" fill="none" stroke="#aebf9d" strokeWidth="2" strokeDasharray="4 6" opacity="0.6" />
              <circle cx="150" cy="150" r="126" fill="none" stroke="#d3e0c3" strokeWidth="1" />

              {/* Major Ticks every 30 degrees */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = i * 30;
                return (
                  <g key={angle} transform={`rotate(${angle} 150 150)`}>
                    <line x1="150" y1="12" x2="150" y2="22" stroke={angle % 90 === 0 ? '#2f3f27' : '#566a4a'} strokeWidth={angle % 90 === 0 ? '3' : '1.5'} />
                  </g>
                );
              })}
            </svg>

            {/* Cardinal Direction Points (N, E, S, W) on Dial */}
            <span className="absolute top-5 left-1/2 -translate-x-1/2 text-sm font-bold text-rose-500">
              U
            </span>
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-ink-400">
              T
            </span>
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs font-bold text-ink-400">
              S
            </span>
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xs font-bold text-ink-400">
              B
            </span>

            {/* KA'BAH BEARING ARROW & ICON (Positioned exactly at qiblaAngle on dial) */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-start pointer-events-none"
              style={{ transform: `rotate(${kaabaPositionOnDial}deg)` }}
            >
              {/* Ka'bah Pointer Arrow */}
              <div className="pt-2 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center p-1.5 transition-all duration-300 ${
                    isAligned
                      ? 'bg-accent-500 text-ink-50 scale-110'
                      : 'bg-accent-600/90 text-ink-50'
                  }`}
                  title={`Ka'bah (${qiblaAngle}°)`}
                >
                  {/* Stylized Ka'bah SVG Icon */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <rect x="3" y="5" width="18" height="14" rx="2" fill="#1d2a17" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="3" y1="8" x2="21" y2="8" stroke="#e3b23a" strokeWidth="2" />
                    <line x1="3" y1="12" x2="21" y2="12" stroke="#e3b23a" strokeWidth="0.8" strokeDasharray="1 2" />
                    <rect x="13" y="11" width="4" height="6" fill="#e3b23a" rx="0.5" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-accent-700 mt-0.5 bg-ink-950/80 px-1.5 py-0.5 rounded-md border border-accent-500/40">
                  KIBLAT
                </span>
                <div className="w-0.5 h-16 bg-accent-400" />
              </div>
            </div>

            {/* North Indicator Needle Center */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-ink-900 border-2 border-ink-700 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-ink-100">{Math.round(currentHeading)}°</span>
                <span className="text-xs text-ink-400">{getCardinalDirection(currentHeading)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status / Instructions text */}
        <div className="mt-8 text-center space-y-2 max-w-sm">
          <p className="text-xs text-ink-300">
            Arah Kiblat dari <strong>{cityName}</strong> berada pada sudut{' '}
            <strong className="text-accent-700">{qiblaAngle}°</strong> dari Utara sejati.
          </p>
          <p className="text-xs text-ink-400">
            Letakkan ponsel mendatar (horizontal) di atas telapak tangan atau permukaan datar agar sensor kompas bekerja optimal.
          </p>
        </div>

        {/* Fallback Manual Slider (Bermanfaat jika browser di Laptop / PC tidak ada sensor kompas) */}
        {(!hasCompassSensor || isManualMode) && (
          <Card className="mt-6 p-4 w-full max-w-md bg-surface-elevated/70 border-ink-700">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-ink-200 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-accent-700" />
                Kalibrasi Manual (Simulasi Putaran)
              </span>
              <Badge variant="slate" size="sm">
                Mode Laptop / Non-Sensor
              </Badge>
            </div>
            <p className="text-xs text-ink-400 mb-3">
              Geser penggeser ini untuk mensimulasikan arah hadap perangkat Anda (0° = Utara, 90° = Timur, 180° = Selatan, 270° = Barat).
            </p>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="360"
                value={manualHeading}
                onChange={(e) => {
                  setIsManualMode(true);
                  setManualHeading(parseInt(e.target.value, 10));
                }}
                className="w-full accent-accent-400 cursor-pointer"
              />
              <span className="w-12 text-right text-xs font-mono font-bold text-accent-700">
                {manualHeading}°
              </span>
            </div>
          </Card>
        )}
      </div>

      {/* Fiqih & Adab Menghadap Kiblat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <Card className="p-5 bg-surface-elevated/40 border-ink-800 space-y-2">
          <div className="flex items-center gap-2 text-accent-700 font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Dalil Wajib Menghadap Kiblat</span>
          </div>
          <p className="text-xs text-ink-300 leading-relaxed">
            Menghadap kiblat merupakan salah satu syarat sah sholat fardhu maupun sunnah, sebagaimana firman Allah SWT:
          </p>
          <p className="text-xs font-serif italic text-ink-400 border-l-2 border-accent-500/50 pl-3 my-1">
            "Maka hadapkanlah wajahmu ke arah Masjidil Haram. Dan di mana saja kamu berada, hadapkanlah wajahmu ke arah itu." (QS. Al-Baqarah: 144)
          </p>
        </Card>

        <Card className="p-5 bg-surface-elevated/40 border-ink-800 space-y-2">
          <div className="flex items-center gap-2 text-accent-700 font-bold text-xs">
            <Info className="w-4 h-4" />
            <span>Tips Ketepatan Kiblat Saat Safar</span>
          </div>
          <p className="text-xs text-ink-300 leading-relaxed">
            Bagi orang yang jauh dari Ka'bah (seperti di Indonesia), kewajiban menghadap kiblat adalah menghadap ke arahnya (*jihatul Ka'bah*), bukan melihat fisik Ka'bah secara persis mata. Toleransi beberapa derajat tetap sah menurut jumhur ulama.
          </p>
        </Card>
      </div>
    </div>
  );
};
