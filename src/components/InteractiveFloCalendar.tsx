import React, { useState, useMemo } from 'react';
import { CycleCalculationResult } from '../types';
import { getMonthCalendarDays, CalendarDayInfo } from '../utils/calendarUtils';
import { formatIndonesianDate } from '../utils/cycleCalculator';
import { ChevronLeft, ChevronRight, Sparkles, Droplets, Calendar as CalendarIcon, Info } from 'lucide-react';

interface InteractiveFloCalendarProps {
  result: CycleCalculationResult;
  onSelectDateDetails?: (dayInfo: CalendarDayInfo) => void;
}

export const InteractiveFloCalendar: React.FC<InteractiveFloCalendarProps> = ({
  result,
  onSelectDateDetails,
}) => {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState<number>(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<CalendarDayInfo | null>(null);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  const calendarDays = useMemo(() => {
    return getMonthCalendarDays(currentYear, currentMonth, result);
  }, [currentYear, currentMonth, result]);

  const activeSelected = useMemo(() => {
    if (selectedDay && calendarDays.some((d) => d.dateStr === selectedDay.dateStr)) {
      return selectedDay;
    }
    const today = calendarDays.find((d) => d.isToday && d.isCurrentMonth);
    return today || calendarDays.find((d) => d.isCurrentMonth) || calendarDays[0];
  }, [selectedDay, calendarDays]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleJumpToToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  const handleDayClick = (day: CalendarDayInfo) => {
    setSelectedDay(day);
    if (onSelectDateDetails) {
      onSelectDateDetails(day);
    }
  };

  const getDayStyling = (day: CalendarDayInfo) => {
    const isChosen = activeSelected?.dateStr === day.dateStr;

    let bgClasses = 'bg-white hover:bg-stone-50 text-stone-700';
    let indicatorBadge = null;

    if (!day.isCurrentMonth) {
      bgClasses = 'bg-stone-50/40 text-stone-300 hover:bg-stone-100/50';
    } else if (day.isPeriodDay) {
      bgClasses = 'bg-rose-100 text-rose-950 font-bold hover:bg-rose-200 border-rose-200';
      indicatorBadge = <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-0.5" />;
    } else if (day.isOvulationDay) {
      bgClasses = 'bg-emerald-100 text-emerald-950 font-bold hover:bg-emerald-200 border-emerald-300 ring-1 ring-emerald-400';
      indicatorBadge = <span className="w-2 h-2 rounded-full bg-emerald-600 mt-0.5 shadow-xs" />;
    } else if (day.isFertileWindow) {
      bgClasses = 'bg-emerald-50 text-emerald-900 font-semibold hover:bg-emerald-100 border-emerald-100';
      indicatorBadge = <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5" />;
    } else if (day.isLutealDay) {
      bgClasses = 'bg-purple-50/60 text-purple-900 hover:bg-purple-100/60';
    } else if (day.isFollicularDay) {
      bgClasses = 'bg-sky-50/50 text-sky-900 hover:bg-sky-100/50';
    }

    const selectedClasses = isChosen
      ? 'ring-2 ring-stone-900 ring-offset-1 z-10 scale-105 shadow-xs font-extrabold'
      : '';

    const todayClasses = day.isToday
      ? 'outline-2 outline-dashed outline-rose-500 outline-offset-1'
      : '';

    return {
      classes: `${bgClasses} ${selectedClasses} ${todayClasses}`,
      indicator: indicatorBadge,
    };
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-6">
      {/* Calendar Header with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-display flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-rose-500" />
              <span>Kalender Haid My Kalila</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 hidden sm:inline-block">
              Warna Khusus Per Fase
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Setiap fase ditandai warna berbeda. Klik tanggal manapun untuk melihat prediksi kondisi tubuh dan rekomendasi harian.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleJumpToToday}
            className="text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl border border-rose-200 transition-colors cursor-pointer"
          >
            Bulan Ini
          </button>
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl hover:bg-white text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              title="Bulan Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs sm:text-sm font-bold text-stone-800 px-2 min-w-[120px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl hover:bg-white text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              title="Bulan Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Calendar on Left, Selected Day Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Calendar Grid (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-3">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-stone-400 uppercase tracking-wider py-1">
            {weekDays.map((wd, i) => (
              <div key={i} className={i === 5 || i === 6 ? 'text-rose-400' : ''}>
                {wd}
              </div>
            ))}
          </div>

          {/* Day Cells Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((day, idx) => {
              const { classes, indicator } = getDayStyling(day);
              return (
                <button
                  key={`${day.dateStr}-${idx}`}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className={`relative min-h-[52px] sm:min-h-[64px] p-1 sm:p-2 rounded-2xl flex flex-col items-center justify-between transition-all border border-stone-100/60 cursor-pointer ${classes}`}
                >
                  <span className="text-xs sm:text-sm font-semibold">{day.dayNumber}</span>
                  <div className="h-4 flex items-center justify-center">
                    {indicator}
                  </div>
                  {day.isToday && (
                    <span className="text-[9px] font-bold text-rose-600 leading-none">Hari ini</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Color Coding Legend (Flo Style) */}
          <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-stone-600">
            <span className="text-stone-400 font-semibold text-[11px]">Keterangan Warna:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-lg bg-rose-200 border border-rose-300 inline-block" />
              <span>Haid / Menstruasi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-lg bg-emerald-300 border border-emerald-400 inline-block" />
              <span>Puncak Ovulasi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-lg bg-emerald-100 border border-emerald-200 inline-block" />
              <span>Jendela Masa Subur</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-lg bg-purple-100 border border-purple-200 inline-block" />
              <span>Fase Luteal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-lg bg-sky-100 border border-sky-200 inline-block" />
              <span>Fase Folikular</span>
            </div>
          </div>
        </div>

        {/* Selected Day Inspector Card (4 cols on lg) */}
        <div className="lg:col-span-4 bg-stone-50/70 border border-stone-200/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200/70 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Detail Tanggal Dipilih
            </span>
            {activeSelected?.isToday && (
              <span className="text-[10px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded-full">
                Hari Ini
              </span>
            )}
          </div>

          {activeSelected && (
            <div className="space-y-3">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-stone-900 font-display">
                  {formatIndonesianDate(activeSelected.dateStr, true)}
                </h4>
                <p className="text-xs text-stone-500">
                  Hari ke-{activeSelected.cycleDayNumber} dalam siklus {result.input.cycleLength} hari
                </p>
              </div>

              {/* Status Badge */}
              <div className="pt-1">
                {activeSelected.isPeriodDay && (
                  <div className="p-3 rounded-xl bg-rose-100/90 border border-rose-200 text-rose-950 space-y-1">
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <Droplets className="w-4 h-4 text-rose-600" />
                      Fase Menstruasi (Haid)
                    </div>
                    <p className="text-[11px] leading-relaxed text-rose-900">
                      Tubuh sedang meluruhkan dinding rahim. Berikan ruang untuk istirahat cukup, kurangi aktivitas berat, dan gunakan kompres hangat jika timbul kram.
                    </p>
                  </div>
                )}

                {activeSelected.isOvulationDay && (
                  <div className="p-3 rounded-xl bg-emerald-100/90 border border-emerald-300 text-emerald-950 space-y-1">
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      Hari Puncak Ovulasi!
                    </div>
                    <p className="text-[11px] leading-relaxed text-emerald-900">
                      Sel telur matang dilepaskan hari ini. Peluang pembuahan (hamil) mencapai titik paling maksimal dalam satu siklus.
                    </p>
                  </div>
                )}

                {!activeSelected.isOvulationDay && activeSelected.isFertileWindow && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Jendela Masa Subur
                    </div>
                    <p className="text-[11px] leading-relaxed text-emerald-900">
                      Sperma dapat bertahan hingga 5 hari dalam saluran reproduksi. Peluang hamil tinggi jika berhubungan intim pada jendela ini.
                    </p>
                  </div>
                )}

                {!activeSelected.isPeriodDay && !activeSelected.isFertileWindow && activeSelected.isFollicularDay && (
                  <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 space-y-1">
                    <div className="text-xs font-bold text-sky-800">
                      Fase Folikular (Pematangan Sel Telur)
                    </div>
                    <p className="text-[11px] leading-relaxed text-sky-900">
                      Estrogen mulai meningkat. Stamina, kejernihan pikiran, dan antusiasme fisikmu berada dalam grafik naik yang positif.
                    </p>
                  </div>
                )}

                {!activeSelected.isPeriodDay && !activeSelected.isFertileWindow && activeSelected.isLutealDay && (
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 space-y-1">
                    <div className="text-xs font-bold text-purple-800">
                      Fase Luteal (Pasca Ovulasi)
                    </div>
                    <p className="text-[11px] leading-relaxed text-purple-900">
                      Hormon progesteron aktif. Persiapkan tubuh menghadapi hari-hari menjelang haid dengan nutrisi seimbang dan kurangi stres.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 text-[11px] text-stone-500 flex items-start gap-1.5 bg-white p-2.5 rounded-xl border border-stone-200/60">
                <Info className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <span>
                  Prediksi tanggal ini diperbarui otomatis saat Anda mengubah data durasi siklus atau durasi haid.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
