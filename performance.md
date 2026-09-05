# Role & Context
You are a Principal Software Engineer specializing in Next.js 16, React 19, and Supabase performance optimization. You are refactoring the "RHTacademy" dashboard (Student & Admin) to eliminate high TTFB (Time to First Byte) and laggy section-switching caused by blocking Server Components (RSC) and redundant database/auth fetching.

# Tech Stack
- Framework: Next.js 16 (App Router, `src/app`)
- UI Framework: React 19, Tailwind CSS
- Database & Auth: `@supabase/ssr`, PostgreSQL

# Objective
Refactor the entire dashboard routing and data-fetching architecture to achieve instant section transitions (<50ms TTFB) using React 19 Suspense streaming, optimized Supabase queries, and non-blocking layout architecture.

---

# Tasks & Refactoring Directives

### 1. Refactor Blocking Page-Level RSCs to Suspense Streaming
- Remove top-level `await` calls for data fetching inside `page.tsx` files.
- Convert `page.tsx` into an immediate UI shell containing layout structures, titles, and skeleton placeholders wrapped in `<Suspense>`.
- Decompose dashboard sections into granular, Async Server Components (placed inside `_components/` directory).
- Wrap each asynchronous component in a `<Suspense fallback={<SkeletonLoader />}>` boundary so the initial page shell renders immediately while data streams in parallel.

### 2. Optimize `@supabase/ssr` & Auth Overhead
- Audit redundant `supabase.auth.getUser()` calls in child components. Since route guards exist in `middleware.ts`, avoid blocking multiple RSCs with redundant network-based session verifications.
- Optimize database queries: Replace all `select('*')` with explicitly selected fields required by the UI.
- Ensure all parallel data dependencies inside async sub-components use `Promise.all` rather than sequential `await` statements.
- Implement pagination or limit offsets for list views (e.g., student lists, course logs).

### 3. Client Navigation & Prefetching
- Ensure all dashboard navigation links (Sidebar, Header tabs) utilize Next.js `<Link>` with `prefetch={true}` (or `router.prefetch()`) to pre-render route payloads on hover/idle.
- Ensure layout structures (`src/app/dashboard/layout.tsx`) maintain persistent state and do not unmount or flicker during route transitions.

### 4. Database Policy & RLS Audit Guidelines
- Identify slow RLS policies and recommend optimized SQL updates (e.g., wrapping `auth.uid()` as `(SELECT auth.uid())` to prevent row-by-row re-evaluation).
- List recommended Postgres Indexes for frequently queried foreign key fields (`student_id`, `course_id`, `created_at`).

---

# Execution Requirements
1. Refactor incrementally, starting with the heaviest dashboard route (e.g., Admin Dashboard / Student Dashboard).
2. Maintain strict TypeScript typing (`strict: true`) and existing Tailwind CSS designs.
3. Do not break existing Supabase client integrations or route middleware rules.
4. Provide clean, well-commented code blocks and explain key performance improvements made in each refactored file.