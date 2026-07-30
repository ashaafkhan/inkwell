'use client';

import { useState } from 'react';
import { createPostAction, updatePostAction } from '@/app/actions/postActions';
import Link from 'next/link';

type Post = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  published?: boolean;
};

export default function PostForm({ post }: { post?: Post }) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!post?.id;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      if (isEditing && post.id) {
        await updatePostAction(post.id, formData);
      } else {
        await createPostAction(formData);
      }
    } catch (error) {
      console.error('Failed to submit form', error);
      alert('An error occurred. Please check the console.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input type="text" name="title" id="title" defaultValue={post?.title} required 
                 className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
          <input type="text" name="slug" id="slug" defaultValue={post?.slug} required 
                 className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" 
                 pattern="^[a-z0-9-]+$" title="Only lowercase letters, numbers, and hyphens" />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <input type="text" name="category" id="category" defaultValue={post?.category || 'general'} required 
                 className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
          <textarea name="excerpt" id="excerpt" rows={2} defaultValue={post?.excerpt} required 
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"></textarea>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">Content</label>
          <textarea name="content" id="content" rows={10} defaultValue={post?.content} required 
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm"></textarea>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input type="checkbox" name="published" id="published" defaultChecked={post?.published} 
                 className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
          <label htmlFor="published" className="text-sm font-medium text-slate-700">Publish immediately</label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
        <Link href="/dashboard/posts" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
          Cancel
        </Link>
        <button type="submit" disabled={loading} 
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
          {loading && <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
          {isEditing ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  );
}
