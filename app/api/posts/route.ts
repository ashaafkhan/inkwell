import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, createPost } from '@/lib/services/postService';
import { postInputSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search') || undefined;
  
  const publishedStr = searchParams.get('published');
  const published = publishedStr ? publishedStr === 'true' : undefined;

  try {
    const posts = await getAllPosts({ published, search });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = postInputSchema.parse(body);
    
    const post = await createPost({
      ...validatedData,
      authorName: 'Admin',
      authorEmail: 'admin@inkwell.com'
    });
    
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
