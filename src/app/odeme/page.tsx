import { OdemeForm } from "@/components/odeme/OdemeForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium'a Geç — Destek Takip",
};

export default function OdemeSayfasi() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center bg-slate-50 px-4 py-12">
      <OdemeForm />
    </div>
  );
}
