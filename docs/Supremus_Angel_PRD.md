# Product Requirements Document
## Supremus Angel — Dynamic Form Builder

> Interactive page for real-time data input and visualisation

---

| | |
|---|---|
| **Project** | Supremus Angel — Developer Assessment |
| **Document Version** | 1.0 |
| **Date** | May 26, 2026 |
| **Status** | Draft — Ready for Implementation |
| **Type** | Frontend Engineering Assessment |

---

## 1. Overview

This document outlines the requirements for the Supremus Angel developer assessment. The objective is to build a single-page web application where users can dynamically create form fields, enter data, and see that data rendered on the screen in real time.

The scope is intentionally narrow. The goal is not to ship a production product, but to demonstrate clean component design, smooth UX, responsiveness, and code quality within a focused build.

## 2. Problem Statement

Most static forms force users to commit to a fixed schema and only show results after submission. Users need a flexible interface where they can:

- Add and remove input fields on the fly to match the data they actually want to capture.
- See their input reflected on screen immediately — without page reloads or modal interruptions.
- Use the form comfortably from any device — phone, tablet, or desktop.

The deliverable is an interactive page that solves exactly this — nothing more.

## 3. Goals & Non-Goals

### 3.1 Goals

- Provide a dynamic form where input fields can be added and removed.
- Render submitted data live on the same page as the user edits it.
- Deliver a smooth, responsive UI that works on mobile, tablet, and desktop.
- Demonstrate clean code structure, reusable components, and maintainability.

### 3.2 Non-Goals

- No backend, database, or authentication — the app is fully client-side.
- No multi-user collaboration or data persistence beyond the session (localStorage is optional, not required).
- No complex analytics, dashboards, or business logic beyond rendering the entered data.
- No design system or branding work beyond a clean, polished look.

## 4. Functional Requirements

### 4.1 Dynamic Form Fields

- **FR-1:** User can add a new input field with a single click (e.g. an "Add Field" button).
- **FR-2:** User can remove any field individually (e.g. a delete icon next to each field).
- **FR-3:** Each field should support, at a minimum, a label and a value input. (Optionally, a field-type selector — text, number, email — can be included for richness.)
- **FR-4:** Adding or removing a field should never reset the data already entered in other fields.

### 4.2 Real-Time Rendering

- **FR-5:** As the user types, the rendered output area updates instantly — no submit button required for live preview.
- **FR-6:** A "Submit" action should commit the current state to a visible rendered view (list, card, or chart-style display).
- **FR-7:** Rendered data should be presented in a clear, readable format — for example, key-value cards, a summary list, or a simple chart if numeric data is detected.
- **FR-8:** Tooltips or hover effects should appear on rendered items, surfacing additional detail or metadata.

### 4.3 Validation (Light)

- **FR-9:** Empty field labels should be flagged with subtle inline feedback — no blocking modals.
- **FR-10:** Field-level errors should not prevent the user from continuing to edit other fields.

## 5. Non-Functional Requirements

### 5.1 Responsiveness

- Layout must adapt smoothly across mobile (≤640px), tablet (641–1024px), and desktop (>1024px) breakpoints.
- Form controls must remain comfortably tappable on mobile — minimum 44px tap targets.
- No horizontal scrolling on any supported viewport.

### 5.2 Animations & Interactions

- Adding or removing a field should animate in/out smoothly — no abrupt DOM jumps.
- Hover and focus states should be visible and consistent across all interactive elements.
- Tooltips on rendered data should appear with a soft transition, not a hard pop.

### 5.3 Performance

- Real-time updates should feel instantaneous (<100ms perceived latency) for typical input volumes (up to ~50 fields).
- No unnecessary re-renders — components should be memoised where it matters.

### 5.4 Accessibility (Baseline)

- All form inputs should have associated labels.
- Interactive elements should be keyboard navigable.
- Focus states should be clearly visible.

## 6. Technical Stack

| Layer | Choice | Rationale |
|---|---|---|
| **Framework** | Next.js (React 18+) | Required: React.js. Next.js earns the bonus and gives clean project structure. |
| **Language** | TypeScript | Bonus criterion; improves maintainability and reviewer confidence. |
| **Styling** | Styled Components | Per spec. Keeps component styling co-located and scoped. |
| **Animation** | Framer Motion | Best-in-class enter/exit animations for adding/removing fields. |
| **State** | React useState / useReducer | Scope is small — no external state library needed. |
| **Charts (if used)** | Recharts | Lightweight; enables tooltips/hover out of the box. |

## 7. UI / UX Notes

- Single-page layout with two clear regions: the form on one side, the live preview on the other (stacked on mobile).
- Primary actions ("Add Field", "Submit") should be visually prominent; destructive actions ("Remove") should be subtle but discoverable.
- Use a clean, professional palette aligned with the Supremus Angel brand (purples/whites as cues, but kept understated).
- Empty states matter: when no fields exist, show a friendly prompt inviting the user to add their first field.

## 8. Architecture (High Level)

The app is intentionally simple — a flat component tree with clear responsibilities:

- **FormBuilder** — owns the field list state and exposes add/remove handlers.
- **FieldRow** — a reusable, controlled component for a single editable field.
- **LivePreview** — subscribes to the field list and renders the current data.
- **RenderedCard / RenderedChart** — presentational sub-components used inside LivePreview.
- **Tooltip** — a shared component used wherever hover detail is needed.

State flows top-down from FormBuilder; events flow up via callbacks. No prop drilling beyond two levels.

```
┌─────────────────────────────────────────┐
│            FormBuilder (state)          │
│  ┌─────────────┐      ┌──────────────┐  │
│  │  FieldRow   │      │ LivePreview  │  │
│  │  FieldRow   │ ───▶ │  ┌────────┐  │  │
│  │  FieldRow   │      │  │ Card   │  │  │
│  │  [+ Add]    │      │  │ Chart  │  │  │
│  └─────────────┘      │  └────────┘  │  │
│                       └──────────────┘  │
└─────────────────────────────────────────┘
```

## 9. Deliverables

- Public GitHub (or Bitbucket) repository with the full source code.
- README covering: project description, setup steps, scripts, tech stack, and a short architecture note.
- Deployment link (preferred) — Vercel is the natural fit for Next.js.
- Clean folder structure and consistent code style (Prettier + ESLint configured).

## 10. Evaluation Criteria (Per Brief)

| Criterion | How This PRD Addresses It |
|---|---|
| Dynamic UI & responsiveness | FR-1 to FR-4 cover dynamics; §5.1 covers responsive breakpoints. |
| UI/UX quality & smooth interactions | §5.2 mandates animations, hover states, and soft tooltips. |
| Code structure & reusable components | §8 defines a small, clean component tree with single responsibilities. |
| Scalability & maintainability | TypeScript + Next.js + styled-components chosen for long-term clarity. |
| Documentation | README + this PRD + architecture note in §8 cover decision rationale. |

## 11. Out of Scope

- Backend services, APIs, or databases.
- User accounts, authentication, or roles.
- Cross-session data persistence (beyond optional localStorage).
- Complex visualisations, analytics dashboards, or business logic.
- Internationalisation, theming, or dark mode (nice-to-haves only).

## 12. Acceptance Criteria

The assessment is considered complete when:

- All functional requirements (FR-1 through FR-10) are met.
- The app passes a quick responsive check across phone, tablet, and desktop widths.
- Add/remove field interactions are visibly animated, not jarring.
- Rendered data shows on hover/focus with tooltips or expanded detail.
- The code is pushed to a public repo with a clear README and (ideally) a live deployment link.

---

*End of Document*
