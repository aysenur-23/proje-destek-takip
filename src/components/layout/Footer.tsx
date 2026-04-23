export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-slate-400 text-sm">
          © {new Date().getFullYear()} Destek Takip — Firmaya özel hibe ve teşvik rehberi
        </p>
        <p className="text-slate-400 text-xs mt-1">
          Bu sistem bilgilendirme amaçlıdır. Resmi başvurular için ilgili kurumun güncel mevzuatını kontrol ediniz.
        </p>
      </div>
    </footer>
  );
}
