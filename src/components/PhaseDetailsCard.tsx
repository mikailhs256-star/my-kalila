import React from 'react';
import { PhaseDetail, PhaseType } from '../types';
import { Sparkles, HeartPulse, Apple, Smile, HelpCircle, ArrowRight } from 'lucide-react';

interface PhaseDetailsCardProps {
  phaseDetail: PhaseDetail;
  onAskAboutPhase: (phaseName: string) => void;
}

export const PhaseDetailsCard: React.FC<PhaseDetailsCardProps> = ({
  phaseDetail,
  onAskAboutPhase,
}) => {
  const getPhaseTheme = (id: PhaseType) => {
    switch (id) {
      case 'menstruasi':
        return {
          badge: 'bg-rose-100 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
          border: 'border-rose-200',
          iconColor: 'text-rose-600',
          bgHighlight: 'bg-rose-50/50',
        };
      case 'folikular':
        return {
          badge: 'bg-sky-100 text-sky-800 border-sky-200',
          dot: 'bg-sky-500',
          border: 'border-sky-200',
          iconColor: 'text-sky-600',
          bgHighlight: 'bg-sky-50/50',
        };
      case 'ovulasi':
        return {
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          border: 'border-emerald-200',
          iconColor: 'text-emerald-600',
          bgHighlight: 'bg-emerald-50/50',
        };
      case 'luteal':
        return {
          badge: 'bg-purple-100 text-purple-800 border-purple-200',
          dot: 'bg-purple-500',
          border: 'border-purple-200',
          iconColor: 'text-purple-600',
          bgHighlight: 'bg-purple-50/50',
        };
    }
  };

  const theme = getPhaseTheme(phaseDetail.id);

  return (
    <div className={`bg-white rounded-3xl p-6 sm:p-8 border ${theme.border} shadow-sm transition-all space-y-6`}>
      {/* Header Phase */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${theme.badge}`}>
              <span className={`w-2 h-2 rounded-full ${theme.dot}`} />
              Fase Biologis {phaseDetail.id.toUpperCase()}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Hari ke-{phaseDetail.dayStart} s/d {phaseDetail.dayEnd}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
            {phaseDetail.name}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
            {phaseDetail.fullDesc}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onAskAboutPhase(phaseDetail.name)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl border border-rose-200 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-rose-600" />
          <span>Tanya Asisten AI Soal Ini</span>
        </button>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Hormon & Energi */}
        <div className={`rounded-2xl p-5 border border-stone-200/80 ${theme.bgHighlight} space-y-3`}>
          <div className="flex items-center gap-2">
            <HeartPulse className={`w-4 h-4 ${theme.iconColor}`} />
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Aktivitas Hormon & Energi Tubuh
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
            {phaseDetail.hormones}
          </p>
          <div className="pt-2 border-t border-stone-200/50 flex items-center justify-between text-xs">
            <span className="text-stone-500">Tingkat Energi Fisik:</span>
            <span className="font-semibold text-stone-800">{phaseDetail.energyLevel}</span>
          </div>
        </div>

        {/* Gejala Alami */}
        <div className="rounded-2xl p-5 border border-stone-200/80 bg-stone-50/40 space-y-3">
          <div className="flex items-center gap-2">
            <Smile className={`w-4 h-4 ${theme.iconColor}`} />
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Gejala & Tanda Tubuh yang Umum
            </h4>
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm text-stone-600">
            {phaseDetail.symptoms.map((symptom, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${theme.dot} mt-1.5 shrink-0`} />
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tips Self Care */}
        <div className="rounded-2xl p-5 border border-stone-200/80 bg-stone-50/40 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className={`w-4 h-4 ${theme.iconColor}`} />
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Panduan Perawatan Diri (Self-Care)
            </h4>
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm text-stone-600">
            {phaseDetail.selfCareTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Rekomendasi Nutrisi */}
        <div className="rounded-2xl p-5 border border-stone-200/80 bg-stone-50/40 space-y-3">
          <div className="flex items-center gap-2">
            <Apple className={`w-4 h-4 ${theme.iconColor}`} />
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Nutrisi & Asupan yang Disarankan
            </h4>
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm text-stone-600">
            {phaseDetail.nutritionTips.map((nutri, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold shrink-0">•</span>
                <span>{nutri}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
