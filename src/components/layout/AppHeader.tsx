import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, MapPin, Sparkles, BookMarked, CalendarDays, Camera, Radio } from 'lucide-react';
import { useAppSettings } from '../../context/AppSettingsContext';
import { Badge } from '../common/Badge';
import { AppLogo } from '../common/AppLogo';
import { LocationModal } from '../common/LocationModal';
import { getHijriDate } from '../../services/hijriService';

export const AppHeader: React.FC = () => {
  const { settings } = useAppSettings();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [hijriDate, setHijriDate] = useState<string>('');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const tz = settings.location.timezone || 'Asia/Jakarta';

      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setCurrentDate(
        now.toLocaleDateString('id-ID', {
          timeZone: tz,
          weekday: 'long',
          day: 'numeric',
          month: 'short',
        })
      );
      setHijriDate(getHijriDate(now, tz).formatted);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.location.timezone]);

  const secondaryNavs = [
    { label: 'Doa Harian', path: '/doa', icon: Sparkles },
    { label: 'Hadits', path: '/hadis', icon: BookMarked },
    { label: 'Kalender', path: '/kalender', icon: CalendarDays },
    { label: 'Galeri', path: '/galeri', icon: Camera },
    { label: 'Podcast', path: '/podcast', icon: Radio },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-ink-800/80 px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand / Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <AppLogo size={38} className=" transition-transform" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base md:text-lg tracking-tight text-ink-100 group-hover:text-accent-800 transition-colors">
                  Ramadan Companion
                </span>
                <Badge variant="violet" size="sm" className="hidden sm:inline-flex text-xs">
                  1448 H
                </Badge>
              </div>
              <p className="text-xs text-ink-400 hidden sm:block">
                Panduan & Pelacak Ibadah Terpercaya
              </p>
            </div>
          </Link>

          {/* Secondary Links for Desktop */}
          <nav className="hidden lg:flex items-center gap-1 bg-surface-elevated/40 p-1 rounded-lg border border-ink-800/60">
            {secondaryNavs.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-accent-400/20 text-accent-700'
                      : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Info: Time & Location */}
          <div className="flex items-center gap-3">
            {/* Quick Location Badge -> Opens LocationModal */}
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-lg bg-surface-elevated/70 border border-ink-700/60 hover:border-accent-500/50 text-xs text-ink-300 transition-all hover:bg-surface-elevated active:scale-95 touch-manipulation cursor-pointer group"
              title="Klik untuk memilih kota atau gunakan GPS"
            >
              <MapPin className="w-3.5 h-3.5 text-accent-700 transition-transform shrink-0" />
              <span className="font-medium max-w-[100px] sm:max-w-[130px] truncate text-ink-200">
                {settings.location.city}
              </span>
            </button>

            {/* Clock & Hijri Widget */}
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-ink-100 tabular-nums">
                {currentTime || '--:--:--'}
              </div>
              <div className="text-xs text-accent-700 font-medium">
                {hijriDate || currentDate || 'Memuat...'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </>
  );
};
