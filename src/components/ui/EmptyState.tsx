import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  ikon: ReactNode;
  baslik: string;
  aciklama?: string;
  aksiyon?: ReactNode;
  className?: string;
  variant?: "default" | "amber" | "blue";
}

const variantMap = {
  default: "border-slate-200 bg-white",
  amber:   "border-amber-200 bg-amber-50/50",
  blue:    "border-blue-200 bg-blue-50/50",
};

const ikonMap = {
  default: "bg-slate-100",
  amber:   "bg-amber-100",
  blue:    "bg-blue-100",
};

export function EmptyState({
  ikon,
  baslik,
  aciklama,
  aksiyon,
  className,
  variant = "default",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center px-6",
        variantMap[variant],
        className,
      )}
    >
      <div className={cn("mb-4 flex h-16 w-16 items-center justify-center rounded-2xl", ikonMap[variant])}>
        {ikon}
      </div>
      <p className="font-semibold text-slate-700 mb-1">{baslik}</p>
      {aciklama && (
        <p className="text-sm text-slate-500 mb-5 max-w-xs leading-relaxed">{aciklama}</p>
      )}
      {aksiyon && <div className="flex gap-2 flex-wrap justify-center">{aksiyon}</div>}
    </div>
  );
}
