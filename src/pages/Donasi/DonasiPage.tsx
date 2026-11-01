import React, { useEffect, useMemo, useState } from 'react';
import { DONATION_URL, Donor, donors as manualDonors } from '../../data/donors';

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

export const DonasiPage: React.FC = () => {
  const [liveDonors, setLiveDonors] = useState<Donor[]>([]);
  const [status, setStatus] = useState<'loading' | 'live' | 'offline'>('loading');

  // Ambil daftar otomatis dari webhook; kalau API tidak ada (mis. saat dev lokal) pakai daftar manual saja
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/donors', { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { configured?: boolean; donors?: Donor[] }) => {
        setLiveDonors(Array.isArray(data.donors) ? data.donors : []);
        setStatus(data.configured ? 'live' : 'offline');
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('offline');
      });
    return () => controller.abort();
  }, []);

  const sorted = useMemo(
    () => [...liveDonors, ...manualDonors].sort((a, b) => b.date.localeCompare(a.date)),
    [liveDonors]
  );

  return (
    <div className="space-y-10">
      <section aria-labelledby="donasi-title">
        <h1 id="donasi-title" className="text-3xl font-semibold text-ink-100">
          Dukung Ramadan Companion
        </h1>
        <p className="mt-3 max-w-prose text-base text-ink-300">
          Situs ini gratis dipakai. Donasi membantu biaya hosting dan pengembangan fitur berikutnya.
          Donasi ini untuk developer, bukan zakat atau sedekah ke lembaga.
        </p>
        <a
          href={DONATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-accent-400 px-6 text-base font-semibold text-on-accent hover:bg-accent-500"
        >
          Donasi lewat SociaBuzz
          <span className="sr-only"> (buka di tab baru)</span>
        </a>
        <p className="mt-3 text-sm text-ink-400">Kamu akan diarahkan ke halaman sociabuzz.com/x2n4x/tribe.</p>
      </section>

      <section aria-labelledby="donatur-title">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="donatur-title" className="text-2xl font-semibold text-ink-100">
            Daftar donatur
          </h2>
          <p className="text-sm tabular-nums text-ink-300">{sorted.length} donatur</p>
        </div>
        <p className="mt-2 max-w-prose text-sm text-ink-400">
          {status === 'live'
            ? 'Daftar ini terisi otomatis saat donasi lewat SociaBuzz berhasil.'
            : 'Daftar ini diperbarui developer setelah donasi dikonfirmasi.'}
        </p>

        {status === 'loading' ? (
          <p className="mt-6 text-sm text-ink-400" role="status">Memuat daftar donatur…</p>
        ) : sorted.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-ink-600 p-6 text-center">
            <p className="text-base font-medium text-ink-100">Belum ada donatur.</p>
            <p className="mt-1 text-sm text-ink-300">Jadi yang pertama, namamu akan muncul di sini.</p>
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-ink-700 border-y border-ink-700">
            {sorted.map((d, i) => (
              <li key={`${d.date}-${d.name}-${i}`} className="py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="text-base font-semibold text-ink-100">{d.name}</p>
                  <p className="text-sm text-ink-400">
                    <time dateTime={d.date}>{formatDate(d.date)}</time>
                    {d.amount ? <span className="ml-3 font-medium tabular-nums text-accent-700">{formatRupiah(d.amount)}</span> : null}
                  </p>
                </div>
                {d.message ? <p className="mt-1 text-sm text-ink-300">{d.message}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default DonasiPage;
