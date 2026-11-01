// Sinkronisasi amalan ke akun Google lewat /api/sync.
// Hanya kunci di SYNC_KEYS yang dikirim. Pengaturan, lokasi, webhook, dan berkas besar tetap di perangkat.

export const SYNC_KEYS = [
  'ramadan_worship_history_v1',
  'ramadan_quran_last_read',
  'ramadan_quran_bookmarks',
  'ramadan_hadis_favorites_v1',
  'ramadan_doa_favorites_v1',
  'ramadan_tasbih_stats_v1',
] as const;

const LOCAL_UPDATED_KEY = 'ramadan_sync_local_updated';
const LAST_SYNC_KEY = 'ramadan_sync_last';
const PUSH_DELAY_MS = 4000;

const rawSet = Storage.prototype.setItem;

const readNumber = (key: string): number => {
  try {
    return Number(localStorage.getItem(key)) || 0;
  } catch {
    return 0;
  }
};

export const getLastSync = (): number | null => readNumber(LAST_SYNC_KEY) || null;

const collectLocal = (): Record<string, string> => {
  const data: Record<string, string> = {};
  for (const key of SYNC_KEYS) {
    const value = localStorage.getItem(key);
    if (value !== null) data[key] = value;
  }
  return data;
};

const applyData = (data: Record<string, string>) => {
  for (const key of SYNC_KEYS) {
    if (typeof data[key] === 'string') rawSet.call(localStorage, key, data[key]);
    else localStorage.removeItem(key);
  }
};

const markSynced = (updatedAt: number) => {
  rawSet.call(localStorage, LOCAL_UPDATED_KEY, String(updatedAt));
  rawSet.call(localStorage, LAST_SYNC_KEY, String(Date.now()));
};

interface ServerSnapshot {
  updatedAt: number;
  data: Record<string, string>;
}

const request = async (method: 'GET' | 'PUT', body?: unknown): Promise<Response> => {
  const res = await fetch('/api/sync', {
    method,
    credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Sinkronisasi gagal (${res.status})`);
  return res;
};

export async function pushNow(): Promise<void> {
  const updatedAt = readNumber(LOCAL_UPDATED_KEY) || Date.now();
  await request('PUT', { data: collectLocal(), updatedAt });
  markSynced(updatedAt);
}

/** Dipanggil sekali setelah login. 'pulled' berarti data lokal diganti, halaman perlu dimuat ulang. */
export async function pullAndMerge(): Promise<'pushed' | 'pulled' | 'none'> {
  const server = (await (await request('GET')).json()) as ServerSnapshot;
  const local = collectLocal();
  const hasLocal = Object.keys(local).length > 0;
  const hasServer = server.updatedAt > 0 && Object.keys(server.data || {}).length > 0;
  const localUpdated = readNumber(LOCAL_UPDATED_KEY);

  if (!hasServer) {
    if (!hasLocal) return 'none';
    if (!localUpdated) rawSet.call(localStorage, LOCAL_UPDATED_KEY, String(Date.now()));
    await pushNow();
    return 'pushed';
  }

  let useServer = server.updatedAt > localUpdated;
  // Perangkat ini belum pernah sinkron tapi sudah punya data: tanya pengguna, jangan menimpa diam-diam
  if (hasLocal && localUpdated === 0) {
    useServer = window.confirm(
      'Data amalan di akun Google berbeda dengan data di perangkat ini.\n\nOK = pakai data akun\nBatal = pakai data perangkat ini'
    );
  }

  if (useServer) {
    applyData(server.data);
    markSynced(server.updatedAt);
    return 'pulled';
  }
  rawSet.call(localStorage, LOCAL_UPDATED_KEY, String(Date.now()));
  await pushNow();
  return 'pushed';
}

/** Pantau perubahan pada kunci amalan, lalu kirim otomatis setelah jeda singkat. */
export function startAutoPush(onSynced: () => void, onError: () => void): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const original = Storage.prototype.setItem;

  Storage.prototype.setItem = function patched(this: Storage, key: string, value: string) {
    original.call(this, key, value);
    if (this === localStorage && (SYNC_KEYS as readonly string[]).includes(key)) {
      original.call(this, LOCAL_UPDATED_KEY, String(Date.now()));
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        pushNow().then(onSynced).catch(onError);
      }, PUSH_DELAY_MS);
    }
  };

  return () => {
    Storage.prototype.setItem = original;
    if (timer) clearTimeout(timer);
  };
}
