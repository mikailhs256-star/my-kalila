import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { CycleForm } from './components/CycleForm';
import { FloDialTracker } from './components/FloDialTracker';
import { DailyFloInsightCard } from './components/DailyFloInsightCard';
import { InteractiveFloCalendar } from './components/InteractiveFloCalendar';
import { ExpertDiagnosisReport } from './components/ExpertDiagnosisReport';
import { CycleOverview } from './components/CycleOverview';
import { PhaseDetailsCard } from './components/PhaseDetailsCard';
import { UpcomingCycles } from './components/UpcomingCycles';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { AssistantChatModal } from './components/AssistantChatModal';
import { CycleInput, PhaseType } from './types';
import { calculateCycle, formatDateISO, addDays } from './utils/cycleCalculator';
import { MessageCircleHeart, Sparkles } from 'lucide-react';

export default function App() {
  // Initialize default LMP to 14 days ago for an informative initial preview
  const defaultInitialLMP = useMemo(() => {
    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const initialDate = addDays(todayUTC, -14);
    return formatDateISO(initialDate);
  }, []);

  const [input, setInput] = useState<CycleInput>({
    lastPeriodDate: defaultInitialLMP,
    cycleLength: 28,
    periodDuration: 5,
    padChangeCount: 5,
    hasBloodClots: false,
    hasSeverePain: false,
  });

  // Calculate cycle data & run Forward Chaining + Certainty Factor engine
  const calculationResult = useMemo(() => {
    return calculateCycle(input);
  }, [input]);

  // Selected phase for detail card view (defaults to current active phase)
  const [selectedPhase, setSelectedPhase] = useState<PhaseType>(calculationResult.currentPhase);

  const handleSelectPhase = (phase: PhaseType) => {
    setSelectedPhase(phase);
    const el = document.getElementById('phase-detail-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToDiagnosis = () => {
    const el = document.getElementById('expert-diagnosis-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Chat modal state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [presetQuestion, setPresetQuestion] = useState<string | undefined>();

  const handleResetForm = () => {
    setInput({
      lastPeriodDate: defaultInitialLMP,
      cycleLength: 28,
      periodDuration: 5,
      padChangeCount: 5,
      hasBloodClots: false,
      hasSeverePain: false,
    });
    setSelectedPhase('ovulasi');
  };

  const handleAskAboutPhase = (phaseName: string) => {
    setPresetQuestion(`Bisa tolong jelaskan lebih lanjut tentang ${phaseName} dan bagaimana cara terbaik menjaga tubuh selama fase ini?`);
    setIsChatOpen(true);
  };

  const handleAskDoctorAI = (promptText: string) => {
    setPresetQuestion(promptText);
    setIsChatOpen(true);
  };

  const selectedPhaseDetail = useMemo(() => {
    return calculationResult.allPhaseDetails[selectedPhase];
  }, [selectedPhase, calculationResult]);

  return (
    <div className="min-h-screen bg-stone-50/60 text-stone-800 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* Top Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        
        {/* Section 1: Flo Dial Tracker & Key Predictions */}
        <section aria-label="Flo Dial Tracker">
          <FloDialTracker
            result={calculationResult}
            onOpenChat={() => {
              setPresetQuestion(undefined);
              setIsChatOpen(true);
            }}
            onSelectPhase={handleSelectPhase}
            onScrollToDiagnosis={handleScrollToDiagnosis}
          />
        </section>

        {/* Section 2: Flo Daily Greeting & Health Insight */}
        <section aria-label="Sapaan Harian Flo">
          <DailyFloInsightCard
            currentPhase={calculationResult.currentPhase}
            currentDayOfCycle={calculationResult.currentDayOfCycle}
            onOpenAssistant={() => {
              setPresetQuestion(`Bagaimana cara terbaik merawat tubuh dan emosi saat berada di fase ${calculationResult.currentPhaseDetail.name}?`);
              setIsChatOpen(true);
            }}
          />
        </section>

        {/* Section 3: Interactive Visual Flo Calendar with Phase Colors */}
        <section aria-label="Kalender Haid My Kalila">
          <InteractiveFloCalendar result={calculationResult} />
        </section>

        {/* Section 4: 4 Physiological Parameters Input Form (Tabel 1-4) */}
        <section aria-label="Formulir Parameter Fisiologis">
          <CycleForm
            input={input}
            onChange={setInput}
            onReset={handleResetForm}
          />
        </section>

        {/* Section 5: Forward Chaining & Certainty Factor Clinical Screening */}
        <section id="expert-diagnosis-section" aria-label="Laporan Deteksi Dini Sistem Pakar">
          <ExpertDiagnosisReport
            evaluation={calculationResult.expertSystem}
            onAskDoctorAI={handleAskDoctorAI}
          />
        </section>

        {/* Section 6: Ringkasan 4 Fase Siklus */}
        <section aria-label="Hasil Perhitungan Siklus">
          <CycleOverview
            result={calculationResult}
            onSelectPhase={handleSelectPhase}
          />
        </section>

        {/* Section 7: Deep Dive Panduan Fase Dipilih */}
        <section id="phase-detail-section" aria-label="Panduan Edukatif Fase">
          <PhaseDetailsCard
            phaseDetail={selectedPhaseDetail}
            onAskAboutPhase={handleAskAboutPhase}
          />
        </section>

        {/* Section 8: Prediksi 3 Siklus Mendatang */}
        <section aria-label="Prediksi Siklus Mendatang">
          <UpcomingCycles result={calculationResult} />
        </section>

        {/* Section 9: Catatan Edukatif & Penafian Medis Resmi */}
        <section aria-label="Penafian Medis">
          <DisclaimerBanner />
        </section>
      </main>

      {/* Floating Assistant Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => {
            setPresetQuestion(undefined);
            setIsChatOpen(true);
          }}
          className="group flex items-center gap-2.5 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer border border-rose-400"
          title="Buka asisten konsultasi ramah"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircleHeart className="w-5 h-5 text-white" />
          </div>
          <div className="text-left pr-1 hidden sm:block">
            <div className="text-xs font-bold leading-tight">Tanya Asisten AI</div>
            <div className="text-[10px] text-rose-100 leading-tight">Konsultasi Ramah &amp; Terpercaya</div>
          </div>
        </button>
      </div>

      {/* Interactive AI Assistant Modal */}
      <AssistantChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        result={calculationResult}
        presetQuestion={presetQuestion}
        onClearPresetQuestion={() => setPresetQuestion(undefined)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200/80 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Kalkulator &amp; Tracker Siklus Menstruasi ala Flo &bull; Estetik, Feminin &amp; Didukung Sistem Pakar</span>
          </div>
          <p className="text-[11px] text-stone-400 text-center sm:text-right">
            Didukung Teori Forward Chaining &amp; Certainty Factor (dr. Novianti Nurzanah, 2026).
          </p>
        </div>
      </footer>
    </div>
  );
}
