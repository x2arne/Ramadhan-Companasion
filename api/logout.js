import { clearCookie, sameOrigin } from './_session.js';

// POST /api/logout -> hapus sesi
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!sameOrigin(req)) return res.status(403).json({ error: 'Forbidden' });
  res.setHeader('Set-Cookie', clearCookie());
  return res.status(200).json({ ok: true });
}
