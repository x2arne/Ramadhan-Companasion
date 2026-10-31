import React, { useState, useEffect } from 'react';
import {
  Moon,
  ShieldAlert,
  AlertCircle,
  Clock,
  CheckCircle2,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { Dialog } from '../../components/common/Dialog';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  FastingRecord,
  FastingStatus,
  FastingReason,
} from '../../types/ibadah';
import { FASTING_REASONS_CONFIG } from '../../services/ibadahService';

export interface FastingModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string;
  dayDisplay: string;
  currentFasting?: FastingRecord;
  onSave: (fasting: FastingRecord) => void;
}

export const FastingModal: React.FC<FastingModalProps> = ({
  isOpen,
  onClose,
  dateStr,
  dayDisplay,
  currentFasting,
  onSave,
}) => {
  const [status, setStatus] = useState<FastingStatus>('puasa');
  const [reason, setReason] = useState<FastingReason>('sakit');
  const [reasonNote, setReasonNote] = useState<string>('');

  useEffect(() => {
    if (currentFasting) {
      setStatus(currentFasting.status);
      setReason(currentFasting.reason || 'sakit');
      setReasonNote(currentFasting.reasonNote || '');
    } else {
      setStatus('puasa');
      setReason('sakit');
      setReasonNote('');
    }
  }, [currentFasting, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const obligationType =
      status === 'tidak_puasa'
        ? FASTING_REASONS_CONFIG[reason]?.obligationType || 'qadha'
        : 'tidak_ada';

    onSave({
      status,
      reason: status === 'tidak_puasa' ? reason : undefined,
      reasonNote: status === 'tidak_puasa' && reasonNote.trim() ? reasonNote.trim() : undefined,
      obligationType,
    });

    onClose();
  };

  const selectedReasonMeta = FASTING_REASONS_CONFIG[reason];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Catat Status Puasa Harian"
      description={`${dayDisplay} (${dateStr})`}
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-ink-200">
        {/* Status Puasa Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-ink-300 block">
            Apakah Anda berpuasa hari ini?
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Pilihan 1: Berpuasa */}
            <button
              type="button"
              onClick={() => setStatus('puasa')}
              className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                status === 'puasa'
                  ? 'bg-ink-800/40 border-accent-500/80 ring-1 ring-accent-500'
                  : 'bg-surface-elevated/40 border-ink-800 hover:border-ink-700 text-ink-400'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Moon
                  className={`w-4 h-4 ${
                    status === 'puasa' ? 'text-accent-700' : 'text-ink-400'
                  }`}
                />
                {status === 'puasa' && (
                  <CheckCircle2 className="w-4 h-4 text-accent-700" />
                )}
              </div>
              <div className="mt-2">
                <span
                  className={`text-xs font-bold block ${
                    status === 'puasa' ? 'text-accent-700' : 'text-ink-300'
                  }`}
                >
                  Berpuasa Penuh
                </span>
                <span className="text-xs text-ink-400 block mt-0.5">
                  Alhamdulillah tuntas
                </span>
              </div>
            </button>

            {/* Pilihan 2: Tidak Berpuasa (Udzur) */}
            <button
              type="button"
              onClick={() => setStatus('tidak_puasa')}
              className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                status === 'tidak_puasa'
                  ? 'bg-ink-800/40 border-accent-500/80 ring-1 ring-accent-500'
                  : 'bg-surface-elevated/40 border-ink-800 hover:border-ink-700 text-ink-400'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <ShieldAlert
                  className={`w-4 h-4 ${
                    status === 'tidak_puasa' ? 'text-accent-700' : 'text-ink-400'
                  }`}
                />
                {status === 'tidak_puasa' && (
                  <CheckCircle2 className="w-4 h-4 text-accent-700" />
                )}
              </div>
              <div className="mt-2">
                <span
                  className={`text-xs font-bold block ${
                    status === 'tidak_puasa' ? 'text-accent-700' : 'text-ink-300'
                  }`}
                >
                  Tidak Berpuasa
                </span>
                <span className="text-xs text-ink-400 block mt-0.5">
                  Ada udzur syar'i
                </span>
              </div>
            </button>

            {/* Pilihan 3: Puasa Setengah Hari */}
            <button
              type="button"
              onClick={() => setStatus('setengah_hari')}
              className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                status === 'setengah_hari'
                  ? 'bg-ink-800/40 border-accent-500/80 ring-1 ring-accent-500'
                  : 'bg-surface-elevated/40 border-ink-800 hover:border-ink-700 text-ink-400'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Clock
                  className={`w-4 h-4 ${
                    status === 'setengah_hari' ? 'text-accent-700' : 'text-ink-400'
                  }`}
                />
                {status === 'setengah_hari' && (
                  <CheckCircle2 className="w-4 h-4 text-accent-700" />
                )}
              </div>
              <div className="mt-2">
                <span
                  className={`text-xs font-bold block ${
                    status === 'setengah_hari' ? 'text-accent-700' : 'text-ink-300'
                  }`}
                >
                  Setengah Hari
                </span>
                <span className="text-xs text-ink-400 block mt-0.5">
                  Latihan / Kondisi khusus
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Section Detail Alasan Jika "Tidak Berpuasa" */}
        {status === 'tidak_puasa' && (
          <div className="space-y-4 p-4 rounded-xl bg-ink-900/70 border border-accent-600/30 animate-fadeIn">
            <div>
              <label className="text-xs font-semibold text-accent-700 flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-4 h-4 text-accent-700" />
                <span>Pilih Alasan / Udzur Syar'i:</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(
                  Object.keys(FASTING_REASONS_CONFIG) as FastingReason[]
                ).map((rKey) => {
                  const cfg = FASTING_REASONS_CONFIG[rKey];
                  const isChecked = reason === rKey;

                  return (
                    <button
                      key={rKey}
                      type="button"
                      onClick={() => setReason(rKey)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        isChecked
                          ? 'bg-accent-500/20 border-accent-500/80 text-accent-700 ring-1 ring-accent-500'
                          : 'bg-surface-elevated/50 border-ink-800 hover:bg-ink-800/60 text-ink-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>{cfg.label}</span>
                        <Badge
                          variant={
                            cfg.obligationType === 'fidyah' ? 'blue' : 'gold'
                          }
                          size="sm"
                          className="text-xs scale-90"
                        >
                          {cfg.obligation}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fiqih Ruling Explanation Box */}
            {selectedReasonMeta && (
              <div className="p-3 rounded-lg bg-ink-950/60 border border-ink-800 space-y-1.5 text-xs text-ink-300">
                <div className="flex items-center gap-1.5 font-semibold text-accent-700 text-xs">
                  <BookOpen className="w-3.5 h-3.5 text-accent-700" />
                  <span>Kaidah Fiqih & Dalil:</span>
                </div>
                <p className="text-xs text-ink-300 leading-relaxed">
                  {selectedReasonMeta.description}
                </p>
                <p className="text-xs text-ink-400 font-mono italic pl-2 border-l border-accent-500/40">
                  {selectedReasonMeta.dalilSummary}
                </p>
              </div>
            )}

            {/* Custom Notes */}
            <div className="space-y-1.5">
              <label
                htmlFor="reason-note-input"
                className="text-xs font-medium text-ink-300"
              >
                Catatan Tambahan Alasan (Opsional):
              </label>
              <input
                id="reason-note-input"
                type="text"
                value={reasonNote}
                onChange={(e) => setReasonNote(e.target.value)}
                placeholder="Contoh: Demam flu dan resep dokter, perjalanan mudik..."
                className="w-full bg-surface-elevated/70 border border-ink-700/60 rounded-lg px-3.5 py-2 text-xs text-ink-100 placeholder-ink-400 focus:outline-none focus:border-accent-500"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-ink-800">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Simpan Status Puasa
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
