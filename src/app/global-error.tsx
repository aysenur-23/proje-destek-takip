"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="tr">
      <body>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, sans-serif",
            backgroundColor: "#f8fafc",
            padding: "1rem",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "400px" }}>
            <div
              style={{
                fontSize: "4rem",
                fontWeight: 800,
                color: "#e2e8f0",
                marginBottom: "1rem",
                lineHeight: 1,
              }}
            >
              500
            </div>
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: "0.5rem",
              }}
            >
              Beklenmeyen Bir Hata Oluştu
            </h1>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#64748b",
                marginBottom: "1.5rem",
                lineHeight: 1.6,
              }}
            >
              Ekibimiz bilgilendirildi. Lütfen sayfayı yenilemeyi deneyin.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button
                onClick={reset}
                style={{
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "0.75rem",
                  padding: "0.6rem 1.25rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Tekrar Dene
              </button>
              <Link
                href="/"
                style={{
                  backgroundColor: "white",
                  color: "#374151",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.75rem",
                  padding: "0.6rem 1.25rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Ana Sayfa
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
