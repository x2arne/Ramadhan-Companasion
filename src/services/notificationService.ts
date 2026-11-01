import type { PrayerKey, PrayerNotificationToggles } from '../types';

export const DEFAULT_NOTIFICATION_TOGGLES: PrayerNotificationToggles = {
  imsak: true,
  subuh: true,
  terbit: false,
  dhuha: false,
  dzuhur: true,
  ashar: true,
  maghrib: true,
  isya: true,
};

/**
 * Cek status izin notifikasi peramban
 */
export function getNotificationPermissionStatus(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

/**
 * Meminta izin notifikasi dari pengguna
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error('Gagal meminta izin notifikasi', err);
    return Notification.permission;
  }
}

/**
 * Membunyikan suara adzan / bel lembut menggunakan Web Audio API
 * (Sintesis harmonik mandiri, bebas dependensi file audio eksternal)
 */
export function playNotificationSound(): void {
  if (typeof window === 'undefined') return;

  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Frekuensi nada melodik islami (D4, G4, A4, D5)
    const notes = [
      { freq: 293.66, start: 0, duration: 0.6 }, // D4
      { freq: 392.0, start: 0.5, duration: 0.7 }, // G4
      { freq: 440.0, start: 1.1, duration: 0.8 }, // A4
      { freq: 587.33, start: 1.8, duration: 1.5 }, // D5
    ];

    notes.forEach(({ freq, start, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + start);

      // Amplop volume (Envelope ADSR) lembut
      gain.gain.setValueAtTime(0, now + start);
      gain.gain.linearRampToValueAtTime(0.25, now + start + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + start);
      osc.stop(now + start + duration);
    });
  } catch (e) {
    console.warn('Web Audio API playback tidak dapat dijalankan', e);
  }
}

export interface SendNotificationOptions {
  body: string;
  prayerKey?: PrayerKey | 'imsak';
  playSound?: boolean;
}

/**
 * Tampilkan notifikasi peramban dan mainkan suara jika diizinkan
 */
export function sendPrayerNotification(
  title: string,
  options: SendNotificationOptions
): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    new Notification(title, {
      body: options.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `prayer-${options.prayerKey || 'general'}-${new Date().toDateString()}`,
    });

    if (options.playSound !== false) {
      playNotificationSound();
    }

    return true;
  } catch (err) {
    console.error('Gagal mengirim web notification', err);
    return false;
  }
}

/**
 * Uji coba notifikasi & suara untuk verifikasi pengguna di Pengaturan
 */
export async function triggerTestNotification(
  soundEnabled: boolean = true
): Promise<{ success: boolean; message: string }> {
  const status = getNotificationPermissionStatus();

  if (status === 'unsupported') {
    return {
      success: false,
      message: 'Peramban Anda belum mendukung Web Notifications API.',
    };
  }

  let currentPermission: NotificationPermission | 'unsupported' = status;
  if (currentPermission === 'default') {
    currentPermission = await requestNotificationPermission();
  }

  if (currentPermission !== 'granted') {
    return {
      success: false,
      message:
        'Izin notifikasi belum diberikan. Silakan izinkan notifikasi pada ikon gembok/setelan peramban.',
    };
  }

  const ok = sendPrayerNotification('Waktu Sholat Tiba (Uji Coba Notifikasi)', {
    body: 'Alhamdulillah! Notifikasi jadwal sholat dan alarm Ramadan Companion aktif dengan lancar.',
    playSound: soundEnabled,
  });

  return {
    success: ok,
    message: ok
      ? 'Notifikasi uji coba berhasil dikirimkan.'
      : 'Gagal mengirimkan notifikasi.',
  };
}
