import { ImageResponse } from "next/og";
import { blogYazisiBul } from "@/data/blog";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const KATEGORI_RENK: Record<string, { bg: string; text: string; accent: string }> = {
  "TÜBİTAK":          { bg: "#1e3a8a", text: "#dbeafe", accent: "#3b82f6" },
  "KOSGEB":           { bg: "#064e3b", text: "#d1fae5", accent: "#10b981" },
  "Sanayi Bakanlığı": { bg: "#2e1065", text: "#ede9fe", accent: "#7c3aed" },
  "AB Fonları":       { bg: "#78350f", text: "#fef3c7", accent: "#f59e0b" },
};

const VARSAYILAN = { bg: "#0f172a", text: "#e2e8f0", accent: "#3b82f6" };

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const yazi = blogYazisiBul(slug);

  const baslik = yazi?.baslik ?? "Destek Takip Blog";
  const kategori = yazi?.kategori ?? "";
  const ozet = yazi?.ozet ?? "TÜBİTAK, KOSGEB ve AB fonları rehberleri";
  const renk = KATEGORI_RENK[kategori] ?? VARSAYILAN;
  const okumaSuresi = yazi?.okumaSuresi;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: renk.bg,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Arka plan degrade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 80% 20%, ${renk.accent}30 0%, transparent 60%)`,
          }}
        />

        {/* Grid doku */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "64px 80px",
            gap: 0,
            flex: 1,
            position: "relative",
          }}
        >
          {/* Üst: Kategori rozeti + site adı */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 40,
            }}
          >
            {kategori && (
              <div
                style={{
                  background: `${renk.accent}30`,
                  border: `1px solid ${renk.accent}60`,
                  borderRadius: 999,
                  padding: "8px 20px",
                  display: "flex",
                }}
              >
                <span style={{ color: renk.text, fontSize: 18, fontWeight: 600 }}>
                  {kategori}
                </span>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: renk.accent,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "#ffffff", fontSize: 22, fontWeight: 800 }}>D</span>
              </div>
              <span style={{ color: renk.text, fontSize: 22, fontWeight: 700, opacity: 0.8 }}>
                Destek Takip
              </span>
            </div>
          </div>

          {/* Makale başlığı */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                fontSize: baslik.length > 60 ? 44 : 52,
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.15,
                letterSpacing: "-1px",
              }}
            >
              {baslik}
            </div>

            {/* Özet */}
            <div
              style={{
                fontSize: 22,
                color: renk.text,
                opacity: 0.75,
                lineHeight: 1.5,
                maxWidth: 800,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                overflow: "hidden",
              }}
            >
              {ozet}
            </div>
          </div>

          {/* Alt bilgi */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginTop: 32,
              paddingTop: 24,
              borderTop: `1px solid ${renk.accent}40`,
            }}
          >
            <span style={{ color: renk.text, fontSize: 18, opacity: 0.6 }}>
              destektakip.com/blog
            </span>
            {okumaSuresi && (
              <>
                <span style={{ color: renk.accent, fontSize: 18, opacity: 0.4 }}>·</span>
                <span style={{ color: renk.text, fontSize: 18, opacity: 0.6 }}>
                  {okumaSuresi} dakika okuma
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
