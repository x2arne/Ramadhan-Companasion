import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const suggestions = [
  { to: '/jadwal', label: 'Jadwal Sholat & Imsak' },
  { to: '/quran', label: 'Al-Qur’an 30 Juz' },
  { to: '/ibadah', label: 'Pelacak Ibadah' },
];

export const NotFoundPage: React.FC = () => {
  const { pathname } = useLocation();

  // Tandai halaman ini sebagai 404 untuk tab browser dan mesin pencari
  useEffect(() => {
    const previousTitle = document.title;
    document.title = '404 — Halaman Tidak Ditemukan | Ramadan Companion';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex';
    document.head.appendChild(robots);
    return () => {
      document.title = previousTitle;
      robots.remove();
    };
  }, []);

  return (
    <section
      aria-labelledby="notfound-title"
      className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center py-10"
    >
      <p className="text-8xl font-extrabold leading-none tabular-nums text-accent-700 sm:text-9xl" aria-hidden="true">
        404
      </p>
      <h1 id="notfound-title" className="mt-6 text-2xl font-semibold text-ink-100">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-2 text-base text-ink-300">
        Alamat <code className="break-all rounded bg-ink-800 px-1.5 py-0.5 text-sm text-ink-100">{pathname}</code>{' '}
        tidak ada di situs ini. Periksa lagi penulisannya, atau kembali ke beranda.
      </p>

      <Link
        to="/"
        className="mt-6 inline-flex min-h-[44px] w-fit items-center rounded-lg bg-accent-400 px-5 text-sm font-semibold text-on-accent hover:bg-accent-500"
      >
        Kembali ke beranda
      </Link>

      <div className="mt-10">
        <p className="text-sm text-ink-400">Atau buka halaman ini:</p>
        <ul className="mt-2 divide-y divide-ink-700 border-y border-ink-700">
          {suggestions.map((s) => (
            <li key={s.to}>
              <Link to={s.to} className="block py-3 text-base font-medium text-ink-100 hover:underline underline-offset-4 decoration-accent-500">
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default NotFoundPage;
