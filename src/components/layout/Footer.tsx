import Link from "next/link";
import { LayoutDashboard, ExternalLink, ArrowUpRight } from "lucide-react";

const linkler = {
  "Ürün": [
    { href: "/destekler", label: "Destek Programları" },
    { href: "/firma", label: "Firma Profili" },
    { href: "/proje-asistani", label: "Proje Asistanı" },
    { href: "/planlar", label: "Fiyatlandırma" },
    { href: "/blog", label: "Blog & Rehberler" },
    { href: "/rapor", label: "Uygunluk Raporu" },
  ],
  "Destek Kaynakları": [
    { href: "https://www.tubitak.gov.tr", label: "TÜBİTAK", external: true },
    { href: "https://www.kosgeb.gov.tr", label: "KOSGEB", external: true },
    { href: "https://www.tkdk.gov.tr", label: "TKDK", external: true },
    { href: "https://www.sanayi.gov.tr", label: "Sanayi Bakanlığı", external: true },
    { href: "https://www.ticaret.gov.tr", label: "Ticaret Bakanlığı", external: true },
  ],
  "Hesap": [
    { href: "/giris", label: "Giriş Yap" },
    { href: "/kayit", label: "Ücretsiz Kayıt" },
    { href: "/planlar", label: "Premium" },
    { href: "/ayarlar", label: "Hesap Ayarları" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-slate-900 mt-auto">
      {/* Üst gradient çizgi */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />

      <div className="container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="group inline-flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-sm shadow-blue-600/30 transition-all group-hover:shadow-blue-600/50">
                <LayoutDashboard size={14} className="text-white" />
              </div>
              <span className="font-bold text-white text-sm tracking-tight">Destek Takip</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 mb-5 max-w-xs">
              Türkiye'deki tüm hibe, teşvik ve destek programlarını firmanıza özel filtreleyin. Yapay zeka destekli analiz ile başvurularınızı güçlendirin.
            </p>
            <div className="flex flex-wrap gap-2">
              {["TÜBİTAK", "KOSGEB", "TKDK"].map((k) => (
                <span
                  key={k}
                  className="rounded-full border border-slate-700 px-2.5 py-0.5 text-[10px] font-medium text-slate-500"
                >
                  {k}
                </span>
              ))}
              <span className="rounded-full border border-slate-700 px-2.5 py-0.5 text-[10px] font-medium text-slate-500">
                +7 daha
              </span>
            </div>
          </div>

          {/* Link grupları */}
          {Object.entries(linkler).map(([baslik, items]) => (
            <div key={baslik}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                {baslik}
              </h3>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      target={"external" in item ? "_blank" : undefined}
                      rel={"external" in item ? "noopener noreferrer" : undefined}
                      className="group flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      <span>{item.label}</span>
                      {"external" in item && (
                        <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-60 transition-opacity -translate-y-0.5" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Alt bilgi çizgisi */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Destek Takip. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-slate-700 sm:text-right max-w-md leading-relaxed">
            Bilgilendirme amaçlıdır — resmi başvurular için kurumun güncel mevzuatını kontrol ediniz.
          </p>
        </div>
      </div>
    </footer>
  );
}
