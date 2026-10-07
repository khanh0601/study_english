# DESIGN.md — English Learning Web App

> Version: 1.0 · Design direction: **Monochrome / Minimal / Calm / Focused**  
> Scope: English-learning web app built with Next.js, Tailwind CSS, shadcn/ui.  
> **This document is the single source of truth for visual design and UI consistency.**

## 1. Product design principles

1. **Content first:** Learning material and answer fields are the visual priority; the UI must not compete with the exercise.
2. **Black + white + neutrals:** Use grayscale for the core interface. Color is permitted **only as an accessible functional status**, never as decoration.
3. **Readable over fashionable:** Avoid ultra-thin body fonts, tiny captions, excessively wide text, and low-contrast text.
4. **One obvious primary action:** Each screen has a single dominant CTA (Start / Check answer / Continue).
5. **Consistent primitives:** Reuse semantic tokens, sizes, radii, shadows, components and states; avoid ad-hoc styling.
6. **Calm movement:** Subtle motion only when it communicates a state transition; respect reduced motion.

### Explicit non-goals

- No vibrant gradients, glassmorphism, neon, playful 3D, heavy drop shadows or oversized decorative graphics.
- No pure-black large text blocks on pure white if a softer neutral improves long reading sessions.
- No emoji as primary UI icons; use Lucide icons.

---

## 2. Foundations: color system

The app uses **semantic color tokens** so light and dark themes share the same component styles. **Light mode is default.** Dark mode is optional and must not be implemented partially.

### 2.1 Light theme (default)

| Semantic token | Hex | Usage |
|---|---|---|
| `--background` | `#FFFFFF` | Page background |
| `--foreground` | `#111111` | Primary text, headings |
| `--surface` | `#FAFAFA` | Secondary surface / section background |
| `--surface-raised` | `#FFFFFF` | Cards / dialogs |
| `--surface-hover` | `#F5F5F5` | Hover on neutral surfaces |
| `--border` | `#E5E5E5` | Borders / dividers |
| `--border-strong` | `#A3A3A3` | Emphasized border |
| `--muted` | `#737373` | Secondary text (on white) |
| `--muted-subtle` | `#525252` | Descriptive text where stronger contrast is needed |
| `--primary` | `#171717` | Primary CTA, active selection |
| `--primary-foreground` | `#FFFFFF` | Text/icons on primary CTA |
| `--secondary` | `#F5F5F5` | Secondary CTA |
| `--secondary-foreground` | `#171717` | Text on secondary CTA |
| `--focus-ring` | `#525252` | Focus outline |
| `--disabled-bg` | `#F5F5F5` | Disabled control background |
| `--disabled-fg` | `#737373` | Disabled text (non-actionable) |
| `--selection` | `#E5E5E5` | Text selection/selected soft background |

**Accessible functional states** (use with text and icon, never color only):

| State | Text/icon | Soft background | Application |
|---|---|---|---|
| Success | `#166534` | `#F0FDF4` | Correct response, saved |
| Error | `#B91C1C` | `#FEF2F2` | Incorrect response, validation |
| Warning | `#92400E` | `#FFFBEB` | Review due, caution |
| Info | `#1D4ED8` | `#EFF6FF` | Informational message, optional |

> If strict black-and-white mode is required, render status blocks in neutrals with **icons + explicit text**, but continue to ensure clear differences in meaning. Do not rely on hue for feedback.

### 2.2 Dark theme (optional, full coverage only)

| Token | Hex |
|---|---|
| `--background` | `#0A0A0A` |
| `--foreground` | `#FAFAFA` |
| `--surface` | `#141414` |
| `--surface-raised` | `#171717` |
| `--surface-hover` | `#262626` |
| `--border` | `#303030` |
| `--border-strong` | `#525252` |
| `--muted` | `#A3A3A3` |
| `--muted-subtle` | `#D4D4D4` |
| `--primary` | `#FAFAFA` |
| `--primary-foreground` | `#111111` |
| `--secondary` | `#262626` |
| `--secondary-foreground` | `#FAFAFA` |
| `--focus-ring` | `#D4D4D4` |
| `--disabled-bg` | `#262626` |
| `--disabled-fg` | `#A3A3A3` |
| `--selection` | `#404040` |

For dark-mode success/error/warning/info use appropriately contrast-tested versions; never reuse the light soft backgrounds without testing.

### 2.3 Color usage rules

- Target **WCAG AA contrast**: at least 4.5:1 for normal text, 3:1 for large text and meaningful non-text controls; test final rendered pairs.
- Black primary button is the default; no multiple saturated competing CTAs.
- Borders are generally 1px solid `var(--border)`.
- Avoid text on subtle-gray backgrounds using low contrast.
- Do not use color alone to convey right/wrong; always show `Correct` / `Needs review` and an icon.

---

## 3. Typography

### 3.1 Font family

**Primary font:** `Inter` via `next/font/google` (supports English + Vietnamese glyphs).  
**Monospace:** `JetBrains Mono` via `next/font/google` (only for grammar tokens, code-related examples, keyboard shortcuts).  
Fallback: `Arial, Helvetica, sans-serif`.

Do not use more than two font families in the product. Avoid decorative display fonts.

### 3.2 Type scale — desktop and mobile

| Token / utility | Desktop | Mobile | Weight | Line-height | Use case |
|---|---|---|---|---|---|
| `display` | 48px | 36px | 650–700 | 1.12 | Rare hero / onboarding title |
| `h1` | 36px | 30px | 650–700 | 1.2 | Page title |
| `h2` | 28px | 24px | 650 | 1.25 | Main section title |
| `h3` | 22px | 20px | 600 | 1.35 | Card heading / lesson title |
| `h4` | 18px | 18px | 600 | 1.4 | Subsection heading |
| `body-lg` | 18px | 17px | 400 | 1.7 | Lesson introduction / long example |
| `body` | 16px | 16px | 400 | 1.65 | Default body / explanation |
| `body-sm` | 14px | 14px | 400–500 | 1.55 | Metadata / supporting descriptions |
| `caption` | 12px | 12px | 500 | 1.5 | Timestamps / chart labels only |
| `label` | 14px | 14px | 500–600 | 1.4 | Field labels, form labels |
| `button` | 14px | 14px | 600 | 1.4 | Buttons |
| `exercise-prompt` | 26px | 22px | 550–600 | 1.5 | Vietnamese prompt / focus sentence |
| `exercise-answer` | 18px | 16px | 400–500 | 1.65 | Answer input / comparison |

**Rules:**

- Minimum default reading size: **16px**. Captions are for metadata only, not explanations.
- Body paragraphs ideally 55–75 characters per line: `max-width: 68ch`.
- Exercise prompt ideally `max-width: 56ch`, centered in focus mode.
- Headings: `letter-spacing: -0.02em` for h1–h3; body letter spacing normal.
- English example sentences remain in the same body font, not monospace.
- Highlight a mistake using underline + background or strikeout, not bold-only or red-only.
- Do not use all caps for long strings. Short category overlines are acceptable with letter spacing.

### 3.3 Tailwind typography examples

```tsx
<h1 className="text-[30px] leading-[1.2] font-bold tracking-[-0.02em] md:text-[36px]">
  Your learning plan
</h1>
<p className="text-base leading-[1.65] text-foreground">
  Practice a little every day.
</p>
<p className="text-sm leading-[1.55] text-muted-foreground">
  5 questions due for review
</p>
<h2 className="text-[22px] leading-[1.5] font-semibold md:text-[26px]">
  Tôi đã làm việc với React hơn hai năm.
</h2>
```

---

## 4. Spacing, layout, grid

Use a **4px base spacing system**. Prefer Tailwind's standard 4px increments.

| Token | Value | Common usage |
|---|---|---|
| `space-1` | 4px | Icon label spacing |
| `space-2` | 8px | Tight inline spacing |
| `space-3` | 12px | Input help text, stacked label |
| `space-4` | 16px | Component padding / row gaps |
| `space-5` | 20px | Compact card padding |
| `space-6` | 24px | Standard card padding |
| `space-8` | 32px | Section inner spacing |
| `space-10` | 40px | Large separation |
| `space-12` | 48px | Main section gap |
| `space-16` | 64px | Desktop section gap (when needed) |

**Page layout:**

- Breakpoints: mobile `<640px`, tablet `640–1023px`, desktop `>=1024px`.
- Max application container: **1200px** (`max-w-[1200px]`).
- Max focus/lesson container: **760px** (`max-w-[760px]`).
- Content gutters: mobile **16px**, tablet **24px**, desktop **32px**.
- Desktop sidebar: **248px**, sticky/fixed depending on content; mobile sidebar replaced by compact nav/menu.
- Desktop main content: generous whitespace; dashboard cards can use 12-column grid; lesson page prefers one column.
- Main page top padding: 24px mobile / 40px desktop.
- Section vertical spacing: 32px mobile / 48px desktop.
- Card gap: 12px mobile / 16px desktop.
- Touch targets: **minimum 44 × 44px** for essential interactive targets.

---

## 5. Shape, border, elevation

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 6px | Small tags, compact elements |
| `radius-md` | 10px | Inputs, buttons |
| `radius-lg` | 14px | Standard cards |
| `radius-xl` | 18px | Modal / featured card |
| `radius-full` | 9999px | Avatar, round badges |
| `border` | 1px | Cards, inputs, dividers |
| `shadow-card` | none | Default cards: border over shadow |
| `shadow-popover` | `0 8px 30px rgba(0,0,0,.08)` | Dialog and floating overlays only |

Never combine heavy shadow + thick border. No glossy effects.

---

## 6. Core component specifications

### 6.1 Buttons

**Variants:**

- `primary`: black background, white text; hover slightly lighter (`#262626`), focus visible ring.
- `secondary`: `--secondary` background, dark text; hover `--surface-hover`.
- `outline`: white bg, neutral border, dark text; hover soft gray.
- `ghost`: transparent; hover soft gray.
- `destructive`: reserved for irreversible actions, requires confirmation when relevant.

**Sizes:**

| Size | Height | Padding X | Text |
|---|---|---|---|
| `sm` | 36px | 12px | 14px |
| `md` | 44px | 16px | 14px |
| `lg` | 48px | 20px | 16px |

- Default: `md`, `rounded-[10px]`, icon 16–18px.
- Buttons with icon and text: 8px gap.
- Loading: spinner + stable button width, disabled repeat submit.
- Disabled should not look actionable; keep labels readable.
- Typical lesson CTA: `Check answer` primary, `Skip` ghost.

### 6.2 Inputs / textarea

- Height **44px** (`input`) and minimum **128px** (`textarea`), `10px` radius.
- Input border `--border`; hover `--border-strong`; focus `2px` visible outline/ring.
- Text input: 16px to avoid iOS focus zoom.
- Label above field; placeholder is *not* the only label.
- Error message placed directly below field, linked to field by `aria-describedby`.
- Exercise answer textarea: min height 144px desktop/mobile; resize vertically; line height 1.65.
- Preserve user answers if AI evaluation fails.

### 6.3 Cards

- Default white surface, 1px border, 14px radius, 24px padding desktop / 16px mobile.
- Header → body → action footer; generous vertical spacing.
- Interactive card: hover background change and focus ring; never make all cards clickable without need.
- Avoid nesting many bordered cards inside one another.

### 6.4 Badges, tags and status

- Badge: 12px or 13px text, 6px vertical / 10px horizontal padding, 6px radius.
- Neutral badges for level (`A2`, `B1`), topic (`Work English`), time (`10 min`).
- Success/errors include clear text + icon; do not rely on color.
- Prefer labels (`Due today`) over unlabeled dots.

### 6.5 Progress, charts and statistics

- Progress bar height 6px, track `--border`, fill `--primary`, fully rounded ends.
- Always show readable numeric progress e.g. `7/10 sentences` alongside graphical indicator.
- Charts use greyscale series and line patterns / labels for differentiation, not color alone.
- A dashboard should favor 3–4 meaningful KPIs, not large decorative charts.

### 6.6 Feedback and answer comparison

- Show `Your answer`, `Suggested correction`, `Why`, `Useful phrases` in that order.
- Correct / incorrect label + icon, then concise explanation.
- For text differences: use accessible underlines, crossed-out segments and explanations.
- Avoid assigning a bright numerical score as the most prominent piece of feedback.
- Always recognize **multiple valid translations**. AI should not penalize a grammatical, semantically correct alternative only because it differs from the reference.

---

## 7. Screen-by-screen design

### 7.1 Dashboard (`/dashboard`)

Priority order:

1. Small greeting + date + current level.
2. `Today's plan` heading and progress (`2/4 completed`).
3. Prominent `Continue learning` primary CTA.
4. Daily activities: learn new lesson, sentence practice, due reviews, vocabulary.
5. Weekly overview and recent progress (secondary priority).

On desktop: sidebar + content, top summary then 2-column activity grid if space allows. On mobile: one-column cards and persistent simple navigation.

### 7.2 Lesson (`/learn/[lessonId]`)

- Width 760px max, no distracting sidebar in exercise focus mode.
- Top row: `Back`, lesson name, progress (`4 of 10`).
- Exercise type overline; large Vietnamese sentence prompt.
- Clear answer input (textarea or sentence builder), then one primary CTA.
- After submit, show result directly under input; scroll/focus to new result accessibly.
- Bottom: `Continue` primary; `Save phrase` secondary.

### 7.3 Daily planner (`/planner`)

- Use `Today`, `This week` tabs.
- Each daily item: type, title, estimated time, due status, completed state.
- Upcoming days may show tentative lessons. Replan missed days without shaming the user.
- Visually distinguish **New lesson** and **Review** with labels + icons (not hue alone).

### 7.4 Review (`/review`)

- Show due count, review session length and estimated time.
- One card/question at a time, keyboard-first.
- Completion summary: recalled correctly, remaining due, next review date.

### 7.5 Mistake notebook (`/mistakes`)

- Dense but readable list, filter by grammar issue and date.
- Each item shows original, correction, explanation and next due date.
- On mobile, use stacked cards rather than a squeezed data table.

### 7.6 Vocabulary (`/vocabulary`)

- Save **phrases in context**, not just isolated words.
- List row: phrase, Vietnamese meaning, example sentence, review status.
- Search input at top; compact filters for topic/level/due date.

### 7.7 Statistics (`/statistics`)

- Prioritize improvement, not gamification pressure.
- Metrics: days practiced, questions attempted, accuracy by grammar topic, reviews completed.
- Explain statistics in language learners understand; show empty states on new accounts.

---

## 8. Navigation and responsive behavior

**Desktop (`>=1024px`):** left sidebar 248px; logo/name at top; grouped nav links (`Dashboard`, `My plan`, `Learn`, `Practice`, `Review`, `Mistakes`, `Vocabulary`, `Statistics`); profile/settings bottom.

**Tablet (640–1023px):** collapsible sidebar or top navigation, content stays comfortably readable.

**Mobile (`<640px`):** simplified header and bottom navigation (up to 4–5 high-frequency items: Home / Learn / Review / Profile); additional destinations in menu. Safe-area padding for device notches/home indicators.

- No horizontal scrolling at 320px width except genuinely scrollable code/long sentence chips.
- One column for exercise flow on every viewport.
- Avoid fixed bottom CTA covering content; include sufficient bottom padding.
- Modals convert to responsive sheets when beneficial.

---

## 9. Accessibility, keyboard and states

- All interactive elements must be reachable by keyboard; use semantic HTML.
- Show `:focus-visible` with a clear 2px outline, at least 2px offset if possible.
- Inputs have visible labels and clear error/success messages; feedback announced with `aria-live="polite"` where appropriate.
- Use correct heading hierarchy (`h1` page title, `h2` sections).
- Main tap targets minimum 44px; do not use icon-only actions without accessible names.
- Honor `prefers-reduced-motion`; animations should not be necessary to understand content.
- Support loading, empty, offline/network error, AI error, disabled, hover, active, focus, and success states.
- On failed AI evaluation: keep submitted text, show clear retry action; no lost work.
- Never autoplay speaking/audio without explicit user interaction.

---

## 10. Motion and interaction details

| Interaction | Duration | Easing | Guidance |
|---|---|---|---|
| Button hover | 120–160ms | ease-out | Background/border only |
| Card hover | 150ms | ease-out | Very subtle |
| Panel open | 180–220ms | ease-out | Opacity + small translate |
| Feedback appearance | 150–200ms | ease-out | No bounce/confetti by default |
| Progress update | 200ms | ease-out | Reduced-motion aware |

Avoid animations longer than 300ms in the core exercise flow.

---

## 11. Icons, illustration and imagery

- Icons: **Lucide React**, consistent 18px default, 20px navigation, 16px dense metadata; stroke 1.75–2.
- Use line icons throughout; no mix with unrelated filled icon sets.
- Avoid ornamental illustrations on practice screens.
- Empty states may include a simple neutral line illustration / icon and one helpful next action.

---

## 12. Design tokens implementation

Use CSS variables and Tailwind semantic classes. This snippet defines an **app-specific token layer**; if initializing shadcn/ui, map its existing semantic tokens to these values rather than creating conflicting systems.

`src/app/globals.css`:

```css
:root {
  color-scheme: light;
  --background: #ffffff;
  --foreground: #111111;
  --surface: #fafafa;
  --surface-raised: #ffffff;
  --surface-hover: #f5f5f5;
  --border: #e5e5e5;
  --border-strong: #a3a3a3;
  --muted: #737373;
  --muted-subtle: #525252;
  --primary: #171717;
  --primary-foreground: #ffffff;
  --secondary: #f5f5f5;
  --secondary-foreground: #171717;
  --focus-ring: #525252;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 18px;
}

/* Activate only when full dark-mode support is shipped. */
.dark {
  color-scheme: dark;
  --background: #0a0a0a;
  --foreground: #fafafa;
  --surface: #141414;
  --surface-raised: #171717;
  --surface-hover: #262626;
  --border: #303030;
  --border-strong: #525252;
  --muted: #a3a3a3;
  --muted-subtle: #d4d4d4;
  --primary: #fafafa;
  --primary-foreground: #111111;
  --secondary: #262626;
  --secondary-foreground: #fafafa;
  --focus-ring: #d4d4d4;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-inter), Arial, Helvetica, sans-serif;
  font-size: 16px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Recommended `next/font` usage in `src/app/layout.tsx`:

```tsx
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
```

**Important for Tailwind/shadcn:** Connect the semantic tokens to the actual Tailwind theme (`@theme inline` in Tailwind v4, or theme configuration for earlier versions). For shadcn components, supply its required CSS variables (`--card`, `--popover`, `--accent`, `--muted-foreground`, `--input`, `--ring`, etc.) through a consistent mapping. The snippets are the foundation, not a fully configured shadcn theme. Check that class names like `bg-background` and `text-muted-foreground` correctly resolve.

---

## 13. Design quality checklist (acceptance criteria)

Before merging any UI feature, verify:

- [ ] Monochrome first; status colors only when functionally required.
- [ ] Light theme works consistently; dark theme not half-finished.
- [ ] Every screen uses the agreed typography tokens and 4px spacing system.
- [ ] No arbitrary font sizes or unrelated grays unless added to tokens.
- [ ] Primary CTA is clear; secondary controls are visibly less dominant.
- [ ] Mobile 320px, 375px, 768px, desktop 1280px layouts tested.
- [ ] Contrast meets WCAG AA on primary content and actionable controls.
- [ ] Keyboard navigation, focus ring and screen-reader labels work.
- [ ] Loading/empty/error/success states are implemented.
- [ ] Exercise page maintains user focus and never loses a typed answer.
- [ ] All feedback communicates meaning through text/icon, not color alone.
- [ ] Visual regression: headings, cards, inputs, buttons, lesson flow look consistent.

---

## 14. Instructions for coding agents (Cursor / Antigravity)

> **When generating or editing UI, read `design.md` first.** Do not invent another style system.
>
> - Apply **Inter**, monochrome semantic tokens, 4px spacing and specified type scale.
> - Build reusable primitives before designing feature-specific components.
> - Use Tailwind CSS + shadcn/ui + Lucide; do not add another component library without a reason.
> - Prefer quiet layouts, borders and whitespace over decorative effects.
> - Make desktop and mobile equally polished; no desktop-only functionality.
> - Use accessible states and validated contrast.
> - If a component needs a new token or variant, update this file and the token source together.

**Visual north star:** a focused learning workspace with the restraint of Linear/Notion, but built for long-form reading and deliberate practice—not a gamified children's app.
