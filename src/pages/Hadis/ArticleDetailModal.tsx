import React from 'react';
import {
  BookOpen,
  Clock,
  ShieldCheck,
  Quote,
  X,
  FileText,
} from 'lucide-react';
import { Dialog } from '../../components/common/Dialog';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import type { EducationalArticle } from '../../types/hadis';

export interface ArticleDetailModalProps {
  article: EducationalArticle | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  isOpen,
  onClose,
}) => {
  if (!article) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={article.title}
      description={`Kajian Fiqih & Sunnah • Estimasi ${article.readTimeMinutes} menit baca`}
    >
      <div className="space-y-6 text-ink-200">
        {/* Top Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-ink-800">
          <Badge variant="emerald" size="sm">
            {article.category.replace('-', ' ').toUpperCase()}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-ink-400 bg-ink-900/60 px-2.5 py-1 rounded-lg border border-ink-800">
            <Clock className="w-3.5 h-3.5 text-accent-700" />
            <span>{article.readTimeMinutes} Menit Baca</span>
          </div>
        </div>

        {/* Lead Summary */}
        <div className="p-4 rounded-lg bg-ink-900/70 border border-ink-800 text-sm text-ink-300 leading-relaxed italic">
          "{article.summary}"
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {article.content.map((sec, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-base font-bold text-ink-100 flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-accent-500"></span>
                <span>{sec.sectionTitle}</span>
              </h3>

              <div className="text-sm text-ink-300 leading-relaxed whitespace-pre-line pl-3.5">
                {sec.body}
              </div>

              {sec.quotedText && (
                <div className="my-3 p-4 rounded-lg bg-surface-elevated/80 border border-accent-600/30 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-700">
                    <Quote className="w-3.5 h-3.5 text-accent-700" />
                    <span>Dalil Rujukan:</span>
                  </div>

                  {sec.quotedText.arabic && (
                    <p
                      dir="rtl"
                      lang="ar"
                      className="font-arabic text-accent-700 text-right text-lg leading-loose py-1"
                    >
                      {sec.quotedText.arabic}
                    </p>
                  )}

                  <p className="text-xs text-ink-200 leading-relaxed italic border-l-2 border-accent-500/40 pl-3">
                    "{sec.quotedText.translation}"
                  </p>

                  <div className="text-xs text-ink-400 text-right font-mono font-medium">
                    — {sec.quotedText.source}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Classical Sources List */}
        {article.sources && article.sources.length > 0 && (
          <div className="p-4 rounded-lg bg-ink-900/60 border border-ink-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-ink-300">
              <ShieldCheck className="w-4 h-4 text-accent-700" />
              <span>Daftar Referensi & Rujukan Ulama:</span>
            </div>
            <ul className="space-y-1 pl-6 list-disc text-xs text-ink-400">
              {article.sources.map((src, i) => (
                <li key={i}>{src}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Bottom Close Button */}
        <div className="pt-3 border-t border-ink-800 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Tutup Kajian
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
