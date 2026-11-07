# shoaibali.site — Personal Portfolio

Single-page portfolio for **Shoaib Ali Shahani**, Data Scientist / AI-ML Engineer.
Live at **https://www.shoaibali.site**.

## Stack

- React 19 + Vite 8
- Framer Motion for reveals and micro-interactions
- Lenis for smooth scrolling
- Three.js via `@react-three/fiber` + `@react-three/drei` for the animated background
- Oxlint for linting

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # serve the production build
npm run lint     # oxlint
```

Node 20+ is recommended.

## Project structure

```
public/                  static assets (CV, profile photo, favicon, robots, sitemap)
src/
  main.jsx               entry point + MotionProvider
  App.jsx                page shell, lazy 3D scene, footer
  data.js                all content: profile, projects, skills, education, certs
  index.css              design tokens and all section styles
  context/
    MotionContext.jsx    motion on/off preference (localStorage + OS setting)
  lib/
    scroll.js            Lenis-aware scroll helpers and nav offset
  components/
    Navbar.jsx           fixed nav, mobile menu, motion toggle
    Hero.jsx             headline, photo, skill marquee
    About.jsx            bio, details, languages
    Projects.jsx         selected work
    Skills.jsx           skill groups and meters
    Education.jsx        education and experience timelines
    Achievements.jsx     animated stats and certifications
    Contact.jsx          contact links and CV
    SceneBackground.jsx  Three.js background scene
    SmoothScroll.jsx     Lenis setup
    ScrollProgress.jsx   top progress bar
```

## Editing content

Almost everything lives in [src/data.js](src/data.js) — profile, navigation labels,
projects, skills, education, experience, certifications, languages, and stats.
Page metadata (title, description, Open Graph, canonical URL) is in
[index.html](index.html); the CV and portrait are in `public/`.

## Deployment

Deployed on Vercel from the `main` branch — pushing to `main` triggers a
production build. `vercel.json` handles the SPA rewrite, security headers, and
immutable caching for hashed assets.

Note: the canonical/OG URLs point at `https://www.shoaibali.site` because that is
the domain attached in Vercel; the apex `shoaibali.site` 308-redirects to it.

## Notes

- Motion can be disabled at any time from the navbar (or the mobile menu), and
  the site respects `prefers-reduced-motion`.
- The 3D scene pauses rendering when motion is disabled and falls back
  gracefully when WebGL is unavailable.
