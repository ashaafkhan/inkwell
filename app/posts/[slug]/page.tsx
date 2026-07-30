import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/services/postService';
import ViewTicker from '@/components/ViewTicker';

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getAllPosts({ published: true });
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post || !post.published) {
    notFound();
  }
  
  return (
    <>
      <ViewTicker postId={post.id} />
      <article className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm">
      <header className="mb-8 border-b border-slate-100 pb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
              {post.authorName[0]}
            </div>
            <span>{post.authorName}</span>
          </div>
          <span className="text-slate-300">&bull;</span>
          <time dateTime={post.createdAt.toISOString()}>
            {new Date(post.createdAt).toLocaleDateString()}
          </time>
          <span className="text-slate-300">&bull;</span>
          <span className="bg-slate-50 px-3 py-1 rounded-full text-slate-600 border border-slate-200">
            {post.category}
          </span>
          <span className="text-slate-300">&bull;</span>
          <span>{post.views} views</span>
        </div>
      </header>
      
      <div className="prose prose-slate prose-lg max-w-none">
        <p className="lead text-slate-600 font-medium text-xl italic">{post.excerpt}</p>
        <p className="whitespace-pre-wrap">{post.content}</p>
      </div>
    </article>
    </>
  );
}
