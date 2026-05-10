export default function DesteklerLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Başlık skeleton */}
      <div className="mb-6 h-8 w-64 animate-pulse rounded-lg bg-gray-200" />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Filtre panel skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
        {/* Kart listesi skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-xl border border-gray-200 p-5">
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
              <div className="h-16 animate-pulse rounded bg-gray-100" />
              <div className="mt-auto flex justify-between">
                <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
                <div className="h-6 w-16 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
