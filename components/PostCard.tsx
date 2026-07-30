import Link from 'next/link';

type PostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  createdAt: Date;
};

export default function PostCard({ post }: { post: PostSummary }) {
  return (
    <Link href={`/posts/${post.slug}`} className="block group">
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
          {!post.published && (
            <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase tracking-widest shrink-0 ml-3">
              Draft
            </span>
          )}
        </div>
        <p className="text-slate-600 mb-6 flex-grow">{post.excerpt}</p>
        <div className="text-sm text-slate-400 font-medium mt-auto">
          {new Date(post.createdAt).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}
