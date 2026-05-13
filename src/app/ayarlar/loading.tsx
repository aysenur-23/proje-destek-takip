export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container py-8 max-w-2xl">
          <div className="h-8 w-48 rounded-xl bg-slate-200 animate-pulse mb-2" />
          <div className="h-4 w-80 rounded-lg bg-slate-100 animate-pulse" />
        </div>
      </div>
      <div className="container max-w-2xl py-8 space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="h-12 bg-slate-50 border-b border-slate-100 animate-pulse" />
            <div className="p-6 space-y-4">
              <div className="h-12 rounded-xl bg-slate-100 animate-pulse" />
              <div className="h-8 w-2/3 rounded-lg bg-slate-100 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
