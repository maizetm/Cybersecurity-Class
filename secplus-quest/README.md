# SecPlus Quest

A gamified CompTIA Security+ study app built with React, TypeScript, and Tailwind CSS. Deployable as a static site on GitHub Pages.

## Features

- **Adventure Runs** — 5, 10, or 20 randomized questions across all domains
- **Boss Battles** — Domain-focused 10-question challenges with tighter life limits
- **Daily Forge** — Spaced repetition review of missed/due questions
- **Port & Protocol Arcade** — Timed mini-game matching services to ports
- **5 Domain Biomes** — Visual map with progress tracking per Security+ domain
- **XP, Levels, Coins, Streaks** — Full progression system with multipliers
- **Lives & Shields** — 3 lives per run, shields drop on correct answers
- **Achievements** — 25 unlockable achievements
- **Cosmetic Shop** — Spend coins on hats, frames, themes, and badges
- **Multiple Question Types** — MCQ, multi-select, matching, ordering, and scenario decision trees
- **Import/Export** — Save and restore progress via JSON file
- **Accessibility** — Reduced motion toggle, keyboard navigation, readable contrast

## Local Development

```bash
cd secplus-quest
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Building

```bash
npm run build
```

Output goes to `dist/`.

## Adding Question Packs

1. Create a JSON file following the schema in `public/questions/core.json`
2. Place it in `public/questions/`
3. Add the filename to the `packFiles` array in `src/engine/questions.ts`

### Question pack schema

```json
{
  "packId": "my-pack",
  "title": "My Question Pack",
  "version": "1.0.0",
  "createdAt": "2026-01-01",
  "questions": [
    {
      "id": "unique-id",
      "domain": 1,
      "objectives": ["D1.1-ThreatActors"],
      "difficulty": "easy",
      "type": "mcq",
      "prompt": "Question text here",
      "choices": ["A", "B", "C", "D"],
      "answerIndex": 0,
      "explanation": "Why A is correct."
    }
  ]
}
```

Supported question types: `mcq`, `multi`, `matching`, `ordering`, `scenario`.

## GitHub Pages Deployment

The included GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys automatically on push to `main`.

To set up:
1. Go to your repo's Settings > Pages
2. Set Source to "GitHub Actions"
3. Push to `main` — the workflow will build and deploy

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- canvas-confetti for visual effects
- All data stored in localStorage (no backend)
