import { readSession } from './_session.js';

// GET /api/me -> { user } atau { user: null }
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  return res.status(200).json({ user: readSession(req) });
}
