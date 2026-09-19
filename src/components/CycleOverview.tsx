import React from 'react';
import { CalendarDays, Sun, Sparkles, Moon, Clock, ArrowRight, Activity } from 'lucide-react';
import { CycleCalculationResult } from '../types';
import { formatIndonesianDate, formatShortIndonesianDate } from '../utils/cycleCalculator';

interface CycleOverviewProps {
  result: CycleCalculationResult;
  onSelectPhase: (phaseId: 'menstruasi' | 'folikular' | 'ovulasi' | 'luteal') => void;
}

export const CycleOverview: React.FC<CycleOverviewProps> = ({ result, onSelectPhase }) => {
  const {
    nextPeriodDate,
    daysUntilNextPeriod,
    isPeriodLate,
    daysLate,
    ovulationDate,
    fertileWindowStart,
    fertileWindowEnd,
    peakFertileDates,
    follicularStart,
    follicularEnd,
    lutealStart,
    lutealEnd,
    currentDayOfCycle,
    currentPhase,
    input,
  } = result;

  const getCountdownLabel = () => {
    if (isPeriodLate) {
      return {
        text: `Terlambat ${daysLate} hari`,
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      };
    }
    if (daysUntilNextPeriod === 0) {
      return {
        text: 'Hari ini perkiraan haid',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
      };
    }
    if (daysUntilNextPeriod === 1) {
      return {
        text: 'Besok perkiraan haid',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      };
    }
    return {
      text: `${daysUntilNextPeriod} hari lagi`,
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    };
  };

  const countdown = getCountdownLabel();

  return (
    <div className="space-y-6">
      {/* Banner status saat ini */}
      <div className="bg-gradient-to-r from-rose-500/10 via-rose-50 to-amber-50/40 rounded-2xl p-4 sm:p-5 border border-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                Status Siklus Saat Ini
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white text-stone-700 border border-stone-200 font-medium">
                Hari ke-{currentDayOfCycle} dari {input.cycleLength}
              </span>
            </div>
            <p className="text-sm font-bold text-stone-900 mt-0.5">
              Tubuhmu sedang berada dalam{' '}
              <button
                type="button"
                onClick={() => onSelectPhase(currentPhase)}
                className="text-rose-700 hover:text-rose-800 underline decoration-rose-300 underline-offset-2 font-bold cursor-pointer"
              >
                {result.currentPhaseDetail.name}
              </button>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            type="button"
            onClick={() => onSelectPhase(currentPhase)}
            className="text-xs font-medium text-rose-700 hover:text-rose-800 bg-white/80 hover:bg-white px-3 py-2 rounded-xl border border-rose-200 transition-colors inline-flex items-center gap-1 shadow-2xs"
          >
            <span>Pelajari Fase Ini</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid 4 Hasil Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* 1. Tanggal Haid Berikutnya */}
        <div className="bg-white rounded-2xl p-5 border border-rose-200/90 shadow-xs hover:border-rose-300 transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl group-hover:scale-110 transition-transform pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wide">
                <CalendarDays className="w-4 h-4 text-rose-600" />
                Haid Berikutnya
              </span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${countdown.badgeClass}`}>
                {countdown.text}
              </span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-stone-900 font-display">
              {formatIndonesianDate(nextPeriodDate, true)}
            </div>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              Perkiraan awal siklus menstruasi yang akan datang berdasarkan durasi siklus {input.cycleLength} hari.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <span>Siklus berikutnya:</span>
            <span className="font-semibold text-rose-700">
              +{input.cycleLength} hari
            </span>
          </div>
        </div>

        {/* 2. Masa Subur & Ovulasi */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:scale-110 transition-transform pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Ovulasi & Masa Subur
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Peluang Hamil Tertinggi
              </span>
            </div>
            <div className="text-base sm:text-lg font-bold text-stone-900 font-display">
              Ovulasi: {formatIndonesianDate(ovulationDate)}
            </div>
            <div className="text-xs font-medium text-emerald-700 mt-1">
              Jendela Subur: {formatShortIndonesianDate(fertileWindowStart)} – {formatShortIndonesianDate(fertileWindowEnd)}
            </div>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              Mencakup 5 hari sebelum ovulasi hingga 1 hari setelahnya. Puncak: {peakFertileDates.map(d => formatShortIndonesianDate(d)).join(', ')}.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => onSelectPhase('ovulasi')}
              className="text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1"
            >
              <span>Detail Masa Subur</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-stone-400 text-[11px]">H-{input.cycleLength - 14}</span>
          </div>
        </div>

        {/* 3. Fase Folikular */}
        <div className="bg-white rounded-2xl p-5 border border-sky-200/80 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-xl group-hover:scale-110 transition-transform pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-wide">
                <Sun className="w-4 h-4 text-sky-600" />
                Fase Folikular
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                Pematangan Telur
              </span>
            </div>
            <div className="text-base sm:text-lg font-bold text-stone-900 font-display">
              {formatShortIndonesianDate(follicularStart)} – {formatShortIndonesianDate(follicularEnd)}
            </div>
            <div className="text-xs text-sky-700 font-medium mt-1">
              Hari ke-1 s/d Hari ke-{input.cycleLength - 14 - 1}
            </div>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              Kadar estrogen meningkat secara alami, memicu penebalan endometrium dan meningkatkan stamina tubuh.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => onSelectPhase('folikular')}
              className="text-sky-700 hover:text-sky-800 font-medium inline-flex items-center gap-1"
            >
              <span>Detail Fase Folikular</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-stone-400 text-[11px]">Estrogen Aktif</span>
          </div>
        </div>

        {/* 4. Fase Luteal */}
        <div className="bg-white rounded-2xl p-5 border border-purple-200/80 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:scale-110 transition-transform pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wide">
                <Moon className="w-4 h-4 text-purple-600" />
                Fase Luteal
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Pasca Ovulasi & PMS
              </span>
            </div>
            <div className="text-base sm:text-lg font-bold text-stone-900 font-display">
              {formatShortIndonesianDate(lutealStart)} – {formatShortIndonesianDate(lutealEnd)}
            </div>
            <div className="text-xs text-purple-700 font-medium mt-1">
              Hari ke-{(input.cycleLength - 14) + 1} s/d Hari ke-{input.cycleLength} (~14 hari)
            </div>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              Korpus luteum memproduksi progesteron. Jika tidak hamil, hormon turun dan memicu menstruasi baru.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => onSelectPhase('luteal')}
              className="text-purple-700 hover:text-purple-800 font-medium inline-flex items-center gap-1"
            >
              <span>Detail Fase Luteal</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-stone-400 text-[11px]">Progesteron</span>
          </div>
        </div>

      </div>
    </div>
  );
};
