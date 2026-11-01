import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { AppSettingsProvider } from './context/AppSettingsContext';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './components/layout/AppLayout';

import { HomePage } from './pages/Home/HomePage';
import { JadwalPage } from './pages/Jadwal/JadwalPage';
import { QuranPage } from './pages/Quran/QuranPage';
import { IbadahPage } from './pages/Ibadah/IbadahPage';
import { PengaturanPage } from './pages/Pengaturan/PengaturanPage';
import { DoaPage } from './pages/Doa/DoaPage';
import { HadisPage } from './pages/Hadis/HadisPage';
import { KalenderPage } from './pages/Kalender/KalenderPage';
import { GaleriPage } from './pages/Galeri/GaleriPage';
import { PodcastPage } from './pages/Podcast/PodcastPage';
import { KhazanahPage } from './pages/Khazanah/KhazanahPage';
import { QiblaPage } from './pages/Qibla/QiblaPage';
import { TasbihPage } from './pages/Tasbih/TasbihPage';
import { KartuUcapanPage } from './pages/KartuUcapan/KartuUcapanPage';
import { InfoUpdatePage } from './pages/InfoUpdate/InfoUpdatePage';
import { AuthProvider } from './context/AuthContext';
import { DonasiPage } from './pages/Donasi/DonasiPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
    <BrowserRouter>
      <AppSettingsProvider>
        <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="jadwal" element={<JadwalPage />} />
              <Route path="quran" element={<QuranPage />} />
              <Route path="ibadah" element={<IbadahPage />} />
              <Route path="pengaturan" element={<PengaturanPage />} />
              <Route path="doa" element={<DoaPage />} />
              <Route path="hadis" element={<HadisPage />} />
              <Route path="kalender" element={<KalenderPage />} />
              <Route path="kiblat" element={<QiblaPage />} />
              <Route path="tasbih" element={<TasbihPage />} />
              <Route path="kartu-ucapan" element={<KartuUcapanPage />} />
              <Route path="galeri" element={<GaleriPage />} />
              <Route path="podcast" element={<PodcastPage />} />
              <Route path="khazanah" element={<KhazanahPage />} />
              <Route path="donasi" element={<DonasiPage />} />
              <Route path="info-update" element={<InfoUpdatePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </AuthProvider>
        </ToastProvider>
      </AppSettingsProvider>
    </BrowserRouter>
    </MotionConfig>
  );
};

export default App;
