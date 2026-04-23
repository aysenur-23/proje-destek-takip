"use client";

import { useState } from "react";
import type { DestekProgrami, ProjeOnerisi } from "@/types";
import { KATEGORI_ADI } from "@/lib/utils";
import { FileText, Sparkles, ChevronDown, ChevronUp, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type DestekOzet = Pick<DestekProgrami, "slug" | "ad" | "kurum" | "kategori">;

interface Props {
  destekler: DestekOzet[];
}

export function ProjeAsistaniClient({ destekler }: Props) {
  const [raporMetni, setRaporMetni] = useState("");
  const [secilenSlug, setSecilenSlug] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [oneri, setOneri] = useState<ProjeOnerisi | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [akisMetni, setAkisMetni] = useState("");

  const secilenDestek = destekler.find((d) => d.slug === secilenSlug);

  async function analiz() {
    if (!raporMetni.trim() || !secilenSlug) return;
    setYukleniyor(true);
    setHata(null);
    setOneri(null);
    setAkisMetni("");

    try {
      const yanit = await fetch("/api/ai/proje", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hedefDestekSlug: secilenSlug, raporMetni }),
      });

      if (!yanit.ok) throw new Error("API hatası");
      if (!yanit.body) throw new Error("Stream yok");

      const reader = yanit.body.getReader();
      const decoder = new TextDecoder();
      let tamMetin = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const parca = decoder.decode(value, { stream: true });
        tamMetin += parca;
        setAkisMetni(tamMetin);
      }

      // Son yanıtı JSON olarak parse et
      const jsonEslesmesi = tamMetin.match(/\{[\s\S]*\}/);
      if (jsonEslesmesi) {
        setOneri(JSON.parse(jsonEslesmesi[0]));
        setAkisMetni("");
      }
    } catch {
      setHata("AI analizi sırasında bir hata oluştu. API anahtarını ve bağlantınızı kontrol edin.");
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Sol: Giriş */}
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            <FileText size={14} className="inline mr-1.5" />
            Hedef Destek Programı
          </label>
          <select
            className="input"
            value={secilenSlug}
            onChange={(e) => setSecilenSlug(e.target.value)}
          >
            <option value="">— Bir destek seçin —</option>
            {Object.entries(KATEGORI_ADI).map(([kat, katAdi]) => {
              const grup = destekler.filter((d) => d.kategori === kat);
              if (grup.length === 0) return null;
              return (
                <optgroup key={kat} label={katAdi}>
                  {grup.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.ad}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>

          {secilenDestek && (
            <div className="mt-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
              <strong>{secilenDestek.kurum}</strong> — {KATEGORI_ADI[secilenDestek.kategori]}
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Proje Raporu / Başvuru Metni
          </label>
          <textarea
            className="input min-h-[320px] resize-y font-mono text-xs leading-relaxed"
            value={raporMetni}
            onChange={(e) => setRaporMetni(e.target.value)}
            placeholder={`Proje raporunuzu buraya yapıştırın veya yazın...\n\nÖrn:\n- Proje özeti\n- Hedefler ve beklenen çıktılar\n- Yöntem ve iş planı\n- Bütçe gerekçesi\n- Beklenen etkiler`}
          />
          <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
            <span>{raporMetni.length.toLocaleString("tr-TR")} karakter</span>
            <span>{raporMetni.split(/\s+/).filter(Boolean).length.toLocaleString("tr-TR")} kelime</span>
          </div>
        </div>

        <button
          onClick={analiz}
          disabled={!raporMetni.trim() || !secilenSlug || yukleniyor}
          className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium rounded-xl transition-colors"
        >
          {yukleniyor ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Analiz ediliyor...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              AI ile Analiz Et
            </>
          )}
        </button>
      </div>

      {/* Sağ: Sonuçlar */}
      <div>
        {hata && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {hata}
          </div>
        )}

        {yukleniyor && akisMetni && (
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3 text-purple-600">
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">AI analiz ediyor...</span>
            </div>
            <pre className="text-xs text-slate-500 whitespace-pre-wrap font-mono overflow-hidden">
              {akisMetni.slice(-800)}
            </pre>
          </div>
        )}

        {!yukleniyor && !oneri && !hata && (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-10 text-center text-slate-400">
            <Sparkles size={36} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">Proje metninizi girin ve hedef desteği seçin.</p>
            <p className="text-xs mt-1">AI bölüm bazlı öneriler sunacak.</p>
          </div>
        )}

        {oneri && <OnerilerPanel oneri={oneri} />}
      </div>
    </div>
  );
}

function OnerilerPanel({ oneri }: { oneri: ProjeOnerisi }) {
  return (
    <div className="space-y-4">
      {/* Genel puan */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900">Genel Değerlendirme</h2>
          <div className={cn(
            "text-2xl font-bold",
            oneri.genelPuan >= 70 ? "text-green-600" : oneri.genelPuan >= 50 ? "text-amber-500" : "text-red-500"
          )}>
            {oneri.genelPuan}/100
          </div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
          <div
            className={cn("h-2 rounded-full transition-all", oneri.genelPuan >= 70 ? "bg-green-500" : oneri.genelPuan >= 50 ? "bg-amber-400" : "bg-red-400")}
            style={{ width: `${oneri.genelPuan}%` }}
          />
        </div>
        <p className="text-slate-600 text-sm">{oneri.genelYorum}</p>

        {oneri.oncelikliDuzeltmeler.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-medium text-red-600 mb-2">Öncelikli Düzeltmeler:</p>
            <ul className="space-y-1">
              {oneri.oncelikliDuzeltmeler.map((d, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-red-600">
                  <span className="font-bold">{i + 1}.</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Bölüm önerileri */}
      <div className="space-y-3">
        {oneri.bolumler.map((bolum, i) => (
          <BolumKarti key={i} bolum={bolum} />
        ))}
      </div>
    </div>
  );
}

function BolumKarti({ bolum }: { bolum: ProjeOnerisi["bolumler"][number] }) {
  const [acik, setAcik] = useState(bolum.puan < 70);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
        onClick={() => setAcik(!acik)}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold",
            bolum.puan >= 70 ? "bg-green-100 text-green-700" : bolum.puan >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
          )}>
            {bolum.puan}
          </div>
          <span className="font-medium text-slate-800 text-sm">{bolum.baslik}</span>
        </div>
        {acik ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>

      {acik && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3">
          {bolum.sorunlar.length > 0 && (
            <div>
              <p className="text-xs font-medium text-red-600 mb-1.5">Sorunlar:</p>
              <ul className="space-y-1">
                {bolum.sorunlar.map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                    <AlertCircle size={12} className="mt-0.5 text-red-400 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-green-600 mb-1.5">
              <CheckCircle size={12} className="inline mr-1" />
              Önerilen Değişiklikler:
            </p>
            <p className="text-xs text-slate-600 bg-green-50 border border-green-100 rounded-lg p-3 whitespace-pre-wrap leading-relaxed">
              {bolum.onerilenDegisiklikler}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
