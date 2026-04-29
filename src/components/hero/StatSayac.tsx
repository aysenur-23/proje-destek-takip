"use client";

import { useEffect, useRef, useState } from "react";

/* ─── Easing: ease-out cubic ─── */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/* ─── Tek sayaç kancası ─── */
function useSayac(hedef: number, sure: number, aktif: boolean) {
  const [deger, setDeger] = useState(0);

  useEffect(() => {
    if (!aktif) return;
    const baslangic = performance.now();

    const tick = (simdi: number) => {
      const gecen = simdi - baslangic;
      const ilerleme = Math.min(gecen / sure, 1);
      const kolaylasmis = easeOutCubic(ilerleme);
      setDeger(Math.round(kolaylasmis * hedef));
      if (ilerleme < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [aktif, hedef, sure]);

  return deger;
}

/* ─── Tekil stat kartı ─── */
interface StatProps {
  hedef: number;
  etiket: string;
  on: string;   // sayıdan önce (ör. "₺", "%")
  son: string;  // sayıdan sonra (ör. "+", "M")
  sabit?: string; // sayı yerine sabit metin (ör. "AI")
  renk: string;
  sure?: number;
  aktif: boolean;
}

function StatKarti({ hedef, etiket, on, son, sabit, renk, sure = 1400, aktif }: StatProps) {
  const deger = useSayac(hedef, sure, aktif && !sabit);

  return (
    <div className="px-6 py-5 text-center first:pl-0 last:pr-0 group">
      <div
        className={`stat-number mb-1 ${renk} transition-transform duration-300 group-hover:scale-110`}
      >
        {sabit ? (
          <span>{sabit}</span>
        ) : (
          <>
            {on}
            {deger.toLocaleString("tr-TR")}
            {son}
          </>
        )}
      </div>
      <div className="text-sm text-slate-500">{etiket}</div>
    </div>
  );
}

/* ─── Tüm stat satırı ─── */
const istatistikler: Omit<StatProps, "aktif">[] = [
  { hedef: 40,  on: "",   son: "+",   etiket: "Destek Programı",         renk: "text-blue-600",    sure: 1200 },
  { hedef: 10,  on: "",   son: "",    etiket: "Kurum & Bakanlık",         renk: "text-emerald-600", sure: 900  },
  { hedef: 0,   on: "",   son: "",    etiket: "Destekli Analiz",          renk: "text-violet-600",  sabit: "AI" },
  { hedef: 100, on: "%",  son: "",    etiket: "Ücretsiz Temel Kullanım",  renk: "text-slate-900",   sure: 1600 },
];

export function StatSatiri() {
  const ref = useRef<HTMLDivElement>(null);
  const [gorundu, setGorundu] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGorundu(true);
          observer.disconnect(); // Bir kez tetikle, yeter
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="border-b border-slate-100 bg-white" ref={ref}>
      <div className="container py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
          {istatistikler.map((s) => (
            <StatKarti key={s.etiket} {...s} aktif={gorundu} />
          ))}
        </div>
      </div>
    </section>
  );
}
