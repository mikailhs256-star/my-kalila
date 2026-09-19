import React from 'react';
import { CycleCalculationResult, PhaseType } from '../types';
import { MapPin } from 'lucide-react';

interface CycleVisualizerProps {
  result: CycleCalculationResult;
  selectedPhase: PhaseType;
  onSelectPhase: (phase: PhaseType) => void;
}

export const CycleVisualizer: React.FC<CycleVisualizerProps> = ({
  result,
  selectedPhase,
  onSelectPhase,
}) => {
  const { input, currentDayOfCycle } = result;
  const cycleLength = input.cycleLength;
  const periodDuration = input.periodDuration;
  const ovulationDay = cycleLength - 14;

  // Segment widths in percentage
  const menstrualWidth = (periodDuration / cycleLength) * 100;
  const follicularDays = Math.max(1, (ovulationDay - 5) - periodDuration);
  const follicularWidth = (follicularDays / cycleLength) * 100;
  const fertileDays = 6; // 5 days before + ovulation day
  const fertileWidth = (fertileDays / cycleLength) * 100;
  const lutealDays = cycleLength - (ovulationDay + 1);
  const lutealWidth = (lutealDays / cycleLength) * 100;

  // Position of today marker (clamped between 1 and 99%)
  const todayPosition = Math.min(98, Math.max(2, (currentDayOfCycle / cycleLength) * 100));

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-stone-900 font-display">
            Peta Perjalanan Siklus & Fase
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Representasi visual ritme biologis tubuh dalam 1 putaran siklus ({cycleLength} hari)
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium text-stone-700 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>Hari ini: Hari ke-{currentDayOfCycle}</span>
        </div>
      </div>

      {/* Timeline Bar Container */}
      <div className="relative pt-8 pb-4">
        {/* Today pin indicator */}
        <div
          className="absolute top-0 -translate-x-1/2 flex flex-col items-center z-10 transition-all duration-300"
          style={{ left: `${todayPosition}%` }}
        >
          <span className="bg-stone-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs whitespace-nowrap">
            Hari Ini ({currentDayOfCycle})
          </span>
          <MapPin className="w-4 h-4 text-stone-900 -mt-0.5 fill-stone-900" />
        </div>

        {/* Phase Bar */}
        <div className="h-9 w-full rounded-2xl overflow-hidden flex shadow-inner border border-stone-200/80 bg-stone-100 p-1 gap-1">
          {/* 1. Menstruasi */}
          <button
            type="button"
            onClick={() => onSelectPhase('menstruasi')}
            style={{ width: `${menstrualWidth}%` }}
            className={`h-full rounded-xl transition-all flex items-center justify-center text-[11px] font-bold cursor-pointer truncate px-1 ${
              selectedPhase === 'menstruasi'
                ? 'bg-rose-500 text-white ring-2 ring-rose-300 shadow-xs'
                : 'bg-rose-200 text-rose-900 hover:bg-rose-300'
            }`}
            title="Fase Menstruasi: Hari 1 s/d Hari ke-5"
          >
            Haid
          </button>

          {/* 2. Folikular */}
          <button
            type="button"
            onClick={() => onSelectPhase('folikular')}
            style={{ width: `${follicularWidth}%` }}
            className={`h-full rounded-xl transition-all flex items-center justify-center text-[11px] font-bold cursor-pointer truncate px-1 ${
              selectedPhase === 'folikular'
                ? 'bg-sky-500 text-white ring-2 ring-sky-300 shadow-xs'
                : 'bg-sky-200 text-sky-900 hover:bg-sky-300'
            }`}
            title="Fase Folikular: Pematangan folikel ovarium"
          >
            Folikular
          </button>

          {/* 3. Masa Subur & Ovulasi */}
          <button
            type="button"
            onClick={() => onSelectPhase('ovulasi')}
            style={{ width: `${fertileWidth}%` }}
            className={`h-full rounded-xl transition-all flex items-center justify-center text-[11px] font-bold cursor-pointer truncate px-1 ${
              selectedPhase === 'ovulasi'
                ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 shadow-xs'
                : 'bg-emerald-200 text-emerald-900 hover:bg-emerald-300'
            }`}
            title="Masa Subur & Ovulasi: Hari ke-10 s/d 15"
          >
            Subur / Ovulasi
          </button>

          {/* 4. Luteal */}
          <button
            type="button"
            onClick={() => onSelectPhase('luteal')}
            style={{ width: `${lutealWidth}%` }}
            className={`h-full rounded-xl transition-all flex items-center justify-center text-[11px] font-bold cursor-pointer truncate px-1 ${
              selectedPhase === 'luteal'
                ? 'bg-purple-500 text-white ring-2 ring-purple-300 shadow-xs'
                : 'bg-purple-200 text-purple-900 hover:bg-purple-300'
            }`}
            title="Fase Luteal: Pasca ovulasi hingga sebelum haid"
          >
            Luteal
          </button>
        </div>

        {/* Legend / Marker ticks */}
        <div className="flex justify-between text-[11px] text-stone-400 mt-2 px-1">
          <span>Hari 1 (Mulai Haid)</span>
          <span>Hari ke-{ovulationDay} (Puncak Ovulasi)</span>
          <span>Hari ke-{cycleLength} (Akhir Siklus)</span>
        </div>
      </div>

      {/* Quick Phase Selection Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
        <button
          type="button"
          onClick={() => onSelectPhase('menstruasi')}
          className={`px-3 py-2.5 rounded-xl border text-left transition-all ${
            selectedPhase === 'menstruasi'
              ? 'border-rose-300 bg-rose-50/80 ring-1 ring-rose-300'
              : 'border-stone-200/80 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-xs font-bold text-stone-800">1. Menstruasi</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Hari 1 - {periodDuration}</p>
        </button>

        <button
          type="button"
          onClick={() => onSelectPhase('folikular')}
          className={`px-3 py-2.5 rounded-xl border text-left transition-all ${
            selectedPhase === 'folikular'
              ? 'border-sky-300 bg-sky-50/80 ring-1 ring-sky-300'
              : 'border-stone-200/80 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span className="text-xs font-bold text-stone-800">2. Folikular</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Hari 1 - {ovulationDay - 1}</p>
        </button>

        <button
          type="button"
          onClick={() => onSelectPhase('ovulasi')}
          className={`px-3 py-2.5 rounded-xl border text-left transition-all ${
            selectedPhase === 'ovulasi'
              ? 'border-emerald-300 bg-emerald-50/80 ring-1 ring-emerald-300'
              : 'border-stone-200/80 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-stone-800">3. Ovulasi / Subur</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Hari ke-{ovulationDay - 5} - {ovulationDay + 1}</p>
        </button>

        <button
          type="button"
          onClick={() => onSelectPhase('luteal')}
          className={`px-3 py-2.5 rounded-xl border text-left transition-all ${
            selectedPhase === 'luteal'
              ? 'border-purple-300 bg-purple-50/80 ring-1 ring-purple-300'
              : 'border-stone-200/80 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-xs font-bold text-stone-800">4. Luteal</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Hari ke-{ovulationDay + 1} - {cycleLength}</p>
        </button>
      </div>
    </div>
  );
};
