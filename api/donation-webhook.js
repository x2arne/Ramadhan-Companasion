import { timingSafeEqual, createHash } from 'node:crypto';
import { isConfigured, redis, LIST_KEY, MAX_DONORS } from './_store.js';

const safeEqual = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};

const pick = (obj, keys) => {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && String(v).trim() !== '') return v;
  }
  return undefined;
};

const clean = (value, max) =>
  String(value ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, max);

// Terima berbagai kemungkinan nama field karena format payload SociaBuzz belum terverifikasi.
export function normalize(body) {
  const data = body?.data && typeof body.data === 'object' ? body.data : body;
  const status = pick(data, ['status', 'payment_status', 'transaction_status']);
  if (status && /fail|pending|expire|cancel|refund|deny/i.test(String(status))) return null;

  const anonymous = ['true', '1', 'yes'].includes(String(pick(data, ['is_anonymous', 'anonymous', 'hide_name']) ?? '').toLowerCase());
  const rawName = pick(data, ['supporter_name', 'donator_name', 'donor_name', 'supporter', 'donator', 'name', 'nama']);
  const name = anonymous || !rawName ? 'Anonim' : clean(rawName, 60) || 'Anonim';

  const amount = Number(String(pick(data, ['amount', 'amount_raw', 'total', 'price', 'nominal']) ?? '0').replace(/[^\d.]/g, '')) || 0;
  const message = clean(pick(data, ['message', 'note', 'pesan', 'supporter_message']), 200);

  const parsed = new Date(pick(data, ['created_at', 'paid_at', 'date', 'timestamp']) ?? Date.now());
  const date = (Number.isNaN(parsed.getTime()) ? new Date() : parsed).toISOString().slice(0, 10);

  const id =
    pick(data, ['id', 'transaction_id', 'order_id', 'invoice_id']) ??
    createHash('sha256').update(JSON.stringify([name, amount, message, date])).digest('hex').slice(0, 24);

  return { id: String(id), donor: { name, date, amount, message } };
}

// POST /api/donation-webhook?key=RAHASIA
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const secret = process.env.DONATION_WEBHOOK_KEY;
  if (!secret || !isConfigured()) {
    return res.status(503).json({ error: 'Server belum dikonfigurasi' });
  }
  const supplied = req.query?.key ?? req.headers['x-webhook-key'] ?? '';
  if (!safeEqual(supplied, secret)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = Object.fromEntries(new URLSearchParams(body)); }
    }
    const result = normalize(body);
    if (!result) return res.status(200).json({ ok: true, ignored: true });

    // Cegah dobel catat bila webhook dikirim ulang
    const fresh = await redis('SET', `ramadan:donation:${result.id}`, '1', 'NX', 'EX', 60 * 60 * 24 * 30);
    if (fresh === null) return res.status(200).json({ ok: true, duplicate: true });

    await redis('LPUSH', LIST_KEY, JSON.stringify(result.donor));
    await redis('LTRIM', LIST_KEY, 0, MAX_DONORS - 1);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('donation-webhook: gagal memproses', err);
    // Kunci sudah valid di titik ini, jadi aman menampilkan penyebab untuk membantu diagnosa
    return res.status(500).json({ error: 'Gagal memproses', detail: String(err?.message || err).slice(0, 200) });
  }
}
