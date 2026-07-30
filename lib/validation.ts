import { z } from 'zod';

export const postInputSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().min(10),
  content: z.string().min(20),
  category: z.string().default('general'),
  published: z.boolean().optional().default(false),
});
