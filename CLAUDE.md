# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (Vite, hot reload)
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

No test runner is configured yet. If adding tests, install Vitest (already compatible with the Vite setup).

## Architecture

This is a React 18 + Vite single-page app. All state lives in `App.jsx`; there is no external state library.

**Task data model** — each task is a plain object:
```js
{ id: string, text: string, completed: boolean, completedAt: number|null, children: Task[] }
```
Tasks are **nested** (up to `MAX_DEPTH = 2`, i.e. root → child → grandchild). The full tree is persisted to `localStorage` as JSON on every state change. `migrate()` in `src/utils/tasks.js` backfills missing fields from older saved data.

**State flow:**
- `App.jsx` owns all task state and passes callbacks down as props
- `DragContext` (`src/context/DragContext.jsx`) is the only React context — it carries drag state (`{ id, overId, pos }`) and drag event handlers to avoid prop-drilling through `TodoItem`'s recursive tree
- `TodoItem` is recursive: it renders its own `task.children` by calling itself with `depth + 1`

**Display sorting** (`sortForDisplay` in `src/utils/tasks.js`): active tasks first (stable order), completed tasks sorted newest-first by `completedAt`. Applied recursively at every level before rendering.

**Drag-and-drop** is native HTML5. Drop position (`before` / `after` / `child`) is determined by cursor Y-position within the target row (top third → before, middle third → child if depth allows, bottom third → after). A task cannot be dropped into its own subtree (`isInSubtree` guard).

**Key files:**
- `src/App.jsx` — all business logic and state
- `src/utils/tasks.js` — pure tree manipulation (find, remove, insert, sort, migrate)
- `src/utils/greeting.js` — time-of-day and holiday greeting copy
- `src/index.css` — all styles (no CSS framework; uses CSS custom properties for theming and indent offsets)

**Dark mode** is toggled via a class on `document.body` (`dark`) and persisted to `localStorage`.
