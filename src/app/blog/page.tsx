import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { blogYazilari } from "@/data/blog";
import { BlogListesiClient } from "@/components/blog/BlogListesiClient";

export const metadata: Metadata = {
  title: "Blog — Hibe & Teşvik Rehberleri",
  description:
    "TÜBİTAK, KOSGEB, AB fonları ve Ar-Ge teşvikleri hakkında güncel rehberler, başvuru ipuçları ve uzman analizleri.",
  openGraph: {
    title: "Blog — Destek Takip",
    description: "Hibe ve teşvik programlarına dair güncel rehberler ve uzman analizleri.",
    type: "website",
  },
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": "/blog/feed.xml",
    },
  },
};

export default function BlogSayfasi() {
  const siraliYazilar = [...blogYazilari].sort((a, b) =>
    b.yayinTarihi.localeCompare(a.yayinTarihi)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-white border-b border-slate-200">
        <div className="container py-12 md:py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={18} className="text-blue-600" />
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                Rehberler & Analizler
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Hibe ve Teşvik Rehberleri
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              TÜBİTAK, KOSGEB, AB fonları ve Ar-Ge teşvikleri hakkında uzman
              içerikler. Başvuru süreçleri, dikkat edilmesi gerekenler ve sık
              yapılan hatalar.
            </p>
          </div>
        </div>
      </section>

      {/* İnteraktif liste (istemci bileşen) */}
      <div className="container py-8">
        <BlogListesiClient yazilar={siraliYazilar} />
      </div>
    </div>
  );
}
