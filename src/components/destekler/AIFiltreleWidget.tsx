"use client";

import { useState } from "react";
import type { DestekProgrami, FirmaProfili, AIFiltreSonucu } from "@/types";
import { Sparkles, X, CheckCircle, XCircle, ChevronRight } from "lucide-react";

interface Props {
  firma: FirmaProfili;
  sinirdaDestekler: DestekProgrami[];
  onKapat: () => void;
}

export function AIFiltreleWidget({ firma, sinirdaDestekler, onKapat }: Props) {
  const [yukleniyor, setYukleniyor] = useState(false);
  const [sonuclar, setSonuclar] = useState<AIFiltreSonucu[]>([]);
  const [hata, setHata] = useState<string | null>(null);

  async function aiAnaliz() {
    setYukleniyor(true);
    setHata(null);
    try {
      const yanit = await fetch("/api/ai/filtrele", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firma, destekSluglar: sinirdaDestekler.map((d) => d.slug) }),
      });
      if (!yanit.ok) throw new Error("API hatası");
      const veri = await yanit.json();
      setSonuclar(veri.sonuclar);
    } catch {
      setHata("AI analizi şu an kullanılamıyor. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-purple-600" />
          <h3 className="font-semibold text-purple-900 text-sm">AI Ek Analiz</h3>
          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
            {sinirdaDestekler.length} sınırda destek
          </span>
        </div>
        <button onClick={onKapat} className="text-purple-400 hover:text-purple-700">
          <X size={16} />
        </button>
      </div>

      <p className="text-xs text-purple-700 mb-3">
        Kural tabanlı filtrenin kesin yanıt veremediği {sinirdaDestekler.length} destek için
        yapay zeka firma bilgilerinizi ve destek mevzuatını birlikte değerlendirir.
      </p>

      {sonuclar.length === 0 && !yukleniyor && (
        <div className="mb-3 space-y-1">
          {sinirdaDestekler.slice(0, 3).map((d) => (
            <div key={d.slug} className="text-xs text-purple-600 flex items-center gap-1.5">
              <ChevronRight size={11} />
              {d.ad}
            </div>
          ))}
          {sinirdaDestekler.length > 3 && (
            <div className="text-xs text-purple-400">+{sinirdaDestekler.length - 3} daha...</div>
          )}
        </div>
      )}

      {yukleniyor && (
        <div className="flex items-center gap-2 py-3">
          <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-purple-600">AI analiz ediyor...</span>
        </div>
      )}

      {hata && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5 mb-3">
          {hata}
        </div>
      )}

      {sonuclar.length > 0 && (
        <div className="space-y-2 mb-3">
          {sonuclar.map((s) => {
            const destek = sinirdaDestekler.find((d) => d.slug === s.slug);
            return (
              <div
                key={s.slug}
                className={`p-3 rounded-lg border text-xs ${
                  s.tavsiye
                    ? "bg-green-50 border-green-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-start gap-2 mb-1.5">
                  {s.tavsiye ? (
                    <CheckCircle size={13} className="text-green-500 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle size={13} className="text-slate-400 mt-0.5 shrink-0" />
                  )}
                  <strong className="text-slate-800">{destek?.ad ?? s.slug}</strong>
                </div>
                <p className="text-slate-600 mb-2">{s.gerekce}</p>
                {s.adimlar.length > 0 && (
                  <ul className="space-y-1 pl-3 border-l-2 border-slate-200">
                    {s.adimlar.map((a, i) => (
                      <li key={i} className="text-slate-500">{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}

      {sonuclar.length === 0 && !yukleniyor && (
        <button
          onClick={aiAnaliz}
          className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          AI Analizini Başlat
        </button>
      )}
    </div>
  );
}
