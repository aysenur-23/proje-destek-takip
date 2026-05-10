"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  BookOpen,
  Settings2,
} from "lucide-react";

const NAV = [
  { href: "/admin", etiket: "Genel Bakış", ikon: LayoutDashboard, exact: true },
  { href: "/admin/kullanicilar", etiket: "Kullanıcılar", ikon: Users },
  { href: "/admin/firmalar", etiket: "Firmalar", ikon: Building2 },
  { href: "/admin/destekler", etiket: "Programlar", ikon: BookOpen },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin menüsü"
      className="flex flex-wrap gap-1 border-b border-slate-200 bg-white px-4 pb-0"
    >
      {NAV.map(({ href, etiket, ikon: Ikon, exact }) => {
        const aktif = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-3 py-3 text-sm font-medium transition-colors",
              aktif
                ? "border-amber-500 text-amber-700"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700",
            )}
            aria-current={aktif ? "page" : undefined}
          >
            <Ikon size={14} />
            {etiket}
          </Link>
        );
      })}
      <div className="ml-auto flex items-center pb-2">
        <Settings2 size={13} className="text-slate-300" />
      </div>
    </nav>
  );
}
