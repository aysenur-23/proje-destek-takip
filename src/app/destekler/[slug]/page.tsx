import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { DestekProgrami, EligibilityCriteria } from "@/types";
import { KATEGORI_ADI, KATEGORI_RENK, TUR_ADI, paraCevir } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  ArrowLeft,
  Calendar,
  Building,
  TrendingUp,
  FileText,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Clock,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { tumDestekler } from "@/data/destekler";
import { BasvuruTakipButonu } from "@/components/destekler/BasvuruTakipButonu";

export const revalidate = 86400;

export async function generateStaticParams() {
  return tumDestekler.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const destek = tumDestekler.find((d) => d.slug === slug);
  if (!destek) return {};
  return {
    title: destek.ad,
    description: destek.aciklama,
    openGraph: {
      title: `${destek.ad} | Destek Takip`,
      description: destek.aciklama,
    },
  };
}

// Kriterlere göre tahmini gerekli belgeler listesi üretir
function gerekliBelirleri(k: EligibilityCriteria, kategori: string): string[] {
  const belgeler: string[] = [
    "Ticaret Sicil Gazetesi (son baskı)",
    "İmza Sirküleri (noter onaylı)",
    "Vergi Levhası",
    "Son 2 yıl bilanço ve gelir tablosu",
  ];

  if (k.argeZorunlu) {
    belgeler.push("Ar-Ge Merkezi belgesi veya Ar-Ge proje sözleşmesi");
    belgeler.push("Ar-Ge personel listesi (sigorta dökümleri)");
  }

  if (k.teknokentZorunlu) {
    belgeler.push("TGB (Teknoloji Geliştirme Bölgesi) kira sözleşmesi veya faaliyet belgesi");
  }

  if (k.ihracatZorunlu) {
    belgeler.push("İhracat beyannameleri (son 1 yıl)");
    belgeler.push("Döviz alım belgeleri");
  }

  if (k.osbZorunlu) {
    belgeler.push("OSB tahsis belgesi veya kira sözleşmesi");
  }

  if (kategori === "TUBITAK" || kategori === "KOSGEB") {
    belgeler.push("Proje özeti (1-3 sayfa, Türkçe)");
    belgeler.push("Proje bütçe tablosu");
    belgeler.push("Ortaklar / ekip özgeçmişleri");
  }

  if (kategori === "TKDK") {
    belgeler.push("Tapu veya kira sözleşmesi (yatırım yeri için)");
    belgeler.push("Çevresel etki belgesi (gerekli ise)");
    belgeler.push("İş planı (TKDK formatında)");
  }

  if (kategori === "AB") {
    belgeler.push("İngilizce proje özeti (executive summary)");
    belgeler.push("Ortak kuruluş mektupları (varsa)");
  }

  if (kategori === "SGK") {
    belgeler.push("SGK işyeri bildirgesi");
    belgeler.push("Prim borcu yoktur yazısı");
  }

  if (kategori === "TICARET") {
    belgeler.push("İhracatçı Birliği üyelik belgesi (gerekebilir)");
    belgeler.push("Marka tescil belgesi (varsa)");
  }

  return belgeler;
}

// Benzer destekler: aynı kategori veya ortak etiket, farklı slug, aktif
function benzerDestekleriGetir(destek: DestekProgrami, tumu: DestekProgrami[]): DestekProgrami[] {
  const puanla = (d: DestekProgrami) => {
    if (d.slug === destek.slug) return -1;
    let puan = 0;
    if (d.kategori === destek.kategori) puan += 3;
    const ortakEtiket = d.etiketler.filter((e) => destek.etiketler.includes(e)).length;
    puan += ortakEtiket;
    if (d.aktif) puan += 1;
    return puan;
  };

  return [...tumu]
    .filter((d) => d.slug !== destek.slug && puanla(d) > 0)
    .sort((a, b) => puanla(b) - puanla(a))
    .slice(0, 3);
}

export default async function DestekDetaySayfasi({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destek = tumDestekler.find((d) => d.slug === slug) ?? null;
  if (!destek) notFound();

  const k = destek.kriterler;
  const belgeler = gerekliBelirleri(k, destek.kategori);
  const benzerler = benzerDestekleriGetir(destek, tumDestekler);

  const suresiDolmuMu = destek.basvuruBitis
    ? new Date(destek.basvuruBitis) < new Date()
    : false;

  return (
    <div className="container py-10 max-w-3xl">
      {/* Geri link */}
      <Link
        href="/destekler"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Tüm destekler
      </Link>

      {/* Başlık bölümü */}
      <div className="flex items-start gap-3 flex-wrap mb-2">
        <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border", KATEGORI_RENK[destek.kategori])}>
          {KATEGORI_ADI[destek.kategori]}
        </span>
        <span className="text-xs border border-slate-200 rounded-full px-2.5 py-1 text-slate-500">
          {TUR_ADI[destek.tur]}
        </span>
        {suresiDolmuMu && (
          <span className="text-xs bg-red-100 text-red-700 border border-red-200 rounded-full px-2.5 py-1 font-semibold">
            Süresi Doldu
          </span>
        )}
        {!destek.aktif && (
          <span className="text-xs bg-slate-100 text-slate-500 border border-slate-200 rounded-full px-2.5 py-1">
            Pasif / Kapalı
          </span>
        )}
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
        <h1 className="text-2xl font-bold text-slate-900 leading-snug flex-1">{destek.ad}</h1>
        <BasvuruTakipButonu destekSlug={destek.slug} destekAdi={destek.ad} />
      </div>
      <p className="text-slate-500 mb-6 leading-relaxed">{destek.aciklama}</p>

      {/* Başvuru tarihi uyarısı */}
      {destek.basvuruBitis && !suresiDolmuMu && (
        <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
          <Calendar size={15} className="shrink-0" />
          <span>Son başvuru tarihi: <strong>{new Date(destek.basvuruBitis).toLocaleDateString("tr-TR")}</strong></span>
        </div>
      )}
      {suresiDolmuMu && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
          <AlertCircle size={15} className="shrink-0" />
          <span>Bu programın başvuru süresi dolmuştur. Yeni çağrı için kurumu takip edin.</span>
        </div>
      )}

      {/* Özet metrik kartları */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {destek.hibeOrani && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-blue-600 text-xs font-semibold mb-1">
              <TrendingUp size={13} />
              Hibe Oranı
            </div>
            <div className="text-3xl font-bold text-blue-700">%{destek.hibeOrani}</div>
            <div className="text-xs text-blue-500 mt-0.5">uygun gider üzerinden</div>
          </div>
        )}
        {destek.butceUstSinir && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold mb-1">
              <TrendingUp size={13} />
              Maksimum Destek
            </div>
            <div className="text-xl font-bold text-emerald-700 leading-tight">{paraCevir(destek.butceUstSinir)}</div>
            <div className="text-xs text-emerald-500 mt-0.5">proje başına üst limit</div>
          </div>
        )}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
            <Building size={13} />
            Kurum
          </div>
          <div className="font-bold text-slate-800 text-sm leading-tight">{destek.kurum}</div>
          {destek.sonGuncelleme && (
            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1.5">
              <Clock size={9} />
              Güncelleme: {new Date(destek.sonGuncelleme).toLocaleDateString("tr-TR")}
            </div>
          )}
        </div>
      </div>

      {/* Ana bilgi kartı */}
      <div className="card divide-y divide-slate-100 mb-6">
        {/* Amaç */}
        <div className="p-5">
          <h2 className="font-semibold text-slate-800 mb-2">Amaç</h2>
          <p className="text-slate-600 text-sm leading-relaxed">{destek.amac}</p>
        </div>

        {/* Önemli notlar */}
        {k.notlar && (
          <div className="p-5">
            <h2 className="font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
              <AlertCircle size={14} className="text-amber-500" />
              Önemli Notlar
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">{k.notlar}</p>
          </div>
        )}

        {/* Uygunluk kriterleri */}
        <div className="p-5">
          <h2 className="font-semibold text-slate-800 mb-3">Uygunluk Kriterleri</h2>
          <div className="space-y-1 text-sm">
            {k.sirketTurleri && (
              <KriterSatiri etiket="Şirket türü" deger={k.sirketTurleri.join(", ")} />
            )}
            {k.minCalisan !== undefined && (
              <KriterSatiri etiket="Min. çalışan" deger={`${k.minCalisan} kişi`} />
            )}
            {k.maxCalisan !== undefined && (
              <KriterSatiri etiket="Maks. çalışan" deger={`${k.maxCalisan} kişi`} />
            )}
            {k.minCiro !== undefined && (
              <KriterSatiri etiket="Min. ciro" deger={paraCevir(k.minCiro)} />
            )}
            {k.maxCiro !== undefined && (
              <KriterSatiri etiket="Maks. ciro" deger={paraCevir(k.maxCiro)} />
            )}
            {k.minKurulusYili !== undefined && (
              <KriterSatiri etiket="En erken kuruluş" deger={`${k.minKurulusYili} yılı ve öncesi`} />
            )}
            {k.maxKurulusYili !== undefined && (
              <KriterSatiri etiket="En geç kuruluş" deger={`${k.maxKurulusYili} yılı ve sonrası`} />
            )}
            {k.sektorler && (
              <KriterSatiri etiket="Sektörler (NACE)" deger={k.sektorler.join(", ")} />
            )}
            {k.sektorHaric && (
              <KriterSatiri etiket="Hariç sektörler" deger={k.sektorHaric.join(", ")} renk="red" />
            )}
            {k.bolgeKisiti && (
              <KriterSatiri etiket="Bölge kısıtı" deger={k.bolgeKisiti.join(", ")} />
            )}
            {k.argeZorunlu && (
              <KriterSatiri etiket="Ar-Ge faaliyeti" deger="Zorunlu" renk="red" />
            )}
            {k.teknokentZorunlu && (
              <KriterSatiri etiket="Teknokent / TGB" deger="Zorunlu" renk="red" />
            )}
            {k.ihracatZorunlu && (
              <KriterSatiri etiket="İhracat" deger="Zorunlu" renk="red" />
            )}
            {k.osbZorunlu && (
              <KriterSatiri etiket="OSB üyeliği" deger="Zorunlu" renk="red" />
            )}
            {k.kadinGirisimciBonus && (
              <KriterSatiri etiket="Kadın girişimci" deger="Öncelik / ek puan" renk="green" />
            )}
            {k.gencGirisimciBonus && (
              <KriterSatiri etiket="Genç girişimci (≤35)" deger="Öncelik / ek puan" renk="green" />
            )}
            {k.tekrarBasvuruEngel && (
              <KriterSatiri etiket="Tekrar başvuru" deger="Mümkün değil" renk="red" />
            )}
          </div>
        </div>

        {/* Etiketler */}
        {destek.etiketler.length > 0 && (
          <div className="p-5">
            <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-1.5">
              <Tag size={14} className="text-slate-400" />
              Etiketler
            </h2>
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

      {/* Gerekli belgeler */}
      <div className="card p-5 mb-6">
        <h2 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
          <FileText size={15} className="text-blue-500" />
          Başvuru İçin Gerekli Belgeler
        </h2>
        <p className="text-xs text-slate-400 mb-3">
          Tahmini belge listesi — başvuru rehberini mutlaka kontrol edin
        </p>
        <ul className="space-y-1.5">
          {belgeler.map((belge) => (
            <li key={belge} className="flex items-start gap-2 text-sm text-slate-600">
              <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-emerald-500" />
              {belge}
            </li>
          ))}
        </ul>
      </div>

      {/* Başvuru aksiyonları */}
      <div className="flex flex-wrap gap-3 mb-10">
        <a
          href={destek.mevzuatUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-md btn-primary gap-2"
          aria-label={`${destek.ad} resmi mevzuatına git (yeni sekmede açılır)`}
        >
          <ExternalLink size={14} aria-hidden="true" />
          Resmi Mevzuat
        </a>
        {destek.rehberUrl && (
          <a
            href={destek.rehberUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-md btn-secondary gap-2"
          >
            <FileText size={14} aria-hidden="true" />
            Başvuru Rehberi
          </a>
        )}
        <Link href={`/proje-asistani?destek=${destek.slug}`} className="btn-md btn-secondary ml-auto gap-1.5">
          AI ile Başvuru Hazırla
          <ChevronRight size={14} aria-hidden="true" />
        </Link>
      </div>

      {/* Benzer destekler */}
      {benzerler.length > 0 && (
        <div>
          <h2 className="font-semibold text-slate-800 mb-3 text-sm flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-violet-600 text-[10px] font-bold">
              ✦
            </span>
            Benzer Destekler
          </h2>
          <div className="space-y-2">
            {benzerler.map((b) => (
              <Link
                key={b.slug}
                href={`/destekler/${b.slug}`}
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
              >
                <span
                  className={cn(
                    "shrink-0 inline-block rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                    KATEGORI_RENK[b.kategori],
                  )}
                >
                  {b.kurum}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate group-hover:text-blue-700 transition-colors">
                    {b.ad}
                  </p>
                  {b.hibeOrani && (
                    <p className="text-xs text-slate-400">%{b.hibeOrani} hibe</p>
                  )}
                </div>
                <ChevronRight size={14} className="shrink-0 text-slate-300 group-hover:text-blue-500 transition-colors" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function KriterSatiri({ etiket, deger, renk }: { etiket: string; deger: string; renk?: "red" | "green" }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 border-b border-slate-50 last:border-0">
      <span className="text-slate-500 shrink-0">{etiket}</span>
      <span
        className={cn(
          "font-medium text-right",
          renk === "red" && "text-red-600",
          renk === "green" && "text-green-600",
          !renk && "text-slate-700",
        )}
      >
        {deger}
      </span>
    </div>
  );
}
