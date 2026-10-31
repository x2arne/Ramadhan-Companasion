export type HadisTopic =
  | 'keutamaan-ramadan'
  | 'fiqih-puasa'
  | 'sahur-iftar'
  | 'tarawih-lailatul-qadar'
  | 'quran-tilawah'
  | 'zakat-sedekah'
  | 'adab-akhlak';

export type HadisGrade =
  | 'Muttafaq \'Alaih'
  | 'Shahih Bukhari'
  | 'Shahih Muslim'
  | 'Shahih'
  | 'Hasan';

export interface HadisItem {
  id: string;
  title: string;
  topic: HadisTopic;
  arabicText: string;
  translation: string;
  narrator: string; // Sahabat perawi e.g. "Abu Hurairah radhiyallahu 'anhu"
  bookName: string; // e.g. "Shahih Al-Bukhari", "Shahih Muslim", "Sunan At-Tirmidzi"
  referenceNumber: string; // e.g. "No. 1894", "No. 1151"
  chapter?: string; // Kitab & Bab
  grade: HadisGrade;
  explanation?: string; // Penjelasan faidah & hikmah (dibedakan secara visual dari matan hadits)
  tags: string[];
}

export interface EducationalArticle {
  id: string;
  title: string;
  category: HadisTopic;
  summary: string;
  readTimeMinutes: number;
  content: {
    sectionTitle: string;
    body: string;
    quotedText?: {
      arabic?: string;
      translation: string;
      source: string;
    };
  }[];
  sources: string[];
}
