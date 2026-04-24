"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { auth, db, firebaseReady } from "@/lib/firebase";
import type { Kullanici } from "@/types";

interface AuthContextValue {
  kullanici: Kullanici | null;
  firebaseUser: User | null;
  yukleniyor: boolean;
  girisYap: (email: string, sifre: string) => Promise<void>;
  googleIleGiris: () => Promise<void>;
  kayitOl: (ad: string, email: string, sifre: string) => Promise<void>;
  cikisYap: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  kullanici: null,
  firebaseUser: null,
  yukleniyor: false,
  girisYap: async () => { throw new Error("Firebase yapılandırılmamış"); },
  googleIleGiris: async () => { throw new Error("Firebase yapılandırılmamış"); },
  kayitOl: async () => { throw new Error("Firebase yapılandırılmamış"); },
  cikisYap: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [kullanici, setKullanici] = useState<Kullanici | null>(null);
  const [yukleniyor, setYukleniyor] = useState(firebaseReady);

  useEffect(() => {
    if (!firebaseReady || !auth) {
      setYukleniyor(false);
      return;
    }

    let mounted = true;

    const setupAuth = async () => {
      const { onAuthStateChanged } = await import("firebase/auth");
      const { doc, getDoc, setDoc, serverTimestamp } = await import("firebase/firestore");

      const abonelik = onAuthStateChanged(auth!, async (user) => {
        if (!mounted) return;
        setFirebaseUser(user);

        if (user && db) {
          try {
            const snap = await getDoc(doc(db!, "kullanicilar", user.uid));
            if (snap.exists()) {
              setKullanici(snap.data() as Kullanici);
            } else {
              const yeniKullanici: Kullanici = {
                uid: user.uid,
                email: user.email!,
                ad: user.displayName ?? user.email!.split("@")[0],
                plan: "ucretsiz",
                olusturmaTarihi: new Date().toISOString(),
              };
              await setDoc(doc(db!, "kullanicilar", user.uid), {
                ...yeniKullanici,
                olusturmaTarihi: serverTimestamp(),
              });
              setKullanici(yeniKullanici);
            }
          } catch {
            setKullanici(null);
          }
        } else {
          setKullanici(null);
        }
        setYukleniyor(false);
      });

      return abonelik;
    };

    let unsub: (() => void) | undefined;
    setupAuth().then((fn) => { unsub = fn; });

    return () => {
      mounted = false;
      unsub?.();
    };
  }, []);

  async function girisYap(email: string, sifre: string) {
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    await signInWithEmailAndPassword(auth!, email, sifre);
  }

  async function googleIleGiris() {
    const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");
    await signInWithPopup(auth!, new GoogleAuthProvider());
  }

  async function kayitOl(ad: string, email: string, sifre: string) {
    const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
    const kred = await createUserWithEmailAndPassword(auth!, email, sifre);
    await updateProfile(kred.user, { displayName: ad });
  }

  async function cikisYap() {
    const { signOut } = await import("firebase/auth");
    await signOut(auth!);
  }

  return (
    <AuthContext.Provider value={{ kullanici, firebaseUser, yukleniyor, girisYap, googleIleGiris, kayitOl, cikisYap }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
