import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export const DisclaimerFooter: React.FC = () => {
  return (
    <footer className="mt-12 mb-6 max-w-7xl mx-auto px-4">
      <div className="bg-slate-900/30 backdrop-blur-xl border border-white/5 rounded-3xl p-5 text-slate-500 text-xs leading-relaxed space-y-2">
        <div className="flex items-center gap-2 text-slate-400 font-mono font-bold">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>SANGGAHAN & MANAJEMEN RISIKO (DISCLAIMER):</span>
        </div>
        <p>
          VisionTrade Pro dirancang khusus sebagai platform analisis pasar dan simulasi perdagangan berbasis kecerdasan buatan (Google Gemini 3.6 Flash Engine). Seluruh data harga, indikator teknikal (RSI, MACD, SMA, Bollinger Bands), sentimen berita, dan sinyal AI yang ditampilkan diproses dari sumber publik terbuka secara real-time dan disediakan hanya untuk tujuan analisis teknis dan pendidikan.
        </p>
        <p>
          VisionTrade Pro tidak memberikan nasihat keuangan formal (Financial Advice). Keputusan investasi atau perdagangan sepenuhnya berada di bawah tanggung jawab pengguna. Pastikan selalu menerapkan prinsip manajemen risiko dan Stop Loss yang ketat.
        </p>
        <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-600">
          <span>© 2026 VisionTrade Pro • Spatial UI visionOS Edition</span>
          <span>Powered by Google Gemini 3.6 Flash & Live Public Data Adapters</span>
        </div>
      </div>
    </footer>
  );
};
