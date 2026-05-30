# ☕ Pod Tracker

A mobile-first **progressive web app** for tracking Nespresso Vertuo pod ratings, tasting notes, and reorder status. Built for a single user, installable to the iPhone home screen, and works entirely offline — no backend, no accounts.

**Live:** [pod-tracker-indol.vercel.app](https://pod-tracker-indol.vercel.app/)

---

## Features

- **Collection view** — pods grouped into Coffee, Flavored & Specialty, and Decaf, each split into *Tried* and *Yet to Try*.
- **Pod cards** — name, status badge, strength + aroma ratings (1–5 pips), and a notes preview. Decaf pods get a blue accent.
- **Add / edit sheet** — an iOS-style slide-up bottom sheet, dismissible by tapping the backdrop or swiping down. Capture status, strength, aroma, free-text notes, and a reorder flag.
- **Reorder list** — a filtered view of everything marked for reorder, with one-tap copy to clipboard for pasting into an Amazon / Nespresso order.
- **Baseline reminder** — your tasting baseline (*Black · Monkfruit powder · No milk · No sugar*) shown in the header so ratings stay consistent.
- **Haptics** — light vibration on status changes (where supported).
- **Offline-first PWA** — installs to the home screen and runs fullscreen via a service worker.

## Tech Stack

| | |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS v4 |
| Persistence | `localStorage` (seeded on first launch) |
| PWA | `vite-plugin-pwa` (manifest + service worker) |
| Hosting | Vercel (auto-deploy on push to `main`) |

## Getting Started

```bash
npm install
npm run dev        # dev server on http://localhost:5174
npm run build      # production build to /dist
npm run preview    # preview the production build
```

## Project Structure

```
src/
  components/
    PodCard.jsx        Pod summary card
    PodSheet.jsx       Add / edit bottom sheet
    ReorderList.jsx    Reorder tab + clipboard copy
    NavBar.jsx         Bottom tab navigation
    StatusBadge.jsx    Colour-coded status pill
    IntensityPicker.jsx 1–5 tap rating selector
  hooks/
    usePods.js         CRUD + localStorage sync
  data/
    seed.js            Initial pod data
  App.jsx              Layout, tabs, FAB
  main.jsx
public/
  icon-192.png, icon-512.png   Home-screen icons
```

## Data Model

```jsonc
{
  "id": "uuid",
  "name": "Colombia",
  "category": "coffee",        // coffee | flavored | decaf
  "decaf": false,
  "status": "liked",           // liked | too_mild | too_strong | yet_to_try
  "intensity": 4,              // strength, 1–5
  "aroma": 3,                  // 1–5
  "notes": "Strong enough. Clean finish.",
  "reorder": true,
  "triedOn": "2026-05-15",
  "addedOn": "2026-05-15"
}
```

## Install on iPhone

1. Open the [live URL](https://pod-tracker-indol.vercel.app/) in Safari.
2. Tap **Share → Add to Home Screen**.
3. Name it *Pod Tracker* → **Add**.

The app launches fullscreen with the seed pods pre-loaded. Use **Settings → Reset all data** to restore defaults.

## Deployment

The repo is connected to Vercel and auto-deploys every push to `main`. Vercel auto-detects the Vite build — no extra configuration required.

---

🤖 Built with [Claude Code](https://claude.com/claude-code)
