export interface CycleInput {
  lastPeriodDate: string; // YYYY-MM-DD
  cycleLength: number; // in days, standard 28
  periodDuration: number; // in days, standard 5
  // Variabel Fisiologis Tambahan Berdasarkan Jurnal (Forward Chaining & CF)
  padChangeCount: number; // Frekuensi ganti pembalut per hari (1-3: sedikit, 4-6: normal, >=7: banyak)
  hasBloodClots: boolean; // Ada gumpalan darah
  hasSeverePain: boolean; // Nyeri perut / kram hebat / sakit punggung yang mengganggu aktivitas (Dismenore)
}

export type PhaseType = 'menstruasi' | 'folikular' | 'ovulasi' | 'luteal';

export interface PhaseDetail {
  id: PhaseType;
  name: string;
  shortDesc: string;
  fullDesc: string;
  startDate: string;
  endDate: string;
  dayStart: number;
  dayEnd: number;
  energyLevel: 'Rendah - Butuh Istirahat' | 'Meningkat & Segar' | 'Puncak Tertinggi' | 'Menurun & Menenangkan';
  hormones: string;
  symptoms: string[];
  selfCareTips: string[];
  nutritionTips: string[];
}

export type DisorderType =
  | 'Amenore Sekunder'
  | 'Oligomenorea'
  | 'Polimenorea'
  | 'Hipermenorea'
  | 'Hipomenorea'
  | 'Dismenore'
  | 'Normal';

export interface DiagnosisOutput {
  name: DisorderType;
  cfValue: number; // 0.0 - 1.0
  cfPercentage: number; // 0 - 100%
  statusType: 'normal' | 'warning' | 'alert';
  description: string;
  triggeredRules: string[];
  formulaDetails: string;
  clinicalAdvice: string;
}

export interface ExpertSystemEvaluation {
  durationFact: {
    code: 'durasi_pendek' | 'durasi_normal' | 'durasi_panjang';
    label: string;
    description: string;
    value: number;
  };
  cycleFact: {
    code: 'siklus_pendek' | 'siklus_normal' | 'siklus_panjang';
    label: string;
    description: string;
    value: number;
  };
  volumeFact: {
    code: 'volume_sedikit' | 'volume_normal' | 'volume_banyak';
    label: string;
    description: string;
    value: number;
  };
  symptomFact: {
    code: 'gejala_nyeri' | 'gejala_normal';
    label: string;
    description: string;
    hasPain: boolean;
  };
  diagnoses: DiagnosisOutput[];
  primaryDiagnosis: DiagnosisOutput;
  isNormal: boolean;
  hasMultiDiagnosis: boolean;
  expertSource: string;
}

export interface CycleCalculationResult {
  input: CycleInput;
  nextPeriodDate: string;
  daysUntilNextPeriod: number;
  isPeriodLate: boolean;
  daysLate?: number;
  
  // Ovulasi & Masa Subur
  ovulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  peakFertileDates: string[]; // typically 1-2 days before ovulation + day of ovulation
  
  // Fase Folikular & Luteal
  follicularStart: string;
  follicularEnd: string;
  lutealStart: string;
  lutealEnd: string;
  
  // Posisi siklus saat ini
  currentDayOfCycle: number;
  currentPhase: PhaseType;
  currentPhaseDetail: PhaseDetail;
  allPhaseDetails: Record<PhaseType, PhaseDetail>;
  cycleProgressPercent: number;
  
  // Hasil evaluasi sistem pakar (Forward Chaining + Certainty Factor)
  expertSystem: ExpertSystemEvaluation;

  // Prediksi 3 siklus mendatang
  upcomingCycles: Array<{
    cycleIndex: number;
    periodStartDate: string;
    ovulationDate: string;
    fertileWindowRange: string;
  }>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
