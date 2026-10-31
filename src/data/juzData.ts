export interface JuzInfo {
  juzNumber: number;
  name: string;
  arabicName: string;
  startSurahNumber: number;
  startSurahName: string;
  startVerse: number;
  endSurahNumber: number;
  endSurahName: string;
  endVerse: number;
}

export const ALL_30_JUZ: JuzInfo[] = [
  { juzNumber: 1, name: 'Al-Fatihah', arabicName: 'الجزء الأول', startSurahNumber: 1, startSurahName: 'Al-Fatihah', startVerse: 1, endSurahNumber: 2, endSurahName: 'Al-Baqarah', endVerse: 141 },
  { juzNumber: 2, name: 'Sayaqul', arabicName: 'الجزء الثاني', startSurahNumber: 2, startSurahName: 'Al-Baqarah', startVerse: 142, endSurahNumber: 2, endSurahName: 'Al-Baqarah', endVerse: 252 },
  { juzNumber: 3, name: 'Tilkar Rusul', arabicName: 'الجزء الثالث', startSurahNumber: 2, startSurahName: 'Al-Baqarah', startVerse: 253, endSurahNumber: 3, endSurahName: "Ali 'Imran", endVerse: 92 },
  { juzNumber: 4, name: 'Lan Tanalu', arabicName: 'الجزء الرابع', startSurahNumber: 3, startSurahName: "Ali 'Imran", startVerse: 93, endSurahNumber: 4, endSurahName: "An-Nisa'", endVerse: 23 },
  { juzNumber: 5, name: 'Wal Muhshanat', arabicName: 'الجزء الخامس', startSurahNumber: 4, startSurahName: "An-Nisa'", startVerse: 24, endSurahNumber: 4, endSurahName: "An-Nisa'", endVerse: 147 },
  { juzNumber: 6, name: 'La Yuhibbullah', arabicName: 'الجزء السادس', startSurahNumber: 4, startSurahName: "An-Nisa'", startVerse: 148, endSurahNumber: 5, endSurahName: "Al-Ma'idah", endVerse: 81 },
  { juzNumber: 7, name: "Wa Iza Sami'u", arabicName: 'الجزء السابع', startSurahNumber: 5, startSurahName: "Al-Ma'idah", startVerse: 82, endSurahNumber: 6, endSurahName: "Al-An'am", endVerse: 110 },
  { juzNumber: 8, name: 'Wa Lau Annana', arabicName: 'الجزء الثامن', startSurahNumber: 6, startSurahName: "Al-An'am", startVerse: 111, endSurahNumber: 7, endSurahName: "Al-A'raf", endVerse: 87 },
  { juzNumber: 9, name: 'Qalal Mala-u', arabicName: 'الجزء التاسع', startSurahNumber: 7, startSurahName: "Al-A'raf", startVerse: 88, endSurahNumber: 8, endSurahName: 'Al-Anfal', endVerse: 40 },
  { juzNumber: 10, name: "Wa'lamu", arabicName: 'الجزء العاشر', startSurahNumber: 8, startSurahName: 'Al-Anfal', startVerse: 41, endSurahNumber: 9, endSurahName: 'At-Taubah', endVerse: 92 },
  { juzNumber: 11, name: 'Ya\'tazirun', arabicName: 'الجزء الحادي عشر', startSurahNumber: 9, startSurahName: 'At-Taubah', startVerse: 93, endSurahNumber: 11, endSurahName: 'Hud', endVerse: 5 },
  { juzNumber: 12, name: 'Wa Ma Min Dabbah', arabicName: 'الجزء الثاني عشر', startSurahNumber: 11, startSurahName: 'Hud', startVerse: 6, endSurahNumber: 12, endSurahName: 'Yusuf', endVerse: 52 },
  { juzNumber: 13, name: 'Wa Ma Ubari-u', arabicName: 'الجزء الثالث عشر', startSurahNumber: 12, startSurahName: 'Yusuf', startVerse: 53, endSurahNumber: 14, endSurahName: 'Ibrahim', endVerse: 52 },
  { juzNumber: 14, name: 'Rubama', arabicName: 'الجزء الرابع عشر', startSurahNumber: 15, startSurahName: 'Al-Hijr', startVerse: 1, endSurahNumber: 16, endSurahName: 'An-Nahl', endVerse: 128 },
  { juzNumber: 15, name: 'Subhanallazi', arabicName: 'الجزء الخامس عشر', startSurahNumber: 17, startSurahName: "Al-Isra'", startVerse: 1, endSurahNumber: 18, endSurahName: 'Al-Kahf', endVerse: 74 },
  { juzNumber: 16, name: 'Qala Alam', arabicName: 'الجزء السادس عشر', startSurahNumber: 18, startSurahName: 'Al-Kahf', startVerse: 75, endSurahNumber: 20, endSurahName: 'Ta-Ha', endVerse: 135 },
  { juzNumber: 17, name: 'Iqtaraba Lin Nasi', arabicName: 'الجزء السابع عشر', startSurahNumber: 21, startSurahName: 'Al-Anbiya', startVerse: 1, endSurahNumber: 22, endSurahName: 'Al-Hajj', endVerse: 78 },
  { juzNumber: 18, name: 'Qad Aflaha', arabicName: 'الجزء الثامن عشر', startSurahNumber: 23, startSurahName: "Al-Mu'minun", startVerse: 1, endSurahNumber: 25, endSurahName: 'Al-Furqan', endVerse: 20 },
  { juzNumber: 19, name: 'Wa Qalal Lazina', arabicName: 'الجزء التاسع عشر', startSurahNumber: 25, startSurahName: 'Al-Furqan', startVerse: 21, endSurahNumber: 27, endSurahName: 'An-Naml', endVerse: 55 },
  { juzNumber: 20, name: 'Amman Khalaqa', arabicName: 'الجزء العشرون', startSurahNumber: 27, startSurahName: 'An-Naml', startVerse: 56, endSurahNumber: 29, endSurahName: "Al-'Ankabut", endVerse: 45 },
  { juzNumber: 21, name: 'Utlu Ma Uhiya', arabicName: 'الجزء الحادي والعشرون', startSurahNumber: 29, startSurahName: "Al-'Ankabut", startVerse: 46, endSurahNumber: 33, endSurahName: 'Al-Ahzab', endVerse: 30 },
  { juzNumber: 22, name: 'Wa Man Yaqnut', arabicName: 'الجزء الثاني والعشرون', startSurahNumber: 33, startSurahName: 'Al-Ahzab', startVerse: 31, endSurahNumber: 36, endSurahName: 'Ya-Sin', endVerse: 27 },
  { juzNumber: 23, name: 'Wa Maliya', arabicName: 'الجزء الثالث والعشرون', startSurahNumber: 36, startSurahName: 'Ya-Sin', startVerse: 28, endSurahNumber: 39, endSurahName: 'Az-Zumar', endVerse: 31 },
  { juzNumber: 24, name: 'Fa Man Azlamu', arabicName: 'الجزء الرابع والعشرون', startSurahNumber: 39, startSurahName: 'Az-Zumar', startVerse: 32, endSurahNumber: 41, endSurahName: 'Fussilat', endVerse: 46 },
  { juzNumber: 25, name: 'Ilaihi Yuraddu', arabicName: 'الجزء الخامس والعشرون', startSurahNumber: 41, startSurahName: 'Fussilat', startVerse: 47, endSurahNumber: 45, endSurahName: 'Al-Jasiyah', endVerse: 37 },
  { juzNumber: 26, name: 'Ha-Mim', arabicName: 'الجزء السادس والعشرون', startSurahNumber: 46, startSurahName: 'Al-Ahqaf', startVerse: 1, endSurahNumber: 51, endSurahName: 'Az-Zariyat', endVerse: 30 },
  { juzNumber: 27, name: 'Qala Fa Ma Khatbukum', arabicName: 'الجزء السابع والعشرون', startSurahNumber: 51, startSurahName: 'Az-Zariyat', startVerse: 31, endSurahNumber: 57, endSurahName: 'Al-Hadid', endVerse: 29 },
  { juzNumber: 28, name: "Qad Sami'allah", arabicName: 'الجزء الثامن والعشرون', startSurahNumber: 58, startSurahName: 'Al-Mujadilah', startVerse: 1, endSurahNumber: 66, endSurahName: 'At-Tahrim', endVerse: 12 },
  { juzNumber: 29, name: 'Tabarakallazi (Juz Tabarak)', arabicName: 'الجزء التاسع والعشرون', startSurahNumber: 67, startSurahName: 'Al-Mulk', startVerse: 1, endSurahNumber: 77, endSurahName: 'Al-Mursalat', endVerse: 50 },
  { juzNumber: 30, name: "'Amma Yatasa'alun (Juz 'Amma)", arabicName: 'الجزء الثلاثون', startSurahNumber: 78, startSurahName: "An-Naba'", startVerse: 1, endSurahNumber: 114, endSurahName: 'An-Nas', endVerse: 6 },
];
