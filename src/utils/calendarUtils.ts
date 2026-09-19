import { CycleCalculationResult, PhaseType } from '../types';
import { parseDate, formatDateISO, daysBetween } from './cycleCalculator';

export interface CalendarDayInfo {
  date: Date;
  dateStr: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  phase: PhaseType | 'normal';
  isPeriodDay: boolean;
  isOvulationDay: boolean;
  isFertileWindow: boolean;
  isPeakFertile: boolean;
  isLutealDay: boolean;
  isFollicularDay: boolean;
  cycleDayNumber?: number; // Day 1..28 in cycle
  notes?: string;
}

/**
 * Returns calendar days for a given year and month (0-indexed month)
 * including days from previous and next month to complete the 7-column grid.
 */
export function getMonthCalendarDays(
  year: number,
  month: number, // 0 = Jan, 11 = Dec
  calculationResult: CycleCalculationResult
): CalendarDayInfo[] {
  const { input } = calculationResult;
  const cycleLen = input.cycleLength;
  const periodDuration = input.periodDuration;
  const lmpDate = parseDate(input.lastPeriodDate);
  const daysToOvulation = cycleLen - 14;

  const now = new Date();
  const todayStr = formatDateISO(now);

  // First day of target month
  const firstDayOfMonth = new Date(Date.UTC(year, month, 1));
  const startingDayOfWeek = firstDayOfMonth.getUTCDay(); // 0 (Sun) to 6 (Sat)
  // Monday start: Mon=0, Sun=6
  const adjustedStartCol = (startingDayOfWeek + 6) % 7;

  // Total days in target month
  const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0));
  const totalDaysInMonth = lastDayOfMonth.getUTCDate();

  // Days from previous month
  const prevMonthLastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();

  const days: CalendarDayInfo[] = [];

  // 1. Previous month trailing days
  for (let i = adjustedStartCol - 1; i >= 0; i--) {
    const prevDate = new Date(Date.UTC(year, month - 1, prevMonthLastDay - i));
    days.push(createDayInfo(prevDate, false, lmpDate, cycleLen, periodDuration, daysToOvulation, todayStr));
  }

  // 2. Current month days
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const currDate = new Date(Date.UTC(year, month, d));
    days.push(createDayInfo(currDate, true, lmpDate, cycleLen, periodDuration, daysToOvulation, todayStr));
  }

  // 3. Next month leading days to complete grid
  const remainingCells = (7 - (days.length % 7)) % 7;
  for (let nextD = 1; nextD <= remainingCells; nextD++) {
    const nextDate = new Date(Date.UTC(year, month + 1, nextD));
    days.push(createDayInfo(nextDate, false, lmpDate, cycleLen, periodDuration, daysToOvulation, todayStr));
  }

  return days;
}

function createDayInfo(
  date: Date,
  isCurrentMonth: boolean,
  lmpDate: Date,
  cycleLen: number,
  periodDuration: number,
  daysToOvulation: number,
  todayStr: string
): CalendarDayInfo {
  const dateStr = formatDateISO(date);
  const isToday = dateStr === todayStr;

  const diffDays = daysBetween(lmpDate, date);
  const cycleDayNumber = ((diffDays % cycleLen) + cycleLen) % cycleLen + 1;

  // Period: days 1 to periodDuration
  const isPeriodDay = cycleDayNumber >= 1 && cycleDayNumber <= periodDuration;
  
  // Ovulation: exactly daysToOvulation (e.g. Day 14 in a 28-day cycle)
  const isOvulationDay = cycleDayNumber === daysToOvulation;

  // Fertile Window: 5 days before ovulation until 1 day after
  const fertileStart = daysToOvulation - 5;
  const fertileEnd = daysToOvulation + 1;
  const isFertileWindow = cycleDayNumber >= fertileStart && cycleDayNumber <= fertileEnd;

  // Peak Fertile: 2 days before ovulation until ovulation day
  const isPeakFertile = cycleDayNumber >= daysToOvulation - 2 && cycleDayNumber <= daysToOvulation;

  // Follicular: Day 1 until ovulation day - 1
  const isFollicularDay = cycleDayNumber >= 1 && cycleDayNumber < daysToOvulation;

  // Luteal: Day after ovulation until end of cycle
  const isLutealDay = cycleDayNumber > daysToOvulation && cycleDayNumber <= cycleLen;

  let phase: PhaseType | 'normal' = 'normal';
  if (isPeriodDay) {
    phase = 'menstruasi';
  } else if (isOvulationDay || isFertileWindow) {
    phase = 'ovulasi';
  } else if (isLutealDay) {
    phase = 'luteal';
  } else if (isFollicularDay) {
    phase = 'folikular';
  }

  return {
    date,
    dateStr,
    dayNumber: date.getUTCDate(),
    isCurrentMonth,
    isToday,
    phase,
    isPeriodDay,
    isOvulationDay,
    isFertileWindow,
    isPeakFertile,
    isLutealDay,
    isFollicularDay,
    cycleDayNumber,
  };
}
