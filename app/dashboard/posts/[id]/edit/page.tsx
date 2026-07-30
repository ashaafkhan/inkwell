import PostForm from '@/components/PostForm';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  
  if (!post) {
    notFound();
  }

  // Convert Date to string for the client component if needed, but we don't pass dates to the form anyway.
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Edit Post</h1>
      <PostForm post={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        published: post.published,
      }} />
    </div>
  );
}
