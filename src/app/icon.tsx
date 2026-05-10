import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1A56DB",
          borderRadius: 8,
        }}
      >
        {/* "D" harfi — mavi zemin üstünde beyaz */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="32"
          height="32"
        >
          <rect width="32" height="32" rx="8" fill="#1A56DB" />
          <path d="M8 10h10a6 6 0 0 1 0 12H8V10z" fill="white" opacity="0.9" />
          <path d="M8 16h8" stroke="#1A56DB" strokeWidth="2" strokeLinecap="round" />
          <circle cx="24" cy="22" r="3" fill="#FCD34D" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
