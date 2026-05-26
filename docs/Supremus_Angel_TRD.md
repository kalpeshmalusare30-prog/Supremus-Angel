# Technical Requirements Document
## Supremus Angel — Dynamic Form Builder

> Technical specifications, architecture, and implementation details

---

| | |
|---|---|
| **Project** | Supremus Angel — Developer Assessment |
| **Document Version** | 1.0 |
| **Date** | May 26, 2026 |
| **Status** | Draft — Ready for Implementation |
| **Companion Document** | [PRD](./Supremus_Angel_PRD.md) |
| **Audience** | Engineering |

---

## 1. Introduction

This Technical Requirements Document (TRD) translates the functional requirements defined in the PRD into concrete technical decisions: architecture, data models, component contracts, state flow, styling, animations, and build/deployment.

The PRD answers **what** is being built. This document answers **how**.

## 2. Scope

This TRD covers:

- System architecture and component design.
- Technology stack with exact versions.
- TypeScript type definitions and data models.
- State management approach.
- Styling and animation implementation.
- Performance, accessibility, and browser support targets.
- Build, lint, and deployment configuration.

Out of scope: backend systems, infrastructure, CI/CD pipelines beyond Vercel's default, and any service-layer concerns (none exist in this project).

## 3. System Architecture

### 3.1 High-Level View

The application is a fully client-side Next.js single-page experience. There is no backend, no API layer, and no persistence beyond the browser session.

```
┌────────────────────────────────────────────────────┐
│                   Browser (Client)                 │
│                                                    │
│   ┌──────────────────────────────────────────┐     │
│   │             Next.js App Shell            │     │
│   │  ┌──────────────────────────────────┐    │     │
│   │  │   FormBuilder (state owner)      │    │     │
│   │  │  ┌─────────────┐ ┌─────────────┐ │    │     │
│   │  │  │  FieldList  │ │ LivePreview │ │    │     │
│   │  │  │  ├ FieldRow │ │ ├ DataCard  │ │    │     │
│   │  │  │  ├ FieldRow │ │ ├ DataChart │ │    │     │
│   │  │  │  └ AddBtn   │ │ └ Tooltip   │ │    │     │
│   │  │  └─────────────┘ └─────────────┘ │    │     │
│   │  └──────────────────────────────────┘    │     │
│   └──────────────────────────────────────────┘     │
│                                                    │
│         localStorage (optional persistence)        │
└────────────────────────────────────────────────────┘
```

### 3.2 Data Flow

- **Single source of truth:** `FormBuilder` owns the entire field list via `useReducer`.
- **Top-down props:** field data flows down to `FieldRow` and `LivePreview` as props.
- **Bottom-up events:** changes are dispatched up via callback props (`onAdd`, `onRemove`, `onChange`).
- **No global store:** the scope does not justify Redux/Zustand/Context.

```
User input → FieldRow.onChange() → dispatch(UPDATE_FIELD)
          → reducer updates state → re-render
          → FieldList & LivePreview receive new props
          → DOM updates (React reconciliation)
```

## 4. Technology Stack

| Category | Technology | Version | Notes |
|---|---|---|---|
| Runtime | Node.js | ≥ 20.x LTS | Required by Next.js 14+ |
| Framework | Next.js | 14.x (App Router) | Static export–friendly |
| UI Library | React | 18.x | Concurrent features available |
| Language | TypeScript | 5.x | `strict: true` |
| Styling | styled-components | 6.x | With Next.js SWC plugin |
| Animation | Framer Motion | 11.x | `AnimatePresence` for exit anims |
| Icons | lucide-react | latest | Tree-shakeable icon set |
| Charts | Recharts | 2.x | Optional, for numeric data |
| Linting | ESLint | 8.x | `next/core-web-vitals` config |
| Formatting | Prettier | 3.x | Single source of truth for style |
| Package Manager | pnpm (preferred) / npm | latest | pnpm for faster installs |

## 5. Project Structure

```
supremus-angel-form/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout, styled-components registry
│   │   ├── page.tsx             # Home — renders <FormBuilder />
│   │   └── globals.css          # CSS reset + root tokens
│   ├── components/
│   │   ├── FormBuilder/
│   │   │   ├── FormBuilder.tsx
│   │   │   ├── FormBuilder.styles.ts
│   │   │   └── index.ts
│   │   ├── FieldRow/
│   │   │   ├── FieldRow.tsx
│   │   │   ├── FieldRow.styles.ts
│   │   │   └── index.ts
│   │   ├── LivePreview/
│   │   │   ├── LivePreview.tsx
│   │   │   ├── DataCard.tsx
│   │   │   ├── DataChart.tsx
│   │   │   └── index.ts
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Tooltip.tsx
│   │       └── index.ts
│   ├── hooks/
│   │   ├── useFormFields.ts     # Encapsulates the reducer
│   │   └── useLocalStorage.ts   # Optional persistence
│   ├── lib/
│   │   ├── registry.tsx         # styled-components SSR registry
│   │   └── validators.ts        # Pure validation functions
│   ├── types/
│   │   └── field.ts             # Shared TS types
│   ├── styles/
│   │   ├── theme.ts             # Theme tokens (colors, spacing, radii)
│   │   └── breakpoints.ts       # Media query helpers
│   └── utils/
│       └── id.ts                # nanoid wrapper for stable field IDs
├── .eslintrc.json
├── .prettierrc
├── next.config.js
├── tsconfig.json
├── package.json
└── README.md
```

**Conventions:**

- One component per folder, with `Component.tsx`, `Component.styles.ts`, and `index.ts` re-export.
- Co-locate styles with components; shared tokens live in `src/styles/theme.ts`.
- Shared primitives (`Button`, `Input`, `Tooltip`) live in `components/ui/`.

## 6. Data Models

All types live in `src/types/field.ts`.

```typescript
// Supported field types
export type FieldType = 'text' | 'number' | 'email';

// A single dynamic field in the form
export interface FormField {
  id: string;          // nanoid — stable across re-renders
  label: string;       // user-defined label
  value: string;       // always stored as string; coerced on render
  type: FieldType;     // controls input element + validation
  error?: string;      // populated by validators on blur/change
}

// Reducer action types
export type FieldAction =
  | { type: 'ADD_FIELD' }
  | { type: 'REMOVE_FIELD'; id: string }
  | { type: 'UPDATE_FIELD'; id: string; patch: Partial<FormField> }
  | { type: 'RESET' }
  | { type: 'HYDRATE'; fields: FormField[] };

// State shape
export interface FormState {
  fields: FormField[];
  lastSubmittedAt: number | null;
}
```

**Design notes:**

- `value` is always a string in storage; `DataCard` coerces to the appropriate JS type when rendering (e.g., `Number(value)` for numeric fields).
- `id` is generated once via `nanoid()` and never changes — this is what React uses as the `key` prop, preventing input-focus loss on re-renders.
- `error` is intentionally a string (not a boolean) so the same field can carry its message inline.

## 7. Component Specifications

### 7.1 `<FormBuilder />`

**Responsibility:** Owns state; orchestrates form and preview.

**Props:** none (root component).

**Internal state:** `useReducer(formReducer, initialState)`.

**Renders:**
- `<FieldList />` (the editable column)
- `<LivePreview />` (the rendered column)
- Layout: CSS Grid, 2 columns on desktop, 1 column on mobile.

### 7.2 `<FieldRow />`

**Responsibility:** Controlled UI for a single field. No internal state.

**Props:**
```typescript
interface FieldRowProps {
  field: FormField;
  onChange: (id: string, patch: Partial<FormField>) => void;
  onRemove: (id: string) => void;
}
```

**Behavior:**
- Renders label input, type selector (dropdown), value input, and delete button.
- On any change, calls `onChange(id, patch)` with only the changed keys.
- Runs `validate(field)` on blur and surfaces the result inline.

### 7.3 `<LivePreview />`

**Responsibility:** Presentational. Receives fields, renders read-only cards.

**Props:**
```typescript
interface LivePreviewProps {
  fields: FormField[];
}
```

**Behavior:**
- Maps over `fields` → `<DataCard />` per field.
- If ≥ 2 numeric fields exist, additionally renders `<DataChart />` below the cards.
- Empty state: shows a friendly placeholder.

### 7.4 `<DataCard />`

**Props:**
```typescript
interface DataCardProps {
  field: FormField;
}
```

**Behavior:**
- Displays `label` and a formatted `value`.
- Hover shows `<Tooltip />` with field type and last-edited info.

### 7.5 `<Tooltip />`

**Props:**
```typescript
interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}
```

**Behavior:** Positioned via CSS; appears on hover/focus with a 150ms ease-in-out transition.

### 7.6 `<Button />` and `<Input />`

Standard styled primitives with `variant` and `size` props. All interactive states (`hover`, `focus-visible`, `disabled`, `active`) defined.

## 8. State Management

### 8.1 Reducer

`useReducer` is used over `useState` because actions are well-defined and benefit from a single transition function.

```typescript
function formReducer(state: FormState, action: FieldAction): FormState {
  switch (action.type) {
    case 'ADD_FIELD':
      return {
        ...state,
        fields: [
          ...state.fields,
          { id: nanoid(), label: '', value: '', type: 'text' },
        ],
      };

    case 'REMOVE_FIELD':
      return {
        ...state,
        fields: state.fields.filter((f) => f.id !== action.id),
      };

    case 'UPDATE_FIELD':
      return {
        ...state,
        fields: state.fields.map((f) =>
          f.id === action.id ? { ...f, ...action.patch } : f
        ),
      };

    case 'RESET':
      return { fields: [], lastSubmittedAt: null };

    case 'HYDRATE':
      return { ...state, fields: action.fields };

    default:
      return state;
  }
}
```

### 8.2 Custom Hook

The reducer is wrapped in `useFormFields()` to give consumers a clean API:

```typescript
const { fields, addField, removeField, updateField, reset } = useFormFields();
```

### 8.3 Optional Persistence

`useLocalStorage()` syncs state on each change. Hydration runs once on mount via the `HYDRATE` action. Guarded by `typeof window !== 'undefined'` to avoid SSR issues.

## 9. Styling Architecture

### 9.1 Theme Tokens

`src/styles/theme.ts` exposes a single theme object consumed via `<ThemeProvider />`:

```typescript
export const theme = {
  colors: {
    primary: '#6B2D8C',
    primaryHover: '#5A2576',
    background: '#FFFFFF',
    surface: '#FAFAFA',
    border: '#E5E5E5',
    text: '#1A1A1A',
    textMuted: '#666666',
    danger: '#D32F2F',
    success: '#2E7D32',
  },
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '40px' },
  radii: { sm: '4px', md: '8px', lg: '12px' },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 12px rgba(0,0,0,0.08)',
  },
  transitions: { fast: '120ms ease-out', base: '200ms ease-out' },
};
```

### 9.2 Breakpoints

```typescript
export const bp = {
  mobile: '(max-width: 640px)',
  tablet: '(min-width: 641px) and (max-width: 1024px)',
  desktop: '(min-width: 1025px)',
};
```

Used inline: `@media ${bp.mobile} { ... }`.

### 9.3 SSR Compatibility

A `StyledComponentsRegistry` component (in `src/lib/registry.tsx`) ensures styled-components classnames are stable between server and client, avoiding hydration warnings in Next.js App Router.

## 10. Animations

Powered by Framer Motion. Three core animations:

| Animation | Trigger | Spec |
|---|---|---|
| Field enter | Field added | `opacity: 0 → 1`, `y: -8 → 0`, duration 220ms |
| Field exit | Field removed | `opacity: 1 → 0`, `height: auto → 0`, duration 180ms |
| Tooltip appear | Hover/focus | `opacity 0 → 1`, `scale 0.96 → 1`, duration 150ms |

Wrap field list in `<AnimatePresence>` so exit animations play before unmount. Reduce motion when `prefers-reduced-motion: reduce` is set.

## 11. Performance

| Concern | Mitigation |
|---|---|
| Input lag on large lists | Each `FieldRow` is wrapped in `React.memo`; `onChange` is stable via `useCallback`. |
| Re-render of unchanged rows | `field.id` is used as `key`; rows only re-render when their own `field` reference changes. |
| Chart recomputation | `useMemo` on the derived `numericFields` array. |
| Bundle size | Recharts and Framer Motion are tree-shaken; lucide icons imported individually. |
| Initial paint | Next.js static rendering; no client fetches at startup. |

**Target metrics (Lighthouse, desktop):** Performance ≥ 95, Accessibility ≥ 95, Best Practices = 100.

## 12. Accessibility

- All inputs paired with `<label htmlFor="...">` or `aria-label`.
- Buttons have descriptive `aria-label` (e.g. `"Remove field: Email"`).
- `focus-visible` rings on all interactive elements; never `outline: none` without a replacement.
- Tooltips are exposed via `aria-describedby` and triggered by focus as well as hover.
- Color contrast: all text ≥ WCAG AA (4.5:1 for body, 3:1 for large text).
- Keyboard support: Tab/Shift+Tab navigates the form; Enter activates buttons.
- Honour `prefers-reduced-motion`.

## 13. Browser Support

| Browser | Version |
|---|---|
| Chrome | Last 2 major versions |
| Firefox | Last 2 major versions |
| Safari | 15+ |
| Edge | Last 2 major versions |
| Mobile Safari | iOS 15+ |
| Chrome Android | Last 2 major versions |

IE11 is not supported. Polyfills are not shipped — Next.js handles modern-target transpilation by default.

## 14. Build & Deployment

### 14.1 Scripts (`package.json`)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\"",
    "typecheck": "tsc --noEmit"
  }
}
```

### 14.2 Build

`next build` produces an optimised production build. Static export is possible (`output: 'export'` in `next.config.js`) for deployment to any static host.

### 14.3 Deployment

**Primary target: Vercel.**

- Connect the GitHub repo to Vercel; default settings work without modification.
- Preview deployments on every PR; production on `main` branch pushes.
- No environment variables required.

**Fallback targets:** Netlify, GitHub Pages (with static export), or any static file host.

## 15. Code Quality

### 15.1 TypeScript

- `strict: true` enabled in `tsconfig.json`.
- No `any` allowed — use `unknown` and narrow.
- No implicit returns; explicit return types on exported functions.

### 15.2 ESLint

Extends `next/core-web-vitals` with these additions:

- `@typescript-eslint/no-unused-vars`: error
- `react/jsx-key`: error
- `react-hooks/exhaustive-deps`: warn

### 15.3 Prettier

Single source of formatting truth. Config:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

### 15.4 Commit Hygiene

- Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`).
- Small, focused PRs preferred over large dumps.

## 16. Error Handling

- **Validation errors:** surfaced inline per field, never blocking other interactions.
- **Render errors:** wrapped in a React Error Boundary at the `FormBuilder` level with a clear fallback UI.
- **localStorage failures:** caught silently; the app continues without persistence.
- **No telemetry or error reporting service** in scope for this assessment.

## 17. Testing Strategy

Given the scope, testing is **light by design**:

- **Manual:** smoke test add/remove/edit/submit, plus responsive check at 375px, 768px, 1280px.
- **Type safety:** `tsc --noEmit` runs as a build gate.
- **Linting:** `next lint` runs locally and ideally as a Vercel build step.
- **Optional:** a handful of React Testing Library unit tests for the reducer and `useFormFields` hook, if time permits.

Full test pyramids (e.g., Playwright E2E) are explicitly out of scope.

## 18. Future Considerations

Items deliberately deferred — noted here for completeness, not for implementation:

- Schema-driven forms (JSON-defined field configs).
- Server-side persistence with auth.
- Drag-and-drop field reordering.
- Export rendered data to CSV / JSON.
- Theme switching (light / dark).
- i18n via `next-intl`.

---

*End of Document*
