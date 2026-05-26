# Implementation Plan
## Supremus Angel — Dynamic Form Builder

> Phased, actionable plan from empty repo to deployed app

---

| | |
|---|---|
| **Project** | Supremus Angel — Developer Assessment |
| **Document Version** | 1.0 |
| **Date** | May 26, 2026 |
| **Companion Documents** | [PRD](./Supremus_Angel_PRD.md) · [TRD](./Supremus_Angel_TRD.md) · [App Flow](./Supremus_Angel_AppFlow.md) · [UI/UX Brief](./Supremus_Angel_UIUX_Brief.md) |
| **Estimated Effort** | 14–18 focused hours |
| **Target Duration** | 3–4 days |

---

## 1. Overview

This is the build plan that turns the four spec documents into a deployed application. It breaks the work into seven sequential phases, each ending in a working, committable state.

The cadence is **vertical slices** — every phase produces something runnable. We don't build all the components first and wire them up at the end. We get a thin, ugly thing working early and iterate to polish.

## 2. Approach

### 2.1 Build Order Principles

1. **Skeleton before flesh.** Get the file structure, tooling, and a "hello world" deployment live before any real code.
2. **State before UI.** The reducer and types come before the components that use them — types catch mistakes early.
3. **Functionality before polish.** Ugly-but-working precedes pretty-but-broken.
4. **Mobile-first.** Style for mobile, layer in tablet/desktop. Easier than the reverse.
5. **Commit often.** Each checklist item is roughly one commit. Small commits are easier to review and revert.

### 2.2 Branching

- `main` — always deployable. Vercel auto-deploys from here.
- Work directly on `main` for this assessment (it's a solo build).
- If feature flags are needed, use simple constants — no env vars.

---

## 3. Phase 0 — Setup (1–2 hours)

**Goal:** Empty Next.js project, deployed, with tooling configured.

### 3.1 Checklist

- [ ] Create a new GitHub repository: `supremus-angel-form`.
- [ ] Initialise Next.js with App Router and TypeScript:
  ```bash
  npx create-next-app@latest supremus-angel-form \
    --typescript --app --eslint --no-tailwind --src-dir --import-alias "@/*"
  ```
- [ ] Add dependencies:
  ```bash
  pnpm add styled-components framer-motion lucide-react recharts nanoid
  pnpm add -D @types/styled-components prettier
  ```
- [ ] Configure `next.config.js` for styled-components SWC plugin:
  ```js
  compiler: { styledComponents: true }
  ```
- [ ] Add `.prettierrc` per TRD §15.3.
- [ ] Configure ESLint with the rules from TRD §15.2.
- [ ] Set up the styled-components SSR registry (`src/lib/registry.tsx`).
- [ ] Add base scripts to `package.json` (`dev`, `build`, `lint`, `format`, `typecheck`).
- [ ] Push to GitHub.
- [ ] Connect repo to Vercel. Confirm the default `create-next-app` page deploys.

### 3.2 Definition of Done

- The default Next.js welcome page is live on a Vercel URL.
- `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck` all pass locally.
- `README.md` has a placeholder section structure.

---

## 4. Phase 1 — Foundations (1.5–2 hours)

**Goal:** Theme, types, and folder structure in place. No UI yet.

### 4.1 Checklist

- [ ] Create folder structure per TRD §5.
- [ ] Add `src/types/field.ts` with `FormField`, `FieldType`, `FieldAction`, `FormState`.
- [ ] Add `src/styles/theme.ts` with the tokens from the UI/UX Brief §4 and §7.
- [ ] Add `src/styles/breakpoints.ts` with the three breakpoints.
- [ ] Add `src/utils/id.ts` (thin wrapper around `nanoid`).
- [ ] Add `src/lib/validators.ts` with pure validators for `text`, `number`, `email`.
- [ ] Set up `<ThemeProvider>` in `src/app/layout.tsx`.
- [ ] Apply a CSS reset in `src/app/globals.css` (minimal — Inter font import, box-sizing, body defaults).
- [ ] Import Inter from Google Fonts via `next/font/google`.

### 4.2 Definition of Done

- TypeScript compiles cleanly with `strict: true`.
- Theme tokens are accessible via `useTheme()` inside any component.
- Inter font renders in the browser.

**Commit:** `chore: scaffold theme, types, and folder structure`

---

## 5. Phase 2 — State Layer (2 hours)

**Goal:** Working reducer and hook. Provable via console, no UI required.

### 5.1 Checklist

- [ ] Implement `formReducer` per TRD §8.1.
- [ ] Implement `useFormFields` hook per TRD §8.2.
- [ ] Implement `useLocalStorage` hook per TRD §8.3 (optional persistence).
- [ ] Add a temporary test page (`src/app/page.tsx`) that exercises the hook:
  - Buttons for Add / Remove / Update / Reset.
  - Print state as JSON below.
- [ ] Manually verify each reducer action behaves correctly.
- [ ] Verify `localStorage` hydration on refresh.

### 5.2 Definition of Done

- All four reducer actions (`ADD_FIELD`, `REMOVE_FIELD`, `UPDATE_FIELD`, `RESET`, `HYDRATE`) work.
- State persists across refresh when localStorage is enabled.
- No TypeScript errors.

**Commit:** `feat: add form state reducer with optional persistence`

---

## 6. Phase 3 — Core UI Components (3–4 hours)

**Goal:** All visual components built and rendering, wired to state. Functional but unstyled-pretty.

### 6.1 Build Order (smallest dependency first)

1. **UI primitives** — `Button`, `Input`, `Tooltip` (`src/components/ui/`).
2. **FieldRow** — uses primitives.
3. **DataCard** — read-only counterpart to FieldRow.
4. **LivePreview** — wraps DataCards.
5. **FormBuilder** — orchestrates the above.

### 6.2 Checklist

- [ ] Implement `<Button />` with all three variants and three sizes per UI/UX Brief §8.1.
- [ ] Implement `<Input />` with default, hover, focus, error, disabled states per UI/UX Brief §8.2.
- [ ] Implement `<Tooltip />` per UI/UX Brief §8.5 (functional positioning, no animation yet).
- [ ] Implement `<FieldRow />` per TRD §7.2 and UI/UX Brief §8.3:
  - Label input + type selector + value input + remove icon.
  - Calls `onChange` and `onRemove` callbacks.
  - Inline error display below input.
- [ ] Implement `<DataCard />` per TRD §7.4 and UI/UX Brief §8.4:
  - Shows label, value, and type badge.
  - Wraps in `<Tooltip>` for hover detail.
- [ ] Implement `<LivePreview />` per TRD §7.3:
  - Maps over fields → DataCards.
  - Shows empty state when `fields.length === 0`.
- [ ] Implement `<FormBuilder />` per TRD §7.1:
  - Connects `useFormFields` to the UI.
  - Renders the two-column layout (form left, preview right).
  - "+ Add Field" and "Submit" buttons.
- [ ] Replace the test page in Phase 2 with `<FormBuilder />`.

### 6.3 Definition of Done

- User can add a field, type into it, see it appear in the preview live.
- User can remove a field, and the preview updates.
- User can change the field type, and the input adapts.
- Submit button triggers validation; errors show inline.
- Tooltips appear on hover (without animation yet).

**Commit:** `feat: implement form builder and live preview`

---

## 7. Phase 4 — Motion & Polish (2–3 hours)

**Goal:** Animations, transitions, and the visual finishing touches that make it feel right.

### 7.1 Checklist

- [ ] Wrap field list in `<AnimatePresence>` from Framer Motion.
- [ ] Add enter animation to `<FieldRow />` per UI/UX Brief §10.2 (opacity + y shift, 220ms).
- [ ] Add exit animation to `<FieldRow />` (opacity + height collapse, 180ms).
- [ ] Add button press animation (scale 1 → 0.98 → 1, 80ms).
- [ ] Add card hover lift to `<DataCard />` (translateY -2px + shadow, 200ms).
- [ ] Animate tooltip appearance (opacity + scale, 150ms).
- [ ] Add the "flash highlight" effect on `DataCard` when its value updates (400ms `primarySoft` background fade).
- [ ] Honour `prefers-reduced-motion`:
  ```ts
  const shouldReduceMotion = useReducedMotion();
  ```
  Skip animations when true.
- [ ] Verify focus rings are visible on all interactive elements via keyboard navigation.

### 7.2 Definition of Done

- Adding a field visibly animates in; removing animates out.
- Buttons feel pressable.
- Tooltips fade rather than pop.
- No motion runs when `prefers-reduced-motion` is set.

**Commit:** `feat: add animations and motion polish`

---

## 8. Phase 5 — Responsive (2 hours)

**Goal:** Layout works smoothly across mobile, tablet, and desktop.

### 8.1 Checklist

- [ ] Apply mobile-first media queries in styled-components per UI/UX Brief §6.
- [ ] At ≤640px: stack form above preview, full width.
- [ ] At 641–1024px: side-by-side 55/45 split.
- [ ] At ≥1025px: side-by-side 50/50 split, max-width 1200px centered.
- [ ] Verify all tap targets are ≥44px on mobile.
- [ ] Stack `<FieldRow />` internals vertically on mobile (label input → type → value → remove).
- [ ] Verify no horizontal scrolling at any breakpoint between 320px and 1920px.
- [ ] Test on real mobile device or accurate device emulation (Chrome DevTools is fine).
- [ ] Verify the sticky "Jump to preview" anchor works on mobile (if implemented).

### 8.2 Definition of Done

- App is usable and looks intentional at 320px, 375px, 768px, 1024px, 1280px, 1920px widths.
- No layout breakage when adding 20+ fields on mobile.
- All buttons are comfortably tappable on touch devices.

**Commit:** `feat: implement responsive layouts`

---

## 9. Phase 6 — QA & Documentation (2 hours)

**Goal:** Code is clean, README is solid, manual smoke test passes.

### 9.1 Code Quality Pass

- [ ] Run `pnpm lint` — fix all warnings.
- [ ] Run `pnpm typecheck` — zero errors.
- [ ] Run `pnpm format`.
- [ ] Remove any `console.log` left over from development.
- [ ] Remove dead code, unused imports, commented-out blocks.
- [ ] Verify all components use the theme — no hardcoded colors or spacing values.
- [ ] Check React keys are using `field.id`, never array index.
- [ ] Add `React.memo` to `FieldRow` and `DataCard` (per TRD §11).

### 9.2 Manual Smoke Test

Walk through the full user journey from App Flow §7:

- [ ] Land on `/` — empty state shows.
- [ ] Add field, type label and value — live preview updates.
- [ ] Add multiple fields with different types.
- [ ] Remove a middle field — others retain data, animation plays.
- [ ] Submit — last-submitted state visible.
- [ ] Refresh — data persists (if localStorage enabled).
- [ ] Resize to mobile width — layout reflows.
- [ ] Tab through every interactive element — focus is always visible.
- [ ] Enable "Reduce Motion" in OS — animations disabled.

### 9.3 README.md

The README is part of the deliverable — write it as if a reviewer will read it before opening the code.

Sections to include:

- [ ] Project title + one-sentence description.
- [ ] Live demo link.
- [ ] Screenshot or GIF (a 10-second screen recording goes a long way).
- [ ] Tech stack list.
- [ ] Local setup steps (`pnpm install`, `pnpm dev`).
- [ ] Available scripts.
- [ ] Folder structure summary (short version of TRD §5).
- [ ] Architecture decisions — short paragraph linking to the full TRD.
- [ ] Reference to the four spec docs in `/docs`.

### 9.4 Definition of Done

- `pnpm build` produces a clean production build.
- Lighthouse scores meet targets (Performance ≥ 95, Accessibility ≥ 95, Best Practices = 100).
- README is complete and accurate.

**Commit:** `docs: finalize README and code quality pass`

---

## 10. Phase 7 — Deployment & Submission (1 hour)

**Goal:** Live URL, polished GitHub repo, submission ready to send.

### 10.1 Checklist

- [ ] Verify the latest `main` deploys cleanly to Vercel.
- [ ] Test the production URL on:
  - [ ] Desktop browser (Chrome or Firefox).
  - [ ] Mobile browser (iOS Safari or Chrome Android).
- [ ] Add the production URL to the README.
- [ ] Copy all four spec docs + this plan into the repo's `/docs` folder.
- [ ] Pin the repo on GitHub profile (optional but nice).
- [ ] Verify the repo is public.
- [ ] Compose submission email/message:
  - GitHub repo link.
  - Live demo link.
  - One-paragraph note on the approach (referencing `/docs` for depth).

### 10.2 Definition of Done

- Reviewer can clone, install, and run locally in under 2 minutes.
- Reviewer can experience the app on the live URL without any setup.
- Reviewer can find the spec documents and architectural reasoning in `/docs`.

---

## 11. Timeline

A realistic 3–4 day pace, assuming ~4 hours per evening:

| Day | Phases | Hours |
|---|---|---|
| **Day 1** | 0 — Setup<br>1 — Foundations<br>2 — State Layer | 4–5h |
| **Day 2** | 3 — Core UI Components | 3–4h |
| **Day 3** | 4 — Motion & Polish<br>5 — Responsive | 4–5h |
| **Day 4** | 6 — QA & Documentation<br>7 — Deployment | 3–4h |
| **Total** | | **14–18 hours** |

Sprint pace (single day): doable in 10–12 hours if focused, but not recommended — the polish phases benefit from sleeping between sessions.

---

## 12. Dependencies

External dependencies that block progress if missing or broken:

| Dependency | Mitigation |
|---|---|
| Node.js ≥ 20 LTS | Use `nvm use 20` if installed. |
| GitHub account | Required for submission. |
| Vercel account | Free tier; sign up with GitHub. |
| Stable internet (for `pnpm install`) | One-time blocker; install all deps in Phase 0. |
| Browser DevTools | Built into modern browsers; no install needed. |

No paid services. No private packages. No API keys.

---

## 13. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Styled-components SSR hydration warnings in Next.js App Router | Medium | Low | Use the SSR registry pattern from TRD §9.3. Tested and documented. |
| Framer Motion animation jank with `AnimatePresence` and dynamic lists | Low | Medium | Use stable `key={field.id}`, not array index. Test with 20+ fields. |
| Scope creep — adding "just one more feature" | High | High | Treat PRD §3.2 (Non-Goals) and §11 (Out of Scope) as contracts. If tempted, write it down and ignore it. |
| Over-polishing one component while others lag | Medium | Medium | Follow the phase order. Don't perfect Phase 3 before starting Phase 4. |
| Mobile layout looks broken at edge widths (320px, 414px) | Medium | Low | Test explicitly at these widths in Phase 5. |
| `localStorage` failing in private browsing mode | Low | Low | Wrap in try/catch (already specced in TRD §16). Continue without persistence. |

---

## 14. Stretch Goals (Only If Ahead of Schedule)

If Phase 6 is reached comfortably ahead of schedule, consider one or two of these — never all:

- [ ] Drag-and-drop field reordering (using `@dnd-kit/sortable`).
- [ ] Export rendered data as JSON (download button).
- [ ] Dark mode toggle (theme already supports it conceptually).
- [ ] A small unit test suite for the reducer and validators using Vitest.
- [ ] A subtle gradient or accent illustration in the header to lift the empty state.

**Rule:** stretch goals never delay the core submission. If any stretch goal isn't fully done by the deadline, revert it.

---

## 15. Definition of Done (Project Level)

The assessment is complete when all of these are true:

- [ ] All ten functional requirements (FR-1 through FR-10) from PRD §4 work end-to-end.
- [ ] All twelve acceptance criteria from PRD §12 are met.
- [ ] The app is responsive across mobile, tablet, and desktop without breakage.
- [ ] Animations and transitions are present and respect `prefers-reduced-motion`.
- [ ] Tooltips appear on hover/focus across rendered data.
- [ ] The code is on a public GitHub repo with a clean folder structure.
- [ ] The README explains setup, scripts, tech stack, and architecture.
- [ ] A live deployment URL is included in the submission.
- [ ] All four companion docs are present in `/docs/`.
- [ ] `pnpm lint`, `pnpm typecheck`, and `pnpm build` all pass with zero errors.

---

## 16. Post-Submission

Things to expect or prepare for after submitting:

- **Code walkthrough:** be ready to explain why `useReducer` over Redux, why styled-components over Tailwind, why no test suite.
- **Live extension:** "What would you add if you had another week?" — see PRD §11 and TRD §18 for grounded answers.
- **Architecture critique:** the four spec docs cover the *why* behind every decision; refer to them as needed.

---

*End of Document*
