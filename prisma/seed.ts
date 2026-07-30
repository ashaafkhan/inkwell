import { PrismaClient } from '../generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db'
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');
  
  // Clean existing data
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();

  // Create Posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Welcome to InkWell',
      slug: 'welcome-to-inkwell',
      excerpt: 'The first post on our new blogging platform.',
      content: 'This is the full content of the first post. Welcome to InkWell! We hope you enjoy reading our content.',
      category: 'announcements',
      published: true,
      authorName: 'Admin',
      views: 15,
      comments: {
        create: [
          { name: 'Alice', content: 'Great first post!' },
          { name: 'Bob', content: 'Looking forward to more.' },
        ]
      }
    }
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Understanding Next.js App Router',
      slug: 'understanding-nextjs-app-router',
      excerpt: 'A deep dive into the new App Router in Next.js.',
      content: 'The App Router introduces a new paradigm for building applications...',
      category: 'tech',
      published: true,
      authorName: 'Admin',
      views: 42,
      comments: {
        create: [
          { name: 'Charlie', content: 'Very helpful, thanks!' }
        ]
      }
    }
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'Why we chose Tailwind CSS',
      slug: 'why-tailwind-css',
      excerpt: 'Exploring the benefits of utility-first CSS.',
      content: 'Tailwind CSS allows us to build designs faster and more consistently...',
      category: 'tech',
      published: true,
      authorName: 'Admin',
      views: 8
    }
  });

  const post4 = await prisma.post.create({
    data: {
      title: 'Draft: Future features',
      slug: 'draft-future-features',
      excerpt: 'A sneak peek into what we are building next.',
      content: 'We are planning to add user authentication and more...',
      category: 'announcements',
      published: false,
      authorName: 'Admin',
      views: 0
    }
  });

  const post5 = await prisma.post.create({
    data: {
      title: 'Draft: Prisma ORM best practices',
      slug: 'draft-prisma-orm',
      excerpt: 'How to use Prisma effectively in a Next.js app.',
      content: 'Prisma provides a great developer experience. Here is how we use it...',
      category: 'tech',
      published: false,
      authorName: 'Admin',
      views: 0
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
  });
