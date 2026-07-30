# InkWell 🖋️

![Live Demo](https://img.shields.io/badge/Live_Demo-View_Site-success?style=for-the-badge&logo=vercel)

**Live URL:** [https://inkwell-xi-henna.vercel.app/](https://inkwell-xi-henna.vercel.app/)

InkWell is a sleek, modern, and high-performance blogging platform built with the Next.js App Router, Prisma ORM, and Tailwind CSS. It was designed from the ground up to serve as a comprehensive reference implementation of modern web development concepts, combining statically generated pages, server-side dynamic content, Server Actions, and RESTful APIs into a single, cohesive full-stack application.

---

## 🚀 Technology Stack

InkWell utilizes the modern web's most popular tooling to deliver a seamless developer and user experience:

- **Framework:** [Next.js 15+ (App Router)](https://nextjs.org/) for intuitive routing, server components, and native caching.
- **Database ORM:** [Prisma v7](https://www.prisma.io/) with full TypeScript type safety and the new Driver Adapters.
- **Database:** PostgreSQL (hosted on [Neon](https://neon.tech/)) for robust, serverless relational data storage.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) to build a fully responsive, custom design system without leaving the HTML.
- **Validation:** [Zod](https://zod.dev/) for strict, declarative input validation on both the client forms and server endpoints.
- **Deployment:** [Vercel](https://vercel.com/) for zero-config global edge delivery and continuous integration.

---

## 🏗️ Architecture & Rendering Strategies

InkWell explicitly leverages the granular caching power of Next.js by employing three distinct rendering strategies, each tailored to specific data-freshness requirements:

1. **SSG (Static Site Generation)** 
   - **Where:** Used for the `/` (Home) and `/about` pages. 
   - **Why:** These pages change infrequently. By fetching data at build time and serving it as static HTML through Vercel's CDN, we achieve instantaneous page loads, zero database overhead, and perfect SEO.

2. **ISR (Incremental Static Regeneration)**
   - **Where:** Used for the `/posts/[slug]` (Post Detail) pages.
   - **Why:** We want the incredible speed of a static page, but blog posts might be updated occasionally to fix typos, or continuously accumulate views. By exporting `revalidate = 60`, we instruct Next.js to serve the cached static page instantly to users, but silently rebuild the page in the background every 60 seconds if the data has changed.

3. **SSR (Server-Side Rendering)**
   - **Where:** Used for the `/dashboard` and all Admin management pages.
   - **Why:** The dashboard contains highly dynamic data—like exact view counts, draft statuses, and total posts. By explicitly setting `export const dynamic = 'force-dynamic'`, we bypass the cache entirely. This guarantees that admins always see the absolute latest, live state directly from the PostgreSQL database on every single page load.

---

## ⚡ Features & Data Flow

InkWell demonstrates two parallel approaches to data mutation, highlighting the flexibility of the App Router:

### 1. Server Actions (Admin Panel)
We utilize Next.js Server Actions to handle secure, server-side data mutations without the need to write manual API endpoints. 
- Creating, editing, publishing, and deleting posts is handled via `app/actions/postActions.ts`.
- These actions seamlessly integrate with `revalidatePath()`, which instantly purges the Next.js cache across the site as soon as a mutation occurs. This means when an admin publishes a post, it appears on the home page *immediately*, overriding the standard ISR cache limits.

### 2. REST API Routes (Client Integrations)
For external integrations or client-heavy features, we built a standalone API under `/api/posts`:
- **Real-time Filtering:** The dashboard features a client-side `<SearchBox />` that debounces user input and fetches real-time results from `GET /api/posts?search=...`.
- **View Tracking:** Public post pages contain an invisible, client-side `<ViewTicker />` component. When a reader loads a post, it silently hits `PATCH /api/posts/[id]/views` in the background to increment the view counter without blocking the static page load.

---

## 💻 Running Locally

To run InkWell on your own machine:

### 1. Clone & Install
```bash
git clone https://github.com/ashaafkhan/inkwell.git
cd inkwell
npm install
```

### 2. Set up your Environment
Create a `.env` file in the root of the project and add your PostgreSQL connection strings. 
```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
```

### 3. Migrate and Seed the Database
Push the Prisma schema to your database and run the seeder to populate dummy posts.
```bash
npx prisma generate
npx prisma migrate dev
npx tsx prisma/seed.ts
```

### 4. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the live site.
