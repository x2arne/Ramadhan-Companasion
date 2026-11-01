// Penyimpanan donatur lewat Upstash Redis (REST). Tanpa dependensi tambahan.
// Buang spasi dan tanda kutip yang sering ikut tertempel di Environment Variables
const clean = (v) => (v || '').trim().replace(/^["']+|["']+$/g, '').trim();
const URL_ = clean(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const TOKEN = clean(process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);

export const isConfigured = () => Boolean(URL_ && TOKEN);

export async function redis(...command) {
  const res = await fetch(URL_, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  if (!res.ok) throw new Error(`Redis error ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

export const LIST_KEY = 'ramadan:donors';
export const MAX_DONORS = 200;
