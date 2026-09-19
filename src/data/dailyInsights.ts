import { PhaseType } from '../types';

export interface DailyInsight {
  greeting: string;
  tagline: string;
  bodyHighlight: string;
  symptomChecklist: string[];
  hormoneStory: string;
  actionableTip: string;
  recommendedActivity: string;
  moodAffirmation: string;
}

export const DAILY_INSIGHTS: Record<PhaseType, DailyInsight> = {
  menstruasi: {
    greeting: 'Selamat beristirahat, tubuhmu sedang memperbarui diri 🌸',
    tagline: 'Fase Menstruasi: Waktu untuk memperlambat ritme dan menyayangi diri',
    bodyHighlight:
      'Dinding rahimmu sedang meluruh secara alami karena sel telur sebelumnya tidak dibuahi. Estrogen dan progesteron berada pada titik terendah, sehingga wajar jika energimu terasa lebih santai dan ingin berada di tempat yang nyaman.',
    symptomChecklist: [
      'Kram panggul atau perut bawah (kontraksi rahim alami)',
      'Pegal di area pinggang atau paha',
      'Keinginan tidur lebih lama atau tubuh cepat lelah',
      'Sensitivitas emosional dan butuh ruang tenang',
    ],
    hormoneStory:
      'Kadar estrogen & progesteron yang rendah membuat pembuluh darah rahim melepaskan prostaglandin. Prostaglandin inilah yang memicu kontraksi kram ringan.',
    actionableTip:
      'Gunakan kompres hangat di perut bawah selama 15-20 menit, minum teh jahe atau chamomile hangat, dan perbanyak makanan kaya zat besi (sayur bayam, daging merah/kacang-kacangan) untuk menjaga cadangan darah.',
    recommendedActivity: 'Peregangan lembut di tempat tidur, yoga restoratif, atau istirahat tidur siang singkat.',
    moodAffirmation: '“Tubuhku memiliki kecerdasan alami. Aku mengizinkan diriku beristirahat tanpa rasa bersalah.”',
  },
  folikular: {
    greeting: 'Halo yang berenergi! Semangatmu mulai bangkit kembali ☀️',
    tagline: 'Fase Folikular: Energi segar, kreativitas, dan motivasi baru',
    bodyHighlight:
      'Haid telah selesai dan ovariummu mulai mematangkan kelompok sel telur baru berkat hormon FSH. Seiring bertambahnya estrogen, energimu meningkat, kulitmu tampak lebih bercahaya, dan pikiranmu lebih fokus.',
    symptomChecklist: [
      'Stamina fisik dan daya tahan meningkat',
      'Suasana hati ceria, percaya diri, dan ramah',
      'Kemampuan belajar dan daya ingat berada di fase optimal',
      'Rasa optimis dan dorongan memulai hal baru',
    ],
    hormoneStory:
      'Hormon FSH (Follicle-Stimulating Hormone) merangsang folikel di ovarium. Folikel ini memproduksi estrogen yang menebalkan kembali lapisan dinding rahim.',
    actionableTip:
      'Manfaatkan fase ini untuk merencanakan proyek baru, berolahraga lebih aktif (kardio, pilates intensif, latihan beban), dan konsumsi makanan fermentasi (yogurt, tempe) serta protein sehat.',
    recommendedActivity: 'Lari pagi, olahraga HIIT atau kekuatan, presentasi kerja, atau mencoba hobi baru.',
    moodAffirmation: '“Energi dan kreativitas mengalir bebas dalam diriku. Hari ini penuh dengan potensi luar biasa.”',
  },
  ovulasi: {
    greeting: 'Kamu sedang berada di puncak pesonamu hari ini! ✨',
    tagline: 'Fase Ovulasi & Jendela Subur: Daya tarik alami dan peluang pembuahan tertinggi',
    bodyHighlight:
      'Lonjakan hormon LH baru saja melepaskan sel telur yang matang dari ovarium. Sel telur siap dibuahi selama 12-24 jam ke depan. Lendir serviks menjadi jernih, elastis, dan licin menyerupai putih telur mentah.',
    symptomChecklist: [
      'Lendir serviks jernih, basah, dan elastis (seperti putih telur mentah)',
      'Gairah seksual (libido) meningkat secara biologis',
      'Sedikit sensasi berdenyut di satu sisi panggul (mittelschmerz)',
      'Sensasi penciuman dan rasa percaya diri mencapai puncak',
    ],
    hormoneStory:
      'Lonjakan tajam LH (Luteinizing Hormone) dan puncak estrogen bekerja bersamaan untuk memicu pelepasan sel telur matang ke dalam tuba falopi.',
    actionableTip:
      'Bagi yang merencanakan kehamilan (promil), ini adalah waktu emas untuk berhubungan intim. Bagi yang menunda kehamilan, gunakan pengaman atau hindari hubungan seksual tanpa proteksi.',
    recommendedActivity: 'Sosialisasi, kencan romantis, negosiasi penting, atau olahraga dinamis yang menyenangkan.',
    moodAffirmation: '“Aku terhubung erat dengan kekuatan feminin, pesona, dan vitalitas tubuhku.”',
  },
  luteal: {
    greeting: 'Saatnya mendengarkan suara hatimu dengan penuh kelembutan 🌙',
    tagline: 'Fase Luteal: Perlambatan tempo, refleksi diri, dan antisipasi siklus',
    bodyHighlight:
      'Korpus luteum sedang memproduksi hormon progesteron dalam jumlah tinggi untuk menjaga ketebalan rahim. Jika tidak terjadi pembuahan, kadar progesteron perlahan menurun menjelang akhir fase ini, yang kerap memicu gejala PMS.',
    symptomChecklist: [
      'Payudara terasa sedikit mengencang atau lebih sensitif',
      'Perut terasa agak kembung atau menahan cairan',
      'Keinginan mengonsumsi camilan manis atau gurih (cravings)',
      'Perubahan mood lebih sensitif atau mudah lelah di sore hari',
    ],
    hormoneStory:
      'Progesteron adalah hormon penenang alami tubuh. Ketika kadarnya mulai menurun beberapa hari sebelum haid, neurotransmitter serotonin juga sedikit menurun, memicu fluktuasi emosi.',
    actionableTip:
      'Cukupi asupan magnesium (cokelat hitam 70%+, pisang, almond) untuk meredakan kembung dan mood swings. Kurangi asupan garam dan kafein berlebih, serta tidur 7-8 jam per malam.',
    recommendedActivity: 'Jalan santai di alam terbuka, journaling, mandi air hangat, atau membaca buku santai.',
    moodAffirmation: '“Perasaanku valid. Aku memeluk setiap emosiku dan memberikan kelembutan untuk diriku sendiri.”',
  },
};
