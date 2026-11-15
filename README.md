# GreenLoop — Smart Waste Management System

A web app for neighbourhood waste pickup tracking, garbage black-spot reporting, and sanitation-worker training.

## What it does

- **Role-based dashboards** — pick a role on the login screen: citizen, worker, or admin. Each role gets its own dashboard.
- **Pickup tracking** — pickups move through `pending → collected → transported → processed`, each with a segregation score.
- **Pickup verification (workers)** — confirm a pickup with a photo proof and a segregation score.
- **Black-spot reporting** — report a garbage black spot with a photo, location, and description; status moves through `reported → acknowledged → resolved`.
- **Training module** — slides and a knowledge quiz for workers, with a certificate of completion.
- **Demo data** — the first run seeds two demo pickups in the browser, so the dashboards are not empty.

## Tech stack

- React 18 + TypeScript + Vite
- Tailwind CSS, lucide-react icons
- Data currently persists in `localStorage` (no backend wired up yet — the `@supabase/supabase-js` package is installed but not used in the code)

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build
npm run typecheck
npm run lint
```

## Demo login

The login screen shows demo credentials for each role (password `demo123` for all three):

| Role | Email |
| --- | --- |
| Citizen | citizen@greenloop.com |
| Worker | worker@greenloop.com |
| Admin | admin@greenloop.com |

Click "Use Demo Credentials" on the login screen to fill them in.

## Deploy

Configured as a single-page app on Vercel (`vercel.json` rewrites all routes to `index.html`).

## Project structure

```
src/
  App.tsx                 # login, role routing, pickup/black-spot state
  main.tsx                # app entry point
  index.css               # Tailwind setup
  components/
    LoginPage.tsx         # role picker + sign in
    CitizenDashboard.tsx  # household pickups and quick actions
    WorkerDashboard.tsx   # today's schedule and pickup verification
    AdminDashboard.tsx    # all pickups, active black spots, system controls
    PickupVerification.tsx
    BlackspotReporting.tsx
    TrainingModule.tsx    # slides, quiz, certificate
```
