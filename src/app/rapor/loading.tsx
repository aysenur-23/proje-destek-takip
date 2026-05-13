export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container py-6">
          <div className="h-8 w-48 rounded-xl bg-slate-200 animate-pulse mb-2" />
          <div className="h-4 w-64 rounded-lg bg-slate-100 animate-pulse" />
        </div>
      </div>
      <div className="container py-8 max-w-4xl space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 h-20 animate-pulse" />
          ))}
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="h-10 bg-slate-100 animate-pulse" />
            <div className="p-5 space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-12 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
