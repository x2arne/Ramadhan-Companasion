import { isConfigured, redis, LIST_KEY, MAX_DONORS } from './_store.js';

// GET /api/donors -> daftar donatur terbaru untuk halaman /donasi
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!isConfigured()) {
    return res.status(200).json({ configured: false, donors: [] });
  }
  try {
    const showAmount = process.env.DONATION_SHOW_AMOUNT === 'true';
    const rows = await redis('LRANGE', LIST_KEY, 0, MAX_DONORS - 1);
    const donors = rows
      .map((row) => {
        try { return JSON.parse(row); } catch { return null; }
      })
      .filter(Boolean)
      .map((d) => ({
        name: d.name,
        date: d.date,
        message: d.message || undefined,
        amount: showAmount ? d.amount : undefined,
      }));
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=120');
    return res.status(200).json({ configured: true, donors });
  } catch (err) {
    console.error('donors: gagal membaca daftar', err);
    return res.status(502).json({ configured: true, donors: [], error: 'Gagal membaca daftar donatur' });
  }
}
