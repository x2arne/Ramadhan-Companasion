import React, { useState } from 'react';
import {
  Smartphone,
  Apple,
  Monitor,
  CheckCircle2,
  ExternalLink,
  Share2,
  MoreVertical,
  PlusSquare,
  Sparkles,
} from 'lucide-react';
import { Dialog } from './Dialog';
import { Badge } from './Badge';
import { Button } from './Button';

export interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>('android');

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Pasang Ramadan Companion"
      description="Panduan pasang aplikasi ke layar utama HP (PWA) tanpa unduh dari Play Store."
      className="max-w-md"
    >
      <div className="p-6 pt-2 space-y-5">
        {/* Device Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-surface-elevated/80 p-1 rounded-lg border border-ink-700/60">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'android'
                ? 'bg-accent-400 text-ink-50 font-semibold'
                : 'text-ink-400 hover:text-ink-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Android
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ios'
                ? 'bg-accent-400 text-ink-50 font-semibold'
                : 'text-ink-400 hover:text-ink-200'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            iPhone / iOS
          </button>

          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'desktop'
                ? 'bg-accent-400 text-ink-50 font-semibold'
                : 'text-ink-400 hover:text-ink-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            PC / Laptop
          </button>
        </div>

        {/* Tab Content: Android */}
        {activeTab === 'android' && (
          <div className="space-y-3.5 text-xs text-ink-300">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-ink-900/60 border border-ink-800">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-600/30 text-accent-700 font-bold shrink-0 text-xs">
                1
              </span>
              <div>
                <p className="font-semibold text-ink-100 flex items-center gap-1.5">
                  Buka Menu Peramban
                  <MoreVertical className="w-3.5 h-3.5 text-accent-700" />
                </p>
                <p className="text-ink-400 mt-0.5">
                  Ketuk ikon titik tiga (<strong>⋮</strong>) di pojok kanan atas browser Google Chrome / Brave / Edge Anda.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-ink-900/60 border border-ink-800">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-600/30 text-accent-700 font-bold shrink-0 text-xs">
                2
              </span>
              <div>
                <p className="font-semibold text-ink-100">
                  Pilih "Instal Aplikasi" / "Tambahkan ke Layar Utama"
                </p>
                <p className="text-ink-400 mt-0.5">
                  Cari opsi bertuliskan <strong>"Instal aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong> (Add to Home screen).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-ink-900/60 border border-ink-800">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-600/30 text-accent-700 font-bold shrink-0 text-xs">
                3
              </span>
              <div>
                <p className="font-semibold text-ink-100 flex items-center gap-1.5">
                  Konfirmasi & Selesai
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent-700" />
                </p>
                <p className="text-ink-400 mt-0.5">
                  Ketuk <strong>Instal</strong>. Ikon Ramadan Companion akan muncul di layar beranda ponsel Anda dan dapat dibuka tanpa bar URL!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: iOS */}
        {activeTab === 'ios' && (
          <div className="space-y-3.5 text-xs text-ink-300">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-ink-900/60 border border-ink-800">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-600/30 text-accent-700 font-bold shrink-0 text-xs">
                1
              </span>
              <div>
                <p className="font-semibold text-ink-100 flex items-center gap-1.5">
                  Buka di Safari & Ketuk Tombol Share
                  <Share2 className="w-3.5 h-3.5 text-accent-700" />
                </p>
                <p className="text-ink-400 mt-0.5">
                  Pastikan website dibuka di browser <strong>Safari</strong> bawaan iPhone, lalu ketuk tombol <strong>Bagikan (Share)</strong> di bar bawah layar.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-ink-900/60 border border-ink-800">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-600/30 text-accent-700 font-bold shrink-0 text-xs">
                2
              </span>
              <div>
                <p className="font-semibold text-ink-100 flex items-center gap-1.5">
                  Pilih "Tambahkan ke Layar Utama"
                  <PlusSquare className="w-3.5 h-3.5 text-accent-700" />
                </p>
                <p className="text-ink-400 mt-0.5">
                  Gulir ke bawah pada menu opsi lembar tindakan, lalu pilih <strong>"Tambahkan ke Layar Utama"</strong> (Add to Home Screen).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-ink-900/60 border border-ink-800">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-600/30 text-accent-700 font-bold shrink-0 text-xs">
                3
              </span>
              <div>
                <p className="font-semibold text-ink-100 flex items-center gap-1.5">
                  Ketuk "Tambah"
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent-700" />
                </p>
                <p className="text-ink-400 mt-0.5">
                  Ketuk <strong>Tambah</strong> di pojok kanan atas. Aplikasi siap digunakan seperti aplikasi iOS dari App Store.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Desktop */}
        {activeTab === 'desktop' && (
          <div className="space-y-3.5 text-xs text-ink-300">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-ink-900/60 border border-ink-800">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-600/30 text-accent-700 font-bold shrink-0 text-xs">
                1
              </span>
              <div>
                <p className="font-semibold text-ink-100">
                  Periksa Bilah Alamat (Address Bar)
                </p>
                <p className="text-ink-400 mt-0.5">
                  Di Google Chrome atau Microsoft Edge, perhatikan sisi kanan address bar (sebelah ikon bintang bookmark).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-ink-900/60 border border-ink-800">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-600/30 text-accent-700 font-bold shrink-0 text-xs">
                2
              </span>
              <div>
                <p className="font-semibold text-ink-100 flex items-center gap-1.5">
                  Klik Ikon "Install" / Pasang
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent-700" />
                </p>
                <p className="text-ink-400 mt-0.5">
                  Klik ikon monitor kecil atau tombol <strong>"Install Ramadan Companion"</strong> untuk memasang aplikasi ke desktop Windows/Mac.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Informational Callout */}
        <div className="p-3.5 rounded-lg bg-ink-800/30 border border-accent-800/40 text-xs text-accent-700 leading-relaxed flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-accent-700 shrink-0 mt-0.5" />
          <p>
            <strong>Mengapa lewat menu peramban?</strong> Sistem keamanan browser mewajibkan protokol <strong>HTTPS resmi</strong> untuk memicu dialog otomatis satu klik. Begitu web dideploy ke hosting ber-SSL (seperti <em>Vercel</em>), pop-up instalasi akan langsung aktif otomatis!
          </p>
        </div>

        {/* Footer Button */}
        <div className="flex justify-end pt-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Mengerti & Tutup
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

