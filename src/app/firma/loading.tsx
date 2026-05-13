export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-200 bg-white">
        <div className="container py-8 sm:py-10">
          <div className="h-7 w-40 rounded-xl bg-slate-200 animate-pulse mb-2" />
          <div className="h-9 w-64 rounded-xl bg-slate-200 animate-pulse mb-2" />
          <div className="h-4 w-80 rounded-lg bg-slate-100 animate-pulse" />
        </div>
      </div>
      <div className="container py-8 max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
                <div className="h-5 w-32 rounded-lg bg-slate-200 animate-pulse" />
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-10 rounded-xl bg-slate-100 animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 h-48 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
