"use client";

import dynamic from "next/dynamic";
import type { DestekProgrami } from "@/types";

const DesteklerSayfasiClient = dynamic(
  () => import("./DesteklerSayfasiClient").then((m) => m.DesteklerSayfasiClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filtre paneli skeleton */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="card p-4 space-y-3">
            <div className="skeleton h-3 w-1/2 rounded" />
            <div className="skeleton h-8 w-full rounded-xl" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-7 w-full rounded-lg" />
            ))}
          </div>
        </div>
        {/* Liste skeleton */}
        <div className="flex-1 space-y-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex gap-1.5">
                    <div className="skeleton h-4 w-16 rounded-full" />
                    <div className="skeleton h-4 w-12 rounded-full" />
                  </div>
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-full rounded" />
                </div>
                <div className="skeleton h-5 w-16 rounded-full shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
);

interface Props {
  destekler: DestekProgrami[];
  baslangicKategoriler?: string[];
  baslangicArama?: string;
  baslangicSadecUygun?: boolean;
}

export function DesteklerWrapper(props: Props) {
  return <DesteklerSayfasiClient {...props} />;
}
