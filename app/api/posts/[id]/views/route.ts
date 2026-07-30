import { NextRequest, NextResponse } from 'next/server';
import { incrementViews } from '@/lib/services/postService';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const post = await incrementViews(id);
    return NextResponse.json({ views: post.views });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 });
  }
}
