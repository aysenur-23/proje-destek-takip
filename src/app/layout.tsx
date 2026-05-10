import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { WelcomeTour } from "@/components/layout/WelcomeTour";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";

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

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.destektakip.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Destek Takip — Firmana Özel Hibe ve Teşvik Rehberi",
    template: "%s | Destek Takip",
  },
  description:
    "TÜBİTAK, KOSGEB, TKDK, SGK, AB Fonları ve daha fazlasını firmana göre filtrele. Akıllı eşleştirme ile uygun destekleri anında bul.",
  keywords: ["hibe", "teşvik", "TÜBİTAK", "KOSGEB", "TKDK", "destek programı", "KOBİ", "hibe programı", "AB fonu"],
  authors: [{ name: "Destek Takip" }],
  creator: "Destek Takip",
  openGraph: {
    title: "Destek Takip — Firmana Özel Hibe ve Teşvik Rehberi",
    description: "40+ destek programını saniyeler içinde filtrele, AI ile başvurunu güçlendir.",
    type: "website",
    locale: "tr_TR",
    url: APP_URL,
    siteName: "Destek Takip",
    // opengraph-image.tsx Next.js tarafından otomatik algılanır
  },
  twitter: {
    card: "summary_large_image",
    title: "Destek Takip — Firmana Özel Hibe ve Teşvik Rehberi",
    description: "40+ destek programını saniyeler içinde filtrele, AI ile başvurunu güçlendir.",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/favicon.svg",
    apple: { url: "/apple-icon", sizes: "180x180", type: "image/png" },
  },
  alternates: {
    canonical: APP_URL,
    types: {
      "application/rss+xml": `${APP_URL}/blog/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} ${jakarta.variable} font-sans antialiased`}>
        <a
          href="#ana-icerik"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none"
        >
          Ana içeriğe geç
        </a>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main id="ana-icerik" className="flex-1">{children}</main>
            <Footer />
          </div>
          <WelcomeTour />
          <Analytics />
          <SpeedInsights />
          <Toaster
            position="bottom-right"
            toastOptions={{
              classNames: {
                toast: "font-sans text-sm",
                success: "!bg-emerald-50 !border-emerald-200 !text-emerald-900",
                error: "!bg-red-50 !border-red-200 !text-red-900",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
