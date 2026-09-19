import React from 'react';
import { AlertCircle, Stethoscope, Info } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-amber-50/70 border border-amber-200/90 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
          <Stethoscope className="w-5 h-5 text-amber-700" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-bold text-amber-950 font-display">
              Catatan Edukatif & Penafian Medis Resmi
            </h4>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
              Penting Diketahui
            </span>
          </div>
          <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
            Perhitungan dan tanggal yang ditampilkan pada aplikasi ini merupakan <strong>estimasi biologis berbasis model matematika kalender standar</strong>.
            Siklus reproduksi setiap wanita bersifat unik dan dinamis; jadwal ovulasi serta haid dapat bergeser secara wajar akibat berbagai faktor seperti tingkat stres fisik/mental, kualitas tidur, pola nutrisi, perjalanan (jet lag), fluktuasi hormon alami, atau kondisi klinis tertentu (seperti sindrom ovarium polikistik/PCOS atau gangguan tiroid).
          </p>

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-amber-900/80">
            <div className="flex items-start gap-2 bg-white/60 p-3 rounded-xl border border-amber-200/60">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Bukan Alat Kontrasepsi Tunggal:</strong> Estimasi masa subur ini tidak dapat diandalkan sebagai satu-satunya metode pencegahan kehamilan karena waktu ovulasi dapat bervariasi setiap bulan.
              </span>
            </div>
            <div className="flex items-start gap-2 bg-white/60 p-3 rounded-xl border border-amber-200/60">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Konsultasi Medis Resmi:</strong> Jika kamu mengalami nyeri panggul yang melumpuhkan, perdarahan haid sangat banyak (&gt;7 hari), atau siklus tidak teratur (&lt;21 hari atau &gt;35 hari), segera berkonsultasi langsung dengan dokter spesialis obstetri &amp; ginekologi (Sp.OG) atau bidan terdekat.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
