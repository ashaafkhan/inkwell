# InkWell 🖋️

InkWell is a simple, elegant blogging platform built with the Next.js App Router, Prisma ORM, and Tailwind CSS. It serves as a comprehensive demonstration of modern web development concepts, including various rendering strategies, Server Actions, and RESTful API routes.

## 🚀 Tech Stack

- **Framework:** [Next.js 14/15 (App Router)](https://nextjs.org/)
- **Database ORM:** [Prisma v7](https://www.prisma.io/)
- **Database:** SQLite (Local Dev) / PostgreSQL (Production)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Validation:** [Zod](https://zod.dev/)

## 🏗️ Architecture & Rendering Strategies

InkWell explicitly leverages the power of Next.js by employing three distinct rendering strategies tailored to specific use cases:

1. **SSG (Static Site Generation)**: 
   - Used for the `/` (Home) and `/about` pages. 
   - **Why?** These pages change infrequently and require maximum load speed and SEO performance. They are rendered once at build time.

2. **ISR (Incremental Static Regeneration)**:
   - Used for the `/posts/[slug]` (Post Detail) pages.
   - **Why?** We want the speed of static pages, but blog posts might be updated (e.g., fixing typos) or accumulate views. Setting `revalidate = 60` ensures the cache is refreshed automatically in the background without needing a full site rebuild.

3. **SSR (Server-Side Rendering)**:
   - Used for the `/dashboard` (Admin) pages.
   - **Why?** The dashboard contains highly dynamic data (stats, unread comments, drafts). By enforcing `dynamic = 'force-dynamic'`, we guarantee the admin always sees the live state of the database on every single request.

## ⚡ Data Mutations

InkWell demonstrates two approaches to data mutation:

- **Server Actions:** Secure, server-side functions used internally by the Dashboard (e.g., creating/editing posts, toggling publish status, deleting posts). This eliminates the need for manual API endpoints for internal admin operations and seamlessly integrates with `revalidatePath` to purge the Next.js cache.
- **REST API Routes:** A fully standalone API under `/api/posts` for external integrations. It is also utilized by the Dashboard's client-side `<SearchBox />` for real-time filtering, and by the public `<ViewTicker />` to increment page views anonymously.

## 💻 Running Locally

### 1. Clone & Install
```bash
git clone https://github.com/ashaafkhan/inkwell.git
cd inkwell
npm install
```

### 2. Set up the Database
The project comes pre-configured with SQLite for development.
```bash
# Push the schema to your local SQLite dev.db
npx prisma db push

# (Optional) Seed the database with sample data
npm run db:seed
```

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## ☁️ Deployment

To deploy this project to production (e.g., Vercel), you must switch the database provider from SQLite to PostgreSQL. Please refer to the deployment guide provided in the project artifacts for detailed instructions.
