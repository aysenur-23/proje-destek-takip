"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Shield } from "lucide-react";
import { AdminNav } from "./_components/AdminNav";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { firebaseUser, yukleniyor } = useAuth();
  const router = useRouter();

  const adminMi =
    !!firebaseUser &&
    (ADMIN_EMAILS.length === 0 || ADMIN_EMAILS.includes(firebaseUser.email?.toLowerCase() ?? ""));

  useEffect(() => {
    if (!yukleniyor && !firebaseUser) {
      router.replace("/giris?donus=/admin");
    }
  }, [yukleniyor, firebaseUser, router]);

  if (yukleniyor) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (!firebaseUser) return null;

  if (!adminMi) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <Shield size={28} />
        </div>
        <div>
          <p className="text-lg font-bold text-slate-800">Erişim Reddedildi</p>
          <p className="text-sm text-slate-500 mt-1">Bu panel yalnızca yöneticilere açıktır.</p>
          <p className="text-xs text-slate-400 mt-2">{firebaseUser.email}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin üst bar */}
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-center text-xs font-semibold text-amber-700">
        <Shield size={10} className="inline mr-1" />
        Yönetici Paneli · {firebaseUser.email}
      </div>
      {/* Tab navigasyon */}
      <AdminNav />
      {/* İçerik */}
      <div>{children}</div>
    </div>
  );
}
