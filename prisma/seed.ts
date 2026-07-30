import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');
  
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});

  const post1 = await prisma.post.create({
    data: {
      title: 'Welcome to InkWell',
      slug: 'welcome-to-inkwell',
      excerpt: 'The first post on our new blogging platform.',
      content: 'This is the full content of our very first post. InkWell is built with Next.js App Router and Prisma.',
      published: true,
      category: 'Announcements',
      authorName: 'Admin',
      comments: {
        create: [
          {
            name: 'First Reader',
            content: 'Great first post!',
          }
        ]
      }
    }
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Draft Post: Upcoming Features',
      slug: 'draft-upcoming-features',
      excerpt: 'A sneak peek at what is coming next.',
      content: 'We are working on adding Server Actions and an admin dashboard.',
      published: false,
      category: 'Product',
      authorName: 'Admin',
    }
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
