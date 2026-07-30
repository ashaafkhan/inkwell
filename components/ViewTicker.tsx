'use client';

import { useEffect } from 'react';

export default function ViewTicker({ postId }: { postId: string }) {
  useEffect(() => {
    fetch(`/api/posts/${postId}/views`, { method: 'PATCH' }).catch(console.error);
  }, [postId]);

  return null;
}
