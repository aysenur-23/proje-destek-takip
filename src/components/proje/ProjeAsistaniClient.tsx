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
  Target,
  BarChart3,
  ClipboardList,
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
  const kelimeSayisi = raporMetni.split(/\s+/).filter(Boolean).length;
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
          <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
            <Target size={14} className="text-blue-500" />
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
            <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-100 px-3 py-2 animate-fade-in">
              <FileText size={13} className="text-blue-500 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-blue-800">{secilenDestek.ad}</p>
                <p className="text-[10px] text-blue-500">
                  {secilenDestek.kurum} · {KATEGORI_ADI[secilenDestek.kategori]}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Rapor metin alanı */}
        <div className="card p-5">
          <div className="mb-2 flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
              <ClipboardList size={14} className="text-blue-500" />
              Proje Raporu / Başvuru Metni
            </label>
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "text-xs font-medium tabular-nums",
                  kelimeSayisi < 20 ? "text-slate-400" : kelimeSayisi < 100 ? "text-amber-500" : "text-emerald-600",
                )}
              >
                {kelimeSayisi} kelime
              </span>
              {raporMetni.length > 0 && (
                <span className="text-xs text-slate-400">· {raporMetni.length} karakter</span>
              )}
            </div>
          </div>
          <textarea
            className="input min-h-[280px] resize-y font-mono text-xs leading-relaxed"
            value={raporMetni}
            onChange={(e) => setRaporMetni(e.target.value)}
            placeholder={`Proje raporunuzu yapıştırın veya yazın...\n\nÖnerilen bölümler:\n• Proje özeti ve amacı\n• Hedefler ve beklenen çıktılar\n• Yöntem ve iş planı\n• Bütçe gerekçesi\n• Beklenen etkiler ve yenilikçilik`}
          />

          {/* İlerleme göstergesi */}
          {raporMetni.length > 0 && (
            <div className="mt-2">
              <div className="mb-1 flex justify-between text-[10px] text-slate-400">
                <span>İçerik yeterliliği</span>
                <span>{Math.min(100, Math.round((kelimeSayisi / 200) * 100))}%</span>
              </div>
              <div className="h-1 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    kelimeSayisi < 20 ? "bg-red-400" : kelimeSayisi < 100 ? "bg-amber-400" : "bg-emerald-500",
                  )}
                  style={{ width: `${Math.min(100, (kelimeSayisi / 200) * 100)}%` }}
                />
              </div>
              {raporMetni.trim().length < 50 && (
                <p className="mt-1.5 text-xs text-amber-600">
                  Daha anlamlı analiz için en az 50 karakter girin.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Analiz butonu */}
        <button
          onClick={analiz}
          disabled={!hazir || yukleniyor}
          className={cn(
            "btn-lg w-full gap-2 transition-all",
            hazir && !yukleniyor
              ? "bg-violet-600 text-white hover:bg-violet-500 shadow-md shadow-violet-600/20 hover:shadow-violet-500/30"
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
        <div className="flex items-start gap-2.5 rounded-xl border border-violet-100 bg-violet-50 px-3.5 py-3 text-xs text-violet-700">
          <Lock size={12} className="mt-0.5 shrink-0" />
          <span>
            Bu özellik <strong>Premium</strong> üyelere açıktır.
            Giriş yaparak 3 ücretsiz analiz hakkı kazanın.
          </span>
        </div>
      </div>

      {/* ── Sağ: Sonuçlar ── */}
      <div>
        {/* Hata */}
        {hata && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-slide-up">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {hata}
          </div>
        )}

        {/* Streaming önizleme */}
        {yukleniyor && (
          <div className="card p-5 mb-4 animate-fade-in">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-violet-300 border-t-violet-600" />
              <span className="text-sm font-medium text-violet-700">
                {secilenDestek?.ad || "Rapor"} analiz ediliyor...
              </span>
            </div>
            {akisMetni && (
              <pre className="max-h-52 overflow-hidden text-[11px] text-slate-400 whitespace-pre-wrap font-mono leading-relaxed bg-slate-50 rounded-lg p-3 border border-slate-100">
                {akisMetni.slice(-500)}
              </pre>
            )}
            {!akisMetni && (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="shimmer h-3 rounded-full"
                    style={{ width: `${85 - i * 12}%` }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Boş durum */}
        {!yukleniyor && !oneri && !hata && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center animate-fade-in">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 border border-violet-100">
              <Sparkles size={28} className="text-violet-400" />
            </div>
            <p className="font-semibold text-slate-600 mb-1">Henüz analiz yapılmadı</p>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              Sol taraftan başvurmak istediğiniz desteği seçin ve proje raporunuzu girin.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-xs">
              {[
                { label: "Destek seç", tamamlandi: !!secilenSlug },
                { label: "Rapor gir", tamamlandi: kelimeSayisi >= 20 },
                { label: "Analiz et", tamamlandi: false },
              ].map((adim, i) => (
                <div
                  key={adim.label}
                  className={cn(
                    "rounded-lg border px-2 py-2 text-center",
                    adim.tamamlandi
                      ? "border-emerald-200 bg-emerald-50"
                      : i === 2 && hazir
                        ? "border-violet-200 bg-violet-50"
                        : "border-slate-100 bg-slate-50",
                  )}
                >
                  <div
                    className={cn(
                      "text-[10px] font-bold",
                      adim.tamamlandi ? "text-emerald-600" : "text-slate-400",
                    )}
                  >
                    {i + 1}. {adim.label}
                  </div>
                </div>
              ))}
            </div>
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
        <div className="mb-1.5 flex items-center gap-1.5">
          <BarChart3 size={14} className="text-slate-400" />
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
            Genel Değerlendirme
          </h2>
        </div>

        <div className="mb-4 flex items-end justify-between">
          <p className="text-sm text-slate-500 leading-relaxed max-w-sm">{oneri.genelYorum}</p>
          <span className={cn("text-4xl font-bold tabular-nums shrink-0 ml-4", puanRenk)}>
            {oneri.genelPuan}
            <span className="text-base font-normal text-slate-400">/100</span>
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn("h-2 rounded-full transition-all duration-700", cubukRenk)}
            style={{ width: `${oneri.genelPuan}%` }}
          />
        </div>

        {oneri.oncelikliDuzeltmeler.length > 0 && (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-red-600">
              Öncelikli Düzeltmeler
            </p>
            <ol className="space-y-1.5">
              {oneri.oncelikliDuzeltmeler.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-red-700">
                  <span className="shrink-0 font-bold text-red-400 mt-0.5">{i + 1}.</span>
                  {d}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Bölüm önerileri */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
          Bölüm Analizi ({oneri.bolumler.length} bölüm)
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

  const config =
    bolum.puan >= 70
      ? { bg: "bg-emerald-100", text: "text-emerald-700", bar: "bg-emerald-500" }
      : bolum.puan >= 50
        ? { bg: "bg-amber-100", text: "text-amber-700", bar: "bg-amber-400" }
        : { bg: "bg-red-100", text: "text-red-700", bar: "bg-red-400" };

  return (
    <div className="card overflow-hidden">
      <button
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-slate-50"
        onClick={() => setAcik(!acik)}
      >
        {/* Puan rozetli daire */}
        <div className={cn("relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold", config.bg, config.text)}>
          {bolum.puan}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">{bolum.baslik}</p>
          {/* Mini progress bar */}
          <div className="mt-1 h-1 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", config.bar)}
              style={{ width: `${bolum.puan}%` }}
            />
          </div>
        </div>

        {acik ? (
          <ChevronUp size={15} className="shrink-0 text-slate-400" />
        ) : (
          <ChevronDown size={15} className="shrink-0 text-slate-400" />
        )}
      </button>

      {acik && (
        <div className="space-y-3 border-t border-slate-100 bg-slate-50/40 px-4 pb-4 pt-3 animate-fade-in">
          {bolum.sorunlar.length > 0 && (
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-red-500">
                Sorunlar
              </p>
              <ul className="space-y-1.5">
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
            <p className="mb-1.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              <CheckCircle2 size={10} />
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
