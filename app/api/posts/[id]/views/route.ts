import { NextRequest, NextResponse } from 'next/server';
import { incrementViews } from '@/lib/services/postService';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await incrementViews(params.id);
    return NextResponse.json({ views: post.views });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 });
  }
}
