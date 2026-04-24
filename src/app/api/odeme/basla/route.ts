import { NextRequest, NextResponse } from "next/server";
import { buildKTFormData } from "@/lib/kuveytturk";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, email, cardHolderName, cardNumber, cardExpireMonth, cardExpireYear, cardCVV2 } = body;

    if (!uid || !email || !cardNumber) {
      return NextResponse.json({ error: "Eksik ödeme bilgisi" }, { status: 400 });
    }

    const orderId = `${uid.slice(0, 8)}-${Date.now()}`;
    const amount = 29900; // ₺299.00 = 29900 kuruş

    const formData = buildKTFormData({
      orderId,
      amount,
      email,
      cardHolderName,
      cardNumber,
      cardExpireMonth,
      cardExpireYear,
      cardCVV2,
    });

    return NextResponse.json({ formData });
  } catch (err) {
    console.error("Ödeme başlatma hatası:", err);
    return NextResponse.json({ error: "Ödeme başlatılamadı" }, { status: 500 });
  }
}
