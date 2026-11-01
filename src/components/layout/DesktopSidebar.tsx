import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Clock,
  BookOpen,
  Sparkles,
  Settings,
  BookMarked,
  CalendarDays,
  ShieldCheck,
  ChevronRight,
  Camera,
  Radio,
  Compass,
  Disc,
  Palette, Heart, Megaphone } from 'lucide-react';
import { mainNavItems } from '../../types/navigation';
import { useAppSettings } from '../../context/AppSettingsContext';
import { Badge } from '../common/Badge';

export const DesktopSidebar: React.FC = () => {
  const { settings } = useAppSettings();

  const primaryItems = [
    ...mainNavItems,
    { id: 'pengaturan', label: 'Pengaturan', path: '/pengaturan', icon: Settings },
  ];

  const secondaryItems = [
    { id: 'khazanah', label: 'Ringkasan Khazanah', path: '/khazanah', icon: Sparkles },
    { id: 'doa', label: 'Doa Harian', path: '/doa', icon: Sparkles },
    { id: 'hadis', label: 'Hadits Pilihan', path: '/hadis', icon: BookMarked },
    { id: 'kalender', label: 'Kalender Hijriah', path: '/kalender', icon: CalendarDays },
    { id: 'kiblat', label: 'Arah Kiblat', path: '/kiblat', icon: Compass },
    { id: 'tasbih', label: 'Tasbih Digital', path: '/tasbih', icon: Disc },
    { id: 'kartu-ucapan', label: 'Kartu Ucapan', path: '/kartu-ucapan', icon: Palette },
    { id: 'galeri', label: 'Galeri Kenangan', path: '/galeri', icon: Camera },
    { id: 'podcast', label: 'Podcast Islami', path: '/podcast', icon: Radio },
    { id: 'info-update', label: 'Info Update', path: '/info-update', icon: Megaphone },
    { id: 'donasi', label: 'Dukung Developer', path: '/donasi', icon: Heart },
  ];

  return (
    <aside
      aria-label="Navigasi Desktop Sidebar"
      className="hidden md:flex flex-col w-64 shrink-0 glass-panel border-r border-ink-800/80 min-h-[calc(100vh-65px)] sticky top-[65px] p-4"
    >
      {/* Main Section */}
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-ink-400 ">
          Menu Utama
        </div>
        {primaryItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              id={`nav-desktop-${item.id}`}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-accent-400/15 text-accent-700 border border-accent-500/30'
                    : 'text-ink-300 hover:text-ink-50 hover:bg-ink-800/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-accent-700' : 'text-ink-400 group-hover:text-ink-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-accent-700" />}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Secondary Section */}
      <div className="mt-6 pt-4 border-t border-ink-800/80 space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-ink-400 ">
          Khazanah Ramadan
        </div>
        {secondaryItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              id={`nav-desktop-${item.id}`}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-accent-500/15 text-accent-700 border border-accent-500/25'
                    : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800/40'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-ink-400" />
                <span>{item.label}</span>
              </div>
            </NavLink>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="mt-auto pt-4 border-t border-ink-800/80 space-y-3">
        <div className="p-3 rounded-lg bg-surface-elevated/40 border border-ink-700/40 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-400">Metode Hitung:</span>
            <Badge variant="blue" size="sm" className="text-xs">
              {settings.prayerMethod}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-400">Lokasi:</span>
            <span className="text-ink-200 font-medium truncate max-w-[100px]">
              {settings.location.city}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between px-1 text-xs text-ink-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-700" />
            <span>Bisa dipakai offline</span>
          </span>
          <span>v1.0.0</span>
        </div>
      </div>
    </aside>
  );
};
