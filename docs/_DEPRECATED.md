# DEPRECATED — Do Not Use

These components are **dead code** from the old `useReducer`-based workspace architecture.  
The canonical implementation now lives in `src/components/dashboard/panels/` and is wired via `JobContext`.

**Safe to delete this entire folder.** Nothing imports from here as of Phase 1.0 MVP (2026-03-01).

## Files in this folder (all dead):
- `TopBar.tsx`
- `LeftSidebar.tsx`
- `CenterPanelNew.tsx` (957-line monolith)
- `RightChatPanel.tsx`
- `ResizableHandle.tsx`
- `UploadDialog.tsx`
- `AskPanel.tsx`
- `ResultsPanel.tsx`
- `ResumePanel.tsx`
- `ResumeViewer.tsx` (duplicate — canonical one is in `panels/ResumeViewer.tsx`)
