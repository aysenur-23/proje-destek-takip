"use client";

import { useEffect } from "react";

/**
 * Bir destek programı sayfası görüntülendiğinde analytics API'sine
 * tek seferlik ping atar. Sessizce başarısız olur.
 */
export function GoruntulemeIzleyici({ slug }: { slug: string }) {
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/analytics/goruntuleme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
      signal: controller.signal,
    }).catch(() => {
      // Analytics hatası sessizce görmezden gel
    });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
