import React, { useState } from 'react';
import { PhaseType } from '../types';
import { DAILY_INSIGHTS } from '../data/dailyInsights';
import { Heart, Sparkles, CheckCircle2, ChevronDown, ChevronUp, Coffee, Smile, MessageCircle } from 'lucide-react';

interface DailyFloInsightCardProps {
  currentPhase: PhaseType;
  currentDayOfCycle: number;
  onOpenAssistant: () => void;
}

export const DailyFloInsightCard: React.FC<DailyFloInsightCardProps> = ({
  currentPhase,
  currentDayOfCycle,
  onOpenAssistant,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const insight = DAILY_INSIGHTS[currentPhase];

  const getPhaseHeaderStyle = (phase: PhaseType) => {
    switch (phase) {
      case 'menstruasi':
        return {
          bgBadge: 'bg-rose-100 text-rose-800 border-rose-200',
          gradientBg: 'from-rose-50/80 via-white to-amber-50/30',
          borderColor: 'border-rose-200',
          iconColor: 'text-rose-600',
          accentBtn: 'hover:bg-rose-100 text-rose-700',
        };
      case 'folikular':
        return {
          bgBadge: 'bg-sky-100 text-sky-800 border-sky-200',
          gradientBg: 'from-sky-50/80 via-white to-blue-50/30',
          borderColor: 'border-sky-200',
          iconColor: 'text-sky-600',
          accentBtn: 'hover:bg-sky-100 text-sky-700',
        };
      case 'ovulasi':
        return {
          bgBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          gradientBg: 'from-emerald-50/80 via-white to-teal-50/30',
          borderColor: 'border-emerald-200',
          iconColor: 'text-emerald-600',
          accentBtn: 'hover:bg-emerald-100 text-emerald-700',
        };
      case 'luteal':
        return {
          bgBadge: 'bg-purple-100 text-purple-800 border-purple-200',
          gradientBg: 'from-purple-50/80 via-white to-pink-50/30',
          borderColor: 'border-purple-200',
          iconColor: 'text-purple-600',
          accentBtn: 'hover:bg-purple-100 text-purple-700',
        };
    }
  };

  const style = getPhaseHeaderStyle(currentPhase);

  return (
    <div
      className={`bg-gradient-to-br ${style.gradientBg} rounded-3xl p-6 sm:p-8 border ${style.borderColor} shadow-xs space-y-5 transition-all`}
    >
      {/* Header Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/50">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${style.bgBadge}`}>
            <Sparkles className="w-3.5 h-3.5" />
            Sapaan &amp; Wawasan Harian Flo (Hari ke-{currentDayOfCycle})
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenAssistant}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 px-3.5 py-1.5 rounded-xl border border-stone-200 transition-colors self-start sm:self-auto shadow-2xs cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5 text-rose-500" />
          <span>Curhat / Tanya Dokter AI</span>
        </button>
      </div>

      {/* Main Greeting Message */}
      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
          {insight.greeting}
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-stone-700">
          {insight.tagline}
        </p>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-4xl">
          {insight.bodyHighlight}
        </p>
      </div>

      {/* Highlights 3 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {/* Card 1: Cek Gejala Umum */}
        <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-stone-200/70 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-800">
            <Smile className="w-4 h-4 text-amber-600" />
            <span>Kondisi Tubuh Hari Ini</span>
          </div>
          <ul className="space-y-1.5 text-xs text-stone-600">
            {insight.symptomChecklist.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card 2: Tips Aksi Praktis */}
        <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-stone-200/70 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-800">
            <Coffee className="w-4 h-4 text-emerald-600" />
            <span>Saran Nutrisi &amp; Perawatan</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            {insight.actionableTip}
          </p>
        </div>

        {/* Card 3: Afirmasi & Rekomendasi Aktivitas */}
        <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-stone-200/70 space-y-2 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Afirmasi Harian</span>
            </div>
            <p className="text-xs text-stone-700 italic font-medium leading-relaxed">
              {insight.moodAffirmation}
            </p>
          </div>
          <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500">
            <strong>Aktivitas ideal:</strong> {insight.recommendedActivity}
          </div>
        </div>
      </div>

      {/* Accordion Toggle for Detailed Hormone Story */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <span>{isExpanded ? 'Sembunyikan' : 'Baca selengkapnya:'} Kisah Hormon di Balik Fase Ini</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {isExpanded && (
          <div className="mt-3 p-4 rounded-2xl bg-white/90 border border-stone-200/80 text-xs text-stone-700 leading-relaxed space-y-2 animate-fadeIn">
            <p>
              <strong>Bagaimana hormonmu bekerja:</strong> {insight.hormoneStory}
            </p>
            <p className="text-stone-500 text-[11px]">
              Setiap wanita memiliki keunikan biologis tersendiri. Catat perubahan fisik dan perasaanmu secara berkala untuk mengenali pola khas tubuhmu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
