import Link from "next/link";
import { LayoutDashboard, ExternalLink } from "lucide-react";

const linkler = {
  "Ürün": [
    { href: "/destekler", label: "Destek Programları" },
    { href: "/firma", label: "Firma Profili" },
    { href: "/proje-asistani", label: "Proje Asistanı" },
    { href: "/planlar", label: "Fiyatlandırma" },
  ],
  "Destek Kaynakları": [
    { href: "https://www.tubitak.gov.tr", label: "TÜBİTAK", external: true },
    { href: "https://www.kosgeb.gov.tr", label: "KOSGEB", external: true },
    { href: "https://www.tkdk.gov.tr", label: "TKDK", external: true },
    { href: "https://www.sanayi.gov.tr", label: "Sanayi Bakanlığı", external: true },
  ],
  "Hesap": [
    { href: "/giris", label: "Giriş Yap" },
    { href: "/kayit", label: "Kayıt Ol" },
    { href: "/planlar", label: "Premium" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <LayoutDashboard size={15} className="text-white" />
              </div>
              <span className="font-bold text-white text-sm">Destek Takip</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500">
              Türkiye'deki tüm hibe, teşvik ve destek programlarını firmanıza özel filtreleyin.
            </p>
          </div>

          {/* Links */}
          {Object.entries(linkler).map(([baslik, items]) => (
            <div key={baslik}>
              <h3 className="font-semibold text-slate-300 text-sm mb-3">{baslik}</h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      target={"external" in item ? "_blank" : undefined}
                      rel={"external" in item ? "noopener noreferrer" : undefined}
                      className="text-sm text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
                    >
                      {item.label}
                      {"external" in item && <ExternalLink size={10} className="opacity-50" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Destek Takip. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-slate-700">
            Bilgilendirme amaçlıdır — resmi başvurular için kurumun güncel mevzuatını kontrol ediniz.
          </p>
        </div>
      </div>
    </footer>
  );
}
