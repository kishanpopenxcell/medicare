# MediCare Connect Portal

A healthcare client portal template where patients can view medical reports, prescriptions, appointments, invoices, and support requests. Staff can manage appointments, billing, and support tickets across patients.

**Template project — all data is mock/dummy.** No real backend, no real auth, no real PHI.

## Mock APIs & data

This project runs entirely in the browser with **no backend of any kind**:

- **No network calls.** There is no `fetch`, `axios`, or WebSocket usage anywhere in `src/`. Nothing is requested from a remote host at runtime.
- **Static fixtures.** All content lives in `src/data/` as typed TypeScript arrays (patients, reports, prescriptions, appointments, invoices, tickets).
- **Mock service layer.** `src/context/data-context.tsx` stands in for an API client. Mutations (book appointment, pay invoice, reply to ticket, request refill) update React state only — changes are lost on refresh and never persisted anywhere.
- **Mock auth.** `src/context/auth-context.tsx` matches an email against `src/data/users.ts`. Any password is accepted; no token is ever issued, requested, or verified. Only a demo user id is written to `localStorage`.
- **Placeholder data only.** All names, emails (`@demo.com`), and clinical details are fabricated sample data. No real credentials, endpoints, or PHI are present.

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
