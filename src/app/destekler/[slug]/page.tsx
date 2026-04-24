import { notFound } from "next/navigation";
import type { DestekProgrami } from "@/types";
import { KATEGORI_ADI, KATEGORI_RENK, TUR_ADI, paraCevir } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ExternalLink, ArrowLeft, Calendar, Building, TrendingUp } from "lucide-react";
import Link from "next/link";
import { tumDestekler } from "@/data/destekler";

export default async function DestekDetaySayfasi({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destek = tumDestekler.find((d) => d.slug === slug) ?? null;
  if (!destek) notFound();

  const k = destek.kriterler;

  return (
    <div className="container py-10 max-w-3xl">
      <Link href="/destekler" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6">
        <ArrowLeft size={14} />
        Tüm destekler
      </Link>

      <div className="flex items-start gap-3 flex-wrap mb-2">
        <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full border", KATEGORI_RENK[destek.kategori])}>
          {KATEGORI_ADI[destek.kategori]}
        </span>
        <span className="text-xs border border-slate-200 rounded-full px-2.5 py-1 text-slate-500">
          {TUR_ADI[destek.tur]}
        </span>
        {!destek.aktif && (
          <span className="text-xs bg-red-100 text-red-700 border border-red-200 rounded-full px-2.5 py-1">
            Pasif / Kapalı
          </span>
        )}
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-2">{destek.ad}</h1>
      <p className="text-slate-500 mb-8">{destek.aciklama}</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {destek.hibeOrani && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-blue-600 text-xs font-medium mb-1">
              <TrendingUp size={13} />
              Hibe Oranı
            </div>
            <div className="text-2xl font-bold text-blue-700">%{destek.hibeOrani}</div>
          </div>
        )}
        {destek.butceUstSinir && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <div className="text-emerald-600 text-xs font-medium mb-1">Maksimum Bütçe</div>
            <div className="text-lg font-bold text-emerald-700">{paraCevir(destek.butceUstSinir)}</div>
          </div>
        )}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
            <Building size={13} />
            Kurum
          </div>
          <div className="font-semibold text-slate-700 text-sm">{destek.kurum}</div>
        </div>
      </div>

      <div className="card divide-y divide-slate-100 mb-6">
        <div className="p-4">
          <h2 className="font-semibold text-slate-800 mb-2">Amaç</h2>
          <p className="text-slate-600 text-sm">{destek.amac}</p>
        </div>

        {k.notlar && (
          <div className="p-4">
            <h2 className="font-semibold text-slate-800 mb-2">Önemli Notlar</h2>
            <p className="text-slate-600 text-sm">{k.notlar}</p>
          </div>
        )}

        <div className="p-4">
          <h2 className="font-semibold text-slate-800 mb-3">Uygunluk Kriterleri</h2>
          <div className="space-y-1 text-sm">
            {k.sirketTurleri && <KriterSatiri etiket="Şirket türü" deger={k.sirketTurleri.join(", ")} />}
            {k.minCalisan !== undefined && <KriterSatiri etiket="Min. çalışan" deger={`${k.minCalisan} kişi`} />}
            {k.maxCalisan !== undefined && <KriterSatiri etiket="Maks. çalışan" deger={`${k.maxCalisan} kişi`} />}
            {k.minCiro !== undefined && <KriterSatiri etiket="Min. ciro" deger={paraCevir(k.minCiro)} />}
            {k.maxCiro !== undefined && <KriterSatiri etiket="Maks. ciro" deger={paraCevir(k.maxCiro)} />}
            {k.sektorler && <KriterSatiri etiket="Sektörler" deger={k.sektorler.join(", ")} />}
            {k.bolgeKisiti && <KriterSatiri etiket="Bölge kısıtı" deger={k.bolgeKisiti.join(", ")} />}
            {k.argeZorunlu && <KriterSatiri etiket="Ar-Ge" deger="Zorunlu" renk="red" />}
            {k.teknokentZorunlu && <KriterSatiri etiket="Teknokent" deger="Zorunlu" renk="red" />}
            {k.ihracatZorunlu && <KriterSatiri etiket="İhracat" deger="Zorunlu" renk="red" />}
            {k.kadinGirisimciBonus && <KriterSatiri etiket="Kadın girişimci" deger="Öncelik / bonus" renk="green" />}
            {k.gencGirisimciBonus && <KriterSatiri etiket="Genç girişimci" deger="Öncelik / bonus" renk="green" />}
          </div>
        </div>

        {destek.etiketler.length > 0 && (
          <div className="p-4">
            <h2 className="font-semibold text-slate-800 mb-2">Etiketler</h2>
            <div className="flex flex-wrap gap-1.5">
              {destek.etiketler.map((e) => (
                <span key={e} className="text-xs bg-slate-100 text-slate-600 rounded-full px-2.5 py-1">
                  {e}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {destek.basvuruBitis && (
        <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
          <Calendar size={15} />
          Son başvuru tarihi: {new Date(destek.basvuruBitis).toLocaleDateString("tr-TR")}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <a
          href={destek.mevzuatUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-md btn-primary gap-2"
        >
          <ExternalLink size={14} />
          Resmi Mevzuat
        </a>
        {destek.rehberUrl && (
          <a
            href={destek.rehberUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-md btn-secondary"
          >
            Başvuru Rehberi
          </a>
        )}
        <Link href="/proje-asistani" className="btn-md btn-secondary ml-auto">
          Proje Asistanı →
        </Link>
      </div>
    </div>
  );
}

function KriterSatiri({ etiket, deger, renk }: { etiket: string; deger: string; renk?: "red" | "green" }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 border-b border-slate-50 last:border-0">
      <span className="text-slate-500">{etiket}</span>
      <span className={cn("font-medium", renk === "red" && "text-red-600", renk === "green" && "text-green-600", !renk && "text-slate-700")}>
        {deger}
      </span>
    </div>
  );
}
