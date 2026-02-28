# CandidRank — Phase 1.0 MVP Feature Spec

> Generated: 2026-03-01 | Architecture: `panels/` canonical set via `JobContext`

---

## Audit Report

### A) Component Wiring Status

Component

Status

Notes

`FiltersPanel` → `JobContext`

**FIXED**

Was broken — now wired via `useJobContext()` inside `JobProvider`

`CompareView` → `CenterPanelTabs`

**FIXED**

Triggered by `compareIds` selection, opens on tab click

`ResumeViewer` → `CenterPanelTabs`

**WIRED**

Opens via `viewResume()` → `openResumeTab()` in context

Evidence bookmarks → DB

**FIXED**

Was sessionStorage only → now persisted via `bookmarks.ts` server action

`RightPanel` → `ChatInterface` → streaming

**WIRED**

Chat + rank dual-mode working

`HistoryPanel` → `getJobQueryHistory()`

**WIRED**

Fetches from DB, re-run button works

`ImportPanel` → `importCandidates()`

**WIRED**

CSV import functional

`ExportModal` → PDF/Excel/ZIP export

**WIRED**

Dark-themed, includes bookmarked evidence

Candidate names → extracted from PDF

**WIRED**

`extractContactInfo()` runs on upload, stored in `documents`

`compare.ts` server action

**NEW**

LLM-powered side-by-side comparison

`bookmarks.ts` server action

**NEW**

CRUD operations for `evidence_bookmarks` table

### B) Architecture Decision: Canonical Component Set

**CANONICAL**: `src/components/dashboard/panels/` + `JobContext`

-   `LeftPanelClient.tsx` — Resume list, upload, filters
-   `CenterPanel.tsx` — Routes to active tab content
-   `CenterPanelTabs.tsx` — Chrome-style tab strip
-   `CompareView.tsx` — Side-by-side candidate comparison
-   `RightPanel.tsx` — Chat/Ask interface
-   `HistoryPanel.tsx` — Past query history
-   `ImportPanel.tsx` — CSV bulk import
-   `ResumeViewer.tsx` — PDF viewer via Supabase Storage signed URL

**DEAD CODE** (safe to delete after review):

-   `src/components/dashboard/workspace/TopBar.tsx`
-   `src/components/dashboard/workspace/LeftSidebar.tsx`
-   `src/components/dashboard/workspace/CenterPanelNew.tsx`
-   `src/components/dashboard/workspace/RightChatPanel.tsx`
-   `src/components/dashboard/workspace/ResizableHandle.tsx`
-   `src/components/dashboard/workspace/AskPanel.tsx`
-   `src/components/dashboard/workspace/ResultsPanel.tsx`
-   `src/components/dashboard/workspace/ResumePanel.tsx`
-   `src/components/dashboard/workspace/ResumeViewer.tsx`
-   `src/components/dashboard/workspace/UploadDialog.tsx`

### C) DB Schema Status

Table/Column

Status

`evidence_bookmarks`

EXISTS (enhanced with `filename`, `page_number`, `chunk_id`)

`documents.candidate_name`

EXISTS

`documents.candidate_email`

EXISTS

`documents.candidate_phone`

EXISTS

`documents.file_path`

EXISTS

`match_document_chunks` RPC

EXISTS (returns `document_id`)

---

## Feature Status Table

#

Feature

Status

Files

Blocker

1

Auth (Google + Email)

✅ Done

`middleware.ts`, `auth/callback/`

None

2

Job CRUD

✅ Done

`actions/jobs.ts`, `dashboard/`

None

3

Resume Upload + Processing

✅ Done

`actions/documents.ts`, `lib/pdf/`

None

4

AI Chat (RAG)

✅ Done

`actions/chat.ts`, `lib/openai/chat.ts`

None

5

AI Ranking

✅ Done

`actions/rank.ts`, `lib/openai/ranking-prompt.ts`

None

6

Filters (client-side)

✅ Done

`FiltersPanel.tsx`, `JobContext.tsx`

None

7

Compare View (4 tabs)

✅ Done

`CompareView.tsx`

None

8

Compare Action (LLM)

✅ NEW

`actions/compare.ts`

None

9

Evidence Bookmarks (DB)

✅ NEW

`actions/bookmarks.ts`, `20260228*.sql`

None

10

Resume Viewer (PDF)

✅ Done

`ResumeViewer.tsx`

None

11

Export (PDF/Excel/CSV/ZIP)

✅ Done

`ExportModal.tsx`, `lib/pdf/export.ts`

None

12

Query History

✅ Done

`HistoryPanel.tsx`, `actions/stats.ts`

None

13

CSV Import

✅ Done

`ImportPanel.tsx`, `actions/import.ts`

None

14

Landing Page

✅ Done

`page.tsx`, `components/landing/`

None

15

Billing (Paddle)

✅ Done

`api/billing/`, `lib/paddle/`

None

16

Settings

✅ Done

`settings/`, `actions/profile.ts`

None

17

Rate Limiting

✅ Done

`lib/ratelimit.ts`

None

18

Analytics (PostHog)

✅ Done

`lib/analytics/posthog.ts`

None

---

## Implementation Order (strict sequence)

### Phase 1: Infrastructure (must run first)

1.  **DB Migration** — `supabase/20260228_evidence_bookmarks.sql`
    -   Enhance `evidence_bookmarks` table with `filename`, `page_number`, `chunk_id`
    -   Safe to re-run (IF NOT EXISTS everywhere)

### Phase 2: Type Definitions

2.  **Types** — `src/types/index.ts`
    -   Add `EvidenceBookmark` type
    -   Add `CompareResult` type

### Phase 3: Server Actions

3.  **Bookmarks** — `src/app/actions/bookmarks.ts`
    -   `addBookmark()`, `removeBookmark()`, `getBookmarks()`, `toggleBookmark()`
4.  **Compare** — `src/app/actions/compare.ts`
    -   `compareCandidates()` — fetches chunks per document, runs LLM comparison

### Phase 4: State Layer

5.  **JobContext** — `src/components/dashboard/JobContext.tsx`
    -   Integrate DB bookmark persistence
    -   Ensure all context values match panel component expectations

### Phase 5: Component Wiring

6.  **JobWorkspace** — `src/components/dashboard/JobWorkspace.tsx`
    -   Rewrite to use `JobProvider` + `panels/` components + `ResizableColumns`
7.  **CompareView** — Wire compare server action
8.  **ExportModal** — Dark theme + bookmarked evidence section

### Phase 6: Page Layer

9.  **loading.tsx** — Verify `JobWorkspaceSkeleton` exists and renders correctly
10.  **page.tsx** — Minimal changes (already correct)

---

## Acceptance Criteria per Feature

### AI Ranking

-   Upload 3+ PDFs → all show "ready" status
-   Ask "Who has the most experience?" → ranked cards appear with scores
-   Score bars animate from 0→value on mount
-   Each card shows candidate name, score, match reasons, citation chips

### Compare View

-   Select 2-3 candidates via checkbox → "Compare" tab appears
-   Switch to Compare → see 4 sub-tabs (Summary, Criteria, Evidence, Notes)
-   Summary tab shows side-by-side cards with strengths
-   Evidence tab shows citation text with bookmark icons
-   Bookmarking persists across page reload (DB-backed)

### Resume Viewer

-   Click "View Resume" on any candidate → PDF tab opens in center panel
-   Tab is closeable via X button
-   PDF renders in `<object>` element
-   Fallback link shown if browser can't render PDF

### Filters

-   Authorization, Location, YOE, Skills filters available
-   Filters are collapsible accordion
-   Filter values applied to `filteredDocuments` in context
-   Ranked results update when filters change

### Export

-   Export PDF generates branded report with candidate rankings
-   Excel export includes all match details
-   ZIP export bundles Excel + original PDF resumes
-   CSV and clipboard copy available
-   Bookmarked evidence included in exports

### Chat/Ask

-   Input field at bottom of right panel
-   Suggested prompt chips shown when no history
-   Answer displayed as formatted text with citations
-   Ranking queries automatically trigger ranked results

---

## Manual Test Checklist

-    Upload 3+ PDFs → all show "ready" status
-    Ask "Who has the most experience?" → ranked cards appear
-    Score bars animate on load
-    Click "View Resume" → PDF tab opens in center panel
-    Select 2 candidates → compare tab becomes active
-    Click Compare → CompareView opens with all 4 sub-tabs
-    Evidence tab shows citations with bookmark toggles
-    Bookmark a citation → persists after page refresh
-    Apply filters → ranking/list updates
-    Shortlist 2 candidates → switch to "Shortlisted" tab in left panel
-    Export → PDF includes shortlisted candidates
-    Ask panel → answer shows with citations (not chat bubbles)
-    History tab → shows past queries with re-run button
-    Import tab → CSV upload parsed and displayed