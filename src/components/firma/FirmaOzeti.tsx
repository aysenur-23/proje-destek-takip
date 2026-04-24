"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { FirmaProfili } from "@/types";
import { SIRKET_TURU_ADI } from "@/lib/utils";
import { paraCevir } from "@/lib/utils";
import {
  Building2,
  MapPin,
  Users,
  TrendingUp,
  Edit2,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

function localdenYukle(): FirmaProfili | null {
  if (typeof window === "undefined") return null;
  try {
    const ham = localStorage.getItem("firmaProfili");
    return ham ? JSON.parse(ham) : null;
  } catch {
    return null;
  }
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
  ].filter(Boolean) as string[];

  return (
    <div className="card p-5 space-y-4">
      {/* Başlık */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 shrink-0">
            <Building2 size={16} className="text-blue-600" />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-slate-900 text-sm truncate">{firma.ad}</h2>
            <p className="text-xs text-slate-400">{SIRKET_TURU_ADI[firma.sirketTuru]}</p>
          </div>
        </div>
        <Link
          href="/firma"
          className="shrink-0 flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Edit2 size={12} />
          Düzenle
        </Link>
      </div>

      {/* Bilgiler */}
      <div className="space-y-2 text-sm">
        {firma.il && (
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin size={13} className="text-slate-400 shrink-0" />
            <span>{firma.il}{firma.ilce ? `, ${firma.ilce}` : ""}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-slate-600">
          <Users size={13} className="text-slate-400 shrink-0" />
          <span>{firma.calısanSayisi} çalışan</span>
        </div>
        {firma.yillikCiro > 0 && (
          <div className="flex items-center gap-2 text-slate-600">
            <TrendingUp size={13} className="text-slate-400 shrink-0" />
            <span>{paraCevir(firma.yillikCiro)} / yıl</span>
          </div>
        )}
      </div>

      {/* Sektör */}
      {firma.sektorAdi && (
        <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
          <span className="text-slate-400">Sektör: </span>
          {firma.sektorAdi}
          {firma.sektorKodu && <span className="ml-1 text-slate-400">({firma.sektorKodu})</span>}
        </div>
      )}

      {/* Özellikler */}
      {ozellikler.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {ozellikler.map((oz) => (
            <span
              key={oz}
              className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
            >
              <CheckCircle2 size={10} />
              {oz}
            </span>
          ))}
        </div>
      )}

      <Link
        href="/destekler"
        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
      >
        <ExternalLink size={12} />
        Uygun Destekleri Gör
      </Link>
    </div>
  );
}
