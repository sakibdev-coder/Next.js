# FitLog

FitLog is a focused workout library and daily training log. Browse twelve movements, inspect detailed instructions, build a five-lift plan, and save future workouts for later.

## Built With

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- FitLog REST API
- LocalStorage for plan persistence

## Features

- Responsive workout library with duration, calorie, rating sorting
- Detailed workout pages with specs and step-by-step instructions
- Today's Plan with a five-exercise cap and live metrics
- Saved workouts tab with persistent browser storage
- Toast feedback for plan, save, remove, and completion actions
- Responsive navigation with live plan and saved counters
- Custom 404 route and loading states

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Data Source

Workout data is loaded from `https://api.abcz.workers.dev/api/fitlog`.
