export interface StorageItemStat {
  key: string;
  name: string;
  bytes: number;
  formatted: string;
}

export interface StorageUsageReport {
  totalBytes: number;
  formattedTotal: string;
  items: StorageItemStat[];
  estimatedLimit: string;
}

export interface AppBackupPayload {
  app: 'Ramadan Companion';
  version: string;
  exportedAt: string;
  data: {
    settings?: any;
    worshipHistory?: any;
    doaFavorites?: string[];
    hadisFavorites?: string[];
    quranLastRead?: any;
    quranBookmarks?: any[];
  };
}

const STORAGE_KEYS_CONFIG = [
  { key: 'ramadan_companion_settings', name: 'Preferensi & Pengaturan Aplikasi' },
  { key: 'ramadan_worship_history_v1', name: 'Jurnal & Catatan Ibadah 30 Hari' },
  { key: 'ramadan_doa_favorites_v1', name: 'Koleksi Doa Favorit' },
  { key: 'ramadan_hadis_favorites_v1', name: 'Koleksi Hadits Favorit' },
  { key: 'ramadan_quran_last_read', name: 'Riwayat Baca Al-Qur\'an Terakhir' },
  { key: 'ramadan_quran_bookmarks', name: 'Penanda Ayat (Bookmark) Al-Qur\'an' },
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

/**
 * Menghitung penggunaan penyimpanan lokal (localStorage)
 */
export function getStorageUsageReport(): StorageUsageReport {
  if (typeof localStorage === 'undefined') {
    return {
      totalBytes: 0,
      formattedTotal: '0 B',
      items: [],
      estimatedLimit: '5.0 MB',
    };
  }

  let totalBytes = 0;
  const items: StorageItemStat[] = [];

  for (const conf of STORAGE_KEYS_CONFIG) {
    const raw = localStorage.getItem(conf.key);
    const bytes = raw
      ? typeof Blob !== 'undefined'
        ? new Blob([raw]).size
        : raw.length
      : 0;

    totalBytes += bytes;
    items.push({
      key: conf.key,
      name: conf.name,
      bytes,
      formatted: formatBytes(bytes),
    });
  }

  return {
    totalBytes,
    formattedTotal: formatBytes(totalBytes),
    items,
    estimatedLimit: '5.0 MB',
  };
}

/**
 * Mengumpulkan seluruh data pengguna dan memicu download file cadangan JSON
 */
export function exportAllUserData(): { success: boolean; filename: string; payload?: AppBackupPayload } {
  if (typeof localStorage === 'undefined') {
    return { success: false, filename: '' };
  }

  try {
    const backup: AppBackupPayload = {
      app: 'Ramadan Companion',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      data: {},
    };

    const settingsRaw = localStorage.getItem('ramadan_companion_settings');
    if (settingsRaw) backup.data.settings = JSON.parse(settingsRaw);

    const worshipRaw = localStorage.getItem('ramadan_worship_history_v1');
    if (worshipRaw) backup.data.worshipHistory = JSON.parse(worshipRaw);

    const doaFavRaw = localStorage.getItem('ramadan_doa_favorites_v1');
    if (doaFavRaw) backup.data.doaFavorites = JSON.parse(doaFavRaw);

    const hadisFavRaw = localStorage.getItem('ramadan_hadis_favorites_v1');
    if (hadisFavRaw) backup.data.hadisFavorites = JSON.parse(hadisFavRaw);

    const quranLastRaw = localStorage.getItem('ramadan_quran_last_read');
    if (quranLastRaw) backup.data.quranLastRead = JSON.parse(quranLastRaw);

    const quranBookRaw = localStorage.getItem('ramadan_quran_bookmarks');
    if (quranBookRaw) backup.data.quranBookmarks = JSON.parse(quranBookRaw);

    const nowStr = new Date().toISOString().split('T')[0];
    const filename = `ramadan_companion_backup_${nowStr}.json`;

    if (typeof document !== 'undefined' && typeof URL !== 'undefined') {
      const jsonString = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    return { success: true, filename, payload: backup };
  } catch (err) {
    console.error('Gagal mengekspor data cadangan', err);
    return { success: false, filename: '' };
  }
}

/**
 * Validasi dan restore data cadangan JSON ke dalam localStorage
 */
export function importUserData(
  jsonContent: string
): { success: boolean; message: string; details?: { worshipDays: number; favDoas: number; favHadis: number } } {
  if (typeof localStorage === 'undefined') {
    return { success: false, message: 'Tidak dapat mengakses penyimpanan di lingkungan sistem.' };
  }

  try {
    const parsed = JSON.parse(jsonContent);

    // Validasi skema dasar
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, message: 'Format file JSON tidak valid.' };
    }

    if (parsed.app !== 'Ramadan Companion' || !parsed.data) {
      return {
        success: false,
        message: 'File cadangan bukan berasal dari aplikasi Ramadan Companion yang sah.',
      };
    }

    const { data } = parsed;
    let worshipDays = 0;
    let favDoas = 0;
    let favHadis = 0;

    // Restore Settings
    if (data.settings && typeof data.settings === 'object') {
      localStorage.setItem('ramadan_companion_settings', JSON.stringify(data.settings));
    }

    // Restore Worship History
    if (data.worshipHistory && typeof data.worshipHistory === 'object') {
      localStorage.setItem('ramadan_worship_history_v1', JSON.stringify(data.worshipHistory));
      worshipDays = Object.keys(data.worshipHistory).length;
    }

    // Restore Doa Favorites
    if (Array.isArray(data.doaFavorites)) {
      localStorage.setItem('ramadan_doa_favorites_v1', JSON.stringify(data.doaFavorites));
      favDoas = data.doaFavorites.length;
    }

    // Restore Hadis Favorites
    if (Array.isArray(data.hadisFavorites)) {
      localStorage.setItem('ramadan_hadis_favorites_v1', JSON.stringify(data.hadisFavorites));
      favHadis = data.hadisFavorites.length;
    }

    // Restore Quran State
    if (data.quranLastRead) {
      localStorage.setItem('ramadan_quran_last_read', JSON.stringify(data.quranLastRead));
    }
    if (Array.isArray(data.quranBookmarks)) {
      localStorage.setItem('ramadan_quran_bookmarks', JSON.stringify(data.quranBookmarks));
    }

    return {
      success: true,
      message: `Cadangan berhasil dipulihkan! (${worshipDays} hari ibadah, ${favDoas} doa favorit, ${favHadis} hadits favorit).`,
      details: { worshipDays, favDoas, favHadis },
    };
  } catch (err: any) {
    console.error('Gagal mengimpor file cadangan', err);
    return {
      success: false,
      message: `Gagal membaca file cadangan: ${err.message || 'File korup atau format tidak sesuai.'}`,
    };
  }
}

/**
 * Menghapus seluruh data pengguna dari localStorage
 */
export function clearAllUserData(): boolean {
  if (typeof localStorage === 'undefined') return false;

  try {
    for (const conf of STORAGE_KEYS_CONFIG) {
      localStorage.removeItem(conf.key);
    }
    return true;
  } catch (err) {
    console.error('Gagal menghapus data lokal', err);
    return false;
  }
}
