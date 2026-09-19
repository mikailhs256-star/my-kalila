import React from 'react';
import { CalendarRange, Sparkles } from 'lucide-react';
import { CycleCalculationResult } from '../types';
import { formatIndonesianDate } from '../utils/cycleCalculator';

interface UpcomingCyclesProps {
  result: CycleCalculationResult;
}

export const UpcomingCycles: React.FC<UpcomingCyclesProps> = ({ result }) => {
  const { upcomingCycles } = result;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
        <div>
          <h3 className="text-lg font-bold text-stone-900 font-display flex items-center gap-2">
            <CalendarRange className="w-5 h-5 text-rose-500" />
            <span>Prediksi 3 Siklus Mendatang</span>
          </h3>
          <p className="text-xs sm:text-sm text-stone-500">
            Perkiraan kalender siklus untuk membantu perencanaan aktivitas dan jadwal pentingmu
          </p>
        </div>
        <span className="text-xs text-stone-400 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200 self-start sm:self-auto">
          Berdasarkan rata-rata {result.input.cycleLength} hari
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {upcomingCycles.map((cycle) => (
          <div
            key={cycle.cycleIndex}
            className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/40 hover:bg-white hover:border-rose-200 hover:shadow-xs transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                Siklus +{cycle.cycleIndex}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold block">
                Perkiraan Mulai Haid:
              </span>
              <p className="text-sm font-bold text-stone-900">
                {formatIndonesianDate(cycle.periodStartDate, true)}
              </p>
            </div>

            <div className="pt-2 border-t border-stone-200/60 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Masa Subur:
                </span>
                <span className="font-semibold text-emerald-700">
                  {cycle.fertileWindowRange}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Puncak Ovulasi:</span>
                <span className="font-medium text-stone-700">
                  {formatIndonesianDate(cycle.ovulationDate)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
