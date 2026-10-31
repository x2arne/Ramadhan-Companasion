import type { EducationalArticle } from '../types/hadis';

export const ALL_ARTICLES: EducationalArticle[] = [
  {
    id: 'fiqih-puasa-lengkap',
    title: 'Panduan Lengkap Fiqih Puasa: Syarat, Rukun, dan Pembatal',
    category: 'fiqih-puasa',
    summary:
      'Penjelasan komprehensif mengenai rukun, syarat sah, syarat wajib, pembatal puasa, serta hal-hal yang dimaafkan menurut jumhur ulama.',
    readTimeMinutes: 6,
    content: [
      {
        sectionTitle: '1. Makna & Kedudukan Puasa Ramadan',
        body: 'Secara bahasa, puasa (ash-shiyam) bermakna al-imsak yaitu menahan diri. Secara istilah syar\'i, puasa adalah menahan diri dari segala hal yang membatalkan puasa mulai dari terbit fajar shadiq (waktu Subuh) sampai terbenamnya matahari (waktu Maghrib) disertai dengan niat karena Allah Ta\'ala. Puasa Ramadan merupakan salah satu rukun Islam yang agung yang diwajibkan bagi setiap mukallaf.',
        quotedText: {
          arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ',
          translation:
            'Wahai orang-orang yang beriman! Diwajibkan atas kamu berpuasa sebagaimana diwajibkan atas orang-orang sebelum kamu agar kamu bertakwa.',
          source: 'QS. Al-Baqarah: 183',
        },
      },
      {
        sectionTitle: '2. Syarat Wajib & Syarat Sah Puasa',
        body: 'Syarat wajib puasa adalah kriteria seseorang dikenai kewajiban berpuasa, yaitu: Islam, baligh (dewasa), berakal sehat, mampu secara fisik (tidak sedang sakit parah atau lansia lemah), dan mukim (tidak sedang safar yang membolehkan qashar). Adapun syarat sah puasa adalah: beragama Islam, mumayyiz, suci dari haid dan nifas bagi wanita, serta berpuasa pada waktu yang diperbolehkan (bukan pada hari raya Idul Fitri, Idul Adha, atau hari Tasyrik).',
      },
      {
        sectionTitle: '3. Rukun-Rukun Puasa',
        body: 'Rukun puasa ada dua:\n1. Niat: Menetapkan kehendak di dalam hati untuk berpuasa semata mengharap ridha Allah. Untuk puasa wajib Ramadan, niat wajib dilakukan pada malam hari sebelum fajar (tabyitun niyyah) berdasarkan hadits Nabi ﷺ: "Barangsiapa tidak berniat puasa sebelum fajar, maka tidak ada puasa baginya" (HR. Abu Dawud & Tirmidzi).\n2. Imsak: Menahan diri dari makan, minum, hubungan suami-istri, dan hal-hal yang membatalkan puasa mulai dari terbit fajar shadiq hingga terbenam matahari.',
      },
      {
        sectionTitle: '4. Hal-Hal yang Membatalkan Puasa',
        body: 'Perkara yang membatalkan puasa jika dilakukan dengan sadar, sengaja, dan tanpa paksaan meliputi:\n• Memasukkan makanan, minuman, atau benda padat/cair ke dalam rongga tubuh terbuka (mulut, hidung, telinga) secara sengaja.\n• Melakukan hubungan biologis suami-istri di siang hari Ramadan (dikenakan kaffarah berat: memerdekakan budak, atau berpuasa 2 bulan berturut-turut, atau memberi makan 60 orang miskin).\n• Muntah yang disengaja.\n• Keluarnya darah haid atau nifas walau sesaat menjelang terbenam matahari.\n• Mengeluarkan sperma secara sengaja (dengan onani atau sentuhan).\n• Hilang akal (gila, mabuk, atau pingsan sepanjang hari).\n• Murtad (keluar dari Islam).',
      },
      {
        sectionTitle: '5. Hal-Hal yang Dibolehkan & Dimaafkan Saat Berpuasa',
        body: 'Syariat Islam memberikan kemudahan (taysir) dalam beberapa keadaan:\n• Lupa: Makan atau minum karena benar-benar lupa tidak membatalkan puasa.\n• Berkumur-kumur dan istinsyaq (menghirup air ke hidung) saat berwudhu, asalkan tidak berlebih-lebihan.\n• Mandi, berendam, atau menyiram kepala dengan air dingin untuk menyegarkan badan.\n• Menelan ludah yang murni dari dalam mulut sendiri.\n• Meneteskan obat tetes mata atau telinga (menurut pendapat terkuat para ulama kontemporer selama gendang telinga utuh).\n• Mengambil sampel darah (tes lab) atau suntikan intramuskular/intravena yang bukan pengganti nutrisi makanan.',
      },
    ],
    sources: [
      'Al-Qur\'an Al-Karim (QS. Al-Baqarah: 183-187)',
      'Shahih Al-Bukhari & Shahih Muslim',
      'Al-Fiqh Al-Islami wa Adillatuh karya Wahbah Az-Zuhaili',
      'Bidayatul Mujtahid karya Ibnu Rusyd',
    ],
  },
  {
    id: 'lailatul-qadar-itikaf',
    title: 'Menjemput Keberkahan Malam Lailatul Qadar & I\'tikaf',
    category: 'tarawih-lailatul-qadar',
    summary:
      'Panduan amalan, tanda-tanda, dan adab i\'tikaf untuk meraih malam kemuliaan yang lebih baik daripada seribu bulan.',
    readTimeMinutes: 5,
    content: [
      {
        sectionTitle: '1. Keagungan Malam Seribu Bulan',
        body: 'Lailatul Qadar adalah malam penuh berkah di mana Al-Qur\'an pertama kali diturunkan dari Lauhul Mahfuzh ke Baitul \'Izzah di langit dunia. Pada malam ini para malaikat, termasuk Malaikat Jibril (Ar-Ruh), turun ke bumi membawa keselamatan, ampunan, dan keberkahan bagi hamba-hamba Allah yang bertakwa hingga fajar menyingsing.',
        quotedText: {
          arabic: 'لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ ۝ تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ ۝ سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ',
          translation:
            'Malam kemuliaan itu lebih baik daripada seribu bulan. Pada malam itu turun para malaikat dan Ruh (Jibril) dengan izin Tuhannya untuk mengatur segala urusan. Sejahteralah (malam itu) sampai terbit fajar.',
          source: 'QS. Al-Qadr: 3-5',
        },
      },
      {
        sectionTitle: '2. Waktu & Tanda-Tanda Lailatul Qadar',
        body: 'Rasulullah ﷺ memerintahkan umatnya untuk memburu Lailatul Qadar pada sepuluh malam terakhir bulan Ramadan, terkhusus pada malam-malam ganjil (malam ke-21, 23, 25, 27, dan 29). Di antara tanda-tandanya menurut hadits shahih:\n• Malam terasa tenang, tenteram, udara tidak terlalu panas dan tidak terlalu dingin.\n• Matahari pada keesokan paginya terbit dengan cahaya putih bersih tanpa sinar yang terik menyengat (HR. Muslim No. 762).',
      },
      {
        sectionTitle: '3. Syariat & Tata Cara I\'tikaf',
        body: 'I\'tikaf secara syar\'i adalah berdiam diri di masjid dengan niat mendekatkan diri kepada Allah. Sunnah muakkadah i\'tikaf dilakukan pada 10 hari terakhir Ramadan sebagaimana dicontohkan Rasulullah ﷺ hingga wafat beliau.\n• Rukun I\'tikaf: Niat dan berdiam di masjid.\n• Syarat Masjid: Masjid yang ditegakkan shalat lima waktu berjamaah (dan lebih utama masjid jami\' yang mendirikan shalat Jumat).\n• Aktivitas Utama: Menghidupkan waktu dengan shalat malam, tilawah Al-Qur\'an, istighfar, dzikir pagi-petang, dan tadabbur ilmu.',
      },
      {
        sectionTitle: '4. Doa Utama Malam Lailatul Qadar',
        body: 'Rasulullah ﷺ mengajarkan Ummul Mukminin Aisyah radhiyallahu \'anha doa yang ringkas namun mencakup segala kebaikan dunia dan akhirat:\n"Allahumma innaka \'afuwwun tuhibbul \'afwa fa\'fu \'anni" (Ya Allah, sesungguhnya Engkau Maha Pemaaf dan menyukai pemaafan, maka maafkanlah aku). Meminta al-\'Afwu berarti memohon penghapusan dosa hingga tuntas tanpa tersisa bekas hisab sedikit pun.',
      },
    ],
    sources: [
      'Al-Qur\'an Al-Karim (QS. Al-Qadr: 1-5, QS. Ad-Dukhan: 1-6)',
      'Shahih Al-Bukhari & Shahih Muslim',
      'Lathaiful Ma\'arif karya Ibnu Rajab Al-Hanbali',
      'Fathul Bari Syarh Shahih Al-Bukhari karya Ibnu Hajar Al-Asqalani',
    ],
  },
  {
    id: 'fiqih-zakat-fitrah',
    title: 'Fiqih Zakat Fitrah: Ketentuan, Waktu, Takaran, & Mustahiq',
    category: 'zakat-sedekah',
    summary:
      'Panduan lengkap menunaikan zakat fitrah: besaran takaran beras, hukum uang konversi, batas akhir penyerahan, dan golongan penerima.',
    readTimeMinutes: 5,
    content: [
      {
        sectionTitle: '1. Pengertian & Hukum Zakat Fitrah',
        body: 'Zakat fitrah adalah zakat badan atau jiwa yang wajib dikeluarkan oleh setiap muslim, baik laki-laki maupun perempuan, merdeka maupun hamba, tua maupun muda, yang memiliki kelebihan makanan pokok untuk diri dan tanggungannya pada malam dan hari raya Idul Fitri.',
        quotedText: {
          arabic: 'فَرَضَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ زَكَاةَ الْفِطْرِ صَاعًا مِنْ تَمْرٍ أَوْ صَاعًا مِنْ شَعِيرٍ عَلَى الْعَبْدِ وَالْحُرِّ وَالذَّكَرِ وَالأُنْثَى وَالصَّغِيرِ وَالْكَبِيرِ مِنَ الْمُسْلِمِينَ',
          translation:
            'Rasulullah ﷺ mewajibkan zakat fitrah sebanyak satu sha\' kurma atau satu sha\' gandum atas hamba sahaya, orang merdeka, laki-laki, perempuan, anak kecil, dan orang dewasa dari kaum muslimin.',
          source: 'HR. Bukhari No. 1503, Muslim No. 984',
        },
      },
      {
        sectionTitle: '2. Takaran Makanan Pokok & Konversi Uang',
        body: 'Takaran zakat fitrah menurut nash hadits adalah 1 sha\'. Di Indonesia yang makanan pokoknya adalah beras:\n• Standar Kemenag RI / BAZNAS: 1 sha\' setara dengan 2,5 kg atau 3,5 liter beras berkualitas baik yang biasa dikonsumsi sehari-hari.\n• Sebagian ulama (seperti Mazhab Syafi\'i mu\'tamad) menganjurkan 2,7 hingga 3,0 kg sebagai bentuk kehati-hatian (ihtiyath).\n• Zakat fitrah dengan Uang: Mazhab Hanafi dan sebagian fatwa kontemporer (termasuk MUI dan BAZNAS) membolehkan pembayaran zakat fitrah dengan uang tunai senilai harga 2,5 kg beras di daerah masing-masing demi kemaslahatan dan kebutuhan fakir miskin.',
      },
      {
        sectionTitle: '3. Waktu Menunaikan Zakat Fitrah',
        body: 'Para fuqaha membagi waktu pengeluaran zakat fitrah ke dalam lima tingkatan:\n1. Waktu Mubah: Sejak awal masuknya bulan Ramadan.\n2. Waktu Wajib: Sejak terbenamnya matahari di hari terakhir Ramadan (malam Idul Fitri).\n3. Waktu Afdhal (Paling Utama): Setelah shalat Subuh sebelum pelaksanaan shalat Idul Fitri.\n4. Waktu Makruh: Setelah shalat Idul Fitri sampai terbenamnya matahari pada 1 Syawwal.\n5. Waktu Haram & Berdosa: Mengakhirkan pembayaran setelah lewat hari raya Idul Fitri tanpa udzur syar\'i (statusnya menjadi hutang qadha dan bernilai sedekah biasa).',
      },
      {
        sectionTitle: '4. Golongan Penerima (Mustahiq)',
        body: 'Jumhur ulama merujuk kepada 8 asnaf penerima zakat sebagaimana disebutkan dalam Surah At-Taubah ayat 60. Namun demikian, prioritas tertinggi zakat fitrah secara khusus adalah fakir dan miskin agar kebutuhan pangan mereka terpenuhi di hari raya dan tidak perlu meminta-minta, sebagaimana sabda Nabi ﷺ: "Cukupilah mereka (kaum miskin) dari meminta-minta pada hari ini" (HR. Ad-Daraquthni).',
      },
    ],
    sources: [
      'Shahih Al-Bukhari & Shahih Muslim',
      'Fatwa Majelis Ulama Indonesia (MUI) No. 65 Tahun 2022',
      'Standar Zakat Fitrah BAZNAS RI',
      'Al-Majmu\' Syarah Al-Muhadzdzab karya Imam An-Nawawi',
    ],
  },
  {
    id: 'adab-akhlak-puasa',
    title: 'Adab & Akhlak Berpuasa Menurut Sunnah Nabi ﷺ',
    category: 'adab-akhlak',
    summary:
      'Menjaga kesucian puasa dari gugurnya pahala: etika lisan, menahan amarah, kedermawanan sosial, dan adab menyambut berbuka.',
    readTimeMinutes: 4,
    content: [
      {
        sectionTitle: '1. Puasa Anggota Badan & Hati',
        body: 'Imam Al-Ghazali dalam Ihya\' Ulumiddin membagi tingkatan puasa menjadi tiga:\n1. Shaumul \'Umum (Puasa Orang Awam): Sekadar menahan perut dan kemaluan dari syahwat biologis.\n2. Shaumul Khusus (Puasa Orang Saleh): Menahan mata, telinga, lisan, tangan, kaki, dan seluruh anggota badan dari dosa dan kemaksiatan.\n3. Shaumul Khususil Khusus (Puasa Para Nabi & Shiddiqin): Puasa hati dari segala bisikan duniawi yang melalaikan diri dari mengingat Allah Ta\'ala.',
      },
      {
        sectionTitle: '2. Menjaga Lisan: Jauhi Ghibah & Namimah',
        body: 'Banyak orang berpuasa tetapi tidak memperoleh apapun selain lapar dan dahaga karena lisannya tidak dijaga dari perkataan haram. Rasulullah ﷺ bersabda:\n"Betapa banyak orang yang berpuasa, bagian dari puasanya hanyalah lapar dan dahaga semata" (HR. Ahmad No. 8693, Ibnu Majah No. 1690, Shahih). Hindari membicarakan aib orang lain (ghibah), adu domba (namimah), berdusta, dan berdebat kusir yang menimbulkan permusuhan.',
      },
      {
        sectionTitle: '3. Menahan Emosi & Kalimat Penenang',
        body: 'Ketika ada orang yang mencaci, memprovokasi, atau mengajak berselisih, sunnah Nabi ﷺ mengajarkan agar seorang muslim menahan diri dan mengulangi kalimat: "Inni imru\'un sho-im" (Sesungguhnya aku sedang berpuasa). Kalimat ini menjadi pengingat bagi diri sendiri untuk meredam nafsu amarah dan pengingat bagi orang lain agar menghormati kesucian ibadah puasa.',
      },
      {
        sectionTitle: '4. Memperbanyak Amal Shalih & Kedermawanan',
        body: 'Adab mulia orang berpuasa tercermin dari kedermawanan sosialnya. Mencontoh Rasulullah ﷺ yang paling dermawan di bulan Ramadan, seorang muslim dianjurkan rajin berbagi makanan buka puasa (iftar), memperbanyak sedekah subuh, membantu orang yang kesusahan, memperbanyak tilawah Al-Qur\'an, serta menjaga shalat berjamaah di masjid.',
      },
    ],
    sources: [
      'Shahih Al-Bukhari & Shahih Muslim',
      'Ihya\' Ulumiddin karya Hujjatul Islam Imam Al-Ghazali',
      'Sunan Ibnu Majah & Musnad Ahmad',
      'Madarijus Salikin karya Ibnu Qayyim Al-Jauziyyah',
    ],
  },
];
