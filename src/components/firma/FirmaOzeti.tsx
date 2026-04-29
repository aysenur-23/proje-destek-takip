"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { FirmaProfili } from "@/types";
import { SIRKET_TURU_ADI, paraCevir } from "@/lib/utils";
import {
  Building2,
  MapPin,
  Users,
  TrendingUp,
  Edit2,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

function localdenYukle(): FirmaProfili | null {
  if (typeof window === "undefined") return null;
  try {
    const ham = localStorage.getItem("firmaProfili");
    return ham ? JSON.parse(ham) : null;
  } catch {
    return null;
  }
}

function kobiSinifi(calisan: number, ciro: number) {
  const ciroM = ciro / 1_000_000;
  if (calisan <= 10 && ciroM <= 3) return { sinif: "Mikro KOBİ", renk: "emerald" };
  if (calisan <= 50 && ciroM <= 25) return { sinif: "Küçük KOBİ", renk: "blue" };
  if (calisan <= 250 && ciroM <= 125) return { sinif: "Orta KOBİ", renk: "violet" };
  return { sinif: "Büyük İşletme", renk: "slate" };
}

export function FirmaOzeti() {
  const [firma, setFirma] = useState<FirmaProfili | null>(null);

  useEffect(() => {
    setFirma(localdenYukle());
  }, []);

  if (!firma?.ad) return null;

  const ozellikler = [
    firma.argeYapiyorMu && "Ar-Ge",
    firma.teknokentteMi && "Teknokent",
    firma.osbdeMi && "OSB",
    firma.ihracatYapiyorMu && "İhracat",
    firma.kadinGirisimci && "Kadın Girişimci",
    firma.gencGirisimci && "Genç Girişimci",
    firma.engellıCalisanVarMi && "Engelli İstihdam",
  ].filter(Boolean) as string[];

  const kobi = kobiSinifi(firma.calısanSayisi, firma.yillikCiro);

  const kobiBadgeRenk: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    violet: "bg-violet-100 text-violet-700 border-violet-200",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
  };

  const yilFark = new Date().getFullYear() - firma.kurulusYili;

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 px-5 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 shrink-0">
            <Building2 size={17} className="text-blue-600" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-slate-900 text-sm truncate leading-tight">{firma.ad}</h2>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-xs text-slate-400">{SIRKET_TURU_ADI[firma.sirketTuru]}</span>
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-bold",
                  kobiBadgeRenk[kobi.renk],
                )}
              >
                {kobi.sinif}
              </span>
            </div>
          </div>
        </div>
        <Link
          href="/firma"
          className="shrink-0 flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
        >
          <Edit2 size={11} />
          Düzenle
        </Link>
      </div>

      {/* Bilgiler */}
      <div className="px-5 py-4 space-y-2.5">
        {firma.il && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin size={13} className="text-slate-400 shrink-0" />
            <span>{firma.il}{firma.ilce ? `, ${firma.ilce}` : ""}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Users size={13} className="text-slate-400 shrink-0" />
          <span>{firma.calısanSayisi} çalışan</span>
        </div>
        {firma.yillikCiro > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <TrendingUp size={13} className="text-slate-400 shrink-0" />
            <span>{paraCevir(firma.yillikCiro)} / yıl</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar size={13} className="text-slate-400 shrink-0" />
          <span>
            {firma.kurulusYili} · {yilFark === 0 ? "Bu yıl kuruldu" : `${yilFark} yıllık`}
          </span>
        </div>

        {/* Sektör */}
        {firma.sektorAdi && (
          <div className="flex items-start gap-2 text-sm text-slate-600">
            <Tag size={13} className="text-slate-400 shrink-0 mt-0.5" />
            <span>
              {firma.sektorAdi}
              {firma.sektorKodu && (
                <span className="ml-1 text-xs text-slate-400">({firma.sektorKodu})</span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Özellikler */}
      {ozellikler.length > 0 && (
        <div className="px-5 pb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Aktif özellikler
          </p>
          <div className="flex flex-wrap gap-1.5">
            {ozellikler.map((oz) => (
              <span
                key={oz}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700"
              >
                <CheckCircle2 size={9} />
                {oz}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="px-5 pb-5">
        <Link
          href="/destekler"
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20"
        >
          Uygun Destekleri Gör
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
