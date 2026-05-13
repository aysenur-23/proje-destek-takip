"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Crown,
  CreditCard,
  Lock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

function formatKartNo(val: string) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

export function OdemeForm() {
  const { kullanici, firebaseUser, yukleniyor } = useAuth();
  const searchParams = useSearchParams();
  const durum = searchParams.get("durum");

  const [kartSahibi, setKartSahibi] = useState("");
  const [kartNo, setKartNo] = useState("");
  const [ay, setAy] = useState("");
  const [yil, setYil] = useState("");
  const [cvv, setCvv] = useState("");
  const [islem, setIslem] = useState(false);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    if (kullanici?.ad) setKartSahibi(kullanici.ad.toUpperCase());
  }, [kullanici]);

  if (yukleniyor) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-300 border-t-blue-600" />
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div className="w-full max-w-sm text-center">
        <Crown size={40} className="mx-auto mb-4 text-violet-500" />
        <h2 className="mb-2 text-xl font-bold text-slate-900">Giriş Gerekiyor</h2>
        <p className="mb-6 text-slate-500">Premium&apos;a geçmek için önce giriş yapın.</p>
        <Link href="/giris?sonra=/odeme" className="btn-md btn-primary">
          Giriş Yap
        </Link>
      </div>
    );
  }

  if (kullanici?.plan === "premium") {
    return (
      <div className="w-full max-w-sm text-center">
        <CheckCircle2 size={40} className="mx-auto mb-4 text-emerald-500" />
        <h2 className="mb-2 text-xl font-bold text-slate-900">Zaten Premium!</h2>
        <p className="mb-6 text-slate-500">
          Hesabınız aktif Premium üyeliğe sahip.
          {kullanici.premiumBitisTarihi && (
            <> Bitiş: {new Date(kullanici.premiumBitisTarihi).toLocaleDateString("tr-TR")}</>
          )}
        </p>
        <Link href="/proje-asistani" className="btn-md btn-premium">
          Proje Asistanını Aç
        </Link>
      </div>
    );
  }

  if (durum === "basarili") {
    return (
      <div className="w-full max-w-sm text-center">
        <CheckCircle2 size={48} className="mx-auto mb-4 text-emerald-500" />
        <h2 className="mb-2 text-2xl font-bold text-slate-900">Ödeme Başarılı!</h2>
        <p className="mb-6 text-slate-500">Premium üyeliğiniz aktif edildi. Tüm AI özelliklerine artık erişebilirsiniz.</p>
        <Link href="/proje-asistani" className="btn-lg btn-premium">
          <Crown size={16} />
          Proje Asistanını Kullan
        </Link>
      </div>
    );
  }

  if (durum === "basarisiz") {
    const neden = searchParams.get("neden");
    return (
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <AlertCircle size={40} className="mx-auto mb-3 text-red-500" />
          <h2 className="text-xl font-bold text-slate-900">Ödeme Başarısız</h2>
          {neden && <p className="mt-1 text-sm text-slate-500">{neden}</p>}
        </div>
        <button onClick={() => window.location.replace("/odeme")} className="btn-md btn-primary w-full">
          Tekrar Dene
        </button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (islem || !firebaseUser) return;
    setHata(null);
    setIslem(true);

    try {
      const res = await fetch("/api/odeme/basla", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          cardHolderName: kartSahibi,
          cardNumber: kartNo.replace(/\s/g, ""),
          cardExpireMonth: ay,
          cardExpireYear: yil,
          cardCVV2: cvv,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ödeme başlatılamadı");

      // 3D Secure yönlendirmesi için form oluştur ve gönder
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.formData.apiUrl;
      Object.entries(data.formData).forEach(([key, value]) => {
        if (key === "apiUrl") return;
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setHata(err instanceof Error ? err.message : "Bir hata oluştu");
      setIslem(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Başlık */}
      <div className="mb-6 text-center">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-600/25">
          <Crown size={22} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Premium&apos;a Geç</h1>
        <p className="mt-1 text-slate-500">₺299 / ay · İstediğiniz zaman iptal</p>
      </div>

      {/* Özellik özeti */}
      <div className="mb-6 card p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Premium ile erişecekleriniz
        </p>
        <ul className="space-y-2">
          {["AI sınır programı analizi", "Proje Yazım Asistanı (Modül 1)", "Bölüm bazlı rapor önerileri"].map(
            (f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 size={14} className="text-violet-500 shrink-0" />
                {f}
              </li>
            ),
          )}
        </ul>
      </div>

      {/* Kart formu */}
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        {hata && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            {hata}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Kart Sahibi</label>
          <input
            type="text"
            className="input"
            value={kartSahibi}
            onChange={(e) => setKartSahibi(e.target.value.toUpperCase())}
            placeholder="AD SOYAD"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Kart Numarası</label>
          <div className="relative">
            <CreditCard size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              inputMode="numeric"
              className="input pl-9 tracking-widest"
              value={kartNo}
              onChange={(e) => setKartNo(formatKartNo(e.target.value))}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Ay</label>
            <select className="input" value={ay} onChange={(e) => setAy(e.target.value)} required>
              <option value="">AA</option>
              {Array.from({ length: 12 }, (_, i) => {
                const m = String(i + 1).padStart(2, "0");
                return <option key={m} value={m}>{m}</option>;
              })}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Yıl</label>
            <select className="input" value={yil} onChange={(e) => setYil(e.target.value)} required>
              <option value="">YY</option>
              {Array.from({ length: 10 }, (_, i) => {
                const y = String(new Date().getFullYear() + i).slice(2);
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">CVV</label>
            <input
              type="text"
              inputMode="numeric"
              className="input"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="•••"
              maxLength={4}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={islem}
          className="btn-lg w-full gap-2 bg-violet-600 text-white hover:bg-violet-500 shadow-md shadow-violet-600/20 disabled:opacity-60"
        >
          {islem ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <Lock size={16} />
          )}
          {islem ? "Yönlendiriliyor..." : "₺299 Öde — 3D Secure"}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck size={13} className="text-emerald-500" />
          Kuveyt Türk Sanal POS · SSL şifreli
        </div>
      </form>

      <p className="mt-4 text-center text-xs text-slate-400">
        Ödeme yaparak{" "}
        <Link href="/sartlar" className="underline">
          Kullanım Şartları
        </Link>
        {'nı'} kabul edersiniz. Aboneliğinizi dilediğiniz zaman iptal edebilirsiniz.
      </p>
    </div>
  );
}
