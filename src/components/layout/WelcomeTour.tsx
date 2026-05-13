"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, Building2, Search, Sparkles, ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TOUR_KEY = "dt_welcome_tour_v1";

interface Adim {
  ikon: React.ComponentType<{ size?: number; className?: string }>;
  renk: string;
  baslik: string;
  aciklama: string;
  aksiyon?: string;
}

const ADIMLAR: Adim[] = [
  {
    ikon: Building2,
    renk: "blue",
    baslik: "Firma Profilinizi Oluşturun",
    aciklama:
      "Şirket büyüklüğünüz, sektörünüz ve özelliklerinizi girerek sistemi kişiselleştirin. 4 adım, 2 dakika — tarayıcınızda kalır.",
    aksiyon: "Profil Oluştur",
  },
  {
    ikon: Search,
    renk: "violet",
    baslik: "Uygun Destekleri Keşfedin",
    aciklama:
      "47+ Türk ve AB hibe/teşvik programı arasından size özel filtrelenmiş liste. TÜBİTAK, KOSGEB, TKDK, SGK ve çok daha fazlası.",
    aksiyon: "Desteklere Bak",
  },
  {
    ikon: Sparkles,
    renk: "emerald",
    baslik: "AI ile Başvuruyu Güçlendirin",
    aciklama:
      "Proje raporunuzu yükleyin — yapay zeka bölüm bazlı öneriler sunar, eksiklikleri işaret eder, puanlar.",
    aksiyon: "Proje Asistanı",
  },
];

const RENK_HARITASI: Record<string, { bg: string; text: string; ring: string; dot: string }> = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    ring: "ring-blue-200",
    dot: "bg-blue-500",
  },
  violet: {
    bg: "bg-violet-50",
    text: "text-violet-600",
    ring: "ring-violet-200",
    dot: "bg-violet-500",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    ring: "ring-emerald-200",
    dot: "bg-emerald-500",
  },
};

const AKSIYON_YOLLARI: Record<string, string> = {
  "Profil Oluştur": "/firma",
  "Desteklere Bak": "/destekler",
  "Proje Asistanı": "/proje-asistani",
};

export function WelcomeTour() {
  const router = useRouter();
  const [goster, setGoster] = useState(false);
  const [adim, setAdim] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const oncekiOdakRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // İlk ziyareti kontrol et — bir sonraki tick'te çalıştır (hydration)
    const timer = setTimeout(() => {
      try {
        const tamamlandi = localStorage.getItem(TOUR_KEY);
        if (!tamamlandi) {
          // Açılmadan önce odak noktasını kaydet
          oncekiOdakRef.current = document.activeElement as HTMLElement;
          setGoster(true);
        }
      } catch {
        // localStorage yoksa sessizce geç
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Modal açıldığında ilk odaklanabilir elemana focus ver
  useEffect(() => {
    if (!goster) return;
    const timer = setTimeout(() => {
      const ilkOdak = modalRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      ilkOdak?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, [goster]);

  // Focus trap — Tab ve Shift+Tab
  const focusTrap = useCallback((e: KeyboardEvent) => {
    if (e.key !== "Tab" || !modalRef.current) return;
    const odaklanabilir = Array.from(
      modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute("disabled"));
    if (odaklanabilir.length === 0) return;
    const ilk = odaklanabilir[0];
    const son = odaklanabilir[odaklanabilir.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === ilk) {
        e.preventDefault();
        son.focus();
      }
    } else {
      if (document.activeElement === son) {
        e.preventDefault();
        ilk.focus();
      }
    }
  }, []);

  const kapat = useCallback(() => {
    try {
      localStorage.setItem(TOUR_KEY, "done");
    } catch {
      // pass
    }
    setGoster(false);
    // Odağı önceki elemente döndür
    setTimeout(() => oncekiOdakRef.current?.focus(), 50);
  }, []);

  // ESC ile kapat
  const escKapat = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") kapat();
  }, [kapat]);

  useEffect(() => {
    if (!goster) return;
    document.addEventListener("keydown", focusTrap);
    document.addEventListener("keydown", escKapat);
    return () => {
      document.removeEventListener("keydown", focusTrap);
      document.removeEventListener("keydown", escKapat);
    };
  }, [goster, focusTrap, escKapat]);

  function ileri() {
    if (adim < ADIMLAR.length - 1) {
      setAdim((a) => a + 1);
    } else {
      kapat();
      const yol = AKSIYON_YOLLARI[ADIMLAR[adim].aksiyon ?? ""] ?? "/firma";
      router.push(yol);
    }
  }

  function aksiyonaTikla() {
    const yol = AKSIYON_YOLLARI[ADIMLAR[adim].aksiyon ?? ""] ?? "/firma";
    kapat();
    router.push(yol);
  }

  if (!goster) return null;

  const mevcutAdim = ADIMLAR[adim];
  const Ikon = mevcutAdim.ikon;
  const renkler = RENK_HARITASI[mevcutAdim.renk];
  const sonAdim = adim === ADIMLAR.length - 1;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Hoş geldiniz turu"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={kapat}
        aria-hidden="true"
      />

      {/* Modal kart */}
      <div ref={modalRef} className="relative z-10 w-full max-w-md animate-slide-up rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
        {/* Kapat butonu */}
        <button
          onClick={kapat}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          aria-label="Turu kapat"
        >
          <X size={14} />
        </button>

        {/* İlerleme çizgisi */}
        <div className="absolute inset-x-0 top-0 h-1 overflow-hidden rounded-t-2xl bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
            style={{ width: `${((adim + 1) / ADIMLAR.length) * 100}%` }}
          />
        </div>

        <div className="px-7 pb-7 pt-8">
          {/* Üst başlık — sadece ilk adımda */}
          {adim === 0 && (
            <div className="mb-5 text-center">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Destek Takip&apos;e hoş geldiniz
              </p>
              <h1 className="mt-1 text-lg font-bold text-slate-900">
                Hibe ve teşvik programlarını kolayca bulun
              </h1>
            </div>
          )}

          {/* Adım içeriği */}
          <div key={adim} className="animate-fade-in">
            {/* İkon */}
            <div
              className={cn(
                "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ring-4",
                renkler.bg,
                renkler.ring,
              )}
            >
              <Ikon size={24} className={renkler.text} />
            </div>

            {/* Adım numarası + başlık */}
            <div className="mb-1 text-center">
              <span className={cn("text-xs font-bold uppercase tracking-widest", renkler.text)}>
                Adım {adim + 1} / {ADIMLAR.length}
              </span>
            </div>
            <h2 className="mb-3 text-center text-base font-bold text-slate-900">
              {mevcutAdim.baslik}
            </h2>
            <p className="mb-6 text-center text-sm leading-relaxed text-slate-500">
              {mevcutAdim.aciklama}
            </p>
          </div>

          {/* Aksiyon butonları */}
          <div className="flex flex-col gap-2">
            {mevcutAdim.aksiyon && (
              <button
                onClick={aksiyonaTikla}
                className="btn-md btn-primary w-full justify-center gap-2 group"
              >
                {mevcutAdim.aksiyon}
                <ChevronRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            )}
            <div className="flex items-center gap-2">
              {!sonAdim ? (
                <button
                  onClick={ileri}
                  className="flex-1 btn-md btn-secondary justify-center gap-1.5 text-slate-500"
                >
                  Sonraki
                  <ArrowRight size={13} />
                </button>
              ) : (
                <button
                  onClick={kapat}
                  className="flex-1 btn-md btn-secondary justify-center text-slate-500"
                >
                  Daha sonra başlayacağım
                </button>
              )}
            </div>
          </div>

          {/* Nokta göstergesi */}
          <div className="mt-5 flex justify-center gap-1.5">
            {ADIMLAR.map((_, i) => (
              <button
                key={i}
                onClick={() => setAdim(i)}
                aria-label={`Adım ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === adim
                    ? `w-5 ${renkler.dot}`
                    : "w-1.5 bg-slate-200 hover:bg-slate-300",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
