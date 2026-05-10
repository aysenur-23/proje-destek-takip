import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Destek Takip — Firmana Özel Hibe ve Teşvik Rehberi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
        }}
      >
        {/* Gradient arka plan */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 20% 50%, #1e3a8a 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #1d4ed8 0%, transparent 50%)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", padding: "64px 80px", gap: 0, flex: 1, position: "relative" }}>
          {/* Üst rozet */}
          <div style={{ display: "flex", marginBottom: 32 }}>
            <div style={{ background: "#1d4ed8", borderRadius: 999, padding: "8px 20px", display: "flex" }}>
              <span style={{ color: "#bfdbfe", fontSize: 18, fontWeight: 600 }}>
                TÜBİTAK · KOSGEB · TKDK · AB Fonları · SGK
              </span>
            </div>
          </div>

          {/* Ana başlık */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
            <div style={{ fontSize: 72, fontWeight: 800, color: "#ffffff", lineHeight: 1.1, letterSpacing: "-2px" }}>
              Firmana Özel
            </div>
            <div style={{ fontSize: 72, fontWeight: 800, color: "#60a5fa", lineHeight: 1.1, letterSpacing: "-2px" }}>
              Hibe & Teşvik
            </div>
            <div style={{ fontSize: 72, fontWeight: 800, color: "#ffffff", lineHeight: 1.1, letterSpacing: "-2px" }}>
              Rehberi
            </div>
          </div>

          {/* Alt bilgi */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ color: "#94a3b8", fontSize: 22 }}>
                40+ destek programı · Akıllı eşleştirme · AI destekli başvuru
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, background: "#1d4ed8", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#ffffff", fontSize: 28, fontWeight: 800 }}>D</span>
              </div>
              <span style={{ color: "#e2e8f0", fontSize: 28, fontWeight: 700 }}>Destek Takip</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
