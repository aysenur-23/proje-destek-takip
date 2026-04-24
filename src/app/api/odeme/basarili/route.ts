import { NextRequest, NextResponse } from "next/server";
import { verifyKTCallback } from "@/lib/kuveytturk";

// Kuveyt Türk 3D Secure başarı callback'i (POST)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const params: Record<string, string> = {};
    formData.forEach((v, k) => { params[k] = v.toString(); });

    if (!verifyKTCallback(params)) {
      return NextResponse.redirect(
        new URL("/odeme?durum=basarisiz&neden=dogrulama", req.url),
      );
    }

    // UID'yi sipariş ID'sinden çıkar (format: uid8char-timestamp)
    const uid = params.MerchantOrderId?.split("-")[0];

    if (uid) {
      // Firebase Admin SDK olmadan doğrudan Firestore REST API ile güncelleme
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      const bitisTarihi = new Date();
      bitisTarihi.setMonth(bitisTarihi.getMonth() + 1);

      await fetch(
        `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/kullanicilar/${uid}?updateMask.fieldPaths=plan&updateMask.fieldPaths=premiumBitisTarihi`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: {
              plan: { stringValue: "premium" },
              premiumBitisTarihi: { stringValue: bitisTarihi.toISOString() },
            },
          }),
        },
      );
    }

    return NextResponse.redirect(new URL("/odeme?durum=basarili", req.url));
  } catch (err) {
    console.error("Ödeme callback hatası:", err);
    return NextResponse.redirect(new URL("/odeme?durum=hata", req.url));
  }
}
