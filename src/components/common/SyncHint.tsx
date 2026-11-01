import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/** Pengingat singkat di halaman amalan agar data tidak hilang saat ganti perangkat. */
export const SyncHint: React.FC = () => {
  const { clientId, user, loading, syncState } = useAuth();
  if (!clientId || loading) return null;

  if (user) {
    return (
      <p className="text-sm text-ink-300" role="status">
        {syncState === 'error' ? 'Amalan belum tersimpan ke akun. ' : 'Amalanmu tersimpan ke akun Google. '}
        <Link to="/pengaturan" className="font-medium text-accent-700 underline underline-offset-4">Kelola akun</Link>
      </p>
    );
  }
  return (
    <p className="text-sm text-ink-300">
      Amalan ini baru tersimpan di perangkat ini.{' '}
      <Link to="/pengaturan" className="font-medium text-accent-700 underline underline-offset-4">
        Masuk dengan Google
      </Link>{' '}
      agar ikut ke perangkat lain.
    </p>
  );
};
