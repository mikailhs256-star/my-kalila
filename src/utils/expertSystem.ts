import { CycleInput, DiagnosisOutput, ExpertSystemEvaluation, DisorderType } from '../types';

/**
 * Mesin Inferensi Forward Chaining & Certainty Factor
 * Berdasarkan Publikasi Ilmiah:
 * "Sistem Pemantau Siklus Haid Sebagai Media Manajemen Kesehatan Reproduksi Menggunakan Metode Forward Chaining dan Certainty Factor"
 * Penulis: Dimas Alva Rizki, Supriyono, Feri Wibowo, Muhammad Hamka (2026)
 * Validasi Pakar Medis: dr. Novianti Nurzanah (Puskesmas Patimuan, Cilacap)
 * Bulletin of Computer Science Research, Vol 6, No 3, Hal 920-930, DOI: 10.47065/bulletincsr.v6i3.1064
 */

export function evaluateExpertSystem(input: CycleInput): ExpertSystemEvaluation {
  const D = input.periodDuration; // Durasi haid (hari)
  const S = input.cycleLength; // Panjang siklus (hari)
  const padCount = input.padChangeCount ?? 5; // Ganti pembalut per hari
  const hasBloodClots = Boolean(input.hasBloodClots);
  const hasSeverePain = Boolean(input.hasSeverePain);

  // 1. KATEGORISASI PARAMETER FISIOLOGIS (Tabel 1-4)
  
  // Tabel 1: Durasi Haid (D)
  let durationCode: 'durasi_pendek' | 'durasi_normal' | 'durasi_panjang';
  let durationLabel: string;
  let durationDesc: string;
  if (D < 2) {
    durationCode = 'durasi_pendek';
    durationLabel = 'Pendek (< 2 hari)';
    durationDesc = 'Durasi haid terlalu singkat dari batas normal medis.';
  } else if (D <= 7) {
    durationCode = 'durasi_normal';
    durationLabel = 'Normal (2 - 7 hari)';
    durationDesc = 'Durasi haid berada dalam batas wajar fisiologis.';
  } else {
    durationCode = 'durasi_panjang';
    durationLabel = 'Panjang (> 7 hari)';
    durationDesc = 'Durasi haid melebihi batas normal medis (berlangsung lama).';
  }

  // Tabel 2: Panjang Siklus (S)
  let cycleCode: 'siklus_pendek' | 'siklus_normal' | 'siklus_panjang';
  let cycleLabel: string;
  let cycleDesc: string;
  if (S < 21) {
    cycleCode = 'siklus_pendek';
    cycleLabel = 'Pendek (< 21 hari)';
    cycleDesc = 'Siklus datang terlalu sering (interval antar haid terlalu cepat).';
  } else if (S <= 35) {
    cycleCode = 'siklus_normal';
    cycleLabel = 'Normal (21 - 35 hari)';
    cycleDesc = 'Panjang siklus berada dalam rentang wajar dan sehat.';
  } else {
    cycleCode = 'siklus_panjang';
    cycleLabel = S >= 90 ? 'Sangat Panjang (≥ 90 hari)' : 'Panjang (> 35 hari)';
    cycleDesc = S >= 90
      ? 'Haid terhenti minimal 3 bulan (indikasi Amenore Sekunder).'
      : 'Siklus datang terlambat atau jarang (jarak antar haid renggang).';
  }

  // Tabel 3: Volume Darah (V)
  let volumeCode: 'volume_sedikit' | 'volume_normal' | 'volume_banyak';
  let volumeLabel: string;
  let volumeDesc: string;
  if (hasBloodClots || padCount >= 7) {
    volumeCode = 'volume_banyak';
    volumeLabel = 'Banyak (≥ 7 kali/hari atau bergumpal)';
    volumeDesc = 'Pendarahan haid berlebih atau disertai gumpalan darah.';
  } else if (padCount >= 4 && padCount <= 6) {
    volumeCode = 'volume_normal';
    volumeLabel = 'Normal (4 - 6 kali/hari)';
    volumeDesc = 'Frekuensi pergantian pembalut dalam batas standar.';
  } else {
    volumeCode = 'volume_sedikit';
    volumeLabel = 'Sedikit (1 - 3 kali/hari)';
    volumeDesc = 'Volume pendarahan sangat sedikit.';
  }

  // Tabel 4: Gejala Nyeri (G)
  let symptomCode: 'gejala_nyeri' | 'gejala_normal';
  let symptomLabel: string;
  let symptomDesc: string;
  if (hasSeverePain) {
    symptomCode = 'gejala_nyeri';
    symptomLabel = 'Nyeri / Kram Berat Terdeteksi';
    symptomDesc = 'Terdapat keluhan kram perut hebat, nyeri panggul, atau sakit punggung yang mengganggu aktivitas.';
  } else {
    symptomCode = 'gejala_normal';
    symptomLabel = 'Normal / Nyeri Wajar';
    symptomDesc = 'Tidak ada keluhan nyeri hebat yang membatasi mobilitas harian.';
  }

  // 2. FORWARD CHAINING INFERENCE & CERTAINTY FACTOR (Tabel 5 & Persamaan 1-3)
  // Bobot CF Pakar berdasarkan dr. Novianti Nurzanah (Puskesmas Patimuan)
  // CF_user bernilai mutlak 1.0 (fakta deterministik pengguna)
  // CF_gejala = CF_user * CF_pakar = 1.0 * CF_pakar = CF_pakar

  const CF_USER = 1.0;
  const diagnosesMap = new Map<DisorderType, {
    cfList: number[];
    rules: string[];
    descriptions: string[];
    advice: string[];
  }>();

  const addRuleMatch = (
    diagnosis: DisorderType,
    ruleCode: string,
    cfPakar: number,
    reason: string,
    adviceText: string
  ) => {
    const cfGejala = CF_USER * cfPakar;
    if (!diagnosesMap.has(diagnosis)) {
      diagnosesMap.set(diagnosis, {
        cfList: [],
        rules: [],
        descriptions: [],
        advice: [],
      });
    }
    const entry = diagnosesMap.get(diagnosis)!;
    entry.cfList.push(cfGejala);
    entry.rules.push(ruleCode);
    entry.descriptions.push(reason);
    if (!entry.advice.includes(adviceText)) {
      entry.advice.push(adviceText);
    }
  };

  // Rule R1: IF siklus >= 90 hari THEN Amenore Sekunder (CF Pakar 0.6)
  if (S >= 90) {
    addRuleMatch(
      'Amenore Sekunder',
      'R1',
      0.6,
      `Panjang siklus mencapai ${S} hari (≥ 90 hari), menunjukkan terhentinya menstruasi minimal 3 bulan pada wanita yang sebelumnya memiliki riwayat haid.`,
      'Disarankan melakukan pemeriksaan ke dokter spesialis obstetri & ginekologi (Sp.OG) untuk evaluasi hormonal (tiroid, prolaktin, estrogen) dan USG panggul.'
    );
  }

  // Rule R2: IF siklus_panjang (35 < S < 90) THEN Oligomenorea (CF Pakar 0.6)
  if (cycleCode === 'siklus_panjang' && S < 90) {
    addRuleMatch(
      'Oligomenorea',
      'R2',
      0.6,
      `Panjang siklus ${S} hari melebihi batas 35 hari, yang menandakan frekuensi menstruasi dalam setahun menjadi lebih jarang.`,
      'Periksa pola stres, fluktuasi berat badan drastis, serta kemungkinan sindrom ovarium polikistik (PCOS) jika disertai jerawat hormonal atau rambut berlebih.'
    );
  }

  // Rule R3: IF siklus_pendek (S < 21 hari) THEN Polimenorea (CF Pakar 0.6)
  if (cycleCode === 'siklus_pendek') {
    addRuleMatch(
      'Polimenorea',
      'R3',
      0.6,
      `Panjang siklus ${S} hari kurang dari 21 hari, menunjukkan siklus menstruasi datang terlalu sering dalam satu bulan.`,
      'Kondisi siklus terlalu pendek dapat meningkatkan risiko anemia atau gangguan fase luteal; dianjurkan konsultasi dokter untuk memantau ovulasi.'
    );
  }

  // Rule R4a: IF durasi_panjang (D > 7 hari) THEN Hipermenorea (CF Pakar 0.6)
  if (durationCode === 'durasi_panjang') {
    addRuleMatch(
      'Hipermenorea',
      'R4a',
      0.6,
      `Durasi haid ${D} hari melebihi batas normal (lebih dari 7 hari).`,
      'Perbanyak konsumsi makanan kaya zat besi dan vitamin C untuk mencegah anemia defisiensi besi akibat durasi pendarahan panjang.'
    );
  }

  // Rule R4b: IF volume_banyak (V3 >= 7x pembalut atau gumpalan) THEN Hipermenorea (CF Pakar 0.6)
  if (volumeCode === 'volume_banyak') {
    addRuleMatch(
      'Hipermenorea',
      'R4b',
      0.6,
      `Volume darah tergolong banyak (${padCount} kali ganti pembalut/hari ${hasBloodClots ? 'disertai gumpalan darah' : ''}).`,
      'Pantau tanda-tanda lemas, pucat, atau pusing. Jika pembalut penuh setiap 1-2 jam, segera periksakan ke fasilitas kesehatan.'
    );
  }

  // Rule R5: IF durasi_pendek AND volume_sedikit THEN Hipomenorea (CF Pakar 0.6)
  if (durationCode === 'durasi_pendek' && volumeCode === 'volume_sedikit') {
    addRuleMatch(
      'Hipomenorea',
      'R5',
      0.6,
      `Durasi haid sangat singkat (${D} hari) disertai volume darah sedikit (${padCount} kali ganti pembalut/hari).`,
      'Hipomenorea dapat dipengaruhi oleh penggunaan kontrasepsi hormonal, ketidakseimbangan hormon estrogen, atau stres berat.'
    );
  }

  // Rule R6: IF gejala_nyeri THEN Dismenore (CF Pakar 0.4)
  if (symptomCode === 'gejala_nyeri') {
    addRuleMatch(
      'Dismenore',
      'R6',
      0.4,
      'Terdeteksi nyeri perut bawah, kram hebat, atau sakit punggung yang intensitasnya mengganggu aktivitas normal.',
      'Lakukan kompres hangat pada perut bawah, konsumsi minuman jahe hangat, latihan peregangan santai, dan konsultasikan ke dokter bila nyeri tidak membaik dengan pereda nyeri biasa.'
    );
  }

  // Rule R7: IF siklus_normal AND durasi_normal AND volume_normal AND gejala_normal THEN Normal (CF Pakar 1.0)
  const isAllNormal =
    cycleCode === 'siklus_normal' &&
    durationCode === 'durasi_normal' &&
    volumeCode === 'volume_normal' &&
    symptomCode === 'gejala_normal';

  if (isAllNormal) {
    addRuleMatch(
      'Normal',
      'R7',
      1.0,
      `Seluruh parameter fisiologis (siklus ${S} hari, durasi ${D} hari, ganti pembalut ${padCount}x/hari, tanpa nyeri berat) berada dalam rentang normal dan sehat.`,
      'Pertahankan gaya hidup sehat, hidrasi cukup, nutrisi seimbang, serta istirahat teratur untuk menjaga kestabilan hormon reproduksi.'
    );
  }

  // 3. KALKULASI CF COMBINE (PARALEL) UNTUK MULTI-GEJALA
  // Persamaan 1 & 3: CF_gabungan = CF1 + CF2 * (1 - CF1)
  const diagnosesOutputs: DiagnosisOutput[] = [];

  diagnosesMap.forEach((entry, diagnosisName) => {
    let finalCf = entry.cfList[0];
    let formulaDetails = `CF Tunggal = CF_user(1.0) × CF_pakar(${entry.cfList[0]}) = ${finalCf}`;

    if (entry.cfList.length > 1) {
      // Multiple rules pointing to the same disorder (e.g. R4a + R4b for Hipermenorea)
      const cf1 = entry.cfList[0];
      const cf2 = entry.cfList[1];
      finalCf = cf1 + cf2 * (1 - cf1); // e.g. 0.6 + 0.6 * 0.4 = 0.84
      formulaDetails = `CF Combine (Paralel): CF1(${cf1}) + CF2(${cf2}) × (1 - ${cf1}) = ${cf1} + ${Number((cf2 * (1 - cf1)).toFixed(2))} = ${Number(finalCf.toFixed(2))}`;
      
      // If more than 2, combine sequentially
      for (let i = 2; i < entry.cfList.length; i++) {
        const nextCf = entry.cfList[i];
        finalCf = finalCf + nextCf * (1 - finalCf);
      }
    }

    const percentage = Math.round(finalCf * 100);

    let statusType: 'normal' | 'warning' | 'alert' = 'normal';
    if (diagnosisName === 'Normal') {
      statusType = 'normal';
    } else if (diagnosisName === 'Amenore Sekunder' || diagnosisName === 'Hipermenorea' || percentage >= 80) {
      statusType = 'alert';
    } else {
      statusType = 'warning';
    }

    diagnosesOutputs.push({
      name: diagnosisName,
      cfValue: Number(finalCf.toFixed(2)),
      cfPercentage: percentage,
      statusType,
      description: entry.descriptions.join(' '),
      triggeredRules: entry.rules,
      formulaDetails,
      clinicalAdvice: entry.advice.join(' '),
    });
  });

  // Sort by highest CF percentage
  diagnosesOutputs.sort((a, b) => b.cfPercentage - a.cfPercentage);

  const primaryDiagnosis = diagnosesOutputs[0] || {
    name: 'Normal',
    cfValue: 1.0,
    cfPercentage: 100,
    statusType: 'normal',
    description: 'Parameter dalam batas wajar.',
    triggeredRules: ['R7'],
    formulaDetails: 'CF = 1.0',
    clinicalAdvice: 'Pertahankan pola hidup sehat.',
  };

  return {
    durationFact: {
      code: durationCode,
      label: durationLabel,
      description: durationDesc,
      value: D,
    },
    cycleFact: {
      code: cycleCode,
      label: cycleLabel,
      description: cycleDesc,
      value: S,
    },
    volumeFact: {
      code: volumeCode,
      label: volumeLabel,
      description: volumeDesc,
      value: padCount,
    },
    symptomFact: {
      code: symptomCode,
      label: symptomLabel,
      description: symptomDesc,
      hasPain: hasSeverePain,
    },
    diagnoses: diagnosesOutputs,
    primaryDiagnosis,
    isNormal: isAllNormal,
    hasMultiDiagnosis: diagnosesOutputs.length > 1 && !isAllNormal,
    expertSource: 'dr. Novianti Nurzanah (Dokter Umum, Puskesmas Patimuan) & Jurnal Bulletin of Computer Science Research 2026',
  };
}
