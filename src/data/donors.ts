export interface Donor {
  name: string;
  /** Format YYYY-MM-DD */
  date: string;
  /** Nominal dalam rupiah (opsional) */
  amount?: number;
  /** Pesan dari donatur (opsional) */
  message?: string;
}

export const DONATION_URL = 'https://sociabuzz.com/x2n4x/tribe';

/**
 * Daftar donatur. Tambahkan donatur baru di sini setelah donasinya dikonfirmasi.
 * Contoh:
 * { name: 'Budi', date: '2027-02-10', amount: 25000, message: 'Semangat, Ramadan Mubarak!' },
 * Gunakan nama "Anonim" kalau donatur tidak mau namanya tampil.
 */
export const donors: Donor[] = [];
