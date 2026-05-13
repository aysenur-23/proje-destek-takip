export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container py-10">
          <div className="h-8 w-48 rounded-xl bg-slate-200 animate-pulse mb-3" />
          <div className="h-4 w-72 rounded-lg bg-slate-100 animate-pulse" />
        </div>
      </div>
      <div className="container py-8">
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-7 w-20 rounded-full bg-slate-200 animate-pulse" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="h-1 w-full bg-slate-200 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-24 rounded-full bg-slate-100 animate-pulse" />
                <div className="h-5 w-full rounded-lg bg-slate-200 animate-pulse" />
                <div className="h-4 w-4/5 rounded-lg bg-slate-100 animate-pulse" />
                <div className="h-16 w-full rounded-lg bg-slate-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
