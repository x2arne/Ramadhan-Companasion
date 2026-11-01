import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE = 'rc_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 hari

const sign = (payload) => createHmac('sha256', process.env.SESSION_SECRET).update(payload).digest('base64url');

export const sessionReady = () => Boolean(process.env.SESSION_SECRET && process.env.GOOGLE_CLIENT_ID);

export function createSession(user) {
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Math.floor(Date.now() / 1000) + MAX_AGE })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function readSession(req) {
  if (!process.env.SESSION_SECRET) return null;
  const header = req.headers?.cookie || '';
  const raw = header.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${COOKIE}=`));
  if (!raw) return null;
  const [payload, sig] = raw.slice(COOKIE.length + 1).split('.');
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.sub || data.exp < Math.floor(Date.now() / 1000)) return null;
    return { sub: String(data.sub), name: String(data.name || ''), picture: data.picture ? String(data.picture) : undefined };
  } catch {
    return null;
  }
}

export const sessionCookie = (token) => `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${MAX_AGE}`;
export const clearCookie = () => `${COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;

// Tolak permintaan lintas-situs untuk metode yang mengubah data
export function sameOrigin(req) {
  const origin = req.headers?.origin;
  if (!origin) return true;
  try { return new URL(origin).host === req.headers.host; } catch { return false; }
}
