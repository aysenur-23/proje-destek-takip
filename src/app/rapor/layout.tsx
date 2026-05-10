import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uygunluk Raporu — Destek Takip",
  description: "Firmanız için uygun destek programlarının kişiselleştirilmiş raporu.",
  robots: { index: false, follow: false }, // Kişisel rapor — arama motorlarına kapatılır
};

export default function RaporLayout({ children }: { children: React.ReactNode }) {
  return children;
}
