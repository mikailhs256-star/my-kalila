import React from 'react';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-rose-100 sticky top-0 z-30 transition-all shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-200 flex items-center justify-center text-rose-600 shadow-xs">
            <Heart className="w-5 h-5 fill-rose-500/30 text-rose-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                Asisten Siklus & Reproduksi
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                <Sparkles className="w-3 h-3 text-rose-500" />
                Empatik & Ramah
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500">
              Perkiraan tanggal haid berikutnya, masa subur, fase folikular & luteal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/80">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Privat & Aman di Perangkat Anda</span>
        </div>
      </div>
    </header>
  );
};
