# Supremus Angel — Dynamic Form Builder

> Build form fields on the fly and watch your data render live. _Unlock the Power of Pre-IPO._

A single-page app where you add and remove input fields dynamically, type into them, and
see the data rendered live in a preview pane — with light validation, hover tooltips, an
auto-appearing chart for numeric data, smooth enter/exit animations, and full responsiveness.

**Live demo:** _add your Vercel URL here after deploying_
**Design reference:** [`docs/design-reference.png`](./docs/design-reference.png)

---

## Highlights

- **Dynamic fields** — add/removing a field never disturbs data in other fields.
- **Live preview** — the preview updates as you type; no submit required.
- **Field types** — `text`, `number`, `email`, each with light, non-blocking validation.
- **Numeric chart** — once ≥2 numeric fields exist, a bar chart appears automatically.
- **Tooltips** — hover or focus a rendered card to see type, size, and "last edited" metadata.
- **Submit / Publish** — commits a snapshot and flags empty labels inline (never blocking).
- **Motion** — field enter/exit, button press, card hover-lift, and a flash-on-update,
  all disabled under `prefers-reduced-motion`.
- **Responsive** — stacked on mobile, two-column on tablet/desktop; ≥44px tap targets.
- **Optional persistence** — fields survive a refresh via `localStorage` (fails silently if blocked).

## Tech stack

| Layer        | Choice                                  |
| ------------ | --------------------------------------- |
| Framework    | Next.js 14 (App Router)                 |
| Language     | TypeScript (`strict`)                   |
| Styling      | styled-components 6 (SSR registry)      |
| Animation    | Framer Motion 11                        |
| Charts       | Recharts                                |
| Icons        | lucide-react                            |
| Fonts        | Geist (headings) · Inter (body) · JetBrains Mono (labels) |
| State        | `useReducer` + a `useFormFields` hook   |
| Tests        | Vitest + Testing Library                |

## Getting started

Requires Node.js ≥ 20.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script               | Does                                          |
| -------------------- | --------------------------------------------- |
| `npm run dev`        | Start the dev server                          |
| `npm run build`      | Production build                              |
| `npm run start`      | Serve the production build                    |
| `npm run lint`       | ESLint (`next/core-web-vitals`)               |
| `npm run typecheck`  | `tsc --noEmit`                                |
| `npm run format`     | Prettier write                                |
| `npm run test`       | Run the Vitest suite once                     |
| `npm run test:watch` | Vitest in watch mode                          |

## Project structure

```
src/
├── app/                 # Root layout, page, providers, global CSS
├── components/
│   ├── ui/              # Button, IconButton, Input, Select, Label, Tooltip
│   ├── FieldRow/        # One editable field (label · type · value · remove)
│   ├── LivePreview/     # LivePreview + DataCard + DataChart
│   ├── FormBuilder/     # State owner; orchestrates form + preview
│   └── Shell/           # Dashboard chrome: TopNav + SideNav + AppShell
├── hooks/               # useFormFields (reducer) · useLocalStorage (persistence)
├── lib/                 # registry (SC SSR) · validators
├── styles/              # theme tokens · breakpoints
├── types/               # FormField / FieldAction / FormState
└── utils/               # id · value formatting
```

## Architecture, in one paragraph

`FormBuilder` is the single source of truth: it owns the field list through a `useReducer`
(wrapped in `useFormFields`) and passes data down to `FieldRow` and `LivePreview` while
events flow back up via callbacks. Each `FieldRow` and `DataCard` is `React.memo`-wrapped
with stable `useCallback` handlers and keyed by a stable `nanoid`, so editing one field never
re-renders the others. Styling is theme-driven via styled-components with an SSR registry to
avoid hydration mismatches in the App Router. The full reasoning behind every decision lives
in [`/docs`](./docs).

## Specification documents

The build follows a complete spec set, included in [`/docs`](./docs):

- [PRD](./docs/Supremus_Angel_PRD.md) — product requirements
- [TRD](./docs/Supremus_Angel_TRD.md) — technical architecture & contracts
- [App Flow](./docs/Supremus_Angel_AppFlow.md) — user journeys & state machine
- [UI/UX Brief](./docs/Supremus_Angel_UIUX_Brief.md) — visual language
- [Implementation Plan](./docs/Supremus_Angel_Implementation_Plan.md) — phased build plan

> Visual note: the palette and tri-font system follow the Stitch design (indigo `#4648d4`,
> Geist/Inter/JetBrains Mono); the layout, interaction, and motion specs follow the UI/UX Brief.

## Deploying to Vercel

Push to GitHub, import the repo at [vercel.com/new](https://vercel.com/new), and accept the
defaults — no environment variables are required. Then drop the resulting URL into the
**Live demo** line above.
