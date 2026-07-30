export default function PostDetailPage({ params }: { params: { slug: string } }) {
  return (
    <article className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm">
      <h1 className="text-3xl font-bold mb-4 text-slate-900">Post Detail: {params.slug}</h1>
      <p className="text-slate-600">
        This is a placeholder for the individual post page. In Stage 3, this will use ISR to fetch real post data and regenerate in the background.
      </p>
    </article>
  );
}
