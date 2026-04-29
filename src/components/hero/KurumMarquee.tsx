const kurumlar = [
  { kisaltma: "TÜBİTAK",      renk: "#2563eb" },
  { kisaltma: "KOSGEB",        renk: "#059669" },
  { kisaltma: "TKDK",          renk: "#b45309" },
  { kisaltma: "SGK",           renk: "#1d4ed8" },
  { kisaltma: "Teknokent TGB", renk: "#7c3aed" },
  { kisaltma: "AB Fonları",    renk: "#1e40af" },
  { kisaltma: "BEBKA",         renk: "#9a3412" },
  { kisaltma: "İSTKA",         renk: "#134e4a" },
  { kisaltma: "Ticaret Bak.",  renk: "#1e3a8a" },
  { kisaltma: "Sanayi Bak.",   renk: "#312e81" },
  { kisaltma: "Tarım Bak.",    renk: "#14532d" },
  { kisaltma: "TURQUALITY",    renk: "#7c2d12" },
];

const tüm = [...kurumlar, ...kurumlar];

export function KurumMarquee() {
  return (
    <div className="border-y border-gray-100 bg-gray-50 py-5 overflow-hidden">
      <p className="text-center text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-5">
        Kapsanan kurumlar ve programlar
      </p>
      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-gray-50 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-gray-50 to-transparent" />
        <div className="flex w-max animate-marquee">
          {tüm.map((k, i) => (
            <div
              key={i}
              className="mx-2 inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 hover:border-gray-300 transition-colors"
            >
              <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: k.renk }} />
              <span className="text-[13px] font-medium text-gray-600 whitespace-nowrap">{k.kisaltma}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
