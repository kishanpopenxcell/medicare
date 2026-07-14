# Design Spec — MediCare Connect Portal

**Status:** Draft v1.0
**Date:** 2026-07-13
**Companion to:** [PRD.md](PRD.md)
**Goal:** Premium, distinctive healthcare portal — no generic admin-template look. Custom shell, custom components per feature, line-art illustrations, rich motion.

---

## 1. Design Principles

1. **No default chrome.** No plain sidebar+topbar box. Navigation is a signature element, not furniture.
2. **Calm-premium, not clinical-cold.** Healthcare software usually feels sterile/beige. Counter that with warmth: soft color, generous whitespace, rounded geometry, human illustration.
3. **Every state is designed.** Empty, loading, success, error states get the same care as "happy path" — illustrations + motion make waiting/empty feel intentional, not broken.
4. **Motion has meaning.** Animation reflects real state change (data loading, status change, item added) — never decoration for its own sake.
5. **One signature shape language.** Pick a recurring geometric motif (see §3) and repeat it across icons, cards, dividers, loaders — this is what makes it feel "designed" not "assembled from a kit."

## 2. Navigation System — Contextual Rail + Command Palette

Replaces sidebar/topbar entirely.

### 2.1 Icon Rail (persistent, left edge)
- Slim vertical rail, ~72px wide, floating with margin from screen edge (not flush) — rounded-full container, soft shadow, glassmorphism blur background.
- Icon-only (no text labels ever) — Dashboard, Reports, Prescriptions, Appointments, Billing, Support.
- Active item: pill-shaped highlight morphs/slides between icons on nav (shared layout animation, not instant swap) — animated indicator "travels" to new position.
- Bottom of rail: avatar (role badge — Patient/Staff color-coded ring), theme toggle, logout.
- Hover on icon: icon lifts slightly + tooltip label fades in beside it (not a text sidebar — a floating micro-tooltip).
- Collapses to smaller width on mobile; on very small screens, rail becomes a bottom-floating dock instead (reuse same component, repositioned).

### 2.2 Command Palette (⌘K / Ctrl+K)
- Primary way to *jump* — "Go to Billing," "New Support Ticket," "Book Appointment," search reports/prescriptions/invoices by name.
- Triggered by rail's top icon (search/logo mark) or keyboard shortcut.
- Built on Radix Dialog + `cmdk` pattern (pairs natively with Shadcn `Command` component).
- Opens with backdrop blur + scale-fade entrance; grouped results (Navigate / Actions / Recent).
- This is what carries most "power-user, modern SaaS" navigation weight — rail is for the 6 top-level sections, palette is for everything specific.

### 2.3 Page Header (per-section, replaces generic topbar)
- Each section has custom header treatment, not a shared generic bar: large section title with small animated icon badge, contextual primary action button top-right (e.g. "Book Appointment," "New Ticket," "Pay Invoice"), breadcrumb only on detail pages (subtle, small caps).

## 3. Signature Shape Language

- **Motif: the "vital arc."** A soft, open arc/crescent (inspired by heartbeat pulse + stethoscope curve) reused as: card corner accents, section divider under headers, avatar ring progress indicator, loading spinner shape, chart accents on dashboard stat cards.
- Corner radius scale: generous, consistent (`xl`/`2xl` Tailwind radius) — no sharp corners anywhere except the arc motif itself which is intentionally organic.
- Color: primary healthcare teal/blue as base, one warm accent (coral/amber) reserved *only* for status/urgency (overdue invoice, open ticket) so it stays meaningful, not decorative.

## 4. Illustration Briefs (you're producing art — style = flat outline/line-art, monochrome or duotone, matches teal+accent palette)

Provide as SVG, single-color stroke (so we can theme light/dark via `currentColor` or CSS variable).

| Location | Illustration brief |
|---|---|
| Login screen | Large hero line-art: stylized doctor+patient or abstract stethoscope-heart-pulse composition, friendly not clinical |
| Dashboard empty (new user, no data) | Small line-art: calendar+clipboard, welcoming "nothing yet" scene |
| Reports — empty state | Line-art: document/folder with magnifying glass |
| Reports — detail page accent | Small decorative line-art: clipboard with heartbeat line, sits near header |
| Prescriptions — empty state | Line-art: pill bottle + leaf (wellness feel) |
| Prescriptions — refill badge/icon | Tiny inline icon: pill capsule outline |
| Appointments — empty calendar | Line-art: calendar page with clock, relaxed pose |
| Appointments — booking success | Line-art: calendar with checkmark, small celebratory feel (not confetti-cartoon, stay line-art) |
| Billing — empty invoices | Line-art: receipt/invoice sheet, simple |
| Billing — payment success modal | Line-art: card + checkmark or receipt + checkmark |
| Billing — overdue warning (subtle, not alarming) | Small inline icon: clock with exclamation, line-art, muted accent color |
| Support/Help desk — empty tickets | Line-art: chat bubble with heart or headset outline |
| Support — ticket resolved state | Line-art: chat bubble + checkmark |
| 404 page | Larger line-art: person looking at map/compass, lost-but-friendly tone |
| Staff dashboard — empty queue | Line-art: inbox/tray, "all clear" tone |

General note: keep all illustrations same stroke weight + same corner-rounding as UI (reinforces "vital arc" motif — ask illustrator/self to echo an arc/curve somewhere in each piece if possible).

## 5. Custom Components Per Feature (beyond stock Shadcn look)

### 5.1 Dashboard
- **Stat cards** are not plain boxes: each has animated arc-progress accent in corner (ties to shape motif), number count-up animation on mount, subtle hover lift.
- Cards arranged in asymmetric bento-grid (not uniform 4-equal-column grid) — one larger "hero" card (next appointment / today's queue) + smaller supporting cards.

### 5.2 Medical Reports
- Report list: **timeline-style list**, not plain table — vertical connecting line with date nodes (like a health history timeline), each report a card branching off the line.
- Report detail: split layout, illustration accent top-right, findings in readable prose card, download button with animated file icon (icon "flies" toward download tray on click before triggering mock download).

### 5.3 Prescriptions
- Displayed as **pill-shaped medicine cards** (visual pun intentional — rounded card shape echoes pill capsule), grid layout, status badge as small colored dot + label, not full-color badge block (subtler).
- Refill action: button triggers small inline animation (pill icon "pulses") + toast confirmation.

### 5.4 Appointment Calendar
- Custom calendar component (build on top of Shadcn `Calendar`/Radix, not vanilla look): day cells with soft dot indicators for booked days, month transitions slide horizontally (not fade), selected day expands into a side/bottom drawer (Radix Drawer/Sheet) showing appointment details — not a modal popup.
- Booking flow: multi-step within same drawer (select doctor → time → confirm), animated step transitions (slide, not page reload feel), progress shown as small arc-fill indicator (motif reuse).

### 5.5 Billing Dashboard
- Invoice list: table upgraded with **inline expandable rows** (click row → expands accordion-style to show line items in place, not separate page navigation) for quick scanning; full detail page still available for deep view.
- "Pay Now" button: satisfying press animation (scale-down on click, checkmark morph on success rather than swapping to a separate icon).
- Status shown via small color dot + arc-shaped mini progress (e.g., partial payments if ever relevant) rather than flat badge chip.

### 5.6 Help Desk
- Ticket thread view styled like a **modern chat interface** (message bubbles, patient right-aligned/staff left-aligned, avatar+timestamp), not a plain form-reply list — reinforces "engaging" goal.
- New ticket creation: slide-over panel (Radix Sheet) with category selected via icon-tile picker (visual categories: Billing/Medical/Technical/Other as small icon tiles), not a plain dropdown.
- Status change (staff side): drag-like segmented control (Open → In Progress → Resolved) with animated fill sliding across segments rather than a plain select dropdown.

## 6. Motion Rules (Framer Motion)

| Moment | Motion treatment |
|---|---|
| Route/page change | Cross-fade + slight vertical slide (8–12px), ~200ms, easeOut |
| Nav rail active-item change | Shared layout animation — pill indicator slides/morphs to new position |
| Dashboard cards on load | Staggered fade+rise, ~40ms delay increments, spring |
| Stat numbers | Count-up animation from 0 to value on mount (respect `prefers-reduced-motion`) |
| Card hover | Lift (translateY -2px) + shadow deepen, spring, ~150ms |
| Modal/Dialog open | Scale from 0.96→1 + fade, spring, backdrop blur fades in |
| Drawer/Sheet (calendar, ticket create) | Slide in from edge, spring physics, backdrop dims |
| Command palette open | Scale-fade + slight blur-in of backdrop |
| Toast notifications | Slide up + fade, auto-dismiss with progress-arc shrinking (motif reuse) |
| Accordion row expand (billing) | Height auto-animate, content fade-in slightly delayed after height settles |
| Button press (primary actions) | Scale-down 0.97 on press, spring back on release |
| Success states (pay, book, resolve) | Icon morph to checkmark (not icon swap) + brief scale pulse |
| Empty-state illustrations | Gentle idle motion optional (e.g. subtle float loop, very slow, low-amplitude) — restraint here, don't overdo |

**Global rule:** respect `prefers-reduced-motion` — fall back to simple fades/no motion when set. All motion durations 150–300ms range except intentional slower moments (drawer slides ~350ms, count-ups ~800ms).

## 7. Color & Theme Notes

- Base: teal/deep-blue primary (healthcare-trust), neutral warm-gray backgrounds (not stark white/gray — slightly warm off-white in light mode, deep desaturated navy in dark mode, not pure black).
- Accent: single warm coral/amber, reserved for urgency/status-attention only (overdue, open-urgent) — keeps it meaningful.
- Dark mode: not just inverted — glassmorphism rail/palette needs distinct blur+opacity tuning per mode so it doesn't look muddy.
- Status semantic colors kept consistent with PRD §10 (green/yellow/red) but rendered as small dots/accents rather than large solid badge chips, matching subtler custom-component direction above.

## 8. Component Build Notes (for implementation phase, not now)

- Nav rail + command palette are the first components to build — everything else's page header/layout depends on shell being right.
- Framer Motion required as new dependency (not in original tech stack list) — add to PRD §4 tech stack.
- `cmdk` (or Shadcn's bundled Command component, which wraps it) required for palette.
- Illustrations: expect SVGs delivered by you; components should accept them as simple `<img>`/inline-SVG swap points — don't hardcode illustration markup deep in logic.

---

**Next step:** confirm this spec, then scaffold Vite+Shadcn project and build shell (rail + palette + theme) first as foundation before feature pages.
