export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="card p-5 animate-pulse">
      {/* Üst satır */}
      <div className="flex items-start gap-3 mb-4">
        <div className="skeleton h-10 w-10 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3.5 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
      </div>
      {/* İçerik satırları */}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="skeleton h-3 rounded"
            style={{ width: `${100 - i * 12}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonDestekKarti() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="flex items-start gap-3 pl-5 pr-4 py-3.5">
        <div className="w-1 absolute left-0 top-0 bottom-0 bg-slate-200 rounded-l-2xl" />
        <div className="flex-1 space-y-2">
          <div className="flex gap-1.5 mb-2">
            <div className="skeleton h-4 w-16 rounded-full" />
            <div className="skeleton h-4 w-12 rounded-full" />
          </div>
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-3 w-full rounded" />
        </div>
        <div className="skeleton h-5 w-16 rounded-full shrink-0" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonDestekKarti key={i} />
      ))}
    </div>
  );
}
