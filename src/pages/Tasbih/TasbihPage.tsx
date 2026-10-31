import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Smartphone,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Plus,
  Undo2,
  Award,
  Layers,
  Heart,
  Settings2,
} from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

interface DzikirPreset {
  id: string;
  arabic: string;
  latin: string;
  translation: string;
  defaultTarget: number;
  fadhilah: string;
}

const DZIKIR_PRESETS: DzikirPreset[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    latin: 'Subhanallah',
    translation: 'Maha Suci Allah',
    defaultTarget: 33,
    fadhilah: 'Dzikir utama ba\'da sholat fardhu, menghapus dosa dan menenteramkan hati.',
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    latin: 'Alhamdulillah',
    translation: 'Segala puji bagi Allah',
    defaultTarget: 33,
    fadhilah: 'Ucapan syukur atas segala nikmat iman, Islam, dan kesehatan.',
  },
  {
    id: 'allahuakbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    latin: 'Allahu Akbar',
    translation: 'Allah Maha Besar',
    defaultTarget: 33,
    fadhilah: 'Mengagungkan kebesaran Allah di atas segala urusan duniawi.',
  },
  {
    id: 'tahlil',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ',
    latin: 'Laa Ilaha Illallah',
    translation: 'Tiada Tuhan selain Allah',
    defaultTarget: 100,
    fadhilah: 'Kalimat tauhid paling utama dan kunci keselamatan di yaumil akhir.',
  },
  {
    id: 'istighfar',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ',
    latin: "Astaghfirullahal 'Adzim",
    translation: 'Aku memohon ampun kepada Allah Yang Maha Agung',
    defaultTarget: 100,
    fadhilah: 'Membuka pintu rezeki, menolak bala, dan membersihkan hati dari noda dosa.',
  },
  {
    id: 'shalawat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ',
    latin: "Allahumma Sholli 'ala Sayyidina Muhammad",
    translation: 'Ya Allah, limpahkanlah rahmat kepada junjungan kami Nabi Muhammad',
    defaultTarget: 100,
    fadhilah: 'Mendapat syafaat di hari kiamat dan sepuluh kebaikan dari setiap satu shalawat.',
  },
  {
    id: 'hauqalah',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    latin: 'Laa Haula wa Laa Quwwata illa Billah',
    translation: 'Tiada daya dan kekuatan kecuali dengan pertolongan Allah',
    defaultTarget: 33,
    fadhilah: 'Simpanan perbendaharaan surga dan penawar rasa cemas maupun keputusasaan.',
  },
  {
    id: 'custom',
    arabic: 'ذِكْرٌ حُرٌّ',
    latin: 'Dzikir Bebas / Target Kustom',
    translation: 'Dzikir pilihan Anda tanpa batasan',
    defaultTarget: 100,
    fadhilah: 'Hitung dzikir atau wirid pribadi Anda sesuai target yang diinginkan.',
  },
];

const TASBIH_STATS_KEY = 'ramadan_tasbih_stats_v1';

export const TasbihPage: React.FC = () => {
  const { showToast } = useToast();

  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [target, setTarget] = useState<number>(33);
  const [isAutoCycle, setIsAutoCycle] = useState<boolean>(true); // Auto transition: Subhanallah -> Alhamdulillah -> Allahu Akbar
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [roundCompleted, setRoundCompleted] = useState<number>(0);

  // Total Lifetime Dzikir
  const [totalLifetimeDzikir, setTotalLifetimeDzikir] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(TASBIH_STATS_KEY);
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const currentPreset = DZIKIR_PRESETS[activePresetIndex];

  // Sync target when preset changes
  useEffect(() => {
    setCount(0);
    setTarget(currentPreset.defaultTarget);
  }, [activePresetIndex]);

  // Persist lifetime stats
  useEffect(() => {
    try {
      localStorage.setItem(TASBIH_STATS_KEY, totalLifetimeDzikir.toString());
    } catch (e) {
      console.warn('Failed to save tasbih stats', e);
    }
  }, [totalLifetimeDzikir]);

  // Play synthesized crisp audio bead click via Web Audio API
  const playClickSound = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (_) {}
  };

  // Play target reached chime
  const playTargetChime = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.2, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.35);
      });
    } catch (_) {}
  };

  // Vibrate phone
  const triggerVibrate = (pattern: number[]) => {
    if (!vibrationEnabled || typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
    try {
      navigator.vibrate(pattern);
    } catch (_) {}
  };

  // Increment counter
  const handleCountIncrement = () => {
    const nextCount = count + 1;
    setCount(nextCount);
    setTotalLifetimeDzikir((prev) => prev + 1);

    playClickSound();
    triggerVibrate([15]);

    // Reached Target
    if (nextCount === target) {
      setRoundCompleted((prev) => prev + 1);
      playTargetChime();
      triggerVibrate([40, 80, 40]);

      showToast({
        title: `Target ${currentPreset.latin} Tercapai! ✨`,
        message: `Alhamdulillah telah menyelesaikan ${target}x hitungan.`,
        type: 'success',
        duration: 3000,
      });

      // Auto cycle ba'da sholat (Subhanallah 33 -> Alhamdulillah 33 -> Allahu Akbar 33)
      if (isAutoCycle) {
        if (activePresetIndex === 0) {
          // Switch to Alhamdulillah
          setTimeout(() => setActivePresetIndex(1), 600);
        } else if (activePresetIndex === 1) {
          // Switch to Allahu Akbar
          setTimeout(() => setActivePresetIndex(2), 600);
        } else if (activePresetIndex === 2) {
          // Switch to Tahlil
          setTimeout(() => setActivePresetIndex(3), 600);
        }
      }
    }
  };

  // Undo one count
  const handleUndo = () => {
    if (count > 0) {
      setCount((prev) => prev - 1);
      setTotalLifetimeDzikir((prev) => Math.max(0, prev - 1));
      triggerVibrate([10]);
    }
  };

  // Reset count
  const handleReset = () => {
    setCount(0);
    triggerVibrate([20, 50, 20]);
    showToast({
      title: 'Tasbih Direset',
      message: 'Hitungan kembali ke 0.',
      type: 'info',
    });
  };

  // Percentage calculation
  const percentage = Math.min(100, Math.round((count / target) * 100));
  const strokeDashoffset = 283 - (283 * percentage) / 100;

  return (
    <div className="space-y-6 pb-28 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl p-6 sm:p-8 bg-surface border border-accent-500/30">

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="violet" dot>
              Tasbih Digital & Dzikir Interaktif 📿
            </Badge>
            <Badge variant="emerald">Haptic Vibration & Web Audio</Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-ink-100 tracking-tight">
            Tasbih & Penghitung Wirid Ramadan
          </h1>

          <p className="text-xs sm:text-sm text-ink-300 leading-relaxed max-w-2xl">
            Basahi lisan dengan dzikirullah di sela-sela ibadah puasa, menanti berbuka, sahur, maupun seusai sholat fardhu dengan tasbih sentuh bergetar yang nyaman di jempol.
          </p>

          <div className="pt-2 flex items-center gap-3 text-xs text-ink-400 flex-wrap">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink-900/60 border border-ink-800">
              <Award className="w-3.5 h-3.5 text-accent-700" />
              Total Dzikir: <strong className="text-ink-100">{totalLifetimeDzikir.toLocaleString('id-ID')}x</strong>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink-900/60 border border-ink-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-700" />
              Putaran Selesai: <strong className="text-ink-100">{roundCompleted} putaran</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Dzikir Preset Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-ink-400 block">
          Pilih Bacaan Dzikir
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {DZIKIR_PRESETS.map((preset, idx) => (
            <button
              key={preset.id}
              onClick={() => setActivePresetIndex(idx)}
              className={`shrink-0 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border ${
                activePresetIndex === idx
                  ? 'bg-accent-400 text-ink-50 font-semibold border-accent-400 '
                  : 'bg-surface-elevated/70 text-ink-300 border-ink-700/80 hover:bg-ink-700/60'
              }`}
            >
              {preset.latin} ({preset.defaultTarget}x)
            </button>
          ))}
        </div>
      </div>

      {/* MAIN TASBIH DISPLAY & TOUCH COUNTER */}
      <div className="relative flex flex-col items-center justify-center p-6 sm:p-10 rounded-xl bg-surface border border-ink-700/80 overflow-hidden">
        {/* Ambient Glow */}

        {/* Current Dzikir Card Presentation */}
        <div className="text-center space-y-2 max-w-md z-10 mb-8">
          <p className="text-3xl sm:text-4xl font-amiri font-bold text-accent-700 drop-shadow-sm leading-relaxed" dir="rtl">
            {currentPreset.arabic}
          </p>
          <h2 className="text-lg sm:text-xl font-bold text-ink-100">
            {currentPreset.latin}
          </h2>
          <p className="text-xs text-ink-400 italic">
            "{currentPreset.translation}"
          </p>
        </div>

        {/* CIRCULAR TASBIH TAP BUTTON */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 select-none z-10 flex items-center justify-center">
          {/* SVG Animated Circular Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
            {/* Background track circle */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="#d3e0c3" strokeWidth="4" />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#ae7a1b"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-150 ease-out"
            />
          </svg>

          {/* Central Interactive Click Area */}
          <button
            type="button"
            onClick={handleCountIncrement}
            className="w-52 h-52 sm:w-56 sm:h-56 rounded-full bg-surface border-2 border-ink-700 active:scale-95 transition-transform flex flex-col items-center justify-center group focus:outline-none focus:ring-4 focus:ring-accent-500/40"
            aria-label="Ketuk untuk menambah hitungan tasbih"
          >
            {/* Inner Ring Glow */}
            <div className="w-44 h-44 rounded-full bg-surface-elevated/40 border border-ink-700/60 flex flex-col items-center justify-center p-4">
              <span className="text-5xl sm:text-6xl font-bold font-mono tracking-tight text-ink-50 group-active:text-accent-700 transition-colors">
                {count}
              </span>
              <span className="text-xs font-semibold text-ink-400 mt-1">
                Target: {target}x
              </span>
              <span className="text-xs text-accent-700 font-bold mt-2 bg-ink-800/60 px-2 py-0.5 rounded-full border border-accent-800/40">
                {percentage}% Selesai
              </span>
            </div>
          </button>
        </div>

        {/* Subtitle / Tip */}
        <p className="text-xs text-ink-400 mt-6 z-10">
          Ketuk lingkaran tasbih di atas untuk menghitung. Dilengkapi getaran halus di jempol.
        </p>

        {/* Quick Toolbar (Undo, Reset, Sound, Vibrate) */}
        <div className="flex items-center gap-3 pt-6 z-10 flex-wrap justify-center">
          {/* Undo */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={count <= 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-ink-800/80 border border-ink-700 text-xs font-semibold text-ink-300 hover:text-ink-50 hover:bg-ink-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Kurangi 1 hitungan (Undo)"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-ink-800/80 border border-ink-700 text-xs font-semibold text-rose-700 hover:bg-rose-950/40 hover:border-rose-700 transition-all"
            title="Reset hitungan ke 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
              soundEnabled
                ? 'bg-ink-800/60 border-accent-500/50 text-accent-700'
                : 'bg-ink-800/80 border-ink-700 text-ink-400'
            }`}
            title="Suara klik tasbih"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Suara</span>
          </button>

          {/* Vibration Toggle */}
          <button
            type="button"
            onClick={() => setVibrationEnabled(!vibrationEnabled)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
              vibrationEnabled
                ? 'bg-ink-800/60 border-accent-500/50 text-accent-700'
                : 'bg-ink-800/80 border-ink-700 text-ink-400'
            }`}
            title="Getaran HP saat disentuh"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Getar</span>
          </button>

          {/* Auto Cycle Ba'da Sholat Toggle */}
          <button
            type="button"
            onClick={() => setIsAutoCycle(!isAutoCycle)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
              isAutoCycle
                ? 'bg-ink-800/60 border-accent-500/50 text-accent-700'
                : 'bg-ink-800/80 border-ink-700 text-ink-400'
            }`}
            title="Otomatis ganti Subhanallah -> Alhamdulillah -> Allahu Akbar"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Siklus Ba'da Sholat</span>
          </button>
        </div>
      </div>

      {/* Fadhilah Dzikir Card */}
      <Card className="p-5 bg-surface-elevated/40 border-ink-800 space-y-2">
        <div className="flex items-center gap-2 text-accent-700 font-bold text-xs">
          <Sparkles className="w-4 h-4" />
          <span>Keutamaan & Fadhilah {currentPreset.latin}</span>
        </div>
        <p className="text-xs text-ink-300 leading-relaxed">
          {currentPreset.fadhilah}
        </p>
      </Card>
    </div>
  );
};

