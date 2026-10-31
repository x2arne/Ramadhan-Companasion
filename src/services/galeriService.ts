import type { RamadanMemory, MemoryCategory } from '../types/galeri.ts';
import { MEMORY_CATEGORIES } from '../types/galeri.ts';
import { getHijriDate } from './hijriService.ts';

const DB_NAME = 'RamadanCompanionDB';
const DB_VERSION = 1;
const STORE_NAME = 'galeri_kenangan';
const LOCAL_STORAGE_KEY = 'ramadan_galeri_kenangan_fallback';

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

// Open IndexedDB safely
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB tidak didukung pada peramban ini'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Initial sample memories
const SAMPLE_MEMORIES: RamadanMemory[] = [
  {
    id: 'sample-1',
    title: 'Buka Puasa Bersama Keluarga',
    description: 'Hangatnya kebersamaan keluarga menyantap kurma dan es blewah segar saat adzan Maghrib berkumandang.',
    imageUrl:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    date: '2027-02-08',
    day: 8,
    month: 2,
    monthName: 'Februari',
    year: 2027,
    hijriFormatted: '1 Ramadan 1448 H',
    ramadanDay: 1,
    location: 'Surabaya, Jawa Timur',
    category: 'buka-puasa',
    categoryLabel: 'Buka Puasa',
    createdAt: new Date('2027-02-08T18:30:00Z').toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Tarawih Pertama di Masjid',
    description: 'Suasana khidmat dan penuh haru saat sholat Isya dan Tarawih berjamaah di malam pertama Ramadan.',
    imageUrl:
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
    date: '2027-02-07',
    day: 7,
    month: 2,
    monthName: 'Februari',
    year: 2027,
    hijriFormatted: 'Malam 1 Ramadan 1448 H',
    ramadanDay: 1,
    location: 'Masjid Nasional Al-Akbar, Surabaya',
    category: 'tarawih',
    categoryLabel: 'Sholat Tarawih',
    createdAt: new Date('2027-02-07T20:15:00Z').toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Sahur Hangat Penuh Syukur',
    description: 'Menikmati sahur bersama dengan menu sederhana dan lantunan tilawah menjelang imsak.',
    imageUrl:
      'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=800&q=80',
    date: '2027-02-15',
    day: 15,
    month: 2,
    monthName: 'Februari',
    year: 2027,
    hijriFormatted: '8 Ramadan 1448 H',
    ramadanDay: 8,
    location: 'Malang, Jawa Timur',
    category: 'sahur',
    categoryLabel: 'Momen Sahur',
    createdAt: new Date('2027-02-15T03:45:00Z').toISOString(),
  },
];

/**
 * Mengambil semua kenangan foto Ramadan dari IndexedDB / localStorage
 */
export async function getAllMemories(): Promise<RamadanMemory[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        let memories: RamadanMemory[] = req.result || [];
        if (memories.length === 0) {
          // Inisialisasi dengan data contoh
          memories = SAMPLE_MEMORIES;
          // Simpan data contoh secara background
          saveSampleMemories(memories);
        }
        // Urutkan dari tanggal terbaru
        memories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        resolve(memories);
      };

      req.onerror = () => {
        resolve(getFallbackMemories());
      };
    });
  } catch (e) {
    console.warn('Gagal membaca IndexedDB, beralih ke localStorage fallback', e);
    return getFallbackMemories();
  }
}

function getFallbackMemories(): RamadanMemory[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed: RamadanMemory[] = JSON.parse(saved);
      return parsed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  } catch (e) {
    console.warn('Fallback localStorage error', e);
  }
  return SAMPLE_MEMORIES;
}

async function saveSampleMemories(memories: RamadanMemory[]): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    memories.forEach((item) => store.put(item));
  } catch (e) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(memories));
    } catch {
      // ignore
    }
  }
}

/**
 * Menyimpan kenangan baru ke IndexedDB dan localStorage
 */
export async function addMemory(
  item: Omit<RamadanMemory, 'id' | 'createdAt' | 'monthName' | 'categoryLabel'>
): Promise<RamadanMemory> {
  const id = `memory-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const monthName = MONTH_NAMES[item.month - 1] || `Bulan ${item.month}`;
  const categoryMeta = MEMORY_CATEGORIES.find((c) => c.id === item.category);
  const categoryLabel = categoryMeta ? categoryMeta.label : 'Kenangan Ramadan';

  const newMemory: RamadanMemory = {
    ...item,
    id,
    monthName,
    categoryLabel,
    createdAt: new Date().toISOString(),
  };

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.add(newMemory);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('IndexedDB write error, saving to localStorage fallback', e);
  }

  // Backup always to localStorage
  try {
    const current = getFallbackMemories().filter((m) => m.id !== id);
    current.unshift(newMemory);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.warn('LocalStorage backup error', e);
  }

  return newMemory;
}

/**
 * Menghapus kenangan berdasarkan ID
 */
export async function deleteMemory(id: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('IndexedDB delete error', e);
  }

  try {
    const current = getFallbackMemories().filter((m) => m.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
  } catch {
    // ignore
  }
}

/**
 * Kompresi gambar client-side menggunakan HTML5 Canvas
 * Mengubah ukuran gambar ke max 1200px dan kompresi JPEG 0.82
 * Menghasilkan Data URL base64 yang ringan (~100-250KB)
 */
export function compressImage(file: File, maxWidth = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(img.src);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
}

/**
 * Menghitung otomatis tanggal Hijriah & hari Ramadan dari objek Date
 */
export function calculateHijriFromDate(date: Date, timezone = 'Asia/Jakarta'): { hijriFormatted: string; ramadanDay?: number } {
  const hijri = getHijriDate(date, timezone);
  const isRamadan = hijri.isRamadan || (date.getFullYear() === 2027 && date.getMonth() === 1 && date.getDate() >= 8);
  
  let ramadanDay: number | undefined;
  if (isRamadan) {
    if (hijri.ramadanDay) {
      ramadanDay = hijri.ramadanDay;
    } else if (date.getFullYear() === 2027 && date.getMonth() === 1) {
      ramadanDay = date.getDate() - 7;
    }
  }

  return {
    hijriFormatted: ramadanDay ? `${ramadanDay} Ramadan ${hijri.year} H` : hijri.formatted,
    ramadanDay: ramadanDay && ramadanDay > 0 ? ramadanDay : undefined,
  };
}
