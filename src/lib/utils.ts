import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { DestekKategori, DestekTuru } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function paraCevir(tutar: number): string {
  if (tutar >= 1_000_000) return `${(tutar / 1_000_000).toFixed(1)} milyon TL`;
  if (tutar >= 1_000) return `${(tutar / 1_000).toFixed(0)} bin TL`;
  return `${tutar.toLocaleString("tr-TR")} TL`;
}

export const KATEGORI_RENK: Record<DestekKategori, string> = {
  TUBITAK: "bg-blue-100 text-blue-800 border-blue-200",
  KOSGEB: "bg-orange-100 text-orange-800 border-orange-200",
  TKDK: "bg-green-100 text-green-800 border-green-200",
  AB: "bg-indigo-100 text-indigo-800 border-indigo-200",
  SGK: "bg-purple-100 text-purple-800 border-purple-200",
  TEKNOKENT: "bg-cyan-100 text-cyan-800 border-cyan-200",
  KALKINMA: "bg-amber-100 text-amber-800 border-amber-200",
  TICARET: "bg-rose-100 text-rose-800 border-rose-200",
  SANAYI: "bg-slate-100 text-slate-800 border-slate-200",
  TARIM: "bg-lime-100 text-lime-800 border-lime-200",
  DIGER: "bg-gray-100 text-gray-800 border-gray-200",
};

export const KATEGORI_ADI: Record<DestekKategori, string> = {
  TUBITAK: "TÜBİTAK",
  KOSGEB: "KOSGEB",
  TKDK: "TKDK / IPARD",
  AB: "AB Fonları",
  SGK: "SGK Teşvikleri",
  TEKNOKENT: "Teknokent",
  KALKINMA: "Kalkınma Ajansı",
  TICARET: "Ticaret Bakanlığı",
  SANAYI: "Sanayi Bakanlığı",
  TARIM: "Tarım Bakanlığı",
  DIGER: "Diğer",
};

export const TUR_ADI: Record<DestekTuru, string> = {
  HIBE: "Hibe",
  KREDI: "Faizsiz Kredi",
  VERGI_MUAFIYETI: "Vergi Muafiyeti",
  PRIM_DESTEGI: "Prim Desteği",
  KARMA: "Hibe + Kredi",
};

export const SIRKET_TURU_ADI: Record<string, string> = {
  AS: "Anonim Şirket (A.Ş.)",
  LTD: "Limited Şirket (Ltd. Şti.)",
  SAHIS: "Şahıs İşletmesi",
  KOOPERATIF: "Kooperatif",
  DERNEK_VAKIF: "Dernek / Vakıf",
  DIGER: "Diğer",
};
