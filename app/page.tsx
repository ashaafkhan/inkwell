export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Latest Posts</h1>
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm text-slate-500">
        Placeholder for the list of published posts (SSG). This will be wired up to Prisma in Stage 3.
      </div>
    </div>
  );
}
