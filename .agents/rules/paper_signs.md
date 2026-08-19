---
trigger: always_on
---

# React + Vite + JavaScript

## Architecture
- **Application** — `src/app/`: application providers and layouts.
- **Features** — `src/features/<feature>/`: pages, components, state, API operations, and tests for one domain.
- **Shared** — `src/shared/`: reusable UI, HTTP infrastructure, hooks, and utilities.

## Core Rules
- **Boundaries** — Keep pages limited to state and layout orchestration.
- **Data** — Keep remote data separate from local interaction state.
- **Types** — Use JSDoc to document public function contracts and external data shapes.
- **Routing** — Lazy-load route modules.
- **Accessibility** — Use semantic controls, keyboard support, and visible focus states.

## Project Conventions
- **Naming** — Use `*.api.js`, `*.keys.js`, `*.schema.js`, `*Provider.jsx`, `*Page.jsx`, and `use<Thing>.js`.
- **Firebase** — Use authorization rules; create required indexes; deploy rule and index changes.
- **Errors** — Use `src/shared/errors/` for normalized application errors, user messages, and diagnostic logging; never show raw errors to users.
- **Environment** — Maintain `.env.example`; expose only public configuration through `VITE_` variables.
- **Secrets** — Store no secrets in source or client environment files.
- **Code** — Use no dead code or linter suppressions.
- **Documentation** — Maintain a README for every feature.
- **Design** — Use Tailwind classes only and no arbitrary values.
- **Theme** — Support light and dark themes everywhere.
- **Motion** — Use Motion only for transitions and feedback.
- **States** — Handle loading, empty, success, and error in every feature.

## Verification
- **Checks** — Run `npm run format`, `npm run lint`, and `npm run build`; fix failures.