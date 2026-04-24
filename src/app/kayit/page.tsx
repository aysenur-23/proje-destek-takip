import { KayitForm } from "@/components/auth/KayitForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kayıt Ol — Destek Takip",
};

export default function KayitSayfasi() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 bg-slate-50">
      <KayitForm />
    </div>
  );
}
