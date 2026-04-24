import { Suspense } from "react";
import { OdemeForm } from "@/components/odeme/OdemeForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium'a Geç — Destek Takip",
};

export default function OdemeSayfasi() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center bg-slate-50 px-4 py-12">
      <Suspense fallback={<div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600" />}>
        <OdemeForm />
      </Suspense>
    </div>
  );
}
