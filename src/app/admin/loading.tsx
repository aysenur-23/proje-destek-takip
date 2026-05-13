export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container py-6">
          <div className="h-7 w-32 rounded-xl bg-slate-200 animate-pulse mb-2" />
          <div className="h-4 w-56 rounded-lg bg-slate-100 animate-pulse" />
        </div>
      </div>
      <div className="container py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 h-24 animate-pulse" />
          ))}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white h-96 animate-pulse" />
      </div>
    </div>
  );
}
