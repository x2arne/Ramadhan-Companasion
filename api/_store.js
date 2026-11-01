// Penyimpanan donatur lewat Upstash Redis (REST). Tanpa dependensi tambahan.
// Buang spasi dan tanda kutip yang sering ikut tertempel di Environment Variables
const clean = (v) => (v || '').trim().replace(/^["']+|[\"']+$/g, '').trim();

// Pasangan URL+token harus berasal dari sumber yang sama. Coba satu per satu bila ditolak (401/403).
const candidates = [
  { url: clean(process.env.UPSTASH_REDIS_REST_URL), token: clean(process.env.UPSTASH_REDIS_REST_TOKEN) },
  { url: clean(process.env.KV_REST_API_URL), token: clean(process.env.KV_REST_API_TOKEN) },
].filter((c) => c.url && c.token);

export const isConfigured = () => candidates.length > 0;

let preferred = 0;

export async function redis(...command) {
  let lastStatus = 0;
  for (let i = 0; i < candidates.length; i++) {
    const idx = (preferred + i) % candidates.length;
    const { url, token } = candidates[idx];
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(command),
    });
    if (res.status === 401 || res.status === 403) {
      lastStatus = res.status;
      continue;
    }
    if (!res.ok) throw new Error(`Redis error ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    preferred = idx;
    return data.result;
  }
  throw new Error(`Redis error ${lastStatus || 'tidak ada kredensial'} (semua pasangan URL/token ditolak)`);
}

export const LIST_KEY = 'ramadan:donors';
export const MAX_DONORS = 200;
