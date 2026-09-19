import React, { useState } from 'react';
import { ExpertSystemEvaluation, DiagnosisOutput } from '../types';
import { Stethoscope, CheckCircle2, AlertTriangle, AlertCircle, Calculator, ChevronDown, ChevronUp, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

interface ExpertDiagnosisReportProps {
  evaluation: ExpertSystemEvaluation;
  onAskDoctorAI: (prompt: string) => void;
}

export const ExpertDiagnosisReport: React.FC<ExpertDiagnosisReportProps> = ({
  evaluation,
  onAskDoctorAI,
}) => {
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);
  const {
    durationFact,
    cycleFact,
    volumeFact,
    symptomFact,
    diagnoses,
    primaryDiagnosis,
    isNormal,
    hasMultiDiagnosis,
    expertSource,
  } = evaluation;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-6">
      {/* Header section with scholarly citation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-display flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-rose-600" />
              <span>Deteksi Dini Fisiologis (Forward Chaining &amp; Certainty Factor)</span>
            </h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 hidden sm:inline-block">
              Sistem Pakar Medis
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Mengevaluasi 4 variabel fisiologis dasar secara simultan dan menghitung probabilitas diagnosis terukur berbasis kepakaran dokter.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-500 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Validasi Pakar Medis: dr. Novianti Nurzanah</span>
        </div>
      </div>

      {/* Main Result Banner (Flo / Clinical Tracker Result Style from Figure 4 & Figure 6) */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border transition-all ${
          isNormal
            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
            : hasMultiDiagnosis
            ? 'bg-rose-50/70 border-rose-200 text-rose-950'
            : 'bg-amber-50/60 border-amber-200 text-amber-950'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
              Hasil Kesimpulan Screening Awal
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              <h4 className="text-xl sm:text-2xl font-black font-display text-stone-900">
                {isNormal ? (
                  <span className="text-emerald-700 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    Siklus Normal &amp; Sehat (100%)
                  </span>
                ) : (
                  <span>
                    {diagnoses.map((d, i) => (
                      <span key={d.name}>
                        {d.name}{' '}
                        <span className="text-base font-bold text-rose-700">
                          ({d.cfPercentage}%)
                        </span>
                        {i < diagnoses.length - 1 && ' & '}
                      </span>
                    ))}
                  </span>
                )}
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl pt-1">
              {isNormal
                ? 'Seluruh parameter durasi haid, panjang siklus, volume pembalut, dan gejala fisik berada dalam batas wajar fisiologis.'
                : hasMultiDiagnosis
                ? 'Terdeteksi indikasi kondisi medis utama yang disertai indikasi penyerta secara simultan berdasarkan algoritma Forward Chaining & Certainty Factor.'
                : primaryDiagnosis.description}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onAskDoctorAI(
                `Jelaskan secara ramah hasil evaluasi siklus saya: ${
                  isNormal
                    ? 'Siklus Normal'
                    : diagnoses.map((d) => `${d.name} (${d.cfPercentage}%)`).join(', ')
                }. Apa yang perlu saya lakukan?`
              )
            }
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition-all shadow-xs shrink-0 self-start md:self-center cursor-pointer"
          >
            Tanyakan ke Dokter AI
          </button>
        </div>
      </div>

      {/* 4 Physiological Parameters Grid (Tabel 1 - 4) */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center justify-between">
          <span>Pemetaan 4 Fakta Fisiologis Terukur (Working Memory)</span>
          <span className="text-[11px] text-stone-400 font-normal">Tabel 1–4 Jurnal Riset</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* 1. Durasi Haid (D) */}
          <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/80 space-y-1.5">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
              Durasi Haid (D)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold text-stone-900 font-display">
                {durationFact.value} Hari
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                durationFact.code === 'durasi_normal'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {durationFact.label}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 leading-snug">
              {durationFact.description}
            </p>
          </div>

          {/* 2. Panjang Siklus (S) */}
          <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/80 space-y-1.5">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
              Panjang Siklus (S)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold text-stone-900 font-display">
                {cycleFact.value} Hari
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                cycleFact.code === 'siklus_normal'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {cycleFact.label}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 leading-snug">
              {cycleFact.description}
            </p>
          </div>

          {/* 3. Volume Darah (V) */}
          <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/80 space-y-1.5">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
              Volume Darah (V)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold text-stone-900 font-display">
                {volumeFact.value}x Ganti/Hari
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                volumeFact.code === 'volume_normal'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {volumeFact.label}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 leading-snug">
              {volumeFact.description}
            </p>
          </div>

          {/* 4. Gejala Nyeri (G) */}
          <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/80 space-y-1.5">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
              Gejala Nyeri (G)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold text-stone-900 font-display">
                {symptomFact.hasPain ? 'Kram Hebat' : 'Normal'}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                !symptomFact.hasPain
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {symptomFact.label}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 leading-snug">
              {symptomFact.description}
            </p>
          </div>
        </div>
      </div>

      {/* Clinical Diagnosis Breakdown Cards */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
          Rincian Tingkat Keyakinan Klinis (Certainty Factor) &amp; Rekomendasi
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {diagnoses.map((diag) => (
            <div
              key={diag.name}
              className="p-4 rounded-2xl border border-stone-200 bg-white space-y-3 hover:border-rose-200 transition-all shadow-2xs"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-stone-900 font-display">
                    {diag.name}
                  </span>
                  <span className="text-xs font-semibold text-stone-400">
                    (Aturan {diag.triggeredRules.join(', ')})
                  </span>
                </div>
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                  diag.statusType === 'normal'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  CF: {diag.cfPercentage}%
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-stone-600">
                <p>
                  <strong>Indikasi:</strong> {diag.description}
                </p>
                <div className="p-2.5 rounded-xl bg-stone-50 text-[11px] text-stone-700 border border-stone-100">
                  <strong className="text-rose-700">Rekomendasi Medis:</strong>{' '}
                  {diag.clinicalAdvice}
                </div>
              </div>

              {/* Progress bar for certainty */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] text-stone-400 font-medium">
                  <span>Tingkat Kepastian Pakar</span>
                  <span>{diag.cfPercentage}%</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      diag.statusType === 'normal'
                        ? 'bg-emerald-500'
                        : diag.cfPercentage >= 80
                        ? 'bg-rose-600'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${diag.cfPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accordion: Transparent Calculation & Research Theory Details */}
      <div className="pt-2 border-t border-stone-100">
        <button
          type="button"
          onClick={() => setShowFormulaDetails(!showFormulaDetails)}
          className="flex items-center justify-between w-full py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-rose-500" />
            <span>Lihat Landasan Teori Ilmiah &amp; Komputasi Certainty Factor (Combine)</span>
          </span>
          {showFormulaDetails ? (
            <ChevronUp className="w-4 h-4 text-stone-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-stone-400" />
          )}
        </button>

        {showFormulaDetails && (
          <div className="mt-3 p-5 rounded-2xl bg-stone-50/80 border border-stone-200 text-xs text-stone-700 space-y-4 animate-fadeIn">
            <div>
              <h5 className="font-bold text-stone-900 text-sm mb-1 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-rose-600" />
                <span>Referensi Jurnal Ilmiah:</span>
              </h5>
              <p className="text-stone-600 italic">
                “Sistem Pemantau Siklus Haid Sebagai Media Manajemen Kesehatan Reproduksi Menggunakan Metode Forward Chaining dan Certainty Factor”
              </p>
              <p className="text-stone-500 text-[11px] mt-0.5">
                Dimas Alva Rizki, Supriyono, Feri Wibowo, Muhammad Hamka (Universitas Muhammadiyah Purwokerto). 
                Diterbitkan di <em>Bulletin of Computer Science Research</em>, Vol 6, No 3, 2026. DOI: 10.47065/bulletincsr.v6i3.1064
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1.5">
                <strong className="text-stone-900 block font-semibold">1. Forward Chaining (Data-Driven Inference)</strong>
                <p className="text-stone-600 leading-relaxed text-[11px]">
                  Fakta input kalender dan fisik diekstraksi ke Working Memory, lalu dicocokkan maju terhadap basis aturan IF-THEN (Tabel 5).
                  Aturan yang premisnya terpenuhi dieksekusi secara otomatis untuk menemukan rute penyakit.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1.5">
                <strong className="text-stone-900 block font-semibold">2. Certainty Factor &amp; CF Combine (Paralel)</strong>
                <p className="text-stone-600 leading-relaxed text-[11px]">
                  Input pengguna berstatus fakta objektif mutlak ($CF_{'{user}'} = 1.0$). Jika lebih dari satu aturan mengarah pada penyakit yang sama (seperti R4a durasi panjang dan R4b volume banyak pada Hipermenorea), probabilitas diakumulasi melalui rumus paralel:
                </p>
                <div className="font-mono text-[10px] bg-stone-100 p-2 rounded-lg text-rose-900">
                  CF_gabungan = CF1 + CF2 × (1 - CF1)
                </div>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1">
              <strong className="text-stone-900 block font-semibold">Perhitungan pada Sesi Anda:</strong>
              {diagnoses.map((d) => (
                <div key={d.name} className="text-[11px] text-stone-600 font-mono">
                  &bull; <strong>{d.name}:</strong> {d.formulaDetails} &rarr; <strong>{d.cfPercentage}%</strong>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-stone-500 italic">
              *Catatan penelitian: Persentase keluaran ini merepresentasikan tingkat keyakinan sistem berdasarkan bobot kepakaran awal dokter umum, bukan merupakan vonis medis mutlak. Konsultasi langsung dengan dokter spesialis obstetri &amp; ginekologi (Sp.OG) tetap menjadi standar utama penanganan kesehatan reproduksi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
