# MediCare Connect Portal

A healthcare client portal template where patients can view medical reports, prescriptions, appointments, invoices, and support requests. Staff can manage appointments, billing, and support tickets across patients.

**Template project — all data is mock/dummy.** No real backend, no real auth, no real PHI. See [PRD.md](PRD.md) and [DESIGN_SPEC.md](DESIGN_SPEC.md) for full product and design specs.

## Tech stack

- React + Vite + TypeScript
- Tailwind CSS v4 + Shadcn/ui (Radix UI primitives)
- Framer Motion for animation
- React Router for routing
- Static mock data (`src/data/`) + React context (no real backend)

## Features

- **Mock auth** — demo login as Patient or Staff (any password works)
- **Dashboard** — role-aware summary (next appointment, reports, invoices, tickets)
- **Medical Reports** — timeline list + detail slider with findings, lab values, attachments
- **Prescriptions** — active/past medications + detail slider with refill, side effects, pharmacy info
- **Appointments** — calendar view + booking flow (patient), clinic-wide schedule (staff)
- **Billing** — invoice list + detail slider with line items, insurance breakdown, mock payment
- **Support** — ticket list + detail slider with threaded chat, priority, staff assignment
- **Light/dark theme**, command palette (⌘K), animated gradient backgrounds and illustrations throughout

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL and sign in with one of the demo accounts shown on the login screen (`patient@demo.com` or `staff@demo.com`, any password).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

## Project structure

```
src/
  assets/illustrations/   Illustration SVGs (per-screen + backgrounds)
  components/             Shared components (shell, ui primitives, etc.)
  context/                Auth, mock data, and theme providers
  data/                   Static mock fixtures (patients, reports, invoices, tickets, ...)
  pages/                  Route-level page components
  types/                  Shared TypeScript types
  routes.tsx              App route definitions
```
