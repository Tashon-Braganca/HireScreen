# HireScreen Architecture Documentation

## 1. Project Overview

**HireScreen** is an AI-powered resume screening SaaS application designed to help recruiters screen candidates 10x faster. Instead of reading resumes line-by-line, recruiters upload a stack of resumes and ask natural language questions (e.g., "Who has 5+ years of React experience in SF?"). The system uses RAG (Retrieval Augmented Generation) to analyze the resumes and provide ranked, cited answers.

### Key Technology Stack

- **Frontend Framework:** Next.js 14.2.35 (App Router, Server Components)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 3.4.1 + `tailwindcss-animate` for animations
- **UI Component Library:** Radix UI primitives via shadcn/ui pattern
- **Authentication:** Supabase Auth (@supabase/ssr) with OAuth (Google) and Email/Password
- **Database:** Supabase PostgreSQL with `pgvector` extension for semantic search
- **AI/LLM:** 
  - **Chat:** OpenAI `gpt-4o-mini`
  - **Embeddings:** OpenAI `text-embedding-3-small`
- **PDF Processing:** `pdf-parse` (server-side parsing)
- **Payment Processing:** LemonSqueezy (Subscriptions & Webhooks)
- **State Management:** React Server Components + React Hooks (Client)
- **Form Handling:** React Hook Form + Zod validation
- **Deployment:** Vercel

---

## 2. Directory Structure & Organization

The project follows a standard Next.js App Router structure with feature-based colocation where appropriate.

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication Route Group (Public/Auth-only)
│   │   ├── login/                # Login page
│   │   ├── signup/               # Signup page
│   │   ├── callback/             # OAuth callback handler
│   │   └── layout.tsx            # Auth-specific layout (centered cards)
│   ├── (dashboard)/              # Dashboard Route Group (Protected)
│   │   ├── dashboard/            # Main overview
│   │   ├── jobs/                 # Job management
│   │   │   └── [id]/             # Single job view (Upload/Query/History tabs)
│   │   ├── settings/             # User settings
│   │   └── layout.tsx            # Dashboard sidebar/nav layout
│   ├── api/                      # API Routes (Serverless Functions)
│   │   ├── account/              # User account management
│   │   ├── billing/              # LemonSqueezy checkout
│   │   ├── jobs/                 # Job CRUD & document management
│   │   └── webhooks/             # External webhooks (LemonSqueezy)
│   ├── page.tsx                  # Public Landing Page
│   └── layout.tsx                # Root layout (Fonts, Providers, Toaster)
├── components/
│   ├── ui/                       # Reusable UI components (Button, Input, Card, etc.)
│   ├── landing/                  # Landing page specific components (Animations)
│   ├── layout/                   # Layout components (Sidebar, Navbar)
│   ├── jobs/                     # Job-related components (Card, List, Header)
│   ├── upload/                   # File upload components (Dropzone, Progress)
│   ├── query/                    # Chat/Query interface components
│   └── settings/                 # Settings forms
├── lib/
│   ├── supabase/                 # Supabase configuration
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server component client (Cookie handling)
│   │   └── middleware.ts         # Session refresh logic
│   ├── openai/                   # AI wrappers
│   │   ├── chat.ts               # RAG generation logic
│   │   └── embeddings.ts         # Vector generation logic
│   ├── pdf/                      # PDF processing utilities
│   │   └── chunking.ts           # Text cleaning and chunking algorithms
│   └── lemonsqueezy/             # Billing configuration
├── hooks/                        # Custom React hooks
├── types/                        # Global TypeScript definitions
└── middleware.ts                 # Edge middleware for route protection
```

---

## 3. Database Schema (Supabase PostgreSQL)

The database utilizes relational data for user management and vector data for AI features.

### 3.1 `profiles`
Extends the default Supabase `auth.users` table.
- `id` (uuid, PK): References `auth.users.id`
- `email` (text): User email
- `full_name` (text): Display name
- `avatar_url` (text): Profile picture
- `subscription_status` (text): 'free', 'pro', or 'cancelled'
- `subscription_id` (text): External LemonSqueezy ID
- `queries_used` (int): Monthly usage counter
- `jobs_created` (int): Usage counter
- `created_at` (timestamptz)

### 3.2 `jobs`
Represents a "folder" or "requisition" containing resumes.
- `id` (uuid, PK)
- `user_id` (uuid, FK): Owner
- `title` (text): Job title (e.g., "Senior Frontend Dev")
- `description` (text): Optional description
- `status` (text): 'active', 'archived'
- `resume_count` (int): Cached count of resumes
- `created_at` (timestamptz)

### 3.3 `documents`
Represents a single uploaded PDF resume.
- `id` (uuid, PK)
- `job_id` (uuid, FK): Parent job
- `user_id` (uuid, FK): Owner
- `filename` (text): Original filename
- `file_size` (int): In bytes
- `page_count` (int)
- `text_content` (text): First 10k chars (for quick preview, not search)
- `status` (text): 'processing', 'ready', 'failed'
- `created_at` (timestamptz)

### 3.4 `document_chunks`
Stores text segments and their vector embeddings for RAG.
- `id` (uuid, PK)
- `document_id` (uuid, FK): Parent document
- `job_id` (uuid, FK): Parent job (for faster filtering)
- `chunk_index` (int): Order in document
- `content` (text): The actual text segment (~500 tokens)
- `page_number` (int): Page where text was found
- `embedding` (vector(1536)): OpenAI generated vector

### 3.5 `queries`
Stores history of user questions and AI answers.
- `id` (uuid, PK)
- `job_id` (uuid, FK)
- `user_id` (uuid, FK)
- `question` (text)
- `answer` (text)
- `sources` (jsonb): Array of citations used
- `tokens_used` (int)
- `created_at` (timestamptz)

---

## 4. Authentication & Security Flow

### Authentication Strategies
1. **Google OAuth 2.0:**
   - Provider: Google
   - Flow: PKCE flow via `@supabase/ssr`
   - Scopes: `email`, `profile`, `openid`
   - Callbacks handled at `/callback` route
2. **Email/Password:**
   - Standard Supabase Auth
   - Requires email confirmation (configured in Supabase)

### Session Management
- **Mechanism:** HTTP-only Cookies (`sb-access-token`, `sb-refresh-token`)
- **Middleware (`middleware.ts`):** 
  - Runs on every request
  - Refreshes expired sessions using the refresh token
  - Updates cookies in the response
- **Route Protection:**
  - Public: `/`, `/login`, `/signup`, `/api/webhooks/*`
  - Protected: `/dashboard/*`, `/jobs/*`, `/settings/*`, `/api/jobs/*`
  - Redirects unauthenticated users to `/login`
  - Redirects authenticated users accessing auth pages to `/dashboard`

### RLS (Row Level Security)
Every table has RLS enabled.
- **Users:** Can only select/insert/update/delete their own rows (`auth.uid() = user_id`)
- **Service Role:** The API uses a service role client (`createAdminClient`) for background tasks like document processing that need to bypass RLS restrictions temporarily.

---

## 5. RAG (Retrieval Augmented Generation) Pipeline

This is the core "AI" logic of the application.

### Phase 1: Ingestion (Upload)
**Endpoint:** `POST /api/jobs/[id]/upload`
1. **Validation:** Check file type (PDF), size (<10MB), and user subscription limits.
2. **Record Creation:** Create `documents` row with status `processing`.
3. **Async Processing:** 
   - **Parse:** Extract text using `pdf-parse`.
   - **Clean:** Remove excessive whitespace, non-printable chars.
   - **Chunk:** Split text into segments of ~500 tokens with 100 token overlap to preserve context across boundaries.
   - **Embed:** Send chunks to OpenAI API (`text-embedding-3-small`) to get 1536-dimensional vectors.
   - **Store:** Batch insert chunks into `document_chunks` table using `pgvector`.
   - **Update:** Set document status to `ready`.

### Phase 2: Retrieval & Generation (Query)
**Endpoint:** `POST /api/jobs/[id]/query`
1. **Embed Query:** Convert user question into a vector using OpenAI.
2. **Vector Search:** Call Supabase RPC function `match_document_chunks`.
   - Performs cosine similarity search (`<=>` operator).
   - Filters by `job_id` to only search relevant resumes.
   - Returns top 10 most similar chunks (Threshold > 0.5).
3. **Context Assembly:** Format chunks into a prompt context:
   ```text
   [Document: Resume_A.pdf, Page 1]
   ...text content...
   ```
4. **LLM Generation:** Call OpenAI Chat API (`gpt-4o-mini`).
   - System Prompt: Instructions to act as a recruiter, cite sources, and be factual.
   - User Prompt: Context + Question.
5. **Response:** Return streamed or complete answer to UI and save to `queries` table.

---

## 6. Billing Integration (LemonSqueezy)

- **Model:** SaaS Subscription (Monthly)
- **Tiers:** Free vs. Pro
- **Flow:**
  1. User clicks "Upgrade" in Settings/Dashboard.
  2. `POST /api/billing/checkout` creates a checkout session.
  3. User completes payment on LemonSqueezy hosted page.
  4. Webhook hits `/api/webhooks/lemonsqueezy`.
  5. Server validates signature and updates `profiles` table (`subscription_status`, `subscription_id`).
