# Setup log donatur otomatis (Vercel)

Alurnya: SociaBuzz mengirim webhook ke `/api/donation-webhook`, data disimpan di Upstash Redis, lalu halaman `/donasi` membacanya lewat `/api/donors`.

1. **Database**: Vercel → project → Storage → Create → Upstash Redis (Marketplace) → hubungkan ke project.
   Variabel `KV_REST_API_URL` dan `KV_REST_API_TOKEN` (atau `UPSTASH_REDIS_REST_*`) terisi otomatis.
2. **Kunci rahasia**: Settings → Environment Variables → tambah `DONATION_WEBHOOK_KEY` berisi teks acak panjang.
   Opsional: `DONATION_SHOW_AMOUNT=true` jika nominal boleh tampil di halaman (default: disembunyikan).
3. **Redeploy** project.
4. **SociaBuzz**: di dashboard cari pengaturan webhook/integrasi, isi URL:
   `https://DOMAIN-KAMU/api/donation-webhook?key=ISI_DONATION_WEBHOOK_KEY`
5. **Tes** (ganti domain dan key):
   ```bash
   curl -X POST "https://DOMAIN-KAMU/api/donation-webhook?key=KEY" \
     -H "Content-Type: application/json" \
     -d '{"id":"tes-1","supporter_name":"Budi","amount":25000,"message":"Semangat!"}'
   ```
   Lalu buka `/donasi`. Donatur "Budi" harus muncul dalam sekitar 30 detik.

Catatan: nama field payload SociaBuzz belum terverifikasi. Fungsi menerima beberapa kemungkinan nama
(`supporter_name`, `donator_name`, `name`, `amount`, `message`, dll). Kalau data asli tidak masuk,
lihat payload aslinya di Vercel → Logs lalu sesuaikan fungsi `normalize` di `api/donation-webhook.js`.

---

# Setup login Google + simpan amalan

1. **Google Cloud Console** → APIs & Services → Credentials → Create Credentials → OAuth client ID → *Web application*.
   Authorized JavaScript origins: `https://DOMAIN-KAMU` dan `http://localhost:5173`. (Tidak perlu redirect URI.)
2. Vercel → Environment Variables:
   - `VITE_GOOGLE_CLIENT_ID` = Client ID tadi (dipakai tombol di browser)
   - `GOOGLE_CLIENT_ID` = Client ID yang sama (dipakai server untuk memverifikasi token)
   - `SESSION_SECRET` = teks acak panjang (untuk tanda tangan cookie sesi)
3. Pakai database Upstash Redis yang sama dengan log donatur. Redeploy.
4. Buka `/pengaturan` → bagian "Akun dan penyimpanan amalan" → masuk dengan Google.

Yang disinkronkan: catatan ibadah, penanda dan terakhir baca Al-Qur'an, favorit doa dan hadis, statistik tasbih.
Tidak disinkronkan: pengaturan, lokasi, webhook Discord, nada alarm, galeri.
Aturan gabung: data yang paling baru diubah yang dipakai. Bila perangkat belum pernah sinkron dan datanya berbeda dengan akun, pengguna ditanya mau pakai yang mana.
