import { ALL_114_SURAHS, SurahMeta } from '../data/quranMetadata';
import { ALL_30_JUZ, JuzInfo } from '../data/juzData';
import { BUNDLED_SURAHS } from '../data/bundledSurahs';

export interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio?: Record<string, string>;
}

export interface SurahDetail {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull?: Record<string, string>;
  ayat: Ayat[];
  suratSebelumnya?: { nomor: number; namaLatin: string } | false;
  suratSelanjutnya?: { nomor: number; namaLatin: string } | false;
}

export interface BookmarkItem {
  id: string;
  surahNumber: number;
  surahName: string;
  verseNumber: number;
  verseTextArab: string;
  verseTranslation: string;
  createdAt: string;
}

export interface LastReadItem {
  surahNumber: number;
  surahName: string;
  verseNumber: number;
  updatedAt: string;
}

const STORAGE_BOOKMARKS_KEY = 'ramadan_quran_bookmarks';
const STORAGE_LAST_READ_KEY = 'ramadan_quran_last_read';
const CACHE_PREFIX = 'quran_surah_v2_';

// In-memory cache for ultra-fast instant switching
const memoryCache = new Map<number, SurahDetail>();

/**
 * Dapatkan daftar 114 surah dengan filter pencarian nama/arti/nomor dan filter juz
 */
export function getSurahList(
  query: string = '',
  filterType: 'all' | 'Makkiyah' | 'Madaniyah' = 'all',
  filterJuz?: number
): SurahMeta[] {
  let list = ALL_114_SURAHS;

  // Filter berdasarkan Juz jika dipilih
  if (filterJuz && filterJuz >= 1 && filterJuz <= 30) {
    const juz = ALL_30_JUZ[filterJuz - 1];
    list = list.filter(
      (s) => s.nomor >= juz.startSurahNumber && s.nomor <= juz.endSurahNumber
    );
  }

  // Filter tipe turun
  if (filterType !== 'all') {
    list = list.filter((s) => s.tempatTurun === filterType);
  }

  // Filter query pencarian
  if (query.trim()) {
    const q = query.toLowerCase().trim();
    list = list.filter(
      (s) =>
        s.namaLatin.toLowerCase().includes(q) ||
        s.arti.toLowerCase().includes(q) ||
        s.nomor.toString() === q
    );
  }

  return list;
}

/**
 * Ambil detail ayat surah lengkap dengan sistem cache offline
 */
export async function fetchSurahDetail(surahNumber: number): Promise<SurahDetail> {
  // 1. Cek memory cache
  if (memoryCache.has(surahNumber)) {
    return memoryCache.get(surahNumber)!;
  }

  // 2. Cek localStorage cache
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${surahNumber}`);
    if (cached) {
      const parsed: SurahDetail = JSON.parse(cached);
      memoryCache.set(surahNumber, parsed);
      return parsed;
    }
  } catch (e) {
    console.warn('LocalStorage cache read error', e);
  }

  // 3. Cek bundled offline fallback
  if (BUNDLED_SURAHS[surahNumber]) {
    const bundled = BUNDLED_SURAHS[surahNumber] as SurahDetail;
    memoryCache.set(surahNumber, bundled);
    return bundled;
  }

  // 4. Fetch dari API resmi equran.id
  try {
    const response = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`);
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: Gagal memuat surat`);
    }

    const json = await response.json();
    if (json.code !== 200 || !json.data) {
      throw new Error('Data surat tidak ditemukan dari server rujukan.');
    }

    const detail: SurahDetail = json.data;

    // Simpan ke memory dan localStorage cache
    memoryCache.set(surahNumber, detail);
    try {
      localStorage.setItem(`${CACHE_PREFIX}${surahNumber}`, JSON.stringify(detail));
    } catch (e) {
      console.warn('LocalStorage quota limit reached, keeping in memory cache only', e);
    }

    return detail;
  } catch (err: any) {
    // Secondary fallback jika equran.id lambat atau offline
    try {
      const secResp = await fetch(`https://api.quran.gading.dev/surah/${surahNumber}`);
      if (secResp.ok) {
        const secJson = await secResp.json();
        if (secJson.data) {
          const raw = secJson.data;
          const mapped: SurahDetail = {
            nomor: raw.number,
            nama: raw.name.short,
            namaLatin: raw.name.transliteration.id,
            jumlahAyat: raw.numberOfVerses,
            tempatTurun: raw.revelation.id === 'Makkah' ? 'Makkiyah' : 'Madaniyah',
            arti: raw.name.translation.id,
            deskripsi: raw.tafsir?.id || '',
            ayat: raw.verses.map((v: any) => ({
              nomorAyat: v.number.inSurah,
              teksArab: v.text.arab,
              teksLatin: v.text.transliteration.en,
              teksIndonesia: v.translation.id,
              audio: v.audio,
            })),
          };
          memoryCache.set(surahNumber, mapped);
          return mapped;
        }
      }
    } catch (secErr) {
      // Fall through to error
    }

    throw new Error(
      `Gagal memuat Surat nomor ${surahNumber}. Periksa koneksi internet Anda untuk mengunduh ayat terverifikasi ke perangkat Anda.`
    );
  }
}

/**
 * Simpan posisi terakhir dibaca
 */
export function saveLastRead(surahNumber: number, surahName: string, verseNumber: number): void {
  try {
    const item: LastReadItem = {
      surahNumber,
      surahName,
      verseNumber,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_LAST_READ_KEY, JSON.stringify(item));
  } catch (e) {
    console.error('Failed to save last read', e);
  }
}

/**
 * Ambil posisi terakhir dibaca
 */
export function getLastRead(): LastReadItem | null {
  try {
    const saved = localStorage.getItem(STORAGE_LAST_READ_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Failed to get last read', e);
  }
  return {
    surahNumber: 1,
    surahName: 'Al-Fatihah',
    verseNumber: 1,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Ambil daftar bookmark
 */
export function getBookmarks(): BookmarkItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Failed to get bookmarks', e);
  }
  return [];
}

/**
 * Tambah / Hapus bookmark ayat
 */
export function toggleBookmark(
  surahNumber: number,
  surahName: string,
  verseNumber: number,
  verseTextArab: string,
  verseTranslation: string
): boolean {
  try {
    const current = getBookmarks();
    const existingIndex = current.findIndex(
      (b) => b.surahNumber === surahNumber && b.verseNumber === verseNumber
    );

    if (existingIndex >= 0) {
      // Hapus bookmark
      current.splice(existingIndex, 1);
      localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(current));
      return false; // tidak di-bookmark lagi
    } else {
      // Tambah bookmark
      const newItem: BookmarkItem = {
        id: `${surahNumber}:${verseNumber}-${Date.now()}`,
        surahNumber,
        surahName,
        verseNumber,
        verseTextArab,
        verseTranslation,
        createdAt: new Date().toISOString(),
      };
      current.unshift(newItem);
      localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(current));
      return true; // berhasil di-bookmark
    }
  } catch (e) {
    console.error('Failed to toggle bookmark', e);
    return false;
  }
}

/**
 * Cek apakah ayat tertentu sudah dibookmark
 */
export function isVerseBookmarked(surahNumber: number, verseNumber: number): boolean {
  const current = getBookmarks();
  return current.some((b) => b.surahNumber === surahNumber && b.verseNumber === verseNumber);
}

/**
 * Hapus bookmark berdasarkan ID
 */
export function removeBookmarkById(id: string): void {
  try {
    const current = getBookmarks().filter((b) => b.id !== id);
    localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to remove bookmark', e);
  }
}
