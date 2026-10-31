import React, { useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  BookOpen,
  ShieldCheck,
  Type,
  Lightbulb,
  Tag,
} from 'lucide-react';
import { Dialog } from '../../components/common/Dialog';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import type { HadisItem, HadisGrade } from '../../types/hadis';
import { copyHadisToClipboard } from '../../services/hadisService';
import { useToast } from '../../context/ToastContext';

export interface HadisDetailModalProps {
  hadis: HadisItem | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const HadisDetailModal: React.FC<HadisDetailModalProps> = ({
  hadis,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<number>(24);

  if (!hadis) return null;

  const handleCopy = async () => {
    const success = await copyHadisToClipboard(hadis);
    if (success) {
      setCopied(true);
      showToast({
        title: 'Hadits Berhasil Disalin',
        message: 'Teks Arab, sanad, terjemahan, dan rujukan kitab siap dibagikan.',
        type: 'success',
      });
      setTimeout(() => setCopied(false), 2500);
    } else {
      showToast({
        title: 'Gagal Menyalin',
        message: 'Silakan pilih dan salin teks hadits secara manual.',
        type: 'error',
      });
    }
  };

  const getGradeBadge = (grade: HadisGrade) => {
    switch (grade) {
      case "Muttafaq 'Alaih":
        return <Badge variant="gold" size="sm">Muttafaq 'Alaih (Bukhari & Muslim)</Badge>;
      case 'Shahih Bukhari':
        return <Badge variant="emerald" size="sm">Shahih Al-Bukhari</Badge>;
      case 'Shahih Muslim':
        return <Badge variant="emerald" size="sm">Shahih Muslim</Badge>;
      case 'Shahih':
        return <Badge variant="blue" size="sm">Derajat Shahih</Badge>;
      case 'Hasan':
        return <Badge variant="violet" size="sm">Derajat Hasan</Badge>;
      default:
        return <Badge variant="slate" size="sm">{grade}</Badge>;
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={hadis.title}
      description={`${hadis.bookName} • ${hadis.referenceNumber}`}
    >
      <div className="space-y-5 text-ink-200">
        {/* Top Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-ink-800">
          <div className="flex flex-wrap items-center gap-2">
            {getGradeBadge(hadis.grade)}
            <Badge variant="slate" size="sm">
              {hadis.topic.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>

          {/* Font Controls */}
          <div className="flex items-center gap-1.5 bg-ink-900/60 p-1 rounded-lg border border-ink-800">
            <span className="text-xs text-ink-400 px-1 font-medium flex items-center gap-1">
              <Type className="w-3 h-3 text-ink-400" /> Arab:
            </span>
            <button
              type="button"
              onClick={() => setFontSize((prev) => Math.max(18, prev - 2))}
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

        {/* Perawi Sahabat Header */}
        <div className="flex items-center gap-2 text-xs text-ink-300 bg-surface-elevated/40 px-3.5 py-2 rounded-lg border border-ink-800/70">
          <span className="text-ink-400">Diriwayatkan dari:</span>
          <span className="font-semibold text-accent-700">{hadis.narrator}</span>
        </div>

        {/* Matan Teks Arab */}
        <div className="p-5 rounded-xl bg-surface-elevated/60 border border-ink-700/60">
          <p
            dir="rtl"
            lang="ar"
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.9 }}
            className="font-arabic text-accent-700 text-right select-text"
          >
            {hadis.arabicText}
          </p>
        </div>

        {/* Terjemahan Bahasa Indonesia */}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-accent-700">
            Terjemahan Makna
          </div>
          <p className="text-sm text-ink-100 leading-relaxed select-text font-medium bg-ink-900/40 p-3.5 rounded-lg border border-ink-800">
            "{hadis.translation}"
          </p>
        </div>

        {/* Rujukan Kitab & Bab */}
        <div className="p-3.5 rounded-lg bg-ink-900/60 border border-ink-800 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-ink-300">
            <ShieldCheck className="w-4 h-4 text-accent-700 shrink-0" />
            <span>Takhrij & Rujukan Kitab:</span>
          </div>
          <p className="text-ink-200 font-mono text-xs pl-5">
            {hadis.bookName} ({hadis.referenceNumber})
          </p>
          {hadis.chapter && (
            <p className="text-ink-400 text-xs pl-5 italic">
              {hadis.chapter}
            </p>
          )}
        </div>

        {/* Faidah & Penjelasan (Cleanly Separated) */}
        {hadis.explanation && (
          <div className="p-4 rounded-lg bg-ink-800/20 border border-accent-800/40 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 font-semibold text-accent-700">
              <Lightbulb className="w-4 h-4 text-accent-700 shrink-0" />
              <span>Faidah & Hikmah Hadits:</span>
            </div>
            <p className="text-ink-300 text-xs leading-relaxed pl-6 border-l-2 border-accent-500/30">
              {hadis.explanation}
            </p>
          </div>
        )}

        {/* Tags */}
        {hadis.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <Tag className="w-3.5 h-3.5 text-ink-400 shrink-0 mr-1" />
            {hadis.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-0.5 rounded-full bg-ink-800/80 text-ink-300 border border-ink-700/50"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-ink-800/80">
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
            onClick={() => onToggleFavorite(hadis.id)}
          >
            {isFavorite ? 'Tersimpan di Favorit' : 'Tambah Favorit'}
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
            {copied ? 'Tersalin' : 'Salin Hadits Lengkap'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
