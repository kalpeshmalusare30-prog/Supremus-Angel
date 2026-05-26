# UI/UX Design Brief
## Supremus Angel — Dynamic Form Builder

> Visual language, interaction patterns, and design principles

---

| | |
|---|---|
| **Project** | Supremus Angel — Developer Assessment |
| **Document Version** | 1.0 |
| **Date** | May 26, 2026 |
| **Companion Documents** | [PRD](./Supremus_Angel_PRD.md) · [TRD](./Supremus_Angel_TRD.md) · [App Flow](./Supremus_Angel_AppFlow.md) |
| **Audience** | Design, Frontend Engineering |

---

## 1. Introduction

This brief defines the visual and interactive design language for the Dynamic Form Builder. The aim is a clean, confident, fintech-adjacent interface that feels considered without being heavy.

The product belongs to **Supremus Angel — Unlock The Power of Pre-IPO**, a pre-IPO investment platform. The design should feel **trustworthy** (because money is involved) and **approachable** (because pre-IPO is intimidating enough already).

## 2. Design Principles

Five principles guide every visual and interaction decision:

### 2.1 Clarity First

If a user has to think about *what something does*, the design has failed. Every input, button, and state has one obvious meaning.

### 2.2 Calm Confidence

Pre-IPO investment carries weight. The UI should feel measured, never loud. No neon gradients, no aggressive micro-animations, no dark patterns.

### 2.3 Feedback Within 100ms

Every interaction confirms itself instantly — typing reflects in the preview, buttons depress, hover states acknowledge intent. Delay = distrust.

### 2.4 Mobile is Not a Compromise

Most users will encounter this on a phone first. Mobile is the **primary** target, not an afterthought.

### 2.5 Whitespace is a Feature

Generous spacing communicates that the brand has nothing to hide. Cramped layouts feel cheap — cheap is the enemy.

---

## 3. Brand & Visual Identity

### 3.1 Brand Personality

| Trait | Yes | No |
|---|---|---|
| Tone | Confident, considered | Loud, hyped |
| Feel | Premium, modern | Corporate, stuffy |
| Energy | Quietly capable | Aggressively ambitious |
| Trust signals | Calm typography, generous spacing | Stock photos of handshakes, gold gradients |

### 3.2 Logo Use

The Supremus Angel logomark (bar chart in an open hand, with the wordmark below) appears in the header at small scale. It should never be:

- Stretched or recoloured.
- Used as a watermark over content.
- Placed on a busy background.

### 3.3 Tagline

*"Unlock The Power of Pre-IPO"* — referenced in the header sub-line, never repeated elsewhere.

---

## 4. Color Palette

### 4.1 Primary

The brand purple anchors the identity. Use it sparingly — for primary actions, focus states, and the logo lockup.

| Token | Hex | Use |
|---|---|---|
| `primary` | `#6B2D8C` | Primary buttons, focus rings, logo |
| `primaryHover` | `#5A2576` | Hover state for primary |
| `primarySoft` | `#F2EAF7` | Tinted backgrounds, badges, hover surfaces |

### 4.2 Neutrals

The bulk of the interface lives in neutrals. They carry the weight; primary is a spotlight.

| Token | Hex | Use |
|---|---|---|
| `background` | `#FFFFFF` | App background |
| `surface` | `#FAFAFA` | Card backgrounds, subtle separation |
| `border` | `#E5E5E5` | Standard borders, dividers |
| `borderStrong` | `#CCCCCC` | Hover/focus borders |
| `text` | `#1A1A1A` | Body and headings |
| `textMuted` | `#666666` | Labels, captions, helper text |
| `textSubtle` | `#999999` | Placeholders, disabled |

### 4.3 Semantic

Reserved for state — never decorative.

| Token | Hex | Use |
|---|---|---|
| `success` | `#2E7D32` | Validation pass, submitted state |
| `danger` | `#D32F2F` | Validation errors, destructive actions |
| `warning` | `#ED6C02` | Soft warnings, non-blocking issues |
| `info` | `#0288D1` | Informational tooltips, neutral feedback |

### 4.4 Contrast & Accessibility

All text/background pairings meet **WCAG AA**:

- Body text on white: 4.5:1 minimum.
- Large text (≥18pt or 14pt bold): 3:1 minimum.
- Primary on white: ✅ 7.2:1.
- `textMuted` on white: ✅ 5.7:1.
- `textSubtle` on white: ✅ 2.8:1 — used only for placeholders, never essential text.

---

## 5. Typography

### 5.1 Type Family

**Primary:** `Inter` (system fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`).

Inter is the right choice because it's:

- Designed for screens.
- Highly legible at small sizes.
- Variable-weight, so we get the full range from one file.
- Brand-neutral — it doesn't fight the purple.

### 5.2 Type Scale

A modular scale with a 1.25 ratio, anchored at 16px.

| Token | Size | Line Height | Weight | Use |
|---|---|---|---|---|
| `display` | 32px | 40px | 700 | Page title |
| `h1` | 24px | 32px | 600 | Section heading |
| `h2` | 20px | 28px | 600 | Sub-section |
| `body` | 16px | 24px | 400 | Default body |
| `bodySm` | 14px | 20px | 400 | Helper text, labels |
| `caption` | 12px | 16px | 500 | Captions, tooltip text |
| `mono` | 14px | 20px | 500 | Numeric values in cards |

### 5.3 Type Pairings

- **Headings:** `Inter 600` in `#1A1A1A`.
- **Body:** `Inter 400` in `#1A1A1A`.
- **Labels:** `Inter 500` in `#666666`, uppercase optional with 0.5px letter-spacing for emphasis.
- **Mono usage:** numeric values in `DataCard` use tabular figures (`font-variant-numeric: tabular-nums`) to align columns visually.

---

## 6. Layout & Grid

### 6.1 Container

- Max content width: **1200px**.
- Centered with `margin: 0 auto`.
- Horizontal padding: 24px (desktop), 16px (mobile).

### 6.2 Form-Preview Split

- **Desktop (>1024px):** two columns, 50/50 split with a 32px gap.
- **Tablet (641–1024px):** two columns, 55/45 split (form gets more room).
- **Mobile (≤640px):** single column, form on top, preview below.

### 6.3 Vertical Rhythm

- 16px between related elements (label + input).
- 24px between unrelated elements (one field row + next).
- 48px between major sections (header + form).

---

## 7. Spacing System

A 4px base unit. Every gap, padding, and margin is a multiple.

| Token | Value | Typical Use |
|---|---|---|
| `xs` | 4px | Icon-to-text, badge padding |
| `sm` | 8px | Tight stacks, button internal padding |
| `md` | 16px | Default gap between elements |
| `lg` | 24px | Section padding, generous gaps |
| `xl` | 40px | Major section separation |
| `2xl` | 64px | Hero / above-the-fold spacing |

**Rule:** never use arbitrary values. If a 12px gap is needed, ask whether 8px or 16px would actually work — usually it does.

---

## 8. Component Specs

### 8.1 Buttons

Three variants, three sizes.

**Variants:**
- **Primary** — solid purple background, white text. Used for the main action (`+ Add Field`, `Submit`).
- **Secondary** — white background, purple border and text. Used for supporting actions.
- **Ghost** — no background, muted text. Used for low-priority actions (e.g., `Reset`).

**Sizes:**
- **Small** — 32px height, 12px horizontal padding, `bodySm` text.
- **Medium** (default) — 40px height, 16px horizontal padding, `body` text.
- **Large** — 48px height, 24px horizontal padding, `body` text.

**States:**
- **Default:** static colors.
- **Hover:** background darkens by ~10%; cursor `pointer`.
- **Active:** scale to 0.98 for 80ms — a soft "press" confirmation.
- **Focus:** 2px purple ring with 2px offset (keyboard only via `focus-visible`).
- **Disabled:** 40% opacity, `cursor: not-allowed`, no hover effect.

**Corner radius:** 8px.

### 8.2 Inputs

**Anatomy:** label above, input below, helper text below that.

**Default:**
- Height: 44px (matches mobile tap target).
- Border: 1px `border`.
- Border-radius: 8px.
- Padding: 12px horizontal.
- Placeholder: `textSubtle`.

**States:**
- **Hover:** border becomes `borderStrong`.
- **Focus:** border becomes `primary`, 3px `primarySoft` glow ring.
- **Error:** border `danger`, helper text `danger`.
- **Disabled:** background `surface`, text `textMuted`.

### 8.3 Field Row (composite)

Layout: label input + type selector + value input + remove icon, in a row on desktop, stacked on mobile.

- Background: `background`.
- Border-bottom: 1px `border` (separates rows visually).
- Padding: 16px 0.
- Remove icon: 32px circular hit target, ghost button, icon turns `danger` on hover.

### 8.4 Data Card (preview)

The rendered output for a single field.

- Background: `surface`.
- Border: 1px `border`.
- Border-radius: 12px.
- Padding: 16px.
- Subtle shadow on hover (`shadows.md`).

**Anatomy:**
```
┌────────────────────────────┐
│  LABEL (uppercase, muted)  │
│  Value (text or mono)      │
│  ─── type badge (tiny) ─── │
└────────────────────────────┘
```

**Hover:** lifts 2px (`transform: translateY(-2px)`), shadow softens in, tooltip can trigger.

### 8.5 Tooltip

- Background: `#1A1A1A` (deep neutral, high contrast).
- Text: white, `caption` size.
- Padding: 8px 12px.
- Border-radius: 6px.
- Small arrow pointing at trigger.
- Max width: 240px.

**Behavior:**
- Appears ~50ms after hover/focus.
- Fades + scales in (150ms ease-out).
- Dismisses immediately on leave.

### 8.6 Empty States

Both columns have empty states.

**Form empty state:**
- Centered, 48px vertical padding.
- A subtle illustration icon (or just `+` in a circle).
- Heading: "Start building"
- Body: "Add your first field to begin."
- A primary `+ Add Field` button below.

**Preview empty state:**
- Same vertical centering.
- Muted icon (e.g., `lucide-eye-off`).
- Body: "Your data will appear here as you type."

---

## 9. Iconography

**Library:** `lucide-react`.

**Why Lucide:**
- Consistent stroke weight (1.5px).
- Modern, geometric, brand-neutral.
- Tree-shakeable.

**Sizes:**
- `sm` — 16px (inline with text).
- `md` — 20px (button icons).
- `lg` — 24px (standalone icon buttons).

**Color:** inherits `currentColor` so icons take on the parent text color naturally.

**Common icons used:**
- `Plus` — Add Field
- `Trash2` — Remove field
- `Send` — Submit
- `Eye` / `EyeOff` — Preview indicators
- `AlertCircle` — Error states
- `CheckCircle2` — Success states
- `Info` — Tooltip triggers

---

## 10. Motion & Animation

Motion has one job: **confirm that the user's action registered**. Never decorative.

### 10.1 Easing

- **Default:** `ease-out` (200ms) — feels natural and snappy.
- **Quick:** `ease-out` (120ms) — for hover/focus state changes.
- **Slow:** `cubic-bezier(0.4, 0, 0.2, 1)` (300ms) — for larger transitions like layout shifts.

### 10.2 Specifications

| Element | Trigger | Animation | Duration |
|---|---|---|---|
| Field row | Mount | `opacity 0→1, y: -8→0` | 220ms |
| Field row | Unmount | `opacity 1→0, height collapse` | 180ms |
| Button | Press | `scale 1→0.98→1` | 80ms |
| Card | Hover | `translateY 0→-2px, shadow in` | 200ms |
| Tooltip | Appear | `opacity 0→1, scale 0.96→1` | 150ms |
| Input | Focus | Border color + glow | 120ms |
| Preview card | Update | `flash highlight` (`primarySoft` for 400ms then fade) | 400ms |

### 10.3 Reduced Motion

When `prefers-reduced-motion: reduce` is set:

- All durations drop to 0ms (instant).
- Only essential feedback remains (focus rings, color changes).
- Layout-shift animations skip entirely.

---

## 11. States We Design For

Every component must handle these five states explicitly:

1. **Default** — at rest.
2. **Hover** — pointer is over it.
3. **Focus** — keyboard has selected it (separate from hover).
4. **Active / Pressed** — being clicked or held.
5. **Disabled** — not currently available.

For interactive content:

6. **Loading** — async work in progress (rarely needed here since there's no backend, but used during initial hydration from localStorage).
7. **Empty** — no data to show.
8. **Error** — validation failed.
9. **Success** — submitted successfully.

---

## 12. Responsive Design

### 12.1 Breakpoints

| Name | Range |
|---|---|
| Mobile | ≤ 640px |
| Tablet | 641 – 1024px |
| Desktop | ≥ 1025px |

### 12.2 Mobile Considerations

- **Tap targets:** minimum 44 × 44px (Apple HIG standard).
- **Font sizes:** never scale below 14px for body text.
- **Touch feedback:** all interactive elements respond to `:active` with visible state change.
- **Bottom safe area:** content respects `env(safe-area-inset-bottom)` on iOS.
- **No hover-dependent UI:** tooltips trigger on tap; nothing is hover-only.

### 12.3 Desktop Considerations

- **Keyboard-first paths:** every action reachable via Tab + Enter.
- **Hover states:** more pronounced than mobile since pointer feedback is precise.
- **Content width:** capped at 1200px so reading doesn't stretch on ultra-wide monitors.

---

## 13. Accessibility

Beyond color contrast (covered in §4.4):

- **Focus indicators:** always visible on keyboard navigation; never `outline: none` without a replacement.
- **Form labels:** every input has a visible label or `aria-label`.
- **Live regions:** the preview column uses `aria-live="polite"` so screen readers announce updates without interrupting.
- **Error announcements:** validation errors use `role="alert"` for immediate notice.
- **Reduced motion:** honoured via `prefers-reduced-motion` media query.
- **Keyboard support:**
  - `Tab` / `Shift+Tab` — navigate fields.
  - `Enter` — activate focused button.
  - `Escape` — dismiss tooltip.
- **Touch targets:** ≥ 44px on mobile.
- **Language:** `<html lang="en">`.

---

## 14. Tone of Voice (UI Copy)

The microcopy should sound like a calm, capable colleague. Not a salesperson, not a robot.

| Context | Avoid | Prefer |
|---|---|---|
| Empty form | "No fields. Get started now!" | "Start building. Add your first field to begin." |
| Validation error | "ERROR! Invalid input." | "This doesn't look like a valid email." |
| Submit success | "Awesome job! 🎉" | "Submitted — preview updated below." |
| Remove confirmation | "Are you sure you want to delete this?!" | (no confirmation — undo is easier than asking) |
| Tooltip | "Click to learn more about this feature" | "Type: number · 4 chars · Last edited 8s ago" |

**Rules:**
- Sentence case for everything except brand names. No Title Case Like This.
- One exclamation mark per app — and only on actual errors. Never for celebration.
- No emoji in UI copy. (Logos and icons do the heavy lifting.)
- Be specific: "Last edited 8s ago" beats "Recently edited".

---

## 15. References & Inspiration

For visual direction without copying:

- **Linear** — the gold standard for calm, confident product UI.
- **Stripe Dashboard** — fintech-credible without being stuffy.
- **Vercel** — generous whitespace, neutral palette with one bold accent.
- **Notion** — soft borders, hover states that feel right.

Avoid:
- Crypto-app aesthetics (neon, glow, hype).
- Old-school finance (navy gradients, "professional" stock imagery).
- Material Design 3 (over-rounded, too playful for the brand).

---

*End of Document*
