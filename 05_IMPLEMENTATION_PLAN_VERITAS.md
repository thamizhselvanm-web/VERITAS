# VERITAS — Premium UI Rebuild Prompt

**Use this as-is** — paste it into Claude Code, Claude Design, or any coding
agent to (re)build the VERITAS front end. It's written to be self-contained.

---

## 0. What's wrong with the current build

Your two screenshots (gateway login + "VERITAS INTEL" loading card) read as
a **luxury credit-card / private-bank marketing site**: cursive serif
wordmark, warm cognac-to-black gradient, gold foil card, particle streaks.
That's a strong look — but it's the wrong genre. It fights your own brief
(`03_APP_FLOW_UI_UX_BRIEF_VERITAS.md`), which calls for:

> "Quiet confidence. High information density. Strong hierarchy. Zero
> visual noise." … "It should NOT look like a neon AI landing page."

A risk officer should feel like they're opening a **Bloomberg terminal /
Stripe Radar / Vanta**, not a Amex Centurion ad. Fix: keep the *ambition*
(a real signature animation, real polish) but move the palette, type, and
motion back to institutional-fintech territory, and make the card moment
earn its place as a **decision-relevant visual**, not decoration.

---

## 1. Design tokens (lock these in before writing any component)

**Color** — graphite/near-black base, one restrained accent, semantic
status colors only:

```
--bg-canvas:      #0B0D10   /* near-black, not pure black */
--bg-surface:     #12151A   /* card/panel surface */
--bg-surface-2:   #1A1E24   /* elevated surface, hover */
--border-hairline:#242830
--text-primary:   #F2F3F5
--text-secondary: #9AA1AC
--text-muted:     #5C6470
--accent:         #5B8DEF   /* restrained indigo/blue — informational, not decorative */
--verified:       #34B37E   /* green, used only for verified states */
--review:         #E0A63C   /* amber, used only for review states */
--risk:           #E5484D   /* red, used only for serious risk — never ambient */
```

No gold, no cognac, no cursive script anywhere. The wordmark is set in the
body sans, upper/mixed-case, not italic script.

**Type** — one professional family, e.g. **Inter** or **IBM Plex Sans**
(display) + **IBM Plex Mono** or **JetBrains Mono** (tabular numerals for
scores, amounts, hashes, timestamps only — never body text):

```
Display   36–48 / 600 / -0.02em
Page title 28–32 / 600
Section    18–22 / 600
Body       14–16 / 400
Metadata   12–13 / 500 / uppercase / 0.04em tracking
Numerals   tabular-nums, mono, for ₹ amounts, scores, hashes
```

**Spacing** — strict 4/8 scale only: `4 8 12 16 24 32 40 48 64 96`. No
arbitrary padding values anywhere in the CSS.

**Radius & elevation** — small and consistent: `--radius-sm: 6px`,
`--radius-md: 10px`. Elevation via a 1px hairline border + a very soft
shadow (`0 8px 24px rgba(0,0,0,.35)`), never glow/blur "glassmorphism."

---

## 2. Signature moment: the post-login card sequence

Keep the idea from your loading screenshot — it's your one allowed
"boldness" — but re-ground it in what VERITAS actually does: **turning a
flat invoice into a verified, provable trust object.** Replace the
gold-credit-card metaphor with an **invoice-becoming-a-verified-record**
metaphor:

1. **Trigger:** immediately after successful MFA, before the dashboard
   mounts (1.6–2.2s total, skippable, respects `prefers-reduced-motion`
   by cutting straight to step 4).
2. **Frame 1 (0–500ms):** a flat invoice document card fades/slides in,
   center stage, subtle grain/paper texture, tabular fields blurred.
3. **Frame 2 (500–1100ms):** thin scan-line sweeps once top→bottom;
   fields sharpen and resolve in sequence (invoice #, amount, seller,
   buyer) — each field "locks" with a 1px accent-colored underline as it
   resolves. This *is* the extraction pipeline, visualized honestly.
4. **Frame 3 (1100–1700ms):** a hairline border draws itself around the
   card (stroke-dashoffset, not a glow) and a small badge stamps in:
   `TRUST 91 · VERIFIED`. This is the trust score being computed, not a
   generic "loading."
5. **Frame 4 (1700ms+):** the card shrinks and docks into the top-left of
   the dashboard shell as the first item in the case list — a literal
   handoff from "processing" to "here's your queue." No confetti, no
   particles, no bokeh.

Copy for the status line changes with real pipeline stages, not vague
flavor text:
```
Scanning for tampering…
Extracting invoice fields…
Cross-checking duplicates…
Computing trust score…
```

Use this **once**, at the moment of highest narrative payoff (post-login,
or first-time upload). Do not reuse it as a generic page-loader — that's
what turns a signature moment into decoration.

**Technical approach:** SVG for the card outline/stroke-draw, CSS
`@keyframes` + `stroke-dashoffset` for the border draw, CSS
`grid-template-rows: 0fr → 1fr` or `clip-path` for field reveals, all
hardware-accelerated (`transform`/`opacity` only, no animating
`top`/`left`/`width` where avoidable). No JS animation library — this
matches your existing CSS-native approach from prior VERITAS work.

---

## 3. Page-by-page spec

### 3.1 Login / Gateway
- Single centered card, max-width ~440px, on the graphite canvas.
- Tenant selector as a real two-option segmented control (not two loose
  boxes with inconsistent selected-state styling like the current
  screenshot — the unselected "Nexus Trade" option currently looks
  disabled, not "available.")
- Fields: identity, hardware MFA code. Label style = metadata scale,
  uppercase, muted.
- One primary button, full width, accent color, sentence case:
  "Access workspace" (drop the all-caps arrow-button treatment — matches
  brief's "no decorative" rule).
- Footer line: auth method disclosure, muted, 12px.
- **Markup target:** ~1 `<main>`, 1 `<form>`, no more than 2 levels of
  wrapper `<div>` before you hit real form controls. Use `<fieldset>` for
  the tenant selector instead of nested divs with click handlers.

### 3.2 Post-login → Overview (dashboard)
Follow the brief's IA and layout exactly:
```
Header: "Trust Operations" · date · "N cases require attention"
KPI row: Open Cases | High Risk | Evidence Gap | Avg. Review Time
Body: Priority review queue (table) | Trust health (compact) | Recent verification events
```
- KPI row = 4 equal `<dl>` items in a CSS grid, not 4 separate card
  components with duplicated shadow/border/padding markup.
- Table = real `<table>` with `<thead>`/`<tbody>`, sortable headers,
  status via icon+text (never color alone, per your own accessibility
  requirement).

### 3.3 Case detail (flagship screen)
Match `05_IMPLEMENTATION_PLAN_VERITAS.md` §16 exactly:
```
Case header → Trust | Confidence | Evidence (3-up score row)
Invoice summary | Top risk signals (2-col)
Trust graph
Evidence ledger (accordion)
Decision actions
```
- Score row: three `ScoreSummary` components sharing one grid, one
  shared CSS class — not three hand-copied card blocks.
- Evidence ledger accordion: use native `<details>/<summary>` where
  possible for free keyboard/screen-reader support, styled to match
  tokens, animated via `grid-template-rows` per your existing pattern.

---

## 4. Markup discipline ("less divs")

Rules to enforce across every page:

1. **Reach for semantic elements first:** `<header>`, `<nav>`, `<main>`,
   `<section>`, `<article>`, `<aside>`, `<footer>`, `<table>`,
   `<dl>/<dt>/<dd>` for label-value pairs (scores, metadata),
   `<details>/<summary>` for expand/collapse. A `<div>` is the fallback
   when nothing semantic fits — not the default.
2. **No wrapper-for-styling-only divs.** If a `<div>` exists only to hold
   a background or padding that its child could hold itself, delete it.
3. **Flat over nested:** use CSS Grid/Flexbox on a single parent instead
   of nested flex-in-flex-in-flex wrappers to achieve alignment.
4. **One component, one class, reused.** `ScoreSummary`, `TrustSignal`,
   `EvidenceItem`, `RiskReason`, `Badge`, `StatusPill` each get a single
   component definition (per your design-system list in the brief) —
   never copy-pasted markup with inline style overrides per instance.
5. Budget check while building: if any page template nests more than
   **4 levels** of `<div>` deep, stop and refactor.

---

## 5. Responsive rules

- Breakpoints: `≥1280` (full desktop, multi-column), `768–1279` (tablet,
  KPI row wraps 2×2, graph/table stack), `<768` (mobile: single column,
  table becomes stacked card list, evidence ledger stays accordion,
  decision actions become a sticky bottom bar).
- Test the case-detail screen at 375px width first — it's the most
  complex layout; if it works there, desktop is easy.
- Tabular numerals, score rings, and the signature card animation all
  need mobile-safe variants (smaller SVG viewBox, shorter animation
  duration, `prefers-reduced-motion` fallback that skips straight to the
  resolved state).

---

## 6. Motion system

- Standard transitions: **120–220ms**, ease-out, on `transform`/`opacity`
  only.
- The signature card sequence (Section 2) is the **one** orchestrated,
  longer moment (~2s) allowed on the whole product. Everything else is
  short and functional: drawer slide, accordion expand, focus ring,
  status pill fade.
- No infinite ambient animation (no looping gradients, no idle particle
  drift, no breathing glows) — this is explicitly called out as
  forbidden in your own UI brief.
- Respect `prefers-reduced-motion: reduce` globally: disable the card
  sequence's motion, cut transitions to near-instant, keep only opacity
  crossfades.

---

## 7. Accessibility floor

- Visible focus ring on every interactive element (2px, accent color,
  offset).
- No color-only status — every `verified`/`review`/`risk` state carries
  an icon or text label too.
- All data tables use real `<table>` semantics with scoped headers.
- Score rings/graphs need a text-equivalent (`aria-label` or adjacent
  `<dl>`) for screen readers — don't rely on the SVG alone.
- Contrast: body text ≥4.5:1 against `--bg-canvas`/`--bg-surface`.

---

## 8. Deliverable checklist

- [ ] Palette/type/spacing tokens defined once as CSS custom properties,
      referenced everywhere (no hard-coded hex/px in components).
- [ ] Signature card sequence built once, triggered post-login, skippable,
      reduced-motion safe.
- [ ] Login, Overview, Case Detail built to the layouts in Sections 3.1–3.3.
- [ ] No page nests more than 4 `<div>` levels; semantic elements used
      wherever applicable.
- [ ] Verified responsive at 375 / 768 / 1280+.
- [ ] Zero decorative infinite animation anywhere outside the signature
      moment.
- [ ] Accessibility floor (Section 7) passes a manual keyboard-only pass.

---

**One-line brief to hand to a design/code agent verbatim:**

> Rebuild VERITAS as a dark institutional-fintech trust platform (graphite
> `#0B0D10` canvas, Inter/IBM Plex Sans type, tabular-mono numerals,
> restrained indigo `#5B8DEF` accent, green/amber/red used only for
> verified/review/risk states — no gold, no script fonts, no glow). Build
> one signature moment: a post-login sequence where a flat invoice card
> resolves field-by-field into a verified, trust-scored record, then docks
> into the case queue. Everywhere else, motion is 120–220ms and functional
> only. Use semantic HTML with minimal `<div>` nesting, a shared component
> set (ScoreSummary, TrustSignal, EvidenceItem, StatusPill), and full
> responsiveness at 375/768/1280px with a reduced-motion fallback.