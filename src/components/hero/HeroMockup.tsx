"use client";

import { CheckCircle2, XCircle, Clock, Zap, SlidersHorizontal } from "lucide-react";

const destekler = [
  { kurum: "TÜBİTAK", ad: "1507 KOBİ Ar-Ge Başlangıç",  skor: 94, durum: "uygun",    hibe: "%75 hibe", max: "₺750K", renk: "#2563eb" },
  { kurum: "KOSGEB",  ad: "Dijital Dönüşüm Desteği",     skor: 88, durum: "uygun",    hibe: "%60 hibe", max: "₺300K", renk: "#059669" },
  { kurum: "SGK",     ad: "5746 Ar-Ge Prim Desteği",     skor: 71, durum: "sinir",    hibe: "Prim",     max: "—",     renk: "#d97706" },
  { kurum: "AB Fonu", ad: "EIC Accelerator",              skor: 38, durum: "uygunsuz", hibe: "%70 hibe", max: "€2.5M", renk: "#64748b" },
];

type Durum = "uygun" | "sinir" | "uygunsuz";

function SkorHalkasi({ skor, durum }: { skor: number; durum: Durum }) {
  const r   = 13;
  const çev = 2 * Math.PI * r;
  const dol = (skor / 100) * çev;
  const clr = durum === "uygun" ? "#22c55e" : durum === "sinir" ? "#f59e0b" : "#94a3b8";
  return (
    <div className="relative flex items-center justify-center w-9 h-9 shrink-0">
      <svg width="36" height="36" className="-rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
        <circle cx="18" cy="18" r={r} fill="none" stroke={clr} strokeWidth="2.5"
          strokeDasharray={`${dol} ${çev}`} strokeLinecap="round" />
      </svg>
      <span className="absolute text-[9px] font-bold text-white/80">{skor}</span>
    </div>
  );
}

export function HeroMockup() {
  return (
    <div className="relative w-full max-w-[500px] select-none">

      {/* Floating: eşleşme */}
      <div className="absolute -top-5 -left-6 z-20 animate-float" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white px-3.5 py-2.5 shadow-lg">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500 shrink-0">
            <CheckCircle2 size={13} className="text-white" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-900">2 Uygun Program</p>
            <p className="text-[10px] text-gray-400">₺1.05M potansiyel hibe</p>
          </div>
        </div>
      </div>

      {/* Floating: AI */}
      <div className="absolute -bottom-5 -right-5 z-20 animate-float" style={{ animationDelay: "1.8s" }}>
        <div className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white px-3.5 py-2.5 shadow-lg">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 shrink-0">
            <Zap size={12} className="text-white" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-900">AI Analiz</p>
            <p className="text-[10px] text-gray-400">0.8 saniyede hazır</p>
          </div>
        </div>
      </div>

      {/* Browser frame */}
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          background: "linear-gradient(145deg, #0f172a 0%, #0d1529 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 32px 64px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        {/* Chrome bar */}
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
          <div className="flex gap-1.5 shrink-0">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          </div>
          <div className="flex flex-1 items-center gap-1.5 rounded-md bg-white/[0.05] px-3 py-1.5 border border-white/[0.06]">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400 shrink-0" />
            <span className="text-[10px] text-gray-500 font-mono">destektakip.com/destekler</span>
          </div>
          <SlidersHorizontal size={13} className="text-gray-600 shrink-0" />
        </div>

        {/* App body */}
        <div className="p-4">
          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[11px] font-semibold text-white/90">Filtreleme Sonuçları</p>
              <p className="text-[10px] text-gray-500 mt-0.5">40 program tarandı · 0.8 sn</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-blue-600/20 border border-blue-500/20 px-2.5 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse-soft" />
              <span className="text-[10px] font-semibold text-blue-300">Canlı</span>
            </div>
          </div>

          {/* Destek kartları */}
          <div className="space-y-2">
            {destekler.map((d) => (
              <div
                key={d.ad}
                className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.04] p-3 transition-colors hover:bg-white/[0.07]"
              >
                {/* Kurum dot */}
                <div
                  className="h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ background: d.renk }}
                />
                {/* İçerik */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-white/85 truncate leading-tight">{d.ad}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: d.renk + "22", color: d.renk }}
                    >
                      {d.kurum}
                    </span>
                    <span className="text-[9px] text-gray-500">{d.hibe}</span>
                    <span className="text-[9px] text-gray-600">max {d.max}</span>
                  </div>
                </div>
                {/* Skor */}
                <SkorHalkasi skor={d.skor} durum={d.durum as Durum} />
                {/* İkon */}
                <div className="shrink-0 w-4">
                  {d.durum === "uygun"    && <CheckCircle2 size={13} className="text-green-400" />}
                  {d.durum === "sinir"    && <Clock        size={13} className="text-yellow-400" />}
                  {d.durum === "uygunsuz" && <XCircle      size={13} className="text-gray-600" />}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between px-1">
            <span className="text-[9px] text-gray-600">
              <span className="text-green-400 font-semibold">2 uygun</span> · 1 sınırda · 1 uygunsuz
            </span>
            <span className="text-[9px] text-blue-400 font-medium cursor-pointer hover:underline">AI analiz →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
