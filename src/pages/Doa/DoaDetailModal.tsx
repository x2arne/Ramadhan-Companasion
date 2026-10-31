import React, { useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  BookOpen,
  Share2,
  ShieldCheck,
  Type,
  X,
} from 'lucide-react';
import { Dialog } from '../../components/common/Dialog';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { DoaItem } from '../../types/doa';
import { copyDoaToClipboard } from '../../services/doaService';
import { useToast } from '../../context/ToastContext';

export interface DoaDetailModalProps {
  doa: DoaItem | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const DoaDetailModal: React.FC<DoaDetailModalProps> = ({
  doa,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<number>(26); // Default Arabic font size

  if (!doa) return null;

  const handleCopy = async () => {
    const success = await copyDoaToClipboard(doa);
    if (success) {
      setCopied(true);
      showToast({
        title: 'Teks Doa Disalin',
        message: 'Teks Arab, transliterasi, arti, dan sumber rujukan siap dibagikan.',
        type: 'success',
      });
      setTimeout(() => setCopied(false), 2500);
    } else {
      showToast({
        title: 'Gagal Menyalin',
        message: 'Silakan pilih dan salin teks secara manual.',
        type: 'error',
      });
    }
  };

  const getAuthenticityBadge = (auth: DoaItem['authenticity']) => {
    switch (auth) {
      case 'Shahih':
        return <Badge variant="emerald" size="sm">Hadits Shahih</Badge>;
      case 'Hasan':
        return <Badge variant="blue" size="sm">Hadits Hasan</Badge>;
      case "Ayat Al-Qur'an":
        return <Badge variant="gold" size="sm">Kalamullah (Al-Qur'an)</Badge>;
      default:
        return <Badge variant="violet" size="sm">Doa Ma'tsur Ulama</Badge>;
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={doa.title}
      description={doa.arabicTitle}
    >
      <div className="space-y-5 text-ink-200">
        {/* Top Badges & Font Control Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-ink-800">
          <div className="flex items-center gap-2">
            {getAuthenticityBadge(doa.authenticity)}
            <Badge variant="slate" size="sm">
              {doa.category.toUpperCase()}
            </Badge>
          </div>

          {/* Font Resizer */}
          <div className="flex items-center gap-1.5 bg-ink-900/60 p-1 rounded-lg border border-ink-800">
            <span className="text-xs text-ink-400 px-1 font-medium flex items-center gap-1">
              <Type className="w-3 h-3 text-ink-400" /> Arab:
            </span>
            <button
              type="button"
              onClick={() => setFontSize((prev) => Math.max(20, prev - 2))}
              className="w-6 h-6 rounded-lg bg-ink-800/80 hover:bg-ink-700 text-xs text-ink-200 flex items-center justify-center font-bold"
              title="Perkecil Font Arab"
            >
              -
            </button>
            <span className="text-xs font-mono text-ink-300 w-5 text-center">
              {fontSize}
            </span>
            <button
              type="button"
              onClick={() => setFontSize((prev) => Math.min(36, prev + 2))}
              className="w-6 h-6 rounded-lg bg-ink-800/80 hover:bg-ink-700 text-xs text-ink-200 flex items-center justify-center font-bold"
              title="Perbesar Font Arab"
            >
              +
            </button>
          </div>
        </div>

        {/* Teks Arab */}
        <div className="p-5 rounded-xl bg-surface-elevated/50 border border-ink-700/60 space-y-2">
          <p
            dir="rtl"
            lang="ar"
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
            className="font-arabic text-accent-700 text-right select-text"
          >
            {doa.arabicText}
          </p>
        </div>

        {/* Transliterasi Huruf Latin */}
        <div className="space-y-1">
          <div className="text-xs font-semibold text-ink-400">
            Transliterasi Latin
          </div>
          <p className="text-sm text-ink-300 italic leading-relaxed select-text font-serif">
            "{doa.transliteration}"
          </p>
        </div>

        {/* Terjemahan Bahasa Indonesia */}
        <div className="space-y-1">
          <div className="text-xs font-semibold text-accent-700">
            Arti Bahasa Indonesia
          </div>
          <p className="text-sm text-ink-100 leading-relaxed select-text font-medium">
            "{doa.translation}"
          </p>
        </div>

        {/* Rujukan Sumber Sanad & Konteks */}
        <div className="p-3.5 rounded-xl bg-ink-900/60 border border-ink-800/80 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-ink-300">
            <ShieldCheck className="w-4 h-4 text-accent-700 shrink-0" />
            <span>Rujukan & Sanad:</span>
            <span className="text-ink-100 font-mono text-xs">{doa.source}</span>
          </div>

          {doa.context && (
            <p className="text-ink-400 text-xs leading-relaxed pl-5 border-l-2 border-accent-500/30">
              {doa.context}
            </p>
          )}
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Button
            variant={isFavorite ? 'primary' : 'outline'}
            size="sm"
            leftIcon={
              isFavorite ? (
                <BookmarkCheck className="w-4 h-4 text-ink-50" />
              ) : (
                <Bookmark className="w-4 h-4 text-ink-400" />
              )
            }
            onClick={() => onToggleFavorite(doa.id)}
          >
            {isFavorite ? 'Tersimpan di Favorit' : 'Tambah ke Favorit'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={
              copied ? (
                <Check className="w-4 h-4 text-accent-700" />
              ) : (
                <Copy className="w-4 h-4 text-accent-700" />
              )
            }
            onClick={handleCopy}
          >
            {copied ? 'Tersalin' : 'Salin Doa Lengkap'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
