import { ALL_HADIS } from '../data/hadisData.ts';
import { ALL_ARTICLES } from '../data/edukasiData.ts';
import type { HadisItem, EducationalArticle, HadisTopic } from '../types/hadis';

const STORAGE_FAVORITES_KEY = 'ramadan_hadis_favorites_v1';

/**
 * Ambil daftar ID hadits favorit dari localStorage
 */
export function getFavoriteHadisIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_FAVORITES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Gagal membaca favorit hadits dari localStorage', e);
  }
  return [];
}

/**
 * Simpan daftar ID hadits favorit ke localStorage
 */
function saveFavoriteHadisIds(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error('Gagal menyimpan favorit hadits ke localStorage', e);
  }
}

/**
 * Cek apakah hadits tertentu masuk favorit
 */
export function isHadisFavorite(id: string): boolean {
  const favs = getFavoriteHadisIds();
  return favs.includes(id);
}

/**
 * Toggle status favorit hadits
 */
export function toggleFavoriteHadis(id: string): boolean {
  const favs = getFavoriteHadisIds();
  const index = favs.indexOf(id);
  let isNowFavorite = false;

  if (index >= 0) {
    favs.splice(index, 1);
    isNowFavorite = false;
  } else {
    favs.push(id);
    isNowFavorite = true;
  }

  saveFavoriteHadisIds(favs);
  return isNowFavorite;
}

/**
 * Mengambil semua data hadits
 */
export function getAllHadis(): HadisItem[] {
  return ALL_HADIS;
}

/**
 * Mengambil detail satu hadits berdasarkan ID
 */
export function getHadisById(id: string): HadisItem | undefined {
  return ALL_HADIS.find((h) => h.id === id);
}

/**
 * Filter dan pencarian hadits berdasarkan kata kunci dan topik
 */
export function searchHadis(query: string = '', topic: string = 'all'): HadisItem[] {
  const cleanQuery = query.trim().toLowerCase();

  return ALL_HADIS.filter((item) => {
    // Filter Topik
    if (topic !== 'all' && item.topic !== topic) {
      return false;
    }

    // Filter Kata Kunci
    if (!cleanQuery) return true;

    const matchTitle = item.title.toLowerCase().includes(cleanQuery);
    const matchTranslation = item.translation.toLowerCase().includes(cleanQuery);
    const matchNarrator = item.narrator.toLowerCase().includes(cleanQuery);
    const matchReference = item.referenceNumber.toLowerCase().includes(cleanQuery);
    const matchBook = item.bookName.toLowerCase().includes(cleanQuery);
    const matchTags = item.tags.some((tag) => tag.toLowerCase().includes(cleanQuery));
    const matchArabic = item.arabicText.includes(cleanQuery);

    return (
      matchTitle ||
      matchTranslation ||
      matchNarrator ||
      matchReference ||
      matchBook ||
      matchTags ||
      matchArabic
    );
  });
}

/**
 * Mengambil semua artikel edukasi
 */
export function getAllArticles(): EducationalArticle[] {
  return ALL_ARTICLES;
}

/**
 * Mengambil artikel edukasi berdasarkan ID
 */
export function getArticleById(id: string): EducationalArticle | undefined {
  return ALL_ARTICLES.find((a) => a.id === id);
}

/**
 * Format hadits untuk siap disalin ke clipboard
 */
export function formatHadisForCopy(hadis: HadisItem): string {
  return [
    `📖 ${hadis.title}`,
    `Perawi: ${hadis.narrator}`,
    `Rujukan: ${hadis.bookName} (${hadis.referenceNumber})`,
    `Derajat: ${hadis.grade}`,
    '',
    hadis.arabicText,
    '',
    `Artinya: "${hadis.translation}"`,
    '',
    hadis.explanation ? `💡 Faidah & Penjelasan:\n${hadis.explanation}\n` : '',
    '— Dibagikan dari Ramadan Companion (Kutubus Sittah Collection)',
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Salin teks hadits lengkap ke clipboard pengguna
 */
export async function copyHadisToClipboard(hadis: HadisItem): Promise<boolean> {
  const text = formatHadisForCopy(hadis);

  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      console.warn('Navigator clipboard gagal, fallback ke execCommand', e);
    }
  }

  // Fallback untuk browser lawas / insecure context
  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-999999px';
      textarea.style.top = '-999999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    } catch (err) {
      console.error('Semua metode copy gagal', err);
      return false;
    }
  }

  return false;
}
