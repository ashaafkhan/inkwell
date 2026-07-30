'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createPost, updatePost, deletePost, togglePublish } from '@/lib/services/postService';
import { postInputSchema } from '@/lib/validation';

export async function createPostAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = postInputSchema.parse({
    ...data,
    published: data.published === 'on',
  });

  const post = await createPost({
    ...parsed,
    authorName: 'Admin',
    authorEmail: 'admin@inkwell.com',
  });

  revalidatePath('/');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/posts');
  redirect('/dashboard/posts');
}

export async function updatePostAction(id: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = postInputSchema.parse({
    ...data,
    published: data.published === 'on',
  });

  await updatePost(id, parsed);

  revalidatePath('/');
  revalidatePath(`/posts/${parsed.slug}`);
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/posts');
  redirect('/dashboard/posts');
}

export async function togglePublishAction(id: string) {
  await togglePublish(id);
  
  revalidatePath('/');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/posts');
}

export async function deletePostAction(id: string) {
  await deletePost(id);

  revalidatePath('/');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/posts');
}
