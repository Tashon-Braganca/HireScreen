# HireScreen Implementation & Feature Plan

## 1. Feature Implementation Status (MVP)

The Minimum Viable Product (MVP) is fully implemented and deployment-ready.

### ✅ Authentication Module
- **Dual Auth Methods:** 
  - Google OAuth (One-click sign-in/up)
  - Email/Password (Traditional flow)
- **Security:**
  - Secure session management via HttpOnly cookies
  - Middleware-based route protection
  - RLS (Row Level Security) enforcement at database level
- **UX:**
  - Auto-redirects to dashboard if logged in
  - Friendly error handling for auth failures
  - Loading states during authentication

### ✅ Dashboard & Job Management
- **Job Creation:** Create "folders" for different hiring roles (e.g., "Product Manager", "React Dev").
- **Limit Enforcement:** 
  - Free Tier: Max 2 jobs
  - Pro Tier: Unlimited jobs
- **Visuals:** Usage statistics cards showing queries used vs. limit.

### ✅ Resume Processing Engine
- **Upload Interface:**
  - Drag-and-drop zone
  - Progress indicators
  - File type validation (PDF only)
  - Size validation (Max 10MB)
- **Processing Logic:**
  - Automatic PDF text extraction
  - Context-aware chunking (preserving sentence boundaries where possible)
  - Vector embedding generation
- **Status Tracking:** Real-time status updates (Processing → Ready/Failed)

### ✅ AI Query System (RAG)
- **Interface:** Chat-like interface for asking questions about the resume stack.
- **capabilities:**
  - Semantic search (finds "frontend" when searching for "React")
  - Cross-resume analysis (scans all PDFs in the job)
- **Citations:** Every claim in the answer cites the source document and page number.
- **History:** Saves past Q&A for reference.

### ✅ Landing Page
- **Hero Section:** High-conversion design with "Rolodex" and "Typewriter" animations.
- **Feature Breakdown:** Bento-grid style feature showcase.
- **Pricing Table:** Clear distinction between Free and Pro tiers.
- **Responsiveness:** Fully mobile-optimized layout.

---

## 2. Technical Scaling Considerations

While the MVP is robust for initial launch, the following areas are identified for scaling to 100k+ documents.

### Current Implementation (MVP)
- **Processing:** Synchronous/In-band. When a user uploads, the server processes the file in the request handler (or fires and forgets).
- **Limit:** Suitable for ~100 concurrent users or ~1000 total documents per day.

### Scale-Up Strategy (Post-MVP)

#### 1. Asynchronous Processing Queue
**Problem:** Large PDFs or batch uploads can timeout serverless functions (Vercel has 10s-60s limits).
**Solution:**
- Implement **Inngest** or **Trigger.dev**.
- Flow: Upload → Save to Storage → Return 202 Accepted → Queue Worker picks up file → Processes → Updates DB.
- Benefit: Can handle thousands of simultaneous uploads without timeouts.

#### 2. Batch Embedding
**Problem:** Calling OpenAI embedding API for every single chunk individually is slow and hits rate limits.
**Solution:**
- Group chunks into batches of 20-50 before sending to OpenAI.
- Benefit: Reduces API round-trips by 20x-50x.

#### 3. Storage Optimization
**Problem:** Storing full text in PostgreSQL (`documents` table) can bloat the database.
**Solution:**
- Move raw PDF storage to **Supabase Storage** (S3).
- Only store vectors and metadata in PostgreSQL.
- Benefit: Cheaper storage, faster database backups/queries.

#### 4. Rate Limiting
**Problem:** Malicious users could spam the query endpoint, draining OpenAI credits.
**Solution:**
- Implement **Upstash Redis** rate limiting.
- Middleware check: `ratelimit.limit(userId)`.
- Benefit: Predictable costs and API protection.

---

## 3. Environment Configuration

The application requires the following environment variables to function.

### Core Application
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | The production URL (e.g. `https://hire-screen.vercel.app`) |

### Supabase (Database & Auth)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public API key for client-side requests |
| `SUPABASE_SERVICE_ROLE_KEY` | **SECRET** Private key for server-side admin tasks |

### OpenAI (AI Intelligence)
| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | **SECRET** Key for Chat & Embedding APIs |

### Google OAuth
| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | OAuth Client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | **SECRET** OAuth Client Secret |

### LemonSqueezy (Billing)
| Variable | Description |
|----------|-------------|
| `LEMONSQUEEZY_API_KEY` | **SECRET** API Key for verifying purchases |
| `LEMONSQUEEZY_STORE_ID` | Your Store ID |
| `LEMONSQUEEZY_VARIANT_ID` | The specific Product Variant ID for the Pro plan |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | **SECRET** Key to verify webhook signatures |

---

## 4. Deployment Guide

### Prerequisites
1. **GitHub Repository:** Code pushed to main branch.
2. **Vercel Account:** Linked to GitHub.
3. **Supabase Project:** Created with `pgvector` enabled.

### Database Setup Steps
1. Go to Supabase SQL Editor.
2. Enable Vector extension: `create extension if not exists vector;`
3. Run the schema migration script (creating tables `profiles`, `jobs`, `documents`, etc.).
4. Go to Auth > Providers and enable Google.
5. Set Redirect URL to: `https://[YOUR-PROJECT-ID].supabase.co/auth/v1/callback`

### Vercel Deployment Steps
1. Import project from GitHub.
2. Add all Environment Variables listed in Section 3.
3. Deploy.
4. Copy the Vercel Production URL.
5. Update `NEXT_PUBLIC_APP_URL` in Vercel with this URL.
6. Update Google Cloud Console Authorized Redirect URIs with this URL + `/callback`.

### Verification
- Visit the landing page.
- Log in with Google.
- Upload a sample resume.
- Ask a question ("What is this candidate's name?").
- Verify the answer is correct and cited.
