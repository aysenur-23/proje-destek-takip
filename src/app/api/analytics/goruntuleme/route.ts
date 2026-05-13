import { NextRequest, NextResponse } from "next/server";

/**
 * Program görüntülenme sayacı
 * POST /api/analytics/goruntuleme
 * Body: { slug: string }
 *
 * Firestore istatistikler/{slug} belgesinin goruntulenmeSayisi alanını artırır.
 * Kimlik doğrulaması gerekmez — herkese açık programlar için.
 * Rate limit: IP başına dakikada 5 istek (spam önlemi).
 */

import { rateLimitKontrol } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // IP başına dakikada 5 istek
  const rl = rateLimitKontrol(`analytics:${ip}`, 5, 60_000);
  if (!rl.basarili) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let slug: string;
  try {
    const body = (await req.json()) as { slug?: string };
    slug = body.slug?.trim() ?? "";
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON" }, { status: 400 });
  }

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Geçersiz slug" }, { status: 400 });
  }

  try {
    const { getAdminFirestore } = await import("@/lib/firebase-admin");
    const db = await getAdminFirestore();

    if (db) {
      const { FieldValue } = await import("firebase-admin/firestore");
      const ref = db.collection("istatistikler").doc(slug);

      await ref.set(
        {
          slug,
          goruntulenmeSayisi: FieldValue.increment(1),
          sonGoruntuleme: new Date().toISOString(),
        },
        { merge: true },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    // İstatistik hatası kritik değil — kullanıcıya sessizce geç
    console.warn("[analytics] Görüntülenme sayacı yazılamadı:", err);
    return NextResponse.json({ ok: true }); // Başarısız görünme
  }
}
