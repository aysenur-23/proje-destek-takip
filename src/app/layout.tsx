import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

/* ── Body font: Inter — mükemmel okunabilirlik, web standardı ── */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

/* ── Heading font: Plus Jakarta Sans — modern, premium görünüm ── */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Destek Takip — Firmana Özel Hibe ve Teşvik Rehberi",
  description:
    "TÜBİTAK, KOSGEB, TKDK, SGK, AB Fonları ve daha fazlasını firmana göre filtrele. Akıllı eşleştirme ile uygun destekleri anında bul.",
  keywords: ["hibe", "teşvik", "TÜBİTAK", "KOSGEB", "TKDK", "destek programı", "KOBİ"],
  openGraph: {
    title: "Destek Takip — Firmana Özel Hibe ve Teşvik Rehberi",
    description: "40+ destek programını saniyeler içinde filtrele, AI ile başvurunu güçlendir.",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} ${jakarta.variable} font-sans antialiased`}>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
