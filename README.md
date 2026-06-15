# todos

A minimalist to-do list app with a sandy, editorial aesthetic.

## What it does

Add, complete, and delete tasks. Tasks persist across page refreshes via localStorage. Filter by All, Active, or Completed. The design uses a warm sand palette, serif typography, sharp corners, and pixel-stippled dithering for all shading — no gradients, no blurred shadows.

## Getting started

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Usage

- Type a task and press **Enter** to add it
- Click the square checkbox to complete a task
- Hover a row and click **×** to delete it
- Use the filter tabs to switch views
- Click **clear completed** to remove all finished tasks

## Tech stack

- React 18
- Vite 5
- Plain CSS (no UI library)
- Google Fonts — Lora
- localStorage for persistence
