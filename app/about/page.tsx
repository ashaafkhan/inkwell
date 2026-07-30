export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-6">About InkWell</h1>
      <div className="prose prose-slate prose-lg">
        <p>
          InkWell is a simple, elegant blogging platform built with the Next.js App Router, 
          Prisma ORM, and Tailwind CSS.
        </p>
        <p>
          It serves as a comprehensive demonstration of various modern web development concepts:
        </p>
        <ul>
          <li><strong>Static Site Generation (SSG)</strong> for blazing fast public pages.</li>
          <li><strong>Incremental Static Regeneration (ISR)</strong> for post detail pages.</li>
          <li><strong>Server-Side Rendering (SSR)</strong> for live dashboard views.</li>
          <li><strong>Server Actions</strong> for secure, javascript-less mutations.</li>
        </ul>
        <p>
          This specific About page is purely static content—it does not fetch any data and is rendered once at build time.
        </p>
      </div>
    </div>
  );
}
