import { ImageResponse } from "next/og";
import { tumDestekler } from "@/data/destekler";
import { KATEGORI_ADI } from "@/lib/utils";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destek = tumDestekler.find((d) => d.slug === slug);

  const baslik = destek?.ad ?? "Destek Programı";
  const kurum = destek?.kurum ?? "";
  const kategori = destek ? KATEGORI_ADI[destek.kategori] : "";
  const hibeOrani = destek?.hibeOrani ? `%${destek.hibeOrani} hibe` : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0f172a",
          fontFamily: "sans-serif",
          padding: "64px 80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 10% 80%, #1e3a8a 0%, transparent 50%)",
          }}
        />

        {/* Kategori rozeti */}
        <div style={{ display: "flex", marginBottom: 40 }}>
          <div style={{ background: "#1e3a8a", borderRadius: 999, padding: "8px 20px", display: "flex", border: "1px solid #3b82f6" }}>
            <span style={{ color: "#93c5fd", fontSize: 20, fontWeight: 600 }}>{kategori} · {kurum}</span>
          </div>
        </div>

        {/* Program adı */}
        <div style={{ color: "#ffffff", fontSize: 58, fontWeight: 800, lineHeight: 1.15, letterSpacing: "-1px", flex: 1 }}>
          {baslik}
        </div>

        {/* Alt bilgi */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {hibeOrani ? (
            <div style={{ background: "#166534", borderRadius: 12, padding: "12px 24px", display: "flex" }}>
              <span style={{ color: "#86efac", fontSize: 24, fontWeight: 700 }}>{hibeOrani}</span>
            </div>
          ) : <div />}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, background: "#1d4ed8", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>D</span>
            </div>
            <span style={{ color: "#94a3b8", fontSize: 22, fontWeight: 600 }}>Destek Takip</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
