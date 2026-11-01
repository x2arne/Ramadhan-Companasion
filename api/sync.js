import { isConfigured, redis } from './_store.js';
import { readSession, sameOrigin } from './_session.js';

// Hanya data amalan yang boleh disinkronkan (tanpa webhook, lokasi, atau berkas besar)
const ALLOWED_KEYS = new Set([
  'ramadan_worship_history_v1',
  'ramadan_quran_last_read',
  'ramadan_quran_bookmarks',
  'ramadan_hadis_favorites_v1',
  'ramadan_doa_favorites_v1',
  'ramadan_tasbih_stats_v1',
]);
const MAX_VALUE = 200 * 1024;
const MAX_TOTAL = 600 * 1024;

const dataKey = (sub) => `ramadan:sync:${sub}`;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const user = readSession(req);
  if (!user) return res.status(401).json({ error: 'Belum login' });
  if (!isConfigured()) return res.status(503).json({ error: 'Penyimpanan belum dikonfigurasi' });

  try {
    if (req.method === 'GET') {
      const raw = await redis('GET', dataKey(user.sub));
      const stored = raw ? JSON.parse(raw) : { updatedAt: 0, data: {} };
      return res.status(200).json(stored);
    }

    if (req.method === 'PUT') {
      if (!sameOrigin(req)) return res.status(403).json({ error: 'Forbidden' });
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const incoming = body?.data;
      if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
        return res.status(400).json({ error: 'Data tidak valid' });
      }
      const data = {};
      let total = 0;
      for (const [key, value] of Object.entries(incoming)) {
        if (!ALLOWED_KEYS.has(key) || typeof value !== 'string') continue;
        if (value.length > MAX_VALUE) return res.status(413).json({ error: `Data ${key} terlalu besar` });
        total += value.length;
        data[key] = value;
      }
      if (total > MAX_TOTAL) return res.status(413).json({ error: 'Data terlalu besar' });
      const now = Date.now();
      const updatedAt = Math.min(Number(body?.updatedAt) || now, now + 60 * 60 * 1000);
      await redis('SET', dataKey(user.sub), JSON.stringify({ updatedAt, data }));
      return res.status(200).json({ ok: true, updatedAt });
    }

    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('sync', err);
    return res.status(500).json({ error: 'Gagal memproses sinkronisasi' });
  }
}
