import React from 'react';
import { Card, CardContent } from '../../components/common/Card';
import { GoogleSignInButton } from '../../components/common/GoogleSignInButton';
import { useAuth } from '../../context/AuthContext';

const formatTime = (ms: number) =>
  new Date(ms).toLocaleString('id-ID', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

export const AccountSection: React.FC = () => {
  const { clientId, user, loading, syncState, lastSync, error, handleCredential, signOut, syncNow } = useAuth();

  return (
    <Card>
      <CardContent className="space-y-4 p-5 sm:p-6">
        <div>
          <h2 className="text-xl font-semibold text-ink-100">Akun dan penyimpanan amalan</h2>
          <p className="mt-1 max-w-prose text-sm text-ink-300">
            Masuk dengan Google agar catatan ibadah, penanda Al-Qur’an, favorit doa dan hadis, serta statistik tasbih
            tersimpan di akunmu dan ikut ke perangkat lain. Pengaturan, lokasi, dan webhook Discord tetap di perangkat ini.
          </p>
        </div>

        {!clientId ? (
          <p className="rounded-lg border border-ink-700 p-3 text-sm text-ink-300">
            Login Google belum diatur oleh pengelola situs. Data amalan tetap tersimpan di perangkat ini.
          </p>
        ) : loading ? (
          <p className="text-sm text-ink-400" role="status">Memeriksa sesi…</p>
        ) : user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {user.picture ? (
                <img src={user.picture} alt="" width={44} height={44} referrerPolicy="no-referrer" className="h-11 w-11 rounded-full border border-ink-700" />
              ) : null}
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-ink-100">{user.name}</p>
                <p className="text-sm text-ink-300" role="status">
                  {syncState === 'syncing' && 'Menyinkronkan…'}
                  {syncState === 'ok' && lastSync ? `Tersimpan ke akun, ${formatTime(lastSync)}` : null}
                  {syncState === 'error' && 'Sinkronisasi gagal. Coba lagi.'}
                  {syncState === 'idle' && 'Masuk dengan Google'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={syncNow}
                disabled={syncState === 'syncing'}
                className="inline-flex min-h-[44px] items-center rounded-lg bg-accent-400 px-5 text-sm font-semibold text-on-accent hover:bg-accent-500 disabled:opacity-60"
              >
                Sinkronkan sekarang
              </button>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex min-h-[44px] items-center rounded-lg border border-ink-600 px-5 text-sm font-semibold text-ink-100 hover:bg-ink-800"
              >
                Keluar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <GoogleSignInButton clientId={clientId} onCredential={handleCredential} />
            <p className="text-sm text-ink-400">Yang disimpan hanya nama, foto profil, dan data amalan. Email tidak disimpan.</p>
          </div>
        )}

        {error ? (
          <p className="text-sm text-rose-700" role="alert">{error}</p>
        ) : null}
      </CardContent>
    </Card>
  );
};
