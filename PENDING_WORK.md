# Supremus Angel — Pending Work

> Status snapshot · 2026-05-27
> Remaining items from the full ~90-field request, plus general polish.
> Delivery mode: **waves, continued automatically**; Tier D = **free / no-key libraries only**.

---

## Wave 4 — Tier C: logic & structural (the big tier)

A visibility/logic engine + container architecture. Each is a substantial feature; will be built in sub-steps, kept green.

### Logic fields
- [ ] **Conditional field** — show/hide a field based on another field's value.
- [ ] **Calculated field** — value computed from other fields.
- [ ] **Formula field** — expression evaluated over other fields.
- [ ] **Lookup field** — value looked up from a reference list/another field.
- [ ] **Dependent / cascading dropdown** — options depend on a parent field's selection.

### Containers / structure
- [ ] **Repeating section** — a group of fields the respondent can add N times.
- [ ] **Tabs** — group fields into tabbed panels.
- [ ] **Accordion** — collapsible field groups.
- [ ] **Matrix / grid** — rows × columns of inputs.
- [ ] **Table input** — add/edit rows of structured data.

### Multi-page & actions
- [ ] **Page break** — split a form into pages.
- [ ] **Next / Previous** navigation.
- [ ] **Progress bar / step indicator** wired to real pages (static versions already exist as Layout elements).
- [ ] **Save draft** button (respondent-side).
- [ ] **Reset / Cancel** buttons (placeable).
- [ ] **Custom action button**.
- [x] **Submit button** — already present on the fill page.

**Architectural note:** requires extending the schema for nested/child fields and a rules model (`when field X = Y → show/skip/compute`), plus evaluation in `FormRenderer` and the fill page. Biggest single piece of remaining work.

---

## Wave 5 — Tier D: media / maps / captcha (free, no-key libs only) ✅ DONE (2026-05-27)

Per the decision to **skip anything needing a paid key/service**. All nine ship in a
new **"Media & smart"** field group; deps added: `leaflet` (lazy-loaded) + `jsqr`.

### Built (no key required)
- [x] **Rich text editor** — contenteditable + toolbar (`RichTextEditor`), stores HTML.
- [x] **Location / map picker** — **OpenStreetMap** via Leaflet (`MapPicker`); stores "lat,lng"; lazy-imported so it never runs during SSR.
- [x] **Address autocomplete** — free **Nominatim (OSM)** lookup (`AddressAutocomplete`), debounced for the usage policy.
- [x] **Captcha** — client-side arithmetic check (`Captcha`); stores `verified` (demo only; not bot-proof).
- [x] **Barcode / QR scanner** — camera + **jsQR** decode loop (`QrScanner`); manual-entry fallback.
- [x] **Camera capture** — `getUserMedia` photo (`CameraCapture`); file-input fallback.
- [x] **Audio recorder** — `MediaRecorder` (`AudioRecorder`).
- [x] **Video recorder** — `MediaRecorder` (`VideoRecorder`).
- [x] **Document scanner** — camera-capture variant (`CameraCapture variant="document"`).

> All values flow through `formatDisplayValue` / CSV / response views (HTML stripped,
> coords linked to OSM, media shown as thumbnails/players or `[attachment]`). Permission-
> based controls feature-detect and degrade gracefully; verified via `npm run typecheck`,
> `lint`, **69 tests**, and `build`.

### Explicitly out of scope (need paid key / external service)
- ❌ Google Maps picker, Google Places autocomplete — need API key.
- ❌ Google reCAPTCHA / hCaptcha — need a service + secret.
- ⚠️ File / image / video / audio captured here are **not persisted** (no backend) — stored in-session / as data URLs only.

---

## General / polish (not field types)

- [ ] **README** — document the full field catalogue, build → publish → fill flow, and the My Forms dashboard.
- [ ] **Tests** — add coverage for the newer field types and the display/layout path (current suite covers the core flow + reducer + schema + format + validators).
- [ ] **Deployment** — push to GitHub + Vercel; drop the live URL into the README (per PRD §9).
- [ ] **Accessibility pass** on the newer custom controls (keyboard nav for calendar grid, OTP, signature).
- [ ] **Min/max/step config** for range slider & stepper (currently fixed 0–100 / step 1).
- [ ] **Structured address** (street/city/state/ZIP) — currently a single multi-line field.

---

## Constraints carried from the PRD

- **No backend** — everything is client-side; published links carry the schema in the URL hash; responses and saved forms live in `localStorage` (this browser only).
- Quality bar: every wave ships **typecheck + lint + tests green** and the dev server serving 200.
