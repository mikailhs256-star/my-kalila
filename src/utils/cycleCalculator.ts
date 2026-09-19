import { CycleInput, CycleCalculationResult, PhaseDetail, PhaseType } from '../types';
import { evaluateExpertSystem } from './expertSystem';

// Helper to parse date string YYYY-MM-DD to UTC Date to avoid timezone shifts
export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

// Format UTC Date to YYYY-MM-DD
export function formatDateISO(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Add days to UTC date
export function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

// Difference in calendar days (b - a)
export function daysBetween(dateA: Date, dateB: Date): number {
  const utc1 = Date.UTC(dateA.getUTCFullYear(), dateA.getUTCMonth(), dateA.getUTCDate());
  const utc2 = Date.UTC(dateB.getUTCFullYear(), dateB.getUTCMonth(), dateB.getUTCDate());
  return Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

// Indonesian localized date format
export function formatIndonesianDate(dateStr: string, includeDayName = false): string {
  if (!dateStr) return '';
  const date = parseDate(dateStr);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const dayName = days[date.getUTCDay()];
  const day = date.getUTCDate();
  const monthName = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  if (includeDayName) {
    return `${dayName}, ${day} ${monthName} ${year}`;
  }
  return `${day} ${monthName} ${year}`;
}

export function formatShortIndonesianDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = parseDate(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${date.getUTCDate()} ${months[date.getUTCMonth()]}`;
}

export function calculateCycle(input: CycleInput): CycleCalculationResult {
  const { lastPeriodDate, cycleLength, periodDuration } = input;
  const lmpDate = parseDate(lastPeriodDate);

  // Next period date: LMP + cycleLength days
  const nextPeriod = addDays(lmpDate, cycleLength);
  const nextPeriodDateStr = formatDateISO(nextPeriod);

  // Ovulation day: Typically 14 days before next period
  // (In a 28-day cycle, this is day 14: LMP + 14 days)
  const daysToOvulation = cycleLength - 14;
  const ovulationDate = addDays(lmpDate, daysToOvulation);
  const ovulationDateStr = formatDateISO(ovulationDate);

  // Fertile window: 5 days before ovulation + ovulation day + 1 day after
  const fertileStart = addDays(ovulationDate, -5);
  const fertileEnd = addDays(ovulationDate, 1);
  const fertileWindowStart = formatDateISO(fertileStart);
  const fertileWindowEnd = formatDateISO(fertileEnd);

  // Peak fertile dates: 2 days before ovulation, 1 day before, and ovulation day
  const peakFertileDates = [
    formatDateISO(addDays(ovulationDate, -2)),
    formatDateISO(addDays(ovulationDate, -1)),
    ovulationDateStr,
  ];

  // Follicular Phase: Day 1 (LMP) to day before ovulation
  const follicularStart = lastPeriodDate;
  const follicularEnd = formatDateISO(addDays(ovulationDate, -1));

  // Luteal Phase: Day after ovulation until day before next period
  const lutealStart = formatDateISO(addDays(ovulationDate, 1));
  const lutealEnd = formatDateISO(addDays(nextPeriod, -1));

  // Menstrual phase end
  const menstrualEnd = formatDateISO(addDays(lmpDate, periodDuration - 1));

  // Current day calculations relative to "today"
  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const daysSinceLmp = daysBetween(lmpDate, todayUTC);
  const currentDayOfCycle = daysSinceLmp >= 0 ? (daysSinceLmp % cycleLength) + 1 : 1;
  const daysUntilNextPeriod = daysBetween(todayUTC, nextPeriod);
  const isPeriodLate = daysUntilNextPeriod < 0;
  const daysLate = isPeriodLate ? Math.abs(daysUntilNextPeriod) : 0;

  // Determine current phase based on cycle days
  let currentPhase: PhaseType = 'folikular';
  if (currentDayOfCycle <= periodDuration) {
    currentPhase = 'menstruasi';
  } else if (currentDayOfCycle < daysToOvulation - 2) {
    currentPhase = 'folikular';
  } else if (currentDayOfCycle <= daysToOvulation + 1) {
    currentPhase = 'ovulasi';
  } else {
    currentPhase = 'luteal';
  }

  // Phase progress
  const cycleProgressPercent = Math.min(100, Math.max(0, Math.round((currentDayOfCycle / cycleLength) * 100)));

  // Detailed info for all phases
  const phaseDetails: Record<PhaseType, PhaseDetail> = {
    menstruasi: {
      id: 'menstruasi',
      name: 'Fase Menstruasi (Haid)',
      shortDesc: 'Peluruhan dinding rahim secara alami dan pembersihan siklik.',
      fullDesc: 'Fase ini menandai awal siklus baru. Karena sel telur dari siklus sebelumnya tidak dibuahi, kadar hormon estrogen dan progesteron menurun, sehingga lapisan rahim (endometrium) meluruh.',
      startDate: lastPeriodDate,
      endDate: menstrualEnd,
      dayStart: 1,
      dayEnd: periodDuration,
      energyLevel: 'Rendah - Butuh Istirahat',
      hormones: 'Estrogen & Progesteron berada di titik terendah.',
      symptoms: [
        'Kram atau rasa mulas di perut bagian bawah',
        'Pegal-pegal di punggung atau pinggang',
        'Rasa lelah dan kebutuhan tidur bertambah',
        'Sensitivitas emosional yang menginginkan ketenangan'
      ],
      selfCareTips: [
        'Gunakan kompres hangat (heating pad/botol air hangat) di area perut bawah',
        'Luangkan waktu untuk tidur siang singkat dan istirahat berkualitas',
        'Lakukan peregangan tubuh santai atau yoga restoratif ringan',
        'Ganti pembalut, menstrual cup, atau tampon secara teratur setiap 4-6 jam'
      ],
      nutritionTips: [
        'Perbanyak asupan zat besi (bayam, daging tanpa lemak, kacang merah) untuk mencegah anemia',
        'Konsumsi vitamin C (jeruk, stroberi) untuk membantu penyerapan zat besi',
        'Minum teh herbal hangat seperti jahe atau chamomile untuk merelaksasi otot rahim',
        'Hindari konsumsi kafein dan garam berlebih yang dapat memperburuk kram serta kembung'
      ]
    },
    folikular: {
      id: 'folikular',
      name: 'Fase Folikular',
      shortDesc: 'Pematangan sel telur dan pembaharuan energi tubuh.',
      fullDesc: 'Dimulai sejak hari pertama haid dan berlanjut hingga sebelum sel telur dilepaskan. Kelenjar pituitari memproduksi hormon FSH (Follicle-Stimulating Hormone) yang merangsang ovarium untuk menyiapkan sel telur matang.',
      startDate: follicularStart,
      endDate: follicularEnd,
      dayStart: 1,
      dayEnd: daysToOvulation,
      energyLevel: 'Meningkat & Segar',
      hormones: 'FSH aktif; hormon Estrogen meningkat secara bertahap.',
      symptoms: [
        'Energi fisik dan stamina mulai meningkat',
        'Suasana hati lebih ceria, percaya diri, dan bersemangat',
        'Fokus mental dan ketajaman berpikir meningkat',
        'Kulit tampak lebih bercahaya karena efek hidrasi estrogen'
      ],
      selfCareTips: [
        'Manfaatkan energi prima untuk memulai proyek baru atau rutinitas baru',
        'Waktu yang sangat baik untuk olahraga kardio, lari santai, atau latihan kekuatan',
        'Rencanakan kegiatan sosial atau pertemuan penting di fase bersemangat ini'
      ],
      nutritionTips: [
        'Konsumsi makanan fermentasi (yogurt, tempe, kimchi) untuk mendukung metabolisme estrogen',
        'Perbanyak karbohidrat kompleks (oatmeal, beras merah, ubi jalar)',
        'Asupan protein bersih untuk regenerasi sel otot dan jaringan'
      ]
    },
    ovulasi: {
      id: 'ovulasi',
      name: 'Fase Ovulasi (Masa Subur)',
      shortDesc: 'Pelepasan sel telur matang dengan peluang pembuahan tertinggi.',
      fullDesc: 'Lonjakan drastis hormon LH (Luteinizing Hormone) menyebabkan folikel melepaskan sel telur yang matang ke dalam tuba falopi. Sel telur bertahan sekitar 12-24 jam, sedangkan sperma dapat bertahan 3-5 hari di dalam saluran reproduksi wanita.',
      startDate: fertileWindowStart,
      endDate: fertileWindowEnd,
      dayStart: daysToOvulation - 4,
      dayEnd: daysToOvulation + 1,
      energyLevel: 'Puncak Tertinggi',
      hormones: 'Lonjakan tajam hormon LH dan puncak estrogen.',
      symptoms: [
        'Lendir serviks menjadi jernih, elastis, dan licin seperti putih telur mentah',
        'Libido atau gairah seksual meningkat secara alami',
        'Sedikit kram atau sensasi nyeri ringan di satu sisi panggul (mittelschmerz)',
        'Suhu tubuh basal (BBT) akan sedikit meningkat setelah ovulasi terjadi'
      ],
      selfCareTips: [
        'Jika sedang merencanakan kehamilan (promil): Ini adalah jendela waktu terbaik untuk berhubungan intim',
        'Jika sedang menunda kehamilan: Gunakan metode kontrasepsi pengaman atau hindari hubungan seksual tanpa pelindung',
        'Catat perubahan lendir serviks untuk mengenali ritme biologis tubuhmu'
      ],
      nutritionTips: [
        'Konsumsi makanan kaya antioksidan (buah beri, paprika, sayuran berdaun hijau gelap)',
        'Asam lemak omega-3 (ikan salmon, kacang kenari, biji chia) untuk mendukung kesehatan sel telur',
        'Pastikan minum minimal 2-2,5 liter air per hari untuk menjaga viskositas lendir serviks yang sehat'
      ]
    },
    luteal: {
      id: 'luteal',
      name: 'Fase Luteal',
      shortDesc: 'Persiapan rahim dan fase refleksi sebelum siklus berikutnya.',
      fullDesc: 'Setelah ovulasi, folikel yang kosong berubah menjadi korpus luteum yang memproduksi progesteron. Progesteron membuat dinding rahim tebal dan siap menerima embrio. Jika tidak terjadi pembuahan, korpus luteum menyusut dan kadar hormon turun menjelang haid baru.',
      startDate: lutealStart,
      endDate: lutealEnd,
      dayStart: daysToOvulation + 1,
      dayEnd: cycleLength,
      energyLevel: 'Menurun & Menenangkan',
      hormones: 'Progesteron meningkat dominan, kemudian menurun bersama estrogen di akhir fase.',
      symptoms: [
        'Gejala PMS (payudara lebih kencang atau sensitif, perut terasa kembung)',
        'Perubahan suasana hati (mood swings), rasa cemas ringan, atau mudah tersentuh',
        'Keinginan makan makanan tertentu (cravings), terutama yang manis atau gurih',
        'Kualitas tidur kadang menurun atau terasa lebih cepat lelah di sore hari'
      ],
      selfCareTips: [
        'Prioritaskan batasan diri dan hindari jadwal yang terlalu padat',
        'Lakukan aktivitas menenangkan seperti membaca buku, mandi air hangat, atau journaling',
        'Ganti olahraga berat dengan jalan santai, pilates ringan, atau berenang santai',
        'Ciptakan suasana tidur yang sejuk dan minim paparan layar sebelum tidur'
      ],
      nutritionTips: [
        'Konsumsi makanan kaya magnesium (cokelat hitam murni 70%+, pisang, kacang almond) untuk relaksasi otot dan mood',
        'Bahan pangan kaya vitamin B6 (biji bunga matahari, kentang panggang, dada ayam) untuk menyeimbangkan neurotransmitter',
        'Kurangi konsumsi garam dan makanan olahan untuk mencegah penumpukan cairan (water retention/kembung)'
      ]
    }
  };

  // Predict the next 3 future cycles
  const upcomingCycles: CycleCalculationResult['upcomingCycles'] = [];
  let currentBasePeriod = nextPeriod;

  for (let i = 1; i <= 3; i++) {
    const cyclePeriodStart = currentBasePeriod;
    const cycleOvulation = addDays(cyclePeriodStart, daysToOvulation);
    const cycleFertileStart = addDays(cycleOvulation, -5);
    const cycleFertileEnd = addDays(cycleOvulation, 1);

    upcomingCycles.push({
      cycleIndex: i,
      periodStartDate: formatDateISO(cyclePeriodStart),
      ovulationDate: formatDateISO(cycleOvulation),
      fertileWindowRange: `${formatShortIndonesianDate(formatDateISO(cycleFertileStart))} - ${formatShortIndonesianDate(formatDateISO(cycleFertileEnd))}`,
    });

    currentBasePeriod = addDays(cyclePeriodStart, cycleLength);
  }

  return {
    input,
    nextPeriodDate: nextPeriodDateStr,
    daysUntilNextPeriod,
    isPeriodLate,
    daysLate,
    ovulationDate: ovulationDateStr,
    fertileWindowStart,
    fertileWindowEnd,
    peakFertileDates,
    follicularStart,
    follicularEnd,
    lutealStart,
    lutealEnd,
    currentDayOfCycle,
    currentPhase,
    currentPhaseDetail: phaseDetails[currentPhase],
    allPhaseDetails: phaseDetails,
    cycleProgressPercent,
    expertSystem: evaluateExpertSystem(input),
    upcomingCycles,
  };
}
