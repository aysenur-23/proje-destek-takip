import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Tag, BookOpen } from "lucide-react";
import { blogYazilari, blogYazisiBul } from "@/data/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogYazilari.map((y) => ({ slug: y.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const yazi = blogYazisiBul(slug);
  if (!yazi) return { title: "Yazı Bulunamadı" };

  return {
    title: yazi.baslik,
    description: yazi.ozet,
    keywords: yazi.etiketler,
    openGraph: {
      title: yazi.baslik,
      description: yazi.ozet,
      type: "article",
      publishedTime: yazi.yayinTarihi,
      tags: yazi.etiketler,
    },
    alternates: {
      canonical: `/blog/${yazi.slug}`,
    },
  };
}

const KATEGORI_RENK: Record<string, string> = {
  "TÜBİTAK": "bg-blue-50 text-blue-700 border-blue-100",
  "KOSGEB": "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Sanayi Bakanlığı": "bg-violet-50 text-violet-700 border-violet-100",
  "AB Fonları": "bg-amber-50 text-amber-700 border-amber-100",
};

export default async function BlogYazisiSayfasi({ params }: Props) {
  const { slug } = await params;
  const yazi = blogYazisiBul(slug);
  if (!yazi) notFound();

  // İlgili yazılar (aynı kategori, kendisi hariç)
  const ilgiliYazilar = blogYazilari
    .filter((y) => y.slug !== yazi.slug && y.kategori === yazi.kategori)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-white">
      {/* Üst bant */}
      <div
        className={`h-1 w-full ${
          yazi.kategori === "TÜBİTAK"
            ? "bg-blue-500"
            : yazi.kategori === "KOSGEB"
            ? "bg-emerald-500"
            : yazi.kategori === "AB Fonları"
            ? "bg-amber-500"
            : "bg-violet-500"
        }`}
      />

      <div className="container max-w-3xl py-8">
        {/* Geri */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-8"
        >
          <ArrowLeft size={15} />
          Blog&apos;a Dön
        </Link>

        {/* Makale başlığı */}
        <header className="mb-8 pb-8 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                KATEGORI_RENK[yazi.kategori] ?? "bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              {yazi.kategori}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock size={12} />
              {yazi.okumaSuresi} dakika okuma
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar size={12} />
              <time dateTime={yazi.yayinTarihi}>
                {new Date(yazi.yayinTarihi).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug mb-4">
            {yazi.baslik}
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">{yazi.ozet}</p>

          {/* Etiketler */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {yazi.etiketler.map((e) => (
              <span
                key={e}
                className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-0.5"
              >
                <Tag size={9} />
                {e}
              </span>
            ))}
          </div>
        </header>

        {/* Makale içeriği */}
        <article
          className="prose prose-slate max-w-none
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900
            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
            prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
            prose-p:text-slate-600 prose-p:leading-relaxed
            prose-li:text-slate-600
            prose-strong:text-slate-800
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-ul:my-3 prose-ol:my-3
            prose-table:text-sm
            prose-th:text-left prose-th:font-semibold prose-th:text-slate-700 prose-th:bg-slate-50
            prose-td:text-slate-600 prose-td:border-slate-200
            [&_table]:w-full [&_table]:border-collapse [&_table]:rounded-xl [&_table]:overflow-hidden
            [&_th]:px-3 [&_th]:py-2 [&_th]:border [&_th]:border-slate-200
            [&_td]:px-3 [&_td]:py-2 [&_td]:border [&_td]:border-slate-200
            [&_tr:nth-child(even)_td]:bg-slate-50/60
          "
          dangerouslySetInnerHTML={{ __html: yazi.icerik }}
        />

        {/* CTA kutusu */}
        <div className="mt-12 rounded-2xl bg-blue-50 border border-blue-100 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
              <BookOpen size={18} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 mb-1">
                Firmanıza uygun programları keşfedin
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                Firma profilinizi doldurarak hangi destek programlarına
                başvurabileceğinizi öğrenin. Ücretsiz, saniyeler içinde sonuç.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/firma"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Profil Oluştur
                </Link>
                <Link
                  href="/destekler"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  Tüm Programlar
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* İlgili yazılar */}
        {ilgiliYazilar.length > 0 && (
          <div className="mt-12">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              İlgili Yazılar
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {ilgiliYazilar.map((ilgili) => (
                <Link
                  key={ilgili.slug}
                  href={`/blog/${ilgili.slug}`}
                  className="group rounded-xl border border-slate-200 p-4 hover:border-blue-200 hover:bg-blue-50/40 transition-all"
                >
                  <span
                    className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold mb-2 ${
                      KATEGORI_RENK[ilgili.kategori] ?? "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {ilgili.kategori}
                  </span>
                  <p className="text-sm font-semibold text-slate-800 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                    {ilgili.baslik}
                  </p>
                  <p className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
                    <Clock size={10} />
                    {ilgili.okumaSuresi} dk okuma
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
