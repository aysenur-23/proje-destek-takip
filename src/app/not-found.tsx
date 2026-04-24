import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-7xl font-bold text-slate-200 mb-4 select-none">404</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Sayfa Bulunamadı</h1>
        <p className="text-slate-500 mb-8 text-sm">
          Aradığınız sayfa kaldırılmış ya da hiç var olmamış olabilir.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-md btn-primary gap-2">
            <Home size={15} />
            Ana Sayfa
          </Link>
          <Link href="/destekler" className="btn-md btn-secondary gap-2">
            <Search size={15} />
            Desteklere Bak
          </Link>
        </div>
      </div>
    </div>
  );
}
