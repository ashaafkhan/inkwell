import { prisma } from '@/lib/prisma';
import { Prisma } from '../../generated/prisma/client';

export async function getAllPosts(params?: { published?: boolean; search?: string }) {
  const where: Prisma.PostWhereInput = {};
  
  if (params?.published !== undefined) {
    where.published = params.published;
  }
  
  if (params?.search) {
    where.OR = [
      { title: { contains: params.search } },
      { excerpt: { contains: params.search } }
    ];
  }

  return prisma.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
  });
}

export async function getDashboardStats() {
  const [totalPosts, publishedCount, draftCount, totalViews, totalComments, recentPosts] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.post.count({ where: { published: false } }),
    prisma.post.aggregate({ _sum: { views: true } }).then(res => res._sum.views || 0),
    prisma.comment.count(),
    prisma.post.findMany({ orderBy: { updatedAt: 'desc' }, take: 5 })
  ]);

  return {
    totalPosts,
    publishedCount,
    draftCount,
    totalViews,
    totalComments,
    recentPosts,
  };
}
