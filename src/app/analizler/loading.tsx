export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container max-w-3xl py-6">
          <div className="h-4 w-40 rounded-lg bg-slate-100 animate-pulse mb-4" />
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-200 animate-pulse" />
            <div>
              <div className="h-6 w-40 rounded-lg bg-slate-200 animate-pulse mb-1.5" />
              <div className="h-4 w-24 rounded-md bg-slate-100 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      <div className="container max-w-3xl py-6 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 h-28 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
