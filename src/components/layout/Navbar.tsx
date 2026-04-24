"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Building2, Search, FileText, Crown, Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const navOgeleri = [
  { href: "/destekler", etiket: "Destekler", ikon: Search },
  { href: "/firma", etiket: "Firma Profili", ikon: Building2 },
  { href: "/proje-asistani", etiket: "Proje Asistanı", ikon: FileText, premium: true },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuAcik, setMenuAcik] = useState(false);
  const { kullanici, cikisYap, yukleniyor } = useAuth();

  async function handleCikis() {
    await cikisYap();
    router.push("/");
    setMenuAcik(false);
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200/80">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-sm shadow-blue-600/30 transition-shadow group-hover:shadow-blue-600/50">
              <LayoutDashboard size={15} className="text-white" />
            </div>
            <div>
              <span className="block text-sm font-bold leading-none text-slate-900">Destek Takip</span>
              <span className="mt-0.5 block text-[10px] leading-none text-slate-400">Hibe & Teşvik Rehberi</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navOgeleri.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200",
                  pathname === item.href
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <item.ikon size={15} />
                <span>{item.etiket}</span>
                {item.premium && <Crown size={11} className="ml-0.5 text-violet-500" />}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden items-center gap-2 md:flex">
            {!yukleniyor && kullanici ? (
              <>
                {kullanici.plan === "premium" ? (
                  <span className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-violet-600">
                    <Crown size={12} className="fill-violet-600" />
                    Premium
                  </span>
                ) : (
                  <Link href="/planlar" className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-violet-600 transition-colors hover:bg-violet-50">
                    <Crown size={13} />
                    Premium&apos;a Geç
                  </Link>
                )}
                <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5">
                  <User size={14} className="text-slate-400" />
                  <span className="max-w-[120px] truncate text-xs font-medium text-slate-700">{kullanici.ad}</span>
                </div>
                <button onClick={handleCikis} className="btn-sm btn-secondary gap-1.5">
                  <LogOut size={13} />
                  Çıkış
                </button>
              </>
            ) : !yukleniyor ? (
              <>
                <Link href="/planlar" className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-violet-600 transition-colors hover:bg-violet-50">
                  <Crown size={13} />
                  Premium
                </Link>
                <Link href="/giris" className="btn-sm btn-secondary">
                  <LogIn size={14} />
                  Giriş Yap
                </Link>
                <Link href="/kayit" className="btn-sm btn-primary">
                  Ücretsiz Başla
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <button
            className="rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
            onClick={() => setMenuAcik(!menuAcik)}
          >
            {menuAcik ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuAcik && (
        <div className="animate-fade-in border-t border-slate-200/80 bg-white md:hidden">
          <div className="container space-y-1 py-3">
            {navOgeleri.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuAcik(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === item.href ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-100",
                )}
              >
                <item.ikon size={16} />
                {item.etiket}
                {item.premium && <Crown size={12} className="ml-auto text-violet-500" />}
              </Link>
            ))}
            <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
              {kullanici ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600">
                    <User size={15} className="text-slate-400" />
                    <span className="truncate font-medium">{kullanici.ad}</span>
                    {kullanici.plan === "premium" && (
                      <Crown size={12} className="ml-auto text-violet-500" />
                    )}
                  </div>
                  <button onClick={handleCikis} className="btn-md btn-secondary w-full gap-2">
                    <LogOut size={15} />
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link href="/giris" onClick={() => setMenuAcik(false)} className="btn-md btn-secondary w-full">
                    <LogIn size={15} />
                    Giriş Yap
                  </Link>
                  <Link href="/kayit" onClick={() => setMenuAcik(false)} className="btn-md btn-primary w-full">
                    Ücretsiz Başla
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
