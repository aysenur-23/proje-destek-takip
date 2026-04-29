"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Search,
  FileText,
  Crown,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const { kullanici, cikisYap, yukleniyor } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (menuAcik) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuAcik]);

  async function handleCikis() {
    await cikisYap();
    router.push("/");
    setMenuAcik(false);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm shadow-slate-900/5"
          : "bg-white/80 backdrop-blur-sm border-b border-slate-200/40",
      )}
    >
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5 shrink-0" onClick={() => setMenuAcik(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-sm shadow-blue-600/30 transition-all duration-200 group-hover:shadow-md group-hover:shadow-blue-600/40 group-hover:scale-105">
              <LayoutDashboard size={15} className="text-white" />
            </div>
            <div>
              <span className="block text-sm font-bold leading-none text-slate-900 tracking-tight">
                Destek Takip
              </span>
              <span className="mt-0.5 block text-[10px] leading-none text-slate-400 tracking-wide">
                Hibe & Teşvik Rehberi
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {navOgeleri.map((item) => {
              const aktif = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200",
                    aktif
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  <item.ikon size={15} />
                  <span>{item.etiket}</span>
                  {item.premium && (
                    <Crown size={11} className={cn("ml-0.5", aktif ? "text-violet-500" : "text-violet-400")} />
                  )}
                  {aktif && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden items-center gap-2 md:flex">
            {!yukleniyor && kullanici ? (
              <>
                {kullanici.plan === "premium" ? (
                  <span className="flex items-center gap-1.5 rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 border border-violet-100">
                    <Crown size={11} className="fill-violet-600" />
                    Premium
                  </span>
                ) : (
                  <Link
                    href="/planlar"
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-violet-600 transition-all hover:bg-violet-50 hover:text-violet-700"
                  >
                    <Crown size={12} />
                    Premium&apos;a Geç
                  </Link>
                )}
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100">
                    <User size={11} className="text-blue-600" />
                  </div>
                  <span className="max-w-[100px] truncate text-xs font-medium text-slate-700">
                    {kullanici.ad}
                  </span>
                  <ChevronDown size={12} className="text-slate-400" />
                </div>
                <button onClick={handleCikis} className="btn-sm btn-secondary gap-1.5 text-xs">
                  <LogOut size={13} />
                  Çıkış
                </button>
              </>
            ) : !yukleniyor ? (
              <>
                <Link
                  href="/planlar"
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-violet-600 transition-all hover:bg-violet-50"
                >
                  <Crown size={12} />
                  Premium
                </Link>
                <Link href="/giris" className="btn-sm btn-secondary text-xs">
                  <LogIn size={14} />
                  Giriş
                </Link>
                <Link href="/kayit" className="btn-sm btn-primary text-xs">
                  Ücretsiz Başla
                </Link>
              </>
            ) : (
              <div className="h-8 w-32 rounded-xl bg-slate-100 animate-pulse" />
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
            onClick={() => setMenuAcik(!menuAcik)}
            aria-label={menuAcik ? "Menüyü kapat" : "Menüyü aç"}
          >
            <div className="relative h-5 w-5">
              <span
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-all duration-200",
                  menuAcik ? "opacity-100 rotate-0" : "opacity-0 rotate-90",
                )}
              >
                <X size={20} />
              </span>
              <span
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-all duration-200",
                  menuAcik ? "opacity-0 -rotate-90" : "opacity-100 rotate-0",
                )}
              >
                <Menu size={20} />
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out md:hidden",
          menuAcik ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          {navOgeleri.map((item) => {
            const aktif = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuAcik(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  aktif
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-100",
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg",
                    aktif ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500",
                  )}
                >
                  <item.ikon size={14} />
                </div>
                <span className="flex-1">{item.etiket}</span>
                {item.premium && (
                  <span className="flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-600">
                    <Crown size={8} />
                    Premium
                  </span>
                )}
              </Link>
            );
          })}

          <div className="flex flex-col gap-2 border-t border-slate-100 pt-3 mt-1">
            {kullanici ? (
              <>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
                    <User size={13} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{kullanici.ad}</p>
                    {kullanici.plan === "premium" && (
                      <p className="flex items-center gap-1 text-[10px] text-violet-600 font-semibold">
                        <Crown size={8} className="fill-violet-600" />
                        Premium Üye
                      </p>
                    )}
                  </div>
                </div>
                <button onClick={handleCikis} className="btn-md btn-secondary w-full">
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
    </header>
  );
}
