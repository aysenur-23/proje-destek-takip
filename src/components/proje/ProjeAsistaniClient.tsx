"use client";

import { useState } from "react";
import type { DestekProgrami, ProjeOnerisi } from "@/types";
import { KATEGORI_ADI } from "@/lib/utils";
import {
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DestekOzet = Pick<DestekProgrami, "slug" | "ad" | "kurum" | "kategori">;

export function ProjeAsistaniClient({ destekler }: { destekler: DestekOzet[] }) {
  const [raporMetni, setRaporMetni] = useState("");
  const [secilenSlug, setSecilenSlug] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [oneri, setOneri] = useState<ProjeOnerisi | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [akisMetni, setAkisMetni] = useState("");

  const secilenDestek = destekler.find((d) => d.slug === secilenSlug);
  const hazir = raporMetni.trim().length > 50 && !!secilenSlug;

  async function analiz() {
    if (!hazir || yukleniyor) return;
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
        tamMetin += decoder.decode(value, { stream: true });
        setAkisMetni(tamMetin);
      }

      const jsonEslesmesi = tamMetin.match(/\{[\s\S]*\}/);
      if (jsonEslesmesi) {
        setOneri(JSON.parse(jsonEslesmesi[0]));
        setAkisMetni("");
      }
    } catch {
      setHata("AI analizi sırasında bir hata oluştu. API anahtarınızı ve bağlantınızı kontrol edin.");
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ── Sol: Girdi ── */}
      <div className="space-y-4">
        {/* Destek seçici */}
        <div className="card p-5">
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            Hedef Destek Programı
          </label>
          <select
            className="input"
            value={secilenSlug}
            onChange={(e) => setSecilenSlug(e.target.value)}
          >
            <option value="">— Başvuracağınız desteği seçin —</option>
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
            <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-100 px-3 py-2">
              <FileText size={13} className="text-blue-500 shrink-0" />
              <span className="text-xs text-blue-700">
                <strong>{secilenDestek.kurum}</strong> — {KATEGORI_ADI[secilenDestek.kategori]}
              </span>
            </div>
          )}
        </div>

        {/* Rapor metin alanı */}
        <div className="card p-5">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-800">
              Proje Raporu / Başvuru Metni
            </label>
            <span className="text-xs text-slate-400">
              {raporMetni.split(/\s+/).filter(Boolean).length} kelime
            </span>
          </div>
          <textarea
            className="input min-h-[300px] resize-y font-mono text-xs leading-relaxed"
            value={raporMetni}
            onChange={(e) => setRaporMetni(e.target.value)}
            placeholder={`Proje raporunuzu yapıştırın veya yazın...\n\nBölümler:\n• Proje özeti ve amacı\n• Hedefler ve beklenen çıktılar\n• Yöntem ve iş planı\n• Bütçe gerekçesi\n• Beklenen etkiler`}
          />
          {raporMetni.length > 0 && raporMetni.trim().length < 50 && (
            <p className="mt-1.5 text-xs text-amber-600">
              Daha anlamlı analiz için en az 50 karakter girin.
            </p>
          )}
        </div>

        {/* Analiz butonu */}
        <button
          onClick={analiz}
          disabled={!hazir || yukleniyor}
          className={cn(
            "btn-lg w-full gap-2 transition-all",
            hazir && !yukleniyor
              ? "bg-violet-600 text-white hover:bg-violet-500 shadow-md shadow-violet-600/20"
              : "cursor-not-allowed bg-slate-100 text-slate-400",
          )}
        >
          {yukleniyor ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Analiz ediliyor...
            </>
          ) : (
            <>
              <Sparkles size={17} />
              AI ile Analiz Et
            </>
          )}
        </button>

        {/* Premium notu */}
        <div className="flex items-start gap-2 rounded-xl border border-violet-100 bg-violet-50 px-3 py-2.5 text-xs text-violet-700">
          <Lock size={12} className="mt-0.5 shrink-0" />
          Bu özellik Premium üyelere açıktır. Giriş yaparak 3 ücretsiz analiz hakkı kazanın.
        </div>
      </div>

      {/* ── Sağ: Sonuçlar ── */}
      <div>
        {/* Hata */}
        {hata && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {hata}
          </div>
        )}

        {/* Streaming önizleme */}
        {yukleniyor && akisMetni && (
          <div className="card p-5 mb-4">
            <div className="mb-3 flex items-center gap-2 text-violet-600">
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-violet-300 border-t-violet-600" />
              <span className="text-sm font-medium">AI raporu inceliyor...</span>
            </div>
            <pre className="max-h-48 overflow-hidden text-[11px] text-slate-400 whitespace-pre-wrap font-mono leading-relaxed">
              {akisMetni.slice(-600)}
            </pre>
          </div>
        )}

        {/* Boş durum */}
        {!yukleniyor && !oneri && !hata && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50">
              <Sparkles size={28} className="text-violet-400" />
            </div>
            <p className="font-medium text-slate-600">Henüz analiz yapılmadı</p>
            <p className="mt-1 text-sm text-slate-400">
              Sol taraftan desteği seçin ve raporu girin.
            </p>
          </div>
        )}

        {/* Sonuçlar */}
        {oneri && <OnerilerPanel oneri={oneri} />}
      </div>
    </div>
  );
}

function OnerilerPanel({ oneri }: { oneri: ProjeOnerisi }) {
  const puanRenk =
    oneri.genelPuan >= 70
      ? "text-emerald-600"
      : oneri.genelPuan >= 50
        ? "text-amber-500"
        : "text-red-500";

  const cubukRenk =
    oneri.genelPuan >= 70
      ? "bg-emerald-500"
      : oneri.genelPuan >= 50
        ? "bg-amber-400"
        : "bg-red-400";

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Genel puan */}
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Genel Değerlendirme</h2>
          <span className={cn("text-3xl font-bold tabular-nums", puanRenk)}>
            {oneri.genelPuan}
            <span className="text-base font-normal text-slate-400">/100</span>
          </span>
        </div>

        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn("h-2 rounded-full transition-all duration-700", cubukRenk)}
            style={{ width: `${oneri.genelPuan}%` }}
          />
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">{oneri.genelYorum}</p>

        {oneri.oncelikliDuzeltmeler.length > 0 && (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3">
            <p className="mb-2 text-xs font-semibold text-red-700">Öncelikli Düzeltmeler</p>
            <ol className="space-y-1.5">
              {oneri.oncelikliDuzeltmeler.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-red-700">
                  <span className="shrink-0 font-bold">{i + 1}.</span>
                  {d}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Bölüm önerileri */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 px-1">
          Bölüm Analizi
        </p>
        {oneri.bolumler.map((bolum, i) => (
          <BolumKarti key={i} bolum={bolum} />
        ))}
      </div>
    </div>
  );
}

function BolumKarti({ bolum }: { bolum: ProjeOnerisi["bolumler"][number] }) {
  const [acik, setAcik] = useState(bolum.puan < 70);

  const { bg, text } =
    bolum.puan >= 70
      ? { bg: "bg-emerald-100", text: "text-emerald-700" }
      : bolum.puan >= 50
        ? { bg: "bg-amber-100", text: "text-amber-700" }
        : { bg: "bg-red-100", text: "text-red-700" };

  return (
    <div className="card overflow-hidden">
      <button
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-50"
        onClick={() => setAcik(!acik)}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
              bg,
              text,
            )}
          >
            {bolum.puan}
          </div>
          <span className="text-sm font-medium text-slate-800">{bolum.baslik}</span>
        </div>
        {acik ? (
          <ChevronUp size={15} className="shrink-0 text-slate-400" />
        ) : (
          <ChevronDown size={15} className="shrink-0 text-slate-400" />
        )}
      </button>

      {acik && (
        <div className="space-y-3 border-t border-slate-100 px-4 pb-4 pt-3">
          {bolum.sorunlar.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-semibold text-red-600">Sorunlar</p>
              <ul className="space-y-1">
                {bolum.sorunlar.map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                    <AlertCircle size={11} className="mt-0.5 shrink-0 text-red-400" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 size={12} />
              Önerilen Değişiklikler
            </p>
            <p className="whitespace-pre-wrap rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs leading-relaxed text-slate-700">
              {bolum.onerilenDegisiklikler}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
