import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-xl bg-surface-elevated border border-ink-700/60 flex items-center justify-center text-accent-700">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-ink-100">Halaman Tidak Ditemukan</h1>
      <p className="text-xs text-ink-400 max-w-sm">
        Rute yang Anda cari tidak tersedia atau sedang dalam tahap penyempurnaan fase berikutnya.
      </p>
      <Link to="/">
        <Button variant="primary" size="sm" leftIcon={<Home className="w-4 h-4" />}>
          Kembali ke Beranda
        </Button>
      </Link>
    </div>
  );
};
