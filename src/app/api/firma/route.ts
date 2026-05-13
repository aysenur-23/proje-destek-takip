/**
 * GET  /api/firma  — Oturum açmış kullanıcının Firestore firma profilini döner
 * POST /api/firma  — Firma profilini Firestore'a kaydeder / günceller
 *
 * Kimlik doğrulama: Firebase ID Token (Authorization: Bearer <token>)
 */

import { NextRequest, NextResponse } from "next/server";
import { tokenDogrula } from "@/lib/firebase-admin";
import type { FirmaProfili } from "@/types";

function getAdminFirestore() {
  const { getApps, getApp, initializeApp, cert } = require("firebase-admin/app");
  const { getFirestore } = require("firebase-admin/firestore");

  if (!process.env.FIREBASE_PROJECT_ID) return null;

  const app =
    getApps().length > 0
      ? getApp()
      : initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
          }),
        });

  return getFirestore(app);
}

// ─── GET ──────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const token = await tokenDogrula(req);
  if (!token) {
    return NextResponse.json({ hata: "Kimlik doğrulaması gerekli" }, { status: 401 });
  }

  try {
    const db = getAdminFirestore();
    if (!db) return NextResponse.json({ firma: null }, { status: 200 });

    const snap = await db
      .collection("kullanicilar")
      .doc(token.uid)
      .collection("profil")
      .doc("firma")
      .get();

    if (!snap.exists) {
      return NextResponse.json({ firma: null }, { status: 200 });
    }

    return NextResponse.json({ firma: snap.data() as FirmaProfili }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/firma]", err);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}

// ─── POST ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const token = await tokenDogrula(req);
  if (!token) {
    return NextResponse.json({ hata: "Kimlik doğrulaması gerekli" }, { status: 401 });
  }

  let firma: FirmaProfili;
  try {
    firma = (await req.json()) as FirmaProfili;
  } catch {
    return NextResponse.json({ hata: "Geçersiz JSON" }, { status: 400 });
  }

  // Temel doğrulama
  if (
    !firma.ad ||
    typeof firma.kurulusYili !== "number" ||
    typeof firma.calısanSayisi !== "number"
  ) {
    return NextResponse.json(
      { hata: "Zorunlu alanlar eksik: ad, kurulusYili, calısanSayisi" },
      { status: 422 },
    );
  }

  try {
    const db = getAdminFirestore();
    if (!db) throw new Error("Firestore bağlantısı yok");

    const { FieldValue } = require("firebase-admin/firestore");

    await db
      .collection("kullanicilar")
      .doc(token.uid)
      .collection("profil")
      .doc("firma")
      .set(
        {
          ...firma,
          guncellenmeTarihi: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

    return NextResponse.json({ basarili: true }, { status: 200 });
  } catch (err) {
    console.error("[POST /api/firma]", err);
    return NextResponse.json({ hata: "Kayıt edilemedi" }, { status: 500 });
  }
}
