import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1A56DB",
          borderRadius: 40,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="130"
          height="130"
        >
          <path d="M2 8h18a11 11 0 0 1 0 22H2V8z" fill="white" opacity="0.9" />
          <path d="M2 19h14" stroke="#1A56DB" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="26" cy="27" r="5.5" fill="#FCD34D" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
