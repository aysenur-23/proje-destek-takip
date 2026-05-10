"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  etiket: string;
  zorunlu?: boolean;
  aciklama?: string;
  hata?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ etiket, zorunlu, aciklama, hata, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
        {etiket}
        {zorunlu && (
          <abbr title="zorunlu" className="text-red-500 no-underline">
            *
          </abbr>
        )}
        {aciklama && !zorunlu && (
          <span className="text-xs font-normal text-slate-400">({aciklama})</span>
        )}
      </label>
      {children}
      {hata && (
        <p className="text-xs text-red-500 flex items-center gap-1" role="alert">
          {hata}
        </p>
      )}
    </div>
  );
}
