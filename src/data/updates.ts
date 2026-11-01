export interface UpdateEntry {
  /** Format YYYY-MM-DD */
  date: string;
  title: string;
  tag: 'Baru' | 'Perbaikan';
  items: string[];
}

/** Tambahkan pembaruan terbaru di paling atas. */
export const updates: UpdateEntry[] = [
  {
    date: '2026-11-01',
    title: 'Login Google dan penyimpanan amalan',
    tag: 'Baru',
    items: [
      'Masuk dengan Google dari halaman Pengaturan.',
      'Catatan ibadah, penanda Al-Qur’an, favorit doa dan hadis, serta statistik tasbih tersimpan ke akun dan ikut ke perangkat lain.',
      'Hanya nama, foto profil, dan data amalan yang disimpan. Email tidak disimpan.',
    ],
  },
  {
    date: '2026-11-01',
    title: 'Dukung Developer dan daftar donatur',
    tag: 'Baru',
    items: [
      'Halaman donasi lewat SociaBuzz.',
      'Daftar donatur tampil di halaman yang sama.',
    ],
  },
  {
    date: '2026-11-01',
    title: 'Tampilan baru',
    tag: 'Baru',
    items: [
      'Tema terang hijau lembut dan kuning hangat, serta mode gelap biru malam yang kini benar-benar berfungsi.',
      'Banner Ramadan Mubarak dan halaman Home yang bercerita, dari sahur sampai berbagi.',
      'Halaman 404 untuk alamat yang tidak dikenal.',
    ],
  },
  {
    date: '2026-11-01',
    title: 'Aksesibilitas dan teks',
    tag: 'Perbaikan',
    items: [
      'Zoom layar diaktifkan kembali dan fokus keyboard terlihat jelas.',
      'Animasi mengikuti pengaturan “kurangi gerakan” di perangkat.',
      'Teks kecil diperbesar, kontras warna dinaikkan, dan teks rusak di panduan webhook diperbaiki.',
    ],
  },
];
