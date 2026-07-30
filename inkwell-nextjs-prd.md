# InkWell — Full-Stack Blog & Admin Dashboard
### Product Requirements Document (Staged Build Plan)

**Purpose:** This is a single, opinionated build path — not a menu of options. Follow the stages in order. By the end you will have covered every concept on the syllabus: file-based routing, layouts, SSR, SSG, ISR, API routes (GET/POST/PUT/PATCH/DELETE), database integration, and Server Actions — with a clear, explainable reason for every choice.

---

## 1. Project Idea (locked in)

**InkWell** is a small blogging platform with two halves:

- **Public site** — visitors read published posts and leave comments. No login needed.
- **Admin dashboard** — the "author" creates, edits, publishes/unpublishes, and deletes posts, and moderates comments.

This is deliberately small in scope but touches every required concept naturally:

| Concept | Where it lives |
|---|---|
| SSG | `/about` (pure static) and `/` home listing |
| ISR | `/posts/[slug]` post detail page |
| SSR | `/dashboard` admin overview |
| API Routes (GET/POST/PUT/PATCH/DELETE) | `/api/posts`, `/api/posts/[id]`, `/api/posts/[id]/views` |
| Server Actions | Dashboard mutations (create/update/delete/publish post) + public comment form |
| Database | Prisma + SQLite (dev) / Postgres (prod) |
| Layouts | Root layout (public nav) + nested dashboard layout (sidebar) |

---

## 2. Tech Stack (fixed)

- **Next.js 14+ App Router** with TypeScript
- **Prisma ORM** — SQLite locally (`file:./dev.db`), Postgres (Neon or Supabase) in production
- **Zod** for validation (shared between API routes and Server Actions)
- **Tailwind CSS** for styling (fast, keeps focus on Next.js concepts not CSS)
- **Vercel** for deployment

Why SQLite → Postgres: SQLite needs zero setup for local dev (no account, no network). Prisma's schema types used here (`String`, `Int`, `Boolean`, `DateTime`) are compatible with both providers, so switching the `datasource` block before deploying is a one-line change.

---

## 3. Data Model

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // change to "postgresql" for production, see Stage 6
  url      = env("DATABASE_URL")
}

model Post {
  id         String    @id @default(cuid())
  title      String
  slug       String    @unique
  excerpt    String
  content    String
  category   String    @default("general")
  published  Boolean   @default(false)
  views      Int       @default(0)
  authorName String    @default("Admin")
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  comments   Comment[]
}

model Comment {
  id        String   @id @default(cuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  name      String
  content   String
  createdAt DateTime @default(now())
}
```

That's it — two models. Small enough to fully understand, large enough to demonstrate real CRUD + relations.

---

## 4. Architecture Decision: API Routes vs Server Actions

This is the part most students get muddy — lock in this mental model and use it consistently:

- **Shared service layer** (`lib/services/postService.ts`, `lib/services/commentService.ts`) contains **all** database logic (Prisma calls). Nobody talks to Prisma directly except these files.
- **API Routes** (`app/api/**`) are a thin HTTP layer on top of the service layer. They exist so Posts data is available as a **standalone REST API** — testable with curl/Postman, independent of any UI, and reusable by any future client (mobile app, another frontend). They also power the one place we need **client-side fetching**: the live search box on the dashboard posts list, which needs to re-fetch as the admin types.
- **Server Actions** (`app/actions/**`) are a thin function-call layer on top of the *same* service layer. They exist for **mutations triggered directly from our own forms** — creating/editing/deleting a post in the dashboard, and submitting a public comment. No API contract, no client-side fetch/loading-state boilerplate, automatic cache revalidation via `revalidatePath`.

Because both layers call the same service functions, there's no duplicated business logic — just two different entry points, which is exactly the distinction the rubric wants you to be able to explain:

> "API routes expose Posts as a general-purpose REST resource for external/programmatic use. Server Actions handle mutations that originate from our own forms, where progressive enhancement and automatic revalidation matter more than a JSON contract."

---

## 5. Rendering Strategy Map (with reasoning)

| Page | Strategy | Why |
|---|---|---|
| `/about` | **SSG** | Pure static content, no data. Generated once at build, never changes. |
| `/` (home, post list) | **SSG** | Public listing doesn't need per-request freshness; built at build time. New posts appear after a redeploy — acceptable tradeoff for a mostly-static marketing/content page. Explicitly call this limitation out in the README. |
| `/posts/[slug]` | **ISR** (`revalidate = 60`) | Individual posts should reflect edits/new comments without a full rebuild. `generateStaticParams` pre-builds known published slugs; `dynamicParams` allows on-demand generation for new ones; background regeneration every 60s keeps content close to fresh. |
| `/dashboard` (and sub-pages) | **SSR** (`dynamic = 'force-dynamic'`) | Admin needs live, per-request-accurate data (counts, recent activity, current publish state) — caching here would show stale/wrong info to the person managing content. |

View counts are **not** incremented during the ISR page render (that would fight the cache). Instead, the post page's client component calls `PATCH /api/posts/[id]/views` after mount — a genuine reason an API route is the right tool even on a cached page.

---

## 6. Folder Structure (target, end state)

```
inkwell/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── lib/
│   ├── prisma.ts              # Prisma client singleton
│   ├── validation.ts          # Zod schemas (shared)
│   └── services/
│       ├── postService.ts
│       └── commentService.ts
├── app/
│   ├── layout.tsx              # root layout (public nav/footer)
│   ├── page.tsx                 # Home (SSG)
│   ├── about/page.tsx            # About (SSG)
│   ├── posts/[slug]/
│   │   ├── page.tsx               # Post detail (ISR)
│   │   ├── loading.tsx
│   │   └── not-found.tsx
│   ├── actions/
│   │   ├── postActions.ts        # 'use server'
│   │   └── commentActions.ts     # 'use server'
│   ├── dashboard/
│   │   ├── layout.tsx              # nested layout, sidebar nav
│   │   ├── page.tsx                 # Overview (SSR)
│   │   ├── posts/
│   │   │   ├── page.tsx              # list + search (SSR + client search)
│   │   │   ├── new/page.tsx           # create form (Server Action)
│   │   │   └── [id]/edit/page.tsx      # edit form (Server Action)
│   │   └── comments/page.tsx          # moderation list
│   └── api/
│       └── posts/
│           ├── route.ts               # GET, POST
│           └── [id]/
│               ├── route.ts            # GET, PUT, DELETE
│               └── views/route.ts       # PATCH
├── components/
│   ├── PostCard.tsx
│   ├── CommentForm.tsx
│   ├── DashboardSidebar.tsx
│   └── SearchBox.tsx (client component)
├── .env.example
└── README.md
```

---

## 7. Stage 1 — Project Setup & Database Foundation

**Goal:** A running Next.js app with the database wired up and a Prisma client that the rest of the app can import.

**Tasks:**
1. `npx create-next-app@latest inkwell --typescript --tailwind --app`
2. Install deps: `npm install prisma @prisma/client zod` and `npm install -D prisma`
3. `npx prisma init --datasource-provider sqlite`
4. Paste the schema from Section 3 into `prisma/schema.prisma`
5. Create `.env` with `DATABASE_URL="file:./dev.db"`, and `.env.example` with the same key but no secret value
6. `npx prisma migrate dev --name init`
7. Create `lib/prisma.ts`:
```ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```
(The global caching pattern avoids exhausting connections from Next.js hot-reloading in dev.)

8. Create `prisma/seed.ts` with 4–5 sample posts (mix of published/unpublished) and 2–3 comments, wire it into `package.json`:
```json
"prisma": { "seed": "ts-node prisma/seed.ts" }
```
9. Run `npx prisma db seed`

**Definition of done:** `npx prisma studio` shows real seeded data in `Post` and `Comment` tables.

---

## 8. Stage 2 — Routing & Layouts

**Goal:** Every route in the folder structure exists (can be placeholder content), with correct nested layouts.

**Tasks:**
1. Root layout (`app/layout.tsx`): global `<html>`/`<body>`, top nav (Home / About), footer.
2. `/about/page.tsx`: hand-written static content about the blog. No data fetching at all — this is your purest SSG example.
3. `/page.tsx` (Home): placeholder for now — will wire to Prisma in Stage 3.
4. `/posts/[slug]/page.tsx`: placeholder.
5. **Dashboard nested layout** (`app/dashboard/layout.tsx`): wraps all `/dashboard/*` routes with a sidebar (links: Overview, Posts, Comments). This demonstrates layouts nesting inside the root layout — the sidebar persists across dashboard sub-navigation without re-rendering the root nav.
6. Create placeholder pages for `/dashboard`, `/dashboard/posts`, `/dashboard/posts/new`, `/dashboard/posts/[id]/edit`, `/dashboard/comments`.

**Definition of done:** You can click through every route in the browser; dashboard pages visibly share a sidebar that the public pages don't have.

---

## 9. Stage 3 — Rendering Strategies (SSG / ISR / SSR)

**Goal:** Real data flowing through each page with the rendering strategy explicitly declared and justified in code.

**9.1 Home page — SSG**
```tsx
// app/page.tsx
import { getAllPosts } from '@/lib/services/postService';
import PostCard from '@/components/PostCard';

export default async function HomePage() {
  const posts = await getAllPosts({ published: true });
  return (
    <main>
      <h1>InkWell</h1>
      <div className="grid gap-4">
        {posts.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
    </main>
  );
}
```
No `dynamic` or `revalidate` export → Next.js statically renders this at build time by default.

**9.2 Post detail — ISR**
```tsx
// app/posts/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/services/postService';

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getAllPosts({ published: true });
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post || !post.published) notFound();
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {/* view-count ticker + comment form added in later stages */}
    </article>
  );
}
```

**9.3 Dashboard overview — SSR**
```tsx
// app/dashboard/page.tsx
import { getDashboardStats } from '@/lib/services/postService';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const stats = await getDashboardStats(); // totals, recent posts, recent comments
  return ( /* stats cards */ );
}
```

Add a `lib/services/postService.ts` function `getDashboardStats()` that returns total posts, published count, draft count, total views, total comments, and the 5 most recently updated posts.

**Definition of done:** You can articulate, out loud, why each of the three pages uses its strategy — you'll need this for evaluation.

---

## 10. Stage 4 — API Routes (REST layer for Posts)

**Goal:** A fully working, independently testable REST API for the Posts resource, with structured responses and proper status codes.

**Response contract (use everywhere):**
```ts
// success
{ success: true, data: T }
// error
{ success: false, error: { message: string, code: string, details?: unknown } }
```

**10.1 `lib/validation.ts`**
```ts
import { z } from 'zod';

export const postInputSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().min(10),
  content: z.string().min(20),
  category: z.string().default('general'),
  published: z.boolean().optional().default(false),
});
```

**10.2 `app/api/posts/route.ts`** — GET (list, `?search=`, `?published=`) + POST (create)
```ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, createPost } from '@/lib/services/postService';
import { postInputSchema } from '@/lib/validation';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') ?? undefined;
    const publishedParam = searchParams.get('published');
    const posts = await getAllPosts({
      search,
      published: publishedParam === null ? undefined : publishedParam === 'true',
    });
    return NextResponse.json({ success: true, data: posts });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch posts', code: 'FETCH_FAILED' } },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = postInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid input', code: 'VALIDATION_ERROR', details: parsed.error.flatten() } },
        { status: 400 },
      );
    }
    const post = await createPost(parsed.data);
    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to create post', code: 'CREATE_FAILED' } },
      { status: 500 },
    );
  }
}
```

**10.3 `app/api/posts/[id]/route.ts`** — GET (single, 404 if missing), PUT (full update), DELETE

**10.4 `app/api/posts/[id]/views/route.ts`** — PATCH (partial update: increments `views` by 1). This is your explicit **PATCH vs PUT** example: PUT replaces the whole post, PATCH here only bumps one field.

**10.5 Wire it into the UI (the one legitimate client-fetch case):**
Build `components/SearchBox.tsx` as a **client component** used on `/dashboard/posts` — as the admin types, it debounces and calls `fetch('/api/posts?search=...')` to re-render the filtered list. This is the concrete reason the API route needs to exist beyond just being "testable": a client component genuinely needs it.

Also, on `/posts/[slug]/page.tsx`, add a small client component `<ViewTicker postId={post.id} />` that calls `PATCH /api/posts/[id]/views` once on mount using `fetch`.

**Definition of done:** Every endpoint testable via curl/Postman with correct status codes: 200, 201, 400 (bad body), 404 (missing id), 500 (forced error).

---

## 11. Stage 5 — Server Actions

**Goal:** All dashboard mutations and the public comment form go through Server Actions, not the API.

**11.1 `app/actions/postActions.ts`**
```ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createPost, updatePost, deletePost, togglePublish } from '@/lib/services/postService';
import { postInputSchema } from '@/lib/validation';

export async function createPostAction(formData: FormData) {
  const parsed = postInputSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    category: formData.get('category'),
    published: formData.get('published') === 'on',
  });
  if (!parsed.success) throw new Error('Invalid post data');

  const post = await createPost(parsed.data);
  revalidatePath('/');
  revalidatePath('/dashboard');
  redirect(`/posts/${post.slug}`);
}

export async function updatePostAction(id: string, formData: FormData) {
  /* same validation shape, then updatePost(id, data) */
  revalidatePath('/');
  revalidatePath('/dashboard');
}

export async function deletePostAction(id: string, slug: string) {
  await deletePost(id);
  revalidatePath('/');
  revalidatePath('/dashboard');
  revalidatePath(`/posts/${slug}`);
}

export async function togglePublishAction(id: string) {
  await togglePublish(id);
  revalidatePath('/');
  revalidatePath('/dashboard');
}
```

**11.2 `app/actions/commentActions.ts`**
```ts
'use server';

import { revalidatePath } from 'next/cache';
import { addComment } from '@/lib/services/commentService';

export async function addCommentAction(postId: string, slug: string, formData: FormData) {
  const name = formData.get('name');
  const content = formData.get('content');
  if (!name || !content) throw new Error('Name and comment are required');

  await addComment({ postId, name: String(name), content: String(content) });
  revalidatePath(`/posts/${slug}`);
}
```

**11.3 Wire into forms**
```tsx
// app/dashboard/posts/new/page.tsx
import { createPostAction } from '@/app/actions/postActions';

export default function NewPostPage() {
  return (
    <form action={createPostAction}>
      <input name="title" required />
      <input name="slug" required />
      <textarea name="excerpt" required />
      <textarea name="content" required />
      <input name="category" />
      <label><input type="checkbox" name="published" /> Publish now</label>
      <button type="submit">Create Post</button>
    </form>
  );
}
```

```tsx
// on the post detail page — comment form, bound with the postId/slug
import { addCommentAction } from '@/app/actions/commentActions';
const boundAction = addCommentAction.bind(null, post.id, post.slug);
// <form action={boundAction}> name / content inputs </form>
```

For delete/toggle-publish buttons in the dashboard posts list, use a small inline `<form action={deletePostAction.bind(null, post.id, post.slug)}>` with a single submit button — no client JS required.

**Why this is the "meaningful use case" the rubric wants:** the comment form works even with JavaScript disabled (progressive enhancement), and every dashboard mutation automatically refreshes the exact cached pages it affects via `revalidatePath` — no manual client-side refetch logic anywhere.

**Definition of done:** Creating, editing, publishing/unpublishing, and deleting a post from the dashboard immediately reflects on the public site (home + post page) without a manual refresh trick; submitting a comment appears on the post page instantly.

---

## 12. Stage 6 — Validation, Error Handling, Polish, Deployment, Docs

**Tasks:**

1. **Error/loading/not-found UI:**
   - `app/posts/[slug]/loading.tsx` (skeleton)
   - `app/posts/[slug]/not-found.tsx` (custom "Post not found")
   - Root `app/error.tsx` for uncaught errors
2. **Validation everywhere:** reuse `postInputSchema` in both API routes and Server Actions (already done above if you followed Stage 4/5 — double check no duplicate schema logic exists).
3. **Empty states:** "No posts yet" on home if list is empty; "No comments yet" on post page.
4. **Seed data check:** reseed and click through the whole app once, end to end.
5. **Switch to Postgres for deployment:**
   - Create a free Neon or Supabase Postgres database.
   - In `schema.prisma`, change `provider = "postgresql"`.
   - Set `DATABASE_URL` in Vercel project settings to the Postgres connection string.
   - Run `npx prisma migrate deploy` against production before first deploy.
6. **Deploy to Vercel**, confirm the live site works end to end (create a post, see it appear, comment on it).
7. **Write `.env.example`:**
```
DATABASE_URL="file:./dev.db"
```
8. **Write the README** (see Section 13 below for the exact outline expected by the assignment).

**Definition of done:** Fresh clone + `npm install` + `.env` from `.env.example` + `npx prisma migrate dev` + `npx prisma db seed` + `npm run dev` works with zero extra steps.

---

## 13. README Outline (copy this structure directly)

```
# InkWell

## Overview
2-3 sentences: what it is, who it's for.

## Tech Stack
Next.js (App Router), TypeScript, Prisma, SQLite/Postgres, Zod, Tailwind, Vercel.

## Features
- Public blog with search-free static listing
- Individual post pages with comments
- Admin dashboard: create/edit/publish/delete posts, moderate comments, live search

## Rendering Strategies
- SSG: `/`, `/about` — reasoning
- ISR: `/posts/[slug]`, revalidate=60 — reasoning
- SSR: `/dashboard/*`, force-dynamic — reasoning

## API Routes
Table: method, path, purpose, example curl.

## Server Actions
List each action, what form triggers it, what it revalidates.

## API Routes vs Server Actions
The 3-sentence explanation from Section 4 of this PRD, in your own words.

## Database Setup
Prisma schema summary, migrate + seed commands.

## Environment Variables
DATABASE_URL — explain both sqlite (dev) and postgres (prod) values.

## How to Run Locally
Exact numbered commands.

## Assumptions / Limitations
- No authentication on the dashboard (single-admin assumption)
- Home page requires redeploy to show brand-new posts (SSG tradeoff) — dashboard always shows the live list

## Live Deployment
Link.
```

---

## 14. Self-Check Against Evaluation Rubric

| Rubric section | Covered by |
|---|---|
| Project idea & completion | Section 1 |
| Routing & layouts | Stage 2 |
| Rendering strategies | Stage 3 |
| API routes | Stage 4 |
| Database integration | Stage 1 + service layer |
| Server Actions | Stage 5 |
| Code quality | Shared service layer, shared Zod schemas (Section 4) |
| README & docs | Stage 6, Section 13 |
| Deployment & demo | Stage 6 |
| Overall understanding | Section 4 — be ready to explain it out loud |

Build in this order: **1 → 2 → 3 → 4 → 5 → 6**. Don't skip ahead to Server Actions before the service layer (Stage 1) and rendering pages (Stage 3) exist — everything downstream depends on them.
