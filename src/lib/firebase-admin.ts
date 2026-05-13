import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { NextRequest } from "next/server";

function getAdminApp(): App | null {
  if (!process.env.FIREBASE_PROJECT_ID) return null;
  if (getApps().length) return getApps()[0];
  try {
    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Vercel env'de \n gerçek newline'a dönüştürülmeli
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  } catch {
    return null;
  }
}

interface TokenSonucu {
  uid: string;
  email?: string;
}

/** Authorization header'dan Bearer token alır ve doğrular. */
export async function tokenDogrula(req: NextRequest): Promise<TokenSonucu | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  const app = getAdminApp();
  if (!app) return null;

  try {
    const decoded = await getAuth(app).verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    return null;
  }
}

/** Kullanıcının premium planında olup olmadığını Firestore'dan kontrol eder. */
export async function premiumMu(uid: string): Promise<boolean> {
  const app = getAdminApp();
  if (!app) return false;
  try {
    const { getFirestore } = await import("firebase-admin/firestore");
    const snap = await getFirestore(app).collection("kullanicilar").doc(uid).get();
    return snap.data()?.plan === "premium";
  } catch {
    return false;
  }
}

/** Admin Firestore instance döner (server-side işlemler için). */
export async function getAdminFirestore() {
  const app = getAdminApp();
  if (!app) return null;
  try {
    const { getFirestore } = await import("firebase-admin/firestore");
    return getFirestore(app);
  } catch {
    return null;
  }
}
