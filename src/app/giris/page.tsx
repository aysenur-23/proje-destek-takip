import { GirisForm } from "@/components/auth/GirisForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş Yap — Destek Takip",
};

export default function GirisSayfasi() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 bg-slate-50">
      <GirisForm />
    </div>
  );
}
