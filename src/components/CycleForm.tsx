import React from 'react';
import { Calendar, RefreshCw, Clock, Sparkles, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { CycleInput } from '../types';
import { formatDateISO, addDays } from '../utils/cycleCalculator';

interface CycleFormProps {
  input: CycleInput;
  onChange: (updated: CycleInput) => void;
  onReset: () => void;
}

export const CycleForm: React.FC<CycleFormProps> = ({ input, onChange, onReset }) => {
  const handleDatePreset = (daysAgo: number) => {
    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const targetDate = addDays(todayUTC, -daysAgo);
    onChange({
      ...input,
      lastPeriodDate: formatDateISO(targetDate),
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm transition-all space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-display flex items-center gap-2">
              <span>Input Parameter Fisiologis Siklus</span>
            </h2>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              Standar Medis 4 Variabel
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Mencakup durasi haid (D), panjang siklus (S), volume darah/pembalut (V), dan keluhan nyeri (G).
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 px-3 py-1.5 rounded-xl hover:bg-stone-100 transition-colors self-start sm:self-auto cursor-pointer"
          title="Kembalikan ke nilai default"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Default</span>
        </button>
      </div>

      {/* Row 1: The First 3 Core Date/Length Variables */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Hari Pertama Haid Terakhir (HPHT) */}
        <div className="space-y-3">
          <label htmlFor="lastPeriodDateInput" className="block text-sm font-semibold text-stone-800">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-rose-500" />
              Hari Pertama Haid Terakhir (HPHT)
            </span>
          </label>
          <input
            id="lastPeriodDateInput"
            type="date"
            value={input.lastPeriodDate}
            onChange={(e) => onChange({ ...input, lastPeriodDate: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
            required
          />

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[11px] text-stone-400 self-center mr-1">Preset:</span>
            <button
              type="button"
              onClick={() => handleDatePreset(0)}
              className="text-[11px] px-2 py-0.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => handleDatePreset(7)}
              className="text-[11px] px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
            >
              7 Hari Lalu
            </button>
            <button
              type="button"
              onClick={() => handleDatePreset(14)}
              className="text-[11px] px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
            >
              14 Hari Lalu
            </button>
            <button
              type="button"
              onClick={() => handleDatePreset(28)}
              className="text-[11px] px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
            >
              28 Hari Lalu
            </button>
          </div>
        </div>

        {/* 2. Panjang Siklus (S) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="cycleLengthInput" className="text-sm font-semibold text-stone-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-rose-500" />
              Panjang Siklus (S)
            </label>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${
              input.cycleLength < 21 || input.cycleLength > 35
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              {input.cycleLength} Hari {input.cycleLength >= 21 && input.cycleLength <= 35 ? '(Normal)' : input.cycleLength >= 90 ? '(≥90h Amenore)' : input.cycleLength > 35 ? '(Panjang)' : '(Pendek)'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="cycleLengthInput"
              type="range"
              min={15}
              max={95}
              value={input.cycleLength}
              onChange={(e) => onChange({ ...input, cycleLength: Number(e.target.value) })}
              className="w-full accent-rose-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex justify-between text-[11px] text-stone-400">
            <span>&lt;21h (Polimenorea)</span>
            <span className="text-stone-600 font-semibold">21-35h (Normal)</span>
            <span>&gt;35h / ≥90h</span>
          </div>
          <p className="text-[11px] text-stone-500">
            Selisih hari ke-1 haid saat ini hingga 1 hari sebelum haid berikutnya.
          </p>
        </div>

        {/* 3. Durasi Haid (D) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="periodDurationInput" className="text-sm font-semibold text-stone-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-500" />
              Durasi Haid (D)
            </label>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${
              input.periodDuration < 2 || input.periodDuration > 7
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              {input.periodDuration} Hari {input.periodDuration >= 2 && input.periodDuration <= 7 ? '(Normal)' : input.periodDuration > 7 ? '(Panjang >7h)' : '(Pendek <2h)'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="periodDurationInput"
              type="range"
              min={1}
              max={14}
              value={input.periodDuration}
              onChange={(e) => onChange({ ...input, periodDuration: Number(e.target.value) })}
              className="w-full accent-rose-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex justify-between text-[11px] text-stone-400">
            <span>&lt;2h (Singkat)</span>
            <span className="text-stone-600 font-semibold">2–7 hari (Batas Wajar)</span>
            <span>&gt;7h (Hipermenorea)</span>
          </div>
          <p className="text-[11px] text-stone-500">
            Jumlah hari perdarahan aktif dari hari pertama sampai tuntas.
          </p>
        </div>
      </div>

      {/* Row 2: Physiological Variables from Journal: Blood Volume (V) and Pain Symptoms (G) */}
      <div className="pt-4 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Variable 3: Volume Darah (V) via Pad Change Frequency */}
        <div className="bg-stone-50/70 p-4 sm:p-5 rounded-2xl border border-stone-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-stone-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500" />
              <span>Volume Darah Haid (V)</span>
            </label>
            <span className="text-xs font-bold text-stone-700 bg-white px-2 py-0.5 rounded-md border border-stone-200">
              {input.padChangeCount} kali ganti/hari
            </span>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            Pilih rata-rata frekuensi ganti pembalut per hari saat haid sedang deras:
          </p>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => onChange({ ...input, padChangeCount: 2 })}
              className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                input.padChangeCount <= 3
                  ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <div className="font-bold">Sedikit (V1)</div>
              <div className="text-[10px] opacity-90 mt-0.5">1–3 kali/hari</div>
            </button>

            <button
              type="button"
              onClick={() => onChange({ ...input, padChangeCount: 5 })}
              className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                input.padChangeCount >= 4 && input.padChangeCount <= 6
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <div className="font-bold">Normal (V2)</div>
              <div className="text-[10px] opacity-90 mt-0.5">4–6 kali/hari</div>
            </button>

            <button
              type="button"
              onClick={() => onChange({ ...input, padChangeCount: 8 })}
              className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                input.padChangeCount >= 7
                  ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <div className="font-bold">Banyak (V3)</div>
              <div className="text-[10px] opacity-90 mt-0.5">≥ 7 kali/hari</div>
            </button>
          </div>

          {/* Checkbox: Gumpalan Darah */}
          <label className="flex items-center gap-2 pt-2 text-xs text-stone-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={input.hasBloodClots}
              onChange={(e) => onChange({ ...input, hasBloodClots: e.target.checked })}
              className="rounded-md border-stone-300 text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
            />
            <span>Sering disertai gumpalan darah berukuran besar</span>
          </label>
        </div>

        {/* Variable 4: Gejala Nyeri (G) - Dismenore */}
        <div className="bg-stone-50/70 p-4 sm:p-5 rounded-2xl border border-stone-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-stone-800 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Keluhan Nyeri Haid / Gejala (G)</span>
            </label>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
              input.hasSeverePain
                ? 'bg-rose-100 text-rose-800 border-rose-300'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              {input.hasSeverePain ? 'Nyeri Berat' : 'Wajar / Ringan'}
            </span>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            Evaluasi apakah Anda merasakan kram hebat atau nyeri yang mengganggu mobilitas harian (indikasi Dismenore):
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => onChange({ ...input, hasSeverePain: false })}
              className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                !input.hasSeverePain
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <div className="font-bold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ringan / Wajar</span>
              </div>
              <div className="text-[10px] opacity-90 mt-0.5">Tidak mengganggu aktivitas</div>
            </button>

            <button
              type="button"
              onClick={() => onChange({ ...input, hasSeverePain: true })}
              className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                input.hasSeverePain
                  ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <div className="font-bold flex items-center justify-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Nyeri Hebat / Kram</span>
              </div>
              <div className="text-[10px] opacity-90 mt-0.5">Mengganggu aktivitas fisik</div>
            </button>
          </div>

          <p className="text-[11px] text-stone-500 italic pt-1">
            *Berdasarkan basis aturan R6 (CF Pakar 0.4), nyeri hebat dipetakan sebagai gejala Dismenore untuk evaluasi klinis awal.
          </p>
        </div>
      </div>
    </div>
  );
};
