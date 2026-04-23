import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Destek Takip — Firmana Özel Hibe ve Teşvik Rehberi",
  description:
    "TÜBİTAK, KOSGEB, TKDK, SGK, AB Fonları ve daha fazlasını firmana göre filtrele. Akıllı eşleştirme ile uygun destekleri anında bul.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
