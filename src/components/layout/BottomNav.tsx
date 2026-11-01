import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  MoreHorizontal,
  X,
  ChevronRight,
  Smartphone,
  Layers,
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { PWAInstallModal } from '../common/PWAInstallModal';
import { isPWAInstallable, promptPWAInstall, isAppRunningStandalone } from '../../services/pwaService';
import { useToast } from '../../context/ToastContext';
import { mainNavItems, khazanahMenuItems } from '../../types/navigation';

export { mainNavItems, khazanahMenuItems };

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setCanInstall(isPWAInstallable());
    setIsStandalone(isAppRunningStandalone());
  }, [isDrawerOpen]);

  // Check if current page is within Khazanah / More section
  const isKhazanahActive = [
    '/doa',
    '/hadis',
    '/kalender',
    '/kiblat',
    '/tasbih',
    '/kartu-ucapan',
    '/galeri',
    '/podcast',
    '/pengaturan',
    '/khazanah',
    '/donasi',
    '/info-update',
  ].includes(location.pathname);

  // Close drawer when route changes
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

  const handleInstallClick = async () => {
    const installed = await promptPWAInstall();
    if (installed) {
      showToast({
        title: 'Aplikasi Terpasang',
        message: 'Ramadan Companion telah dipasang ke layar utama HP Anda.',
        type: 'success',
      });
      setCanInstall(false);
      setIsDrawerOpen(false);
    } else {
      setIsDrawerOpen(false);
      setIsInstallModalOpen(true);
    }
  };

  return (
    <>
      {/* Bottom Sheet Drawer for Khazanah Ramadan */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/75 animate-in fade-in duration-200">
          {/* Backdrop click area */}
          <div
            className="flex-1"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Tutup Menu Khazanah"
          />

          {/* Drawer Container */}
          <div className="w-full bg-surface-elevated/95-2xl border-t border-accent-500/30 rounded-t-xl p-5 space-y-4 max-h-[85vh] overflow-y-auto safe-area-bottom animate-in slide-in-from-bottom-5 duration-250">
            {/* Top Pull Bar & Header */}
            <div className="flex flex-col items-center">
              <span className="w-12 h-1.5 rounded-full bg-ink-700/80 mb-3" />
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent-600/20 text-accent-700 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-ink-100">
                      Khazanah Ramadan & Fitur Lengkap
                    </h3>
                    <p className="text-xs text-ink-400">
                      Pilih fitur penunjang ibadah yang ingin Anda buka
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="min-h-[40px] min-w-[40px] rounded-lg flex items-center justify-center text-ink-400 hover:text-ink-200 hover:bg-ink-800/60 active:scale-95 touch-manipulation cursor-pointer"
                  title="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {khazanahMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      navigate(item.path);
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all active:scale-[0.98] touch-manipulation cursor-pointer ${
                      isActive
                        ? 'bg-ink-800/40 border-accent-500/60 ring-1 ring-accent-500/30'
                        : 'bg-surface/70 border-ink-800/80 hover:border-ink-700 hover:bg-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-lg ${item.bgColor} ${item.borderColor} border flex items-center justify-center shrink-0`}
                      >
                        <Icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-ink-100 truncate">
                            {item.label}
                          </h4>
                          <span className="text-xs px-1.5 py-0.2 rounded-md bg-ink-800 text-ink-400 font-mono hidden sm:inline">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-ink-400 truncate mt-0.5">
                          {item.sublabel}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-ink-400 shrink-0 ml-2" />
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions: PWA Install & Full Khazanah Hub Link */}
            <div className="pt-2 border-t border-ink-800/80 space-y-2">
              {!isStandalone && (
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-accent-400 hover:bg-accent-500 text-on-accent text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 touch-manipulation cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Pasang Aplikasi ke Layar Utama (PWA)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  navigate('/khazanah');
                  setIsDrawerOpen(false);
                }}
                className="w-full min-h-[40px] px-3 py-2 rounded-lg text-center text-xs font-semibold text-accent-700 hover:text-accent-800 hover:bg-ink-800/20 active:scale-95 touch-manipulation cursor-pointer transition-colors"
              >
                Buka Halaman Ringkasan Khazanah →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Navigation Bar on Mobile */}
      <nav
        aria-label="Navigasi Utama Bawah"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-ink-800/80 px-2 py-2 safe-area-bottom"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* 4 Core Tabs */}
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                id={`nav-mobile-${item.id}`}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center min-h-[50px] min-w-[56px] px-2 py-1.5 rounded-xl transition-all duration-200 relative touch-manipulation cursor-pointer ${
                    isActive
                      ? 'text-accent-700 font-bold bg-ink-800/40 border border-accent-500/20 scale-105'
                      : 'text-ink-400 hover:text-ink-200 active:scale-95'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="relative">
                      <Icon className="w-5 h-5 mb-1 stroke-[2.2]" />
                      {isActive && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent-400" />
                      )}
                    </div>
                    <span className="text-xs tracking-tight font-medium leading-none">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}

          {/* 5th Tab: "Lainnya" (More Logo Titik Tiga) -> Opens Khazanah Ramadan Drawer */}
          <button
            type="button"
            id="nav-mobile-more"
            onClick={() => setIsDrawerOpen(true)}
            className={`flex flex-col items-center justify-center min-h-[50px] min-w-[56px] px-2 py-1.5 rounded-xl transition-all duration-200 relative touch-manipulation cursor-pointer ${
              isKhazanahActive || isDrawerOpen
                ? 'text-accent-700 font-bold bg-ink-800/40 border border-accent-500/20 scale-105'
                : 'text-ink-400 hover:text-ink-200 active:scale-95'
            }`}
            title="Khazanah Ramadan & Fitur Lengkap"
          >
            <div className="relative">
              <MoreHorizontal className="w-5 h-5 mb-1 stroke-[2.4]" />
              {(isKhazanahActive || isDrawerOpen) && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent-400" />
              )}
            </div>
            <span className="text-xs tracking-tight font-medium leading-none">
              Lainnya
            </span>
          </button>
        </div>
      </nav>

      {/* PWA Install Guide Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </>
  );
};
