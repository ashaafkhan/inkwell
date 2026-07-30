'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import SearchBox from '@/components/SearchBox';

type Post = {
  id: string;
  title: string;
  published: boolean;
  createdAt: string;
  views: number;
};

export default function DashboardPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async (searchQuery: string = '') => {
    setLoading(true);
    try {
      const url = searchQuery ? `/api/posts?search=${encodeURIComponent(searchQuery)}` : '/api/posts';
      const res = await fetch(url);
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">Manage Posts</h1>
        <Link href="/dashboard/posts/new" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm">
          Write New Post
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <SearchBox onSearch={fetchPosts} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm min-h-[300px]">
        {loading ? (
          <div className="p-12 text-center text-slate-500 animate-pulse">Loading posts...</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {posts.map((post) => (
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
                  <p className="text-sm text-slate-500">
                    Created on {new Date(post.createdAt).toLocaleDateString()} &bull; {post.views} views
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link href={`/dashboard/posts/${post.id}/edit`} className="text-sm px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 hover:text-blue-600 transition-colors sm:opacity-0 group-hover:opacity-100 focus:opacity-100">
                    Edit
                  </Link>
                </div>
              </li>
            ))}
            {posts.length === 0 && (
              <li className="p-12 text-center text-slate-500 flex flex-col items-center">
                <span className="text-3xl mb-3">🔍</span>
                <p>No posts matched your search.</p>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
