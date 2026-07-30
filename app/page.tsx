import { getAllPosts } from '@/lib/services/postService';
import PostCard from '@/components/PostCard';

export default async function HomePage() {
  const posts = await getAllPosts({ published: true });
  
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Latest Posts</h1>
        <p className="text-slate-500 mt-2">Discover our newest insights and stories.</p>
      </div>
      
      {posts.length === 0 ? (
        <div className="p-12 bg-white rounded-xl border border-slate-200 shadow-sm text-slate-500 text-center flex flex-col items-center justify-center">
          <span className="text-4xl mb-3">📭</span>
          <p className="text-lg font-medium">No posts yet.</p>
          <p className="text-sm">Check back later for new content!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
