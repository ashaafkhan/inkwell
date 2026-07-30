import { getDashboardStats } from '@/lib/services/postService';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardOverviewPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <Link href="/dashboard/posts/new" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm">
          Write New Post
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Posts" value={stats.totalPosts} />
        <StatCard title="Published" value={stats.publishedCount} />
        <StatCard title="Drafts" value={stats.draftCount} />
        <StatCard title="Total Views" value={stats.totalViews} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Recent Posts</h2>
          <Link href="/dashboard/posts" className="text-sm font-medium text-blue-600 hover:underline">View all &rarr;</Link>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <ul className="divide-y divide-slate-100">
            {stats.recentPosts.map((post) => (
              <li key={post.id} className="p-5 hover:bg-slate-50 transition-colors flex justify-between items-center group">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-slate-900">{post.title}</p>
                    {!post.published && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase tracking-widest">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">Updated on {new Date(post.updatedAt).toLocaleDateString()} &bull; {post.views} views</p>
                </div>
                <Link href={`/dashboard/posts/${post.id}/edit`} className="text-sm px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                  Edit
                </Link>
              </li>
            ))}
            {stats.recentPosts.length === 0 && (
              <li className="p-8 text-center text-slate-500">No posts found. Start by creating a new one!</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-blue-200 transition-colors">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.64-2.25 1.64-1.74 0-2.33-.89-2.41-1.76H7.73c.09 1.86 1.46 2.97 3.17 3.3V19h2.32v-1.67c1.52-.36 2.83-1.35 2.83-2.92-.01-1.92-1.64-2.81-3.74-3.27z"/></svg>
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 relative z-10">{title}</p>
      <p className="text-4xl font-extrabold text-slate-900 relative z-10">{value}</p>
    </div>
  );
}
