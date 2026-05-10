/**
 * POST /api/bildirim/hatirlat
 *
 * Cron job veya manuel tetikleme ile son başvuru tarihi yaklaşan
 * destekleri kullanıcılara email gönderir.
 *
 * Güvenlik: CRON_SECRET header zorunlu
 * Servis: Resend (resend.com)
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { tumDestekler } from "@/data/destekler";

const resend = new Resend(process.env.RESEND_API_KEY);

// Kaç gün kaldığında hatırlatma gönderilecek
const HATIRLATMA_GUNLERI = [7, 3, 1];

interface HatirlatmaEmail {
  kullaniciEmail: string;
  kullaniciAd: string;
  destekler: Array<{ ad: string; kalan: number; url: string }>;
}

async function emailGonder(data: HatirlatmaEmail) {
  const liste = data.destekler
    .map(
      (d) =>
        `<li style="margin-bottom:8px">
          <strong>${d.ad}</strong> — Son başvuruya <strong>${d.kalan} gün</strong> kaldı
          <br/><a href="${d.url}" style="color:#1d4ed8">Detayları gör →</a>
        </li>`,
    )
    .join("");

  await resend.emails.send({
    from: "Destek Takip <bildirim@destektakip.com>",
    to: data.kullaniciEmail,
    subject: `🔔 ${data.destekler.length} destek programının son başvuru tarihi yaklaşıyor`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:32px 24px;color:#1e293b">
        <div style="background:#1d4ed8;border-radius:12px;padding:20px 24px;margin-bottom:24px">
          <h2 style="color:white;margin:0;font-size:20px">Destek Takip Bildirimi</h2>
        </div>

        <p>Merhaba <strong>${data.kullaniciAd}</strong>,</p>

        <p>Takibinizdeki aşağıdaki destek programlarının son başvuru tarihi yaklaşıyor:</p>

        <ul style="padding-left:20px;line-height:1.8">
          ${liste}
        </ul>

        <p style="margin-top:24px">
          Başvurunuzu tamamlamak için <a href="${process.env.NEXT_PUBLIC_APP_URL}/destekler" style="color:#1d4ed8">Destek Takip</a>'i ziyaret edin.
        </p>

        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
        <p style="font-size:12px;color:#94a3b8">
          Bu bildirimi almak istemiyorsanız hesap ayarlarınızdan bildirimleri kapatabilirsiniz.
        </p>
      </div>
    `,
  });
}

export async function POST(req: NextRequest) {
  // Cron güvenlik kontrolü
  const cronSecret = req.headers.get("x-cron-secret");
  if (cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ hata: "Yetkisiz" }, { status: 401 });
  }

  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);

  // Yaklaşan son tarihli destekleri bul
  const yaklaşanlar = tumDestekler.filter((d) => {
    if (!d.aktif || !d.basvuruBitis) return false;
    const bitis = new Date(d.basvuruBitis);
    const kalanGun = Math.ceil((bitis.getTime() - bugun.getTime()) / 86400000);
    return HATIRLATMA_GUNLERI.includes(kalanGun);
  });

  if (yaklaşanlar.length === 0) {
    return NextResponse.json({ mesaj: "Hatırlatılacak destek yok", gonderilen: 0 });
  }

  // Firestore'dan tüm kullanıcıları çek (Admin SDK gerekli — placeholder)
  // Production'da: firebase-admin ile kullanicilar koleksiyonunu listele,
  // her kullanıcının takip ettiği destekleri kontrol et.
  //
  // Şimdilik: takip listesi varsa email gönder (mock)
  let gonderilen = 0;

  try {
    const adminApp = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
      ? await import("@/lib/firebase-admin").then((m) => m.adminApp)
      : null;

    if (adminApp) {
      const { getFirestore } = await import("firebase-admin/firestore");
      const db = getFirestore(adminApp);
      const kullanicilarSnap = await db.collection("kullanicilar").get();

      for (const kullaniciDoc of kullanicilarSnap.docs) {
        const kullanici = kullaniciDoc.data();
        if (!kullanici.email) continue;

        // Kullanıcının takibindeki destekleri al
        const takipSnap = await db
          .collection("kullanicilar")
          .doc(kullaniciDoc.id)
          .collection("basvurular")
          .get();

        const takipSluglar = new Set(
          takipSnap.docs
            .filter((d) => d.data().durum !== "basvurulmadi")
            .map((d) => d.id),
        );

        const ilgiliDestekler = yaklaşanlar
          .filter((d) => takipSluglar.has(d.slug))
          .map((d) => {
            const bitis = new Date(d.basvuruBitis!);
            const kalan = Math.ceil((bitis.getTime() - bugun.getTime()) / 86400000);
            return {
              ad: d.ad,
              kalan,
              url: `${process.env.NEXT_PUBLIC_APP_URL}/destekler/${d.slug}`,
            };
          });

        if (ilgiliDestekler.length === 0) continue;

        await emailGonder({
          kullaniciEmail: kullanici.email,
          kullaniciAd: kullanici.ad ?? "Kullanıcı",
          destekler: ilgiliDestekler,
        });

        gonderilen++;
      }
    }
  } catch (err) {
    console.error("[Bildirim] Email gönderme hatası:", err);
    return NextResponse.json({ hata: "Email gönderilemedi" }, { status: 500 });
  }

  return NextResponse.json({
    mesaj: "Hatırlatmalar gönderildi",
    yaklaşanDestekSayisi: yaklaşanlar.length,
    gonderilen,
  });
}
