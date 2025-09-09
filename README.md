# NoxDash

A beautiful, keyboard-first “Now” dashboard that shows time, date, greeting, local weather (Open‑Meteo), rotating quotes, a focus card, and a Ctrl/Cmd+K command palette. Deployed automatically to GitHub Pages. [Open‑Meteo](https://open-meteo.com) docs cover current_weather fields used here. [5][6]

## Features
- Live clock with 12/24h toggle via command palette. [8]
- Location-based current weather via Open‑Meteo; no API key required. [5][6]
- Theme toggle with persistence (light/dark). [8]
- Command palette (Ctrl/Cmd+K) to run actions quickly. [8]
- Minimal, responsive, elegant design. [8][9]

## Local dev

```
npm install
npm run dev
```
Open the shown localhost URL. Vite builds a static site suitable for GitHub Pages. [1]

## Build
```
npm run build
npm run preview
```
Vite outputs static files to `dist`. [1]

## Deploy (GitHub Pages)
This repo uses a single GitHub Actions workflow that builds and publishes to Pages on push to `main`. Enable Pages in repo settings after the first run if needed. [4][1]

## License
MIT
