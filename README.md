# NoxDash

A beautiful, keyboard-first “Now” dashboard that shows time, date, greeting, local weather (Open‑Meteo), rotating quotes, a focus card, and a Ctrl/Cmd+K command palette. Deployed automatically to GitHub Pages. [Open‑Meteo](https://open-meteo.com) docs cover current_weather fields used here.

## Features
- Live clock with 12/24h toggle via command palette.
- Location-based current weather via Open‑Meteo; no API key required.
- Theme toggle with persistence (light/dark).
- Command palette (Ctrl/Cmd+K) to run actions quickly.
- Minimal, responsive, elegant design.

## Local dev

```
npm install
npm run dev
```
Open the shown localhost URL. Vite builds a static site suitable for GitHub Pages.

## Build
```
npm run build
npm run preview
```
Vite outputs static files to `dist`.

## Deploy (GitHub Pages)
This repo uses a single GitHub Actions workflow that builds and publishes to Pages on push to `main`. Enable Pages in repo settings after the first run if needed.

## License
MIT
