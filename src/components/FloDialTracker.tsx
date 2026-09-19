import React from 'react';
import { CycleCalculationResult, PhaseType } from '../types';
import { Sparkles, Heart, Droplets, Calendar, Moon, Sun, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { formatIndonesianDate, formatShortIndonesianDate } from '../utils/cycleCalculator';

interface FloDialTrackerProps {
  result: CycleCalculationResult;
  onOpenChat: () => void;
  onSelectPhase: (phase: PhaseType) => void;
  onScrollToDiagnosis?: () => void;
}

export const FloDialTracker: React.FC<FloDialTrackerProps> = ({
  result,
  onOpenChat,
  onSelectPhase,
  onScrollToDiagnosis,
}) => {
  const {
    input,
    currentDayOfCycle,
    currentPhase,
    nextPeriodDate,
    daysUntilNextPeriod,
    isPeriodLate,
    daysLate,
    ovulationDate,
    fertileWindowStart,
    fertileWindowEnd,
    expertSystem,
  } = result;

  const cycleLength = input.cycleLength;
  const progressPercent = Math.min(100, Math.max(0, (currentDayOfCycle / cycleLength) * 100));

  // Stroke circumference calculations for SVG circle
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const getPhaseDisplay = (phase: PhaseType) => {
    switch (phase) {
      case 'menstruasi':
        return {
          title: 'Haid Aktif',
          color: 'text-rose-600',
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-200',
          ringColor: 'stroke-rose-500',
          gradient: 'from-rose-500 to-rose-600',
          badge: 'Fase Menstruasi',
          icon: <Droplets className="w-5 h-5 text-rose-500" />,
          statusSubtitle: `${Math.max(1, input.periodDuration - currentDayOfCycle + 1)} hari haid tersisa`,
        };
      case 'folikular':
        return {
          title: 'Fase Folikular',
          color: 'text-sky-600',
          bgColor: 'bg-sky-50',
          borderColor: 'border-sky-200',
          ringColor: 'stroke-sky-500',
          gradient: 'from-sky-400 to-blue-500',
          badge: 'Pematangan Telur',
          icon: <Sun className="w-5 h-5 text-sky-500" />,
          statusSubtitle: 'Energi fisik & stamina meningkat',
        };
      case 'ovulasi':
        return {
          title: 'Masa Subur / Ovulasi',
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          ringColor: 'stroke-emerald-500',
          gradient: 'from-emerald-400 to-teal-500',
          badge: 'Peluang Hamil Tinggi',
          icon: <Sparkles className="w-5 h-5 text-emerald-500" />,
          statusSubtitle: `Ovulasi: ${formatShortIndonesianDate(ovulationDate)}`,
        };
      case 'luteal':
        return {
          title: 'Fase Luteal',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          ringColor: 'stroke-purple-500',
          gradient: 'from-purple-400 to-pink-500',
          badge: 'Pasca Ovulasi',
          icon: <Moon className="w-5 h-5 text-purple-500" />,
          statusSubtitle: isPeriodLate
            ? `Terlambat ${daysLate} hari`
            : `${daysUntilNextPeriod} hari menuju haid berikutnya`,
        };
    }
  };

  const phaseConfig = getPhaseDisplay(currentPhase);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm relative overflow-hidden">
      {/* Decorative subtle aura */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-100/30 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left / Center: Flo Circular Dial */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            {/* SVG Circular Progress Track */}
            <svg className="w-full h-full -rotate-90 transform drop-shadow-sm" viewBox="0 0 260 260">
              {/* Background ring */}
              <circle
                cx="130"
                cy="130"
                r={radius}
                className="stroke-rose-100/70"
                strokeWidth="14"
                fill="none"
              />
              {/* Dynamic progress ring */}
              <circle
                cx="130"
                cy="130"
                r={radius}
                className={`${phaseConfig.ringColor} transition-all duration-1000 ease-out`}
                strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Inner Content of Flo Dial */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full border ${phaseConfig.bgColor} ${phaseConfig.color} ${phaseConfig.borderColor} mb-1`}>
                {phaseConfig.badge}
              </span>

              <div className="flex items-baseline justify-center gap-0.5 my-0.5">
                <span className="text-4xl sm:text-5xl font-black text-stone-900 font-display">
                  {currentDayOfCycle}
                </span>
                <span className="text-stone-400 text-sm font-semibold">
                  /{cycleLength}
                </span>
              </div>
              <span className="text-xs font-semibold text-stone-600">Hari Siklus</span>

              <div className="mt-1 text-xs font-medium text-stone-500 max-w-[170px] leading-tight">
                {phaseConfig.statusSubtitle}
              </div>

              <button
                type="button"
                onClick={() => onSelectPhase(currentPhase)}
                className="mt-2 text-[11px] font-semibold text-rose-700 hover:text-rose-800 underline decoration-rose-300 underline-offset-2 flex items-center gap-1 cursor-pointer"
              >
                <span>Pelajari Fase Ini</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 text-xs text-stone-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Haid ({input.periodDuration}h)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Subur (~6h)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              Luteal (~14h)
            </span>
          </div>
        </div>

        {/* Right: Key Predictions & Medical Status Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border-b border-stone-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                Prediksi Siklus &amp; Screening Fisiologis
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-display mt-0.5">
                Kalender Kesehatan Menstruasi &amp; Ovulasi Kalila
              </h3>
            </div>

            {/* Medical Screening Pill Badge */}
            {expertSystem && (
              <button
                type="button"
                onClick={onScrollToDiagnosis}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  expertSystem.isNormal
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                }`}
                title="Klik untuk melihat detail diagnosis pakar"
              >
                {expertSystem.isNormal ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Status: Normal (100%)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>
                      {expertSystem.primaryDiagnosis.name} ({expertSystem.primaryDiagnosis.cfPercentage}%)
                    </span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 1. Haid Berikutnya */}
            <div className="p-4 rounded-2xl border border-rose-200/90 bg-rose-50/30 hover:bg-rose-50/60 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5 uppercase tracking-wide">
                    <Droplets className="w-4 h-4 text-rose-600" />
                    Haid Berikutnya
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                    {isPeriodLate
                      ? `Telat ${daysLate} hari`
                      : daysUntilNextPeriod === 0
                      ? 'Hari ini'
                      : `${daysUntilNextPeriod} hari lagi`}
                  </span>
                </div>
                <div className="text-base sm:text-lg font-bold text-stone-900 font-display">
                  {formatIndonesianDate(nextPeriodDate, true)}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Perkiraan berdasarkan siklus {cycleLength} hari &amp; durasi haid {input.periodDuration} hari.
                </p>
              </div>
            </div>

            {/* 2. Estimasi Ovulasi */}
            <div className="p-4 rounded-2xl border border-emerald-200/90 bg-emerald-50/30 hover:bg-emerald-50/60 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 uppercase tracking-wide">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Estimasi Ovulasi
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Hari ke-{cycleLength - 14}
                  </span>
                </div>
                <div className="text-base sm:text-lg font-bold text-stone-900 font-display">
                  {formatIndonesianDate(ovulationDate, true)}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Pelepasan sel telur matang dengan peluang kehamilan paling tinggi.
                </p>
              </div>
            </div>

            {/* 3. Jendela Masa Subur */}
            <div className="p-4 rounded-2xl border border-stone-200/80 bg-white hover:border-emerald-300 transition-all sm:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    Jendela Masa Subur (Fertile Window)
                  </span>
                  <div className="text-sm sm:text-base font-bold text-stone-900 mt-1">
                    {formatShortIndonesianDate(fertileWindowStart)} – {formatShortIndonesianDate(fertileWindowEnd)}
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Mencakup 5 hari sebelum ovulasi sampai 1 hari sesudah ovulasi (daya hidup sperma &amp; sel telur).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenChat}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-2xs shrink-0 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-white/20" />
                  <span>Konsultasi AI</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
