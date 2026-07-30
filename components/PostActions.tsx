'use client';

import { togglePublishAction, deletePostAction } from '@/app/actions/postActions';

export default function PostActions({ id, published }: { id: string; published: boolean }) {
  const handleToggle = async () => {
    await togglePublishAction(id);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deletePostAction(id);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={handleToggle}
        className="text-xs px-3 py-1.5 border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 transition-colors font-medium"
      >
        {published ? 'Unpublish' : 'Publish'}
      </button>
      <button 
        onClick={handleDelete}
        className="text-xs px-3 py-1.5 border border-red-200 rounded-md text-red-600 hover:bg-red-50 transition-colors font-medium"
      >
        Delete
      </button>
    </div>
  );
}
