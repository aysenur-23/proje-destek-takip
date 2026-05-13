export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container py-6">
          <div className="h-8 w-56 rounded-xl bg-slate-200 animate-pulse mb-2" />
          <div className="h-4 w-80 rounded-lg bg-slate-100 animate-pulse" />
        </div>
      </div>
      <div className="container py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 h-24 animate-pulse" />
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 h-64 animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 h-48 animate-pulse" />
            <div className="rounded-2xl border border-slate-200 bg-white p-5 h-40 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
