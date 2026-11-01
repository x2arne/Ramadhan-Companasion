import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Clock,
  Moon,
  Sunset,
  Sunrise,
  BookOpen,
  Sparkles,
  Search,
  Timer,
  Check,
  X,
  Share2,
  Sliders,
  ChevronRight,
  Video,
  Headphones,
  Plus,
  ExternalLink,
  Download,
  Film,
  Music,
  Trash2,
  Sun,
  Eye,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import type { PodcastEpisode, PodcastMediaMode } from '../../types/podcast.ts';
import { PODCAST_CATEGORIES } from '../../types/podcast.ts';
import { PODCAST_EPISODES } from '../../data/podcastData.ts';

const CUSTOM_PODCASTS_STORAGE_KEY = 'ramadan_custom_podcasts_v1';

export const PodcastPage: React.FC = () => {
  const { showToast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Custom User Added Podcasts
  const [customEpisodes, setCustomEpisodes] = useState<PodcastEpisode[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_PODCASTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal / Form state for Adding Custom YouTube link
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newYoutubeUrl, setNewYoutubeUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newSpeaker, setNewSpeaker] = useState('');
  const [newCategory, setNewCategory] = useState<'tidur' | 'buka' | 'sahur' | 'kajian'>('tidur');

  // Active Player State
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(PODCAST_EPISODES[0]);
  const [mediaMode, setMediaMode] = useState<PodcastMediaMode>('mp3'); // 'mp3' (Audio banner only) or 'mp4' (Full video)
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [volume, setVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState(false);

  // Sleep Timer (Minutes)
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);
  const [isSleepTimerMenuOpen, setIsSleepTimerMenuOpen] = useState(false);

  // Download / Converter Info Modal
  const [isConverterModalOpen, setIsConverterModalOpen] = useState(false);
  // Background Audio / Screen Lock Tips Modal
  const [isBgTipsModalOpen, setIsBgTipsModalOpen] = useState(false);

  // Screen Wake Lock State (Anti-Mati Layar saat mendengarkan / tidur)
  const [isWakeLockSupported, setIsWakeLockSupported] = useState(false);
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);
  const [keepScreenAwake, setKeepScreenAwake] = useState(true);
  const wakeLockSentinelRef = useRef<any>(null);

  // Native HTML5 Audio element (for non-YouTube direct audio like Murottal)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Silent audio element to keep OS audio session active in background
  const keepAliveAudioRef = useRef<HTMLAudioElement | null>(null);
  // YouTube Iframe element ref
  const ytIframeRef = useRef<HTMLIFrameElement | null>(null);

  // Check Wake Lock support
  useEffect(() => {
    setIsWakeLockSupported(typeof navigator !== 'undefined' && 'wakeLock' in navigator);
  }, []);

  // Request Wake Lock
  const requestWakeLock = async () => {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        wakeLockSentinelRef.current = await (navigator as any).wakeLock.request('screen');
        setIsWakeLockActive(true);
        wakeLockSentinelRef.current.addEventListener('release', () => {
          setIsWakeLockActive(false);
        });
      } catch (err) {
        console.warn('Wake Lock request error:', err);
      }
    }
  };

  // Release Wake Lock
  const releaseWakeLock = async () => {
    if (wakeLockSentinelRef.current) {
      try {
        await wakeLockSentinelRef.current.release();
        wakeLockSentinelRef.current = null;
        setIsWakeLockActive(false);
      } catch (err) {
        console.warn('Wake Lock release error:', err);
      }
    }
  };

  // Toggle Wake Lock
  const handleToggleWakeLock = async () => {
    const nextVal = !keepScreenAwake;
    setKeepScreenAwake(nextVal);
    if (nextVal) {
      await requestWakeLock();
      showToast({
        title: 'Layar Tetap Menyala Aktif',
        message: 'Layar HP tidak akan mati otomatis saat podcast sedang diputar.',
        type: 'success',
      });
    } else {
      await releaseWakeLock();
      showToast({
        title: 'Layar Normal',
        message: 'Layar HP akan mengikuti batas waktu timeout standar.',
        type: 'info',
      });
    }
  };

  // Manage Wake Lock based on isPlaying
  useEffect(() => {
    if (isPlaying && keepScreenAwake) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
    return () => {
      releaseWakeLock();
    };
  }, [isPlaying, keepScreenAwake]);

  // Manage MediaSession (Lock Screen & Notification Controls on Mobile)
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator && currentEpisode) {
      try {
        navigator.mediaSession.metadata = new (window as any).MediaMetadata({
          title: currentEpisode.title,
          artist: currentEpisode.speaker,
          album: 'Podcast Ramadan Companion',
          artwork: [
            { src: currentEpisode.imageUrl, sizes: '512x512', type: 'image/jpeg' },
            { src: '/crescent.svg', sizes: '192x192', type: 'image/svg+xml' },
          ],
        });

        navigator.mediaSession.setActionHandler('play', () => {
          if (currentEpisode.youtubeId) sendYtCommand('playVideo');
          if (audioRef.current && currentEpisode.audioUrl) audioRef.current.play();
          if (keepAliveAudioRef.current) keepAliveAudioRef.current.play().catch(() => {});
          setIsPlaying(true);
        });

        navigator.mediaSession.setActionHandler('pause', () => {
          if (currentEpisode.youtubeId) sendYtCommand('pauseVideo');
          if (audioRef.current) audioRef.current.pause();
          if (keepAliveAudioRef.current) keepAliveAudioRef.current.pause();
          setIsPlaying(false);
        });

        navigator.mediaSession.setActionHandler('seekbackward', () => {
          handleSkip(-15);
        });

        navigator.mediaSession.setActionHandler('seekforward', () => {
          handleSkip(15);
        });

        navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
      } catch (err) {
        console.warn('MediaSession error:', err);
      }
    }
  }, [currentEpisode, isPlaying]);

  // Save custom episodes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_PODCASTS_STORAGE_KEY, JSON.stringify(customEpisodes));
    } catch (e) {
      console.warn('Failed to save custom podcasts', e);
    }
  }, [customEpisodes]);

  // Combined episodes list
  const allEpisodes = [...customEpisodes, ...PODCAST_EPISODES];

  // Helper to send command to YouTube Iframe via postMessage
  const sendYtCommand = (func: string, args: any = '') => {
    if (ytIframeRef.current && ytIframeRef.current.contentWindow) {
      ytIframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: func,
          args: args || '',
        }),
        '*'
      );
    }
  };

  // Sleep Timer Countdown
  useEffect(() => {
    if (!sleepTimerRemaining || sleepTimerRemaining <= 0) return;

    const timer = setInterval(() => {
      setSleepTimerRemaining((prev) => {
        if (!prev || prev <= 1) {
          // Time expired: pause audio / video
          if (audioRef.current) {
            audioRef.current.pause();
          }
          sendYtCommand('pauseVideo');
          setIsPlaying(false);

          showToast({
            title: 'Sleep Timer Berakhir',
            message: 'Pemutaran podcast dihentikan otomatis. Selamat tidur dan istirahat dengan lelap.',
            type: 'info',
            duration: 4000,
          });
          setSleepTimerMinutes(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sleepTimerRemaining, showToast]);

  const setSleepTimer = (minutes: number | null) => {
    setSleepTimerMinutes(minutes);
    if (minutes) {
      setSleepTimerRemaining(minutes * 60);
      showToast({
        title: 'Sleep Timer Diaktifkan',
        message: `Audio akan mati otomatis dalam ${minutes} menit. Selamat beristirahat!`,
        type: 'success',
        duration: 2500,
      });
    } else {
      setSleepTimerRemaining(null);
      showToast({
        title: 'Sleep Timer Dimatikan',
        message: 'Pemutaran podcast tidak dibatasi waktu.',
        type: 'info',
      });
    }
    setIsSleepTimerMenuOpen(false);
  };

  // Select and play episode with explicit mode
  const handleSelectEpisode = (episode: PodcastEpisode, mode: PodcastMediaMode = 'mp3') => {
    const isSameEpisode = currentEpisode?.id === episode.id;

    if (isSameEpisode) {
      if (mediaMode === mode) {
        // Toggle play/pause
        handleTogglePlay();
      } else {
        // Just switch mode
        setMediaMode(mode);
        showToast({
          title: mode === 'mp4' ? 'Beralih ke Mode MP4 (Video)' : 'Beralih ke Mode MP3 (Audio)',
          message: mode === 'mp4' ? 'Video kini berjalan lengkap' : 'Hanya menampilkan banner & memutar audio',
          type: 'info',
        });
      }
      return;
    }

    // Switch to new episode
    setCurrentEpisode(episode);
    setMediaMode(mode);
    setIsPlaying(true);
    setCurrentTime(0);

    if (episode.audioUrl && audioRef.current) {
      audioRef.current.src = episode.audioUrl;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.play().catch((e) => console.warn('Audio play failed', e));
    }

    showToast({
      title: mode === 'mp4' ? 'Memutar MP4 (Video)' : 'Memutar MP3 (Audio)',
      message: `"${episode.title}"`,
      type: 'info',
      duration: 3000,
    });
  };

  const handleTogglePlay = () => {
    if (!currentEpisode) return;

    if (isPlaying) {
      if (currentEpisode.youtubeId) {
        sendYtCommand('pauseVideo');
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (currentEpisode.youtubeId) {
        sendYtCommand('playVideo');
      }
      if (audioRef.current && currentEpisode.audioUrl) {
        audioRef.current.play().catch((e) => console.warn('Audio play failed', e));
      }
      setIsPlaying(true);
    }
  };

  const handleSkip = (seconds: number) => {
    if (currentEpisode?.youtubeId) {
      const nextTime = Math.max(0, currentTime + seconds);
      sendYtCommand('seekTo', [nextTime, true]);
      setCurrentTime(nextTime);
    } else if (audioRef.current) {
      const nextTime = Math.min(
        Math.max(0, audioRef.current.currentTime + seconds),
        audioRef.current.duration || 9999
      );
      audioRef.current.currentTime = nextTime;
      setCurrentTime(nextTime);
    }
  };

  const handleChangePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (currentEpisode?.youtubeId) {
      sendYtCommand('setPlaybackRate', [rate]);
    }
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (currentEpisode?.youtubeId) {
      if (nextMuted) {
        sendYtCommand('mute');
      } else {
        sendYtCommand('unMute');
        sendYtCommand('setVolume', [Math.round(volume * 100)]);
      }
    }

    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(false);

    if (currentEpisode?.youtubeId) {
      sendYtCommand('unMute');
      sendYtCommand('setVolume', [Math.round(val * 100)]);
    }

    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = false;
    }
  };

  // Extract YouTube ID from any YouTube URL format
  const extractYoutubeId = (url: string): string | null => {
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Add Custom YouTube Podcast
  const handleAddCustomPodcast = (e: React.FormEvent) => {
    e.preventDefault();
    const ytId = extractYoutubeId(newYoutubeUrl.trim());

    if (!ytId) {
      showToast({
        title: 'Link YouTube Tidak Valid',
        message: 'Pastikan link berformat https://youtu.be/... atau https://youtube.com/watch?v=...',
        type: 'error',
      });
      return;
    }

    const title = newTitle.trim() || `Kajian YouTube [${ytId}]`;
    const speaker = newSpeaker.trim() || 'Kajian Islam YouTube';

    const newEp: PodcastEpisode = {
      id: `custom-yt-${Date.now()}`,
      title,
      speaker,
      category: newCategory,
      categoryLabel:
        newCategory === 'tidur'
          ? 'Pengantar Tidur'
          : newCategory === 'buka'
          ? 'Menunggu Buka'
          : newCategory === 'sahur'
          ? 'Menemani Sahur'
          : 'Tadabbur Ramadan',
      suitableFor: 'Podcast YouTube pilihan pribadi Anda',
      description: `Kajian YouTube ditambahkan secara kustom ke Ramadan Companion. Siap diputar dalam Mode MP4 (Video) maupun Mode MP3 (Audio Banner).`,
      duration: 'YouTube',
      durationSeconds: 1800,
      youtubeId: ytId,
      imageUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      tags: ['Kustom', 'YouTube', newCategory],
      isCustom: true,
    };

    setCustomEpisodes((prev) => [newEp, ...prev]);
    setIsAddModalOpen(false);
    setNewYoutubeUrl('');
    setNewTitle('');
    setNewSpeaker('');

    showToast({
      title: 'Podcast Berhasil Ditambahkan!',
      message: `"${title}" siap diputar dalam versi MP4 maupun MP3.`,
      type: 'success',
    });

    // Auto-select and play the added podcast
    handleSelectEpisode(newEp, 'mp3');
  };

  const handleDeleteCustomPodcast = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomEpisodes((prev) => prev.filter((ep) => ep.id !== id));
    if (currentEpisode?.id === id) {
      setCurrentEpisode(PODCAST_EPISODES[0]);
    }
    showToast({
      title: 'Podcast Dihapus',
      message: 'Podcast kustom telah dihapus dari daftar.',
      type: 'info',
    });
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || sec < 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Filter episodes
  const filteredEpisodes = allEpisodes.filter((ep) => {
    const matchCat = selectedCategory === 'all' || ep.category === selectedCategory;
    const matchSearch =
      searchQuery.trim() === '' ||
      ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.suitableFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 pb-28">
      {/* Hidden Native Audio Element for Direct Murottal files */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            if (!duration && audioRef.current.duration) {
              setDuration(audioRef.current.duration);
            }
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration || currentEpisode?.durationSeconds || 0);
          }
        }}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-xl p-6 sm:p-8 bg-surface border border-accent-500/25">

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="violet" dot>
              Podcast & Kajian Islami Ramadan
            </Badge>
            <Badge variant="blue">Versi MP4 (Video) & MP3 (Audio)</Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-ink-100 tracking-tight">
            Ruang Podcast & Kajian Audio-Visual Islami
          </h1>

          <p className="text-xs sm:text-sm text-ink-300 leading-relaxed">
            Temani setiap detik Ramadan Anda: dari <strong>suara tenang pengantar tidur</strong>,{' '}
            <strong>ngabuburit asyik menunggu adzan Maghrib</strong>, hingga{' '}
            <strong>pembangkit semangat di sepertiga malam waktu sahur</strong>. Dilengkapi fitur{' '}
            <strong>Mode Video MP4</strong> (semua video berjalan) dan <strong>Mode Audio MP3</strong>{' '}
            (tampilan banner estetik penyejuk mata yang ramah kuota).
          </p>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Tambah Link YouTube
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => setIsConverterModalOpen(true)}
            >
              Info Download MP3/MP4 Offline
            </Button>
          </div>
        </div>
      </div>

      {/* ACTIVE MEDIA PLAYER (HERO PLAYER WITH MP4 / MP3 TOGGLE) */}
      {currentEpisode && (
        <Card className="overflow-hidden border-accent-500/40 bg-surface/90">
          <div className="p-4 sm:p-6 space-y-4">
            {/* Top Bar: Mode Switcher Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-ink-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-ink-400">Pilih Mode Tampilan:</span>
                <div className="inline-flex p-1 rounded-lg bg-ink-900 border border-ink-800">
                  <button
                    type="button"
                    onClick={() => {
                      setMediaMode('mp4');
                      if (currentEpisode.youtubeId) {
                        sendYtCommand('playVideo');
                      }
                      setIsPlaying(true);
                      showToast({
                        title: 'Mode Video (MP4) Aktif',
                        message: 'Video penuh sedang berjalan di layar.',
                        type: 'info',
                      });
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-bold transition-all touch-manipulation cursor-pointer active:scale-95 ${
                      mediaMode === 'mp4'
                        ? 'bg-accent-400 text-on-accent font-semibold'
                        : 'text-ink-400 hover:text-ink-200'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Mode Video (MP4)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMediaMode('mp3');
                      showToast({
                        title: 'Mode Audio (MP3) Aktif',
                        message: 'Menampilkan banner estetik & memutar audio di latar belakang.',
                        type: 'info',
                      });
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-bold transition-all touch-manipulation cursor-pointer active:scale-95 ${
                      mediaMode === 'mp3'
                        ? 'bg-accent-400 text-on-accent font-semibold'
                        : 'text-ink-400 hover:text-ink-200'
                    }`}
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Mode Audio (MP3)</span>
                  </button>
                </div>
              </div>

              {/* Sleep Timer, Wake Lock & External Tools */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto flex-wrap">
                {/* Wake Lock Toggle (Anti-Mati Layar saat didengarkan) */}
                <button
                  type="button"
                  onClick={handleToggleWakeLock}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                    keepScreenAwake && isWakeLockActive
                      ? 'bg-ink-800/60 border-accent-500/50 text-accent-700 font-semibold'
                      : 'bg-surface-elevated/70 border-ink-700/80 text-ink-400 hover:text-ink-200'
                  }`}
                  title={keepScreenAwake ? 'Layar HP dijaga tetap menyala' : 'Layar HP normal mengikuti sleep timeout'}
                >
                  <Sun className={`w-3.5 h-3.5 ${keepScreenAwake && isWakeLockActive ? 'text-accent-700' : ''}`} />
                  <span className="hidden xs:inline">
                    {keepScreenAwake && isWakeLockActive ? 'Layar Nyala' : 'Anti-Mati'}
                  </span>
                </button>

                {/* Info Panduan Putar Layar Mati */}
                <button
                  type="button"
                  onClick={() => setIsBgTipsModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-ink-700/80 bg-surface-elevated/70 text-ink-400 hover:text-accent-800 transition-colors"
                  title="Panduan agar audio tetap jalan saat layar HP mati"
                >
                  <Info className="w-3.5 h-3.5 text-accent-700" />
                  <span className="hidden sm:inline">Tips Layar Mati</span>
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsSleepTimerMenuOpen(!isSleepTimerMenuOpen)}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      sleepTimerRemaining
                        ? 'bg-ink-800/50 border-accent-500 text-accent-700 font-bold'
                        : 'bg-surface-elevated/70 border-ink-700/80 text-ink-300 hover:bg-ink-700/60'
                    }`}
                    title="Atur Timer Tidur Otomatis"
                  >
                    <Timer className="w-3.5 h-3.5 text-accent-700" />
                    <span>
                      {sleepTimerRemaining
                        ? `Tidur: ${Math.ceil(sleepTimerRemaining / 60)}m`
                        : 'Sleep Timer'}
                    </span>
                  </button>

                  {/* Sleep Timer Dropdown */}
                  {isSleepTimerMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-surface-elevated border border-ink-700 rounded-lg p-2 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-2 py-1 text-xs font-bold text-ink-400">
                        Timer Tidur Otomatis
                      </div>
                      {[15, 30, 45, 60].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setSleepTimer(mins)}
                          className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                            sleepTimerMinutes === mins
                              ? 'bg-accent-400 text-on-accent font-semibold font-semibold'
                              : 'text-ink-200 hover:bg-ink-700/50'
                          }`}
                        >
                          <span>{mins} Menit</span>
                          {sleepTimerMinutes === mins && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setSleepTimer(null)}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-rose-700 hover:bg-rose-950/30 transition-colors"
                      >
                        Matikan Timer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SCREEN VIEWPORT CONTAINER */}
            <div className="relative rounded-xl overflow-hidden bg-ink-950 border border-ink-800">
              {/* 1. MP4 MODE: FULL VIDEO RUNNING */}
              {mediaMode === 'mp4' && currentEpisode.youtubeId && (
                <div className="relative w-full aspect-video">
                  <iframe
                    ref={ytIframeRef}
                    src={`https://www.youtube-nocookie.com/embed/${currentEpisode.youtubeId}?autoplay=1&enablejsapi=1&rel=0&playsinline=1`}
                    title={currentEpisode.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              )}

              {/* 2. MP3 MODE: BANNER ONLY WITH AUDIO SPECTRUM & SLEEK ARTWORK */}
              {mediaMode === 'mp3' && (
                <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden group">
                  {/* Banner Image */}
                  <img
                    src={currentEpisode.imageUrl}
                    alt={currentEpisode.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Dark Vignette & Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20" />

                  {/* Mode Badge & Category */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-800/80 border border-accent-500/40 text-xs font-semibold text-accent-700">
                      <Music className="w-3.5 h-3.5 text-accent-700" /> Mode Audio MP3 (Banner Only)
                    </span>
                    <Badge variant="gold" size="sm">
                      {currentEpisode.categoryLabel}
                    </Badge>
                  </div>

                  {/* Center Content: Title, Speaker, & Equalizer Animation */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                    <div className="max-w-xl space-y-2">
                      <h2 className="text-base sm:text-xl font-bold text-white drop-shadow-md line-clamp-2 leading-tight">
                        {currentEpisode.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-accent-200 font-medium drop-shadow">
                        {currentEpisode.speaker}
                      </p>

                      {/* Equalizer Sound Waves Animation */}
                      <div className="flex items-center justify-center gap-1 pt-3 h-8">
                        {[40, 70, 30, 90, 60, 100, 50, 80, 45, 65, 85, 35, 75, 95, 55, 85].map(
                          (height, i) => (
                            <span
                              key={i}
                              className={`w-1 rounded-full bg-accent-400 transition-all duration-300 ${
                                isPlaying ? 'animate-pulse' : 'opacity-40'
                              }`}
                              style={{
                                height: isPlaying ? `${Math.max(15, (height * (i % 3 + 1)) % 100)}%` : '20%',
                                animationDelay: `${(i * 0.08).toFixed(2)}s`,
                              }}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hidden Background YouTube IFrame for MP3 audio streaming */}
                  {currentEpisode.youtubeId && (
                    <div
                      style={{
                        position: 'absolute',
                        top: -9999,
                        left: -9999,
                        width: '1px',
                        height: '1px',
                        opacity: 0,
                        pointerEvents: 'none',
                      }}
                    >
                      <iframe
                        ref={ytIframeRef}
                        src={`https://www.youtube-nocookie.com/embed/${currentEpisode.youtubeId}?autoplay=${
                          isPlaying ? 1 : 0
                        }&enablejsapi=1&rel=0&playsinline=1`}
                        title="Background Audio Stream"
                        allow="autoplay"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Audio Controls Bar (Especially for MP3 Banner Mode) */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-ink-100 line-clamp-1">
                    {currentEpisode.title}
                  </h3>
                  <p className="text-xs text-accent-700 font-medium">
                    {currentEpisode.speaker} • {currentEpisode.suitableFor}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-ink-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-ink-400" />
                  <span>Durasi: {currentEpisode.duration}</span>
                </div>
              </div>

              {/* Playback Controls & Speed */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-ink-800">
                {/* Speed Controls */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-ink-400 mr-0.5 hidden sm:inline">Speed:</span>
                  {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => handleChangePlaybackRate(rate)}
                      className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-semibold transition-all touch-manipulation cursor-pointer active:scale-95 ${
                        playbackRate === rate
                          ? 'bg-accent-400 text-on-accent font-semibold'
                          : 'text-ink-400 hover:text-ink-200 bg-ink-800/40 hover:bg-ink-700/50'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>

                {/* Center Buttons: Skip & Play/Pause */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSkip(-10)}
                    className="min-h-[44px] min-w-[44px] p-2.5 rounded-lg flex items-center justify-center text-ink-300 hover:text-ink-50 hover:bg-ink-800/60 active:scale-95 touch-manipulation cursor-pointer transition-all"
                    title="Mundur 10 detik"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className="w-12 h-12 min-h-[48px] min-w-[48px] rounded-xl bg-accent-400 hover:bg-accent-500 text-on-accent font-semibold flex items-center justify-center transition-transform active:scale-95 touch-manipulation cursor-pointer"
                    title={isPlaying ? 'Jeda' : 'Putar'}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSkip(10)}
                    className="min-h-[44px] min-w-[44px] p-2.5 rounded-lg flex items-center justify-center text-ink-300 hover:text-ink-50 hover:bg-ink-800/60 active:scale-95 touch-manipulation cursor-pointer transition-all"
                    title="Maju 10 detik"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Volume slider */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className="text-ink-400 hover:text-ink-200"
                    title={isMuted ? 'Nyalakan Suara' : 'Bisukan'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-700" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1.5 bg-ink-800 rounded-lg appearance-none cursor-pointer accent-accent-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Category Tabs & Search Bar */}
      <div className="space-y-3 pt-2">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-ink-800/80">
          {PODCAST_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-accent-400 text-on-accent font-semibold'
                    : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800/40'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search & Stats */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="w-full sm:max-w-md">
            <Input
              placeholder="Cari podcast (Escape, Felix Siauw, Tidur, Sahur, Buka)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-ink-400" />}
            />
          </div>

          <div className="text-xs text-ink-400 flex items-center gap-2">
            <span>Ditemukan {filteredEpisodes.length} Episode</span>
          </div>
        </div>
      </div>

      {/* Podcast Episode Cards */}
      {filteredEpisodes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEpisodes.map((episode) => {
            const isCurrent = currentEpisode?.id === episode.id;
            const isPlayingThis = isCurrent && isPlaying;

            return (
              <Card
                key={episode.id}
                className={`p-5 transition-all duration-300 flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-ink-800/30 border-accent-500/60 ring-1 ring-accent-500/40'
                    : 'bg-surface/60 border-ink-800 hover:border-ink-700/80 hover:bg-surface-elevated/40'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Header Row with Thumbnail */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-ink-900 border border-ink-700/60 shrink-0">
                        <img
                          src={episode.imageUrl}
                          alt={episode.title}
                          className="w-full h-full object-cover"
                        />
                        {isPlayingThis && (
                          <div className="absolute inset-0 bg-ink-800/60 flex items-center justify-center">
                            <span className="w-3.5 h-3.5 rounded-full bg-accent-400 animate-ping" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge
                            variant={
                              episode.category === 'tidur'
                                ? 'violet'
                                : episode.category === 'buka'
                                ? 'blue'
                                : episode.category === 'sahur'
                                ? 'gold'
                                : 'emerald'
                            }
                            size="sm"
                          >
                            {episode.categoryLabel}
                          </Badge>
                          <span className="text-xs text-ink-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {episode.duration}
                          </span>
                          {episode.isCustom && (
                            <Badge variant="slate" size="sm">
                              Kustom
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-ink-100 mt-1 leading-snug line-clamp-2">
                          {episode.title}
                        </h3>
                        <p className="text-xs text-accent-700 font-medium truncate">
                          {episode.speaker}
                        </p>
                      </div>
                    </div>

                    {/* Delete button if custom */}
                    {episode.isCustom && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteCustomPodcast(episode.id, e)}
                        className="p-1.5 rounded-lg text-ink-400 hover:text-rose-700 hover:bg-rose-950/20 transition-colors"
                        title="Hapus Podcast Kustom"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Situational Highlight Pill */}
                  <div className="p-2.5 rounded-lg bg-surface-elevated/40 border border-ink-800 text-xs text-ink-300 flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-accent-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-ink-200">Sangat Pas Untuk:</strong>{' '}
                      <span className="text-ink-400">{episode.suitableFor}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-ink-400 leading-relaxed line-clamp-2">
                    {episode.description}
                  </p>
                </div>

                {/* Bottom Row: MP4 & MP3 Play Action Buttons */}
                <div className="pt-3 mt-3 border-t border-ink-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {episode.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-md bg-ink-800/60 text-ink-400 border border-ink-700/40"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* MP3 Button */}
                    <button
                      type="button"
                      onClick={() => handleSelectEpisode(episode, 'mp3')}
                      className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all touch-manipulation cursor-pointer active:scale-95 ${
                        isCurrent && mediaMode === 'mp3' && isPlaying
                          ? 'bg-accent-400 text-on-accent font-semibold'
                          : 'bg-surface-elevated border border-ink-700 hover:border-accent-500/50 text-accent-700 hover:text-ink-50'
                      }`}
                      title="Putar Versi MP3 (Tampilan Banner)"
                    >
                      <Headphones className="w-3.5 h-3.5" />
                      <span>MP3</span>
                    </button>

                    {/* MP4 Button (if YouTube available) */}
                    {episode.youtubeId && (
                      <button
                        type="button"
                        onClick={() => handleSelectEpisode(episode, 'mp4')}
                        className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all touch-manipulation cursor-pointer active:scale-95 ${
                          isCurrent && mediaMode === 'mp4' && isPlaying
                            ? 'bg-accent-400 text-on-accent font-semibold'
                            : 'bg-surface-elevated border border-ink-700 hover:border-accent-500/50 text-accent-700 hover:text-ink-50'
                        }`}
                        title="Putar Versi MP4 (Video Lengkap)"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>MP4</span>
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Radio className="w-8 h-8 text-accent-700" />}
          title="Tidak Ada Podcast yang Cocok"
          description={`Tidak ditemukan episode untuk kata kunci "${searchQuery}". Coba gunakan kata kunci lain.`}
          actionLabel="Tampilkan Semua Podcast"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('all');
          }}
        />
      )}

      {/* MODAL: TAMBAH LINK YOUTUBE SENDIRI */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-surface border border-ink-700 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-accent-600/20 text-accent-700 flex items-center justify-center">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink-100">
                    Tambah Link YouTube ke Podcast
                  </h3>
                  <p className="text-xs text-ink-400">
                    Otomatis tersedia dalam versi MP4 (Video) dan MP3 (Audio Banner)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-ink-400 hover:text-ink-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomPodcast} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-ink-300 mb-1">
                  URL YouTube (Kajian / Ceramah / Murottal) *
                </label>
                <Input
                  required
                  placeholder="Contoh: https://youtu.be/ik82ZtQG5Ls"
                  value={newYoutubeUrl}
                  onChange={(e) => setNewYoutubeUrl(e.target.value)}
                />
                <p className="text-xs text-ink-400 mt-1">
                  Mendukung link share `youtu.be/...` dan `youtube.com/watch?v=...`
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-300 mb-1">
                  Judul Podcast / Kajian *
                </label>
                <Input
                  required
                  placeholder="Contoh: Kajian Fiqih Puasa & Tadabbur Al-Qadr"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-300 mb-1">
                  Narasumber / Ustadz / Channel
                </label>
                <Input
                  placeholder="Contoh: Ustadz Adi Hidayat / Felix Siauw"
                  value={newSpeaker}
                  onChange={(e) => setNewSpeaker(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-300 mb-1">
                  Kategori Waktu & Suasana
                </label>
                <select
                  value={newCategory}
                  onChange={(e) =>
                    setNewCategory(e.target.value as 'tidur' | 'buka' | 'sahur' | 'kajian')
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface-elevated border border-ink-700 text-xs text-ink-200 focus:outline-none focus:border-accent-500"
                >
                  <option value="tidur">Pengantar Tidur & Ketenangan Jiwa</option>
                  <option value="buka">Menunggu Buka (Ngabuburit)</option>
                  <option value="sahur">Menemani Sahur & Qiyamullail</option>
                  <option value="kajian">Tadabbur & Fiqih Ramadan</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
                  Batal
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Simpan & Putar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INFO CONVERTER & DOWNLOAD MP3 / MP4 */}
      {isConverterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-surface border border-ink-700 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-accent-600/20 text-accent-700 flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink-100">
                    Download File MP3 / MP4 Offline
                  </h3>
                  <p className="text-xs text-ink-400">
                    Panduan & alat aman untuk mengunduh audio/video
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsConverterModalOpen(false)}
                className="p-1 rounded-lg text-ink-400 hover:text-ink-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-ink-300 leading-relaxed">
              <p>
                Ramadan Companion memutar audio dan video langsung secara <em>client-side streaming</em>{' '}
                sehingga tidak membebani memori penyimpanan perangkat Anda.
              </p>
              <p>
                Jika Anda ingin mengunduh berkas audio MP3 atau video MP4 murni ke galeri perangkat agar bisa didengarkan tanpa koneksi internet sama sekali, Anda dapat menggunakan layanan converter publik terpercaya:
              </p>

              <div className="space-y-2 pt-1">
                <a
                  href="https://cobalt.tools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-surface-elevated/70 border border-ink-700 hover:border-accent-500/50 flex items-center justify-between transition-colors group"
                >
                  <div>
                    <h4 className="font-bold text-ink-100 group-hover:text-accent-800 flex items-center gap-1.5">
                      Cobalt.tools <ExternalLink className="w-3.5 h-3.5" />
                    </h4>
                    <p className="text-xs text-ink-400">
                      Open-source, bebas iklan, privasi terjaga, mendukung konversi MP3 & MP4 kualitas tinggi.
                    </p>
                  </div>
                  <Badge variant="violet" size="sm">
                    Rekomendasi
                  </Badge>
                </a>

                <a
                  href="https://y2mate.is"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-surface-elevated/70 border border-ink-700 hover:border-accent-500/50 flex items-center justify-between transition-colors group"
                >
                  <div>
                    <h4 className="font-bold text-ink-100 group-hover:text-accent-800 flex items-center gap-1.5">
                      Y2Mate Converter <ExternalLink className="w-3.5 h-3.5" />
                    </h4>
                    <p className="text-xs text-ink-400">
                      Converter web cepat untuk mengunduh audio MP3 dari tautan YouTube.
                    </p>
                  </div>
                  <Badge variant="blue" size="sm">
                    Alternatif
                  </Badge>
                </a>
              </div>

              <div className="p-3 rounded-xl bg-ink-900/60 border border-ink-800 text-xs text-ink-400">
                <strong>Catatan Penggunaan:</strong> Unduh konten hanya untuk keperluan edukasi dan ibadah pribadi secara bijak.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={() => setIsConverterModalOpen(false)}>
                Tutup Panduan
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL 3: PANDUAN PEMUTARAN LATAR BELAKANG / SAAT LAYAR HP MATI */}
      {isBgTipsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-surface border border-ink-700/80 rounded-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-ink-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-accent-500/20 text-accent-700 flex items-center justify-center">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink-100">
                    Tips Putar Saat Layar HP Mati
                  </h3>
                  <p className="text-xs text-ink-400">
                    Solusi agar podcast terus bersuara saat tidur / layar terkunci
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBgTipsModalOpen(false)}
                className="p-1 rounded-lg text-ink-400 hover:text-ink-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-ink-300 leading-relaxed">
              <p>
                Sistem operasi Android dan iOS memiliki kebijakan ketat yang sengaja menghentikan video web saat layar HP dimatikan. Berikut <strong>3 cara praktis</strong> agar podcast Anda tetap berjalan lancar:
              </p>

              {/* Tip 1 */}
              <div className="p-3.5 rounded-xl bg-ink-800/30 border border-accent-800/40 space-y-1.5">
                <div className="flex items-center gap-2 text-accent-700 font-bold">
                  <Sun className="w-4 h-4 shrink-0" />
                  <span>Metode 1: Fitur "Anti-Mati Layar" (Rekomendasi Utama)</span>
                </div>
                <p className="text-ink-300">
                  Cukup aktifkan tombol <strong>"Layar Nyala"</strong> di atas pemutar. Layar HP Anda akan dijaga tetap aktif dengan kecerahan minimal saat mendengarkan sebelum tidur atau santap sahur tanpa takut layar mati otomatis.
                </p>
              </div>

              {/* Tip 2 */}
              <div className="p-3.5 rounded-xl bg-ink-800/30 border border-accent-800/40 space-y-1.5">
                <div className="flex items-center gap-2 text-accent-700 font-bold">
                  <Headphones className="w-4 h-4 shrink-0" />
                  <span>Metode 2: Lanjutkan dari Layar Kunci (Lock Screen)</span>
                </div>
                <p className="text-ink-300">
                  Saat Anda mematikan layar HP, periksa <strong>layar kunci atau bar notifikasi HP Anda</strong>. Akan muncul panel pemutar <em>Ramadan Companion</em>. Ketuk ikon <strong>Play (▶)</strong> di layar kunci untuk melanjutkan suara podcast!
                </p>
              </div>

              {/* Tip 3 */}
              <div className="p-3.5 rounded-xl bg-ink-900/60 border border-ink-800 space-y-1.5">
                <div className="flex items-center gap-2 text-accent-700 font-bold">
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <span>Metode 3: Aktifkan "Situs Desktop" di Google Chrome</span>
                </div>
                <p className="text-ink-400">
                  Di peramban Chrome HP Anda, ketuk titik tiga (⋮) di pojok kanan atas, lalu centang <strong>"Situs Desktop"</strong>. Pada mode desktop, peramban mengizinkan audio berjalan di latar belakang tanpa jeda.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={() => setIsBgTipsModalOpen(false)}>
                Mengerti
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
