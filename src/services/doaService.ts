import { ALL_DOAS } from '../data/doaData.ts';
import type { DoaItem, DoaCategory } from '../types/doa';

const STORAGE_FAVORITES_KEY = 'ramadan_doa_favorites_v1';

/**
 * Ambil daftar ID doa favorit dari localStorage
 */
export function getFavoriteDoaIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_FAVORITES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Gagal membaca favorit doa dari localStorage', e);
  }
  return [];
}

/**
 * Simpan daftar ID doa favorit ke localStorage
 */
function saveFavoriteDoaIds(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error('Gagal menyimpan favorit doa ke localStorage', e);
  }
}

/**
 * Cek apakah doa tertentu masuk favorit
 */
export function isDoaFavorite(id: string): boolean {
  const favs = getFavoriteDoaIds();
  return favs.includes(id);
}

/**
 * Toggle status favorit doa
 */
export function toggleFavoriteDoa(id: string): boolean {
  const favs = getFavoriteDoaIds();
  const index = favs.indexOf(id);
  let isNowFavorite = false;

  if (index >= 0) {
    favs.splice(index, 1);
    isNowFavorite = false;
  } else {
    favs.push(id);
    isNowFavorite = true;
  }

  saveFavoriteDoaIds(favs);
  return isNowFavorite;
}

/**
 * Dapatkan seluruh kumpulan doa
 */
export function getAllDoas(): DoaItem[] {
  return ALL_DOAS;
}

/**
 * Cari doa berdasarkan kata kunci dan kategori
 */
export function searchDoas(
  query: string = '',
  category: DoaCategory | 'all' | 'favorite' = 'all'
): DoaItem[] {
  let list = ALL_DOAS;

  // Filter Kategori
  if (category === 'favorite') {
    const favIds = new Set(getFavoriteDoaIds());
    list = list.filter((d) => favIds.has(d.id));
  } else if (category !== 'all') {
    list = list.filter((d) => d.category === category);
  }

  // Filter Pencarian Teks
  if (query.trim()) {
    const q = query.toLowerCase().trim();
    list = list.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.translation.toLowerCase().includes(q) ||
        d.transliteration.toLowerCase().includes(q) ||
        d.source.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return list;
}

/**
 * Format teks doa untuk disalin ke papan klip (WhatsApp/pesan)
 */
export function formatDoaForCopy(doa: DoaItem): string {
  return `*${doa.title}*
_${doa.source} (${doa.authenticity})_

${doa.arabicText}

"${doa.transliteration}"

*Artinya:*
"${doa.translation}"

${doa.context ? `_Catatan: ${doa.context}_` : ''}

_Dibagikan dari Ramadan Companion_`;
}

/**
 * Salin teks doa ke clipboard peramban
 */
export async function copyDoaToClipboard(doa: DoaItem): Promise<boolean> {
  const text = formatDoaForCopy(doa);
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    console.warn('Clipboard API gagal, mencoba fallback textarea', e);
  }

  // Fallback textarea
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}
