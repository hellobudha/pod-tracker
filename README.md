# ☕ Coffee Pod Tracker

A mobile-first **progressive web app** for tracking Nespresso Vertuo pod ratings, tasting notes, prices, and reorder status. Built for a single user and installable to the iPhone home screen. The core app works fully offline; two optional features (natural-language commands and price lookup) use a small serverless backend.

**Live:** [pod-tracker-indol.vercel.app](https://pod-tracker-indol.vercel.app/)

---

## Features

- **Collection view** — pods grouped by cup size (Espresso, Double Espresso, Gran Lungo, Coffee), each split into *Tried* and *Yet to Try*, with a stats summary header.
- **Pod cards** — name, status badge, Decaf/Flavored tags, strength + aroma pips, price, and a notes preview. **Tap the status badge** to change status inline, and **tap the reorder pill** to toggle reorder — no need to open the editor.
- **Natural-language / voice commands** — tap ✨ and say or type *"tried Colombia, loved it, strong enough, add to reorder"*. A serverless Claude call turns it into structured edits and shows a plain-English confirmation before applying. Falls back to an on-device parser when offline, so it never hard-breaks. Voice (mic) appears when the device supports the Web Speech API.
- **Prices (US · USD)** — a built-in **Nespresso Vertuo catalog** (`src/data/nespressoCatalog.js`: title, description, per-sleeve price, pods/sleeve). *Match Nespresso prices* in Settings fuzzy-matches your pods to the catalog and fills per-sleeve + per-pod prices offline. You can also **enter or override a price manually** per pod; manual prices are never overwritten.
- **Add / edit sheet** — iOS-style slide-up bottom sheet. Capture category, tags, status, strength, aroma, notes, price, and reorder.
- **Reorder list** — filtered view of everything marked for reorder, with one-tap clipboard copy.
- **Dark mode** — Light / Dark / System, synced to the iOS status bar.
- **Haptics & PWA** — light vibration on key taps; installs to the home screen and runs fullscreen.

## Tech Stack

| | |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS v4 |
| Persistence | `localStorage` (seeded on first launch) |
| PWA | `vite-plugin-pwa` (manifest + service worker) |
| Serverless | Vercel function in `/api` (`parse-command`) |
| Price data | Local catalog `src/data/nespressoCatalog.js` (Nespresso US Vertuo) |
| AI | `@anthropic-ai/sdk` (server-side only, command parsing) |
| Hosting | Vercel (auto-deploy on push to `main`) |

## Getting Started

```bash
npm install
npm run dev        # dev server on http://localhost:5174 (UI only)
npm run build      # production build to /dist
npm run preview    # preview the production build
```

> **Note:** `vite` does not run the `/api` serverless functions. Test those on a Vercel
> preview deployment, or with `vercel dev`. Without the backend, the command feature uses
> its offline fallback parser and prices fall back to manual entry.

## Configuration (Vercel)

The natural-language command feature calls Claude server-side. Set this in the Vercel
project → **Settings → Environment Variables**:

| Variable | Used by | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | `api/parse-command.js` | Required for AI parsing. Without it, the app uses the offline fallback parser. Never exposed to the client. |

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
3. Name it *Coffee Pods* → **Add**.

The app launches fullscreen with the seed pods pre-loaded. Use **Settings → Reset all data** to restore defaults.

## Deployment

The repo is connected to Vercel and auto-deploys every push to `main`. Vercel auto-detects the Vite build — no extra configuration required.

---

🤖 Built with [Claude Code](https://claude.com/claude-code)
