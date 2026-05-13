export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container py-8">
          <div className="h-7 w-44 rounded-xl bg-slate-200 animate-pulse mb-2" />
          <div className="h-9 w-72 rounded-xl bg-slate-200 animate-pulse mb-2" />
          <div className="h-4 w-96 rounded-lg bg-slate-100 animate-pulse" />
        </div>
      </div>
      <div className="container py-8 max-w-4xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 h-40 animate-pulse" />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 h-56 animate-pulse" />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 h-32 animate-pulse" />
      </div>
    </div>
  );
}
