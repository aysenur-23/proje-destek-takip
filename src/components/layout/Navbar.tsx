"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Building2, Search, FileText } from "lucide-react";

const navOgeleri = [
  { href: "/", etiket: "Ana Sayfa", ikon: LayoutDashboard },
  { href: "/firma", etiket: "Firma Profilim", ikon: Building2 },
  { href: "/destekler", etiket: "Destekler", ikon: Search },
  { href: "/proje-asistani", etiket: "Proje Asistanı", ikon: FileText },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">DT</span>
            </div>
            <span className="font-semibold text-slate-900 hidden sm:block">
              Destek Takip
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {navOgeleri.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                )}
              >
                <item.ikon size={15} />
                <span className="hidden sm:block">{item.etiket}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
