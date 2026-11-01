import { createSession, sessionCookie, sessionReady, sameOrigin } from './_session.js';

// POST /api/auth-google { credential } -> verifikasi ID token Google lalu buat sesi
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!sessionReady()) return res.status(503).json({ error: 'Login belum dikonfigurasi di server' });
  if (!sameOrigin(req)) return res.status(403).json({ error: 'Forbidden' });

  const credential = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body).credential; } catch { return ''; } })() : req.body?.credential;
  if (!credential || typeof credential !== 'string') return res.status(400).json({ error: 'Credential kosong' });

  try {
    const r = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    if (!r.ok) return res.status(401).json({ error: 'Token Google tidak valid' });
    const t = await r.json();
    const issuerOk = t.iss === 'accounts.google.com' || t.iss === 'https://accounts.google.com';
    const notExpired = Number(t.exp) > Math.floor(Date.now() / 1000);
    if (t.aud !== process.env.GOOGLE_CLIENT_ID || !issuerOk || !notExpired || !t.sub) {
      return res.status(401).json({ error: 'Token Google tidak valid' });
    }
    // Hanya simpan id, nama, dan foto. Email tidak disimpan.
    const user = { sub: String(t.sub), name: String(t.name || 'Pengguna').slice(0, 80), picture: t.picture ? String(t.picture) : undefined };
    res.setHeader('Set-Cookie', sessionCookie(createSession(user)));
    return res.status(200).json({ user });
  } catch (err) {
    console.error('auth-google', err);
    return res.status(502).json({ error: 'Gagal memverifikasi token' });
  }
}
