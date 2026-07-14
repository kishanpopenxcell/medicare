# PRD — MediCare Connect Portal

**Status:** Draft v1.0
**Date:** 2026-07-13
**Type:** Template / Demo project (all data mock/dummy — no real PHI, no real backend)

---

## 1. Overview

MediCare Connect Portal — healthcare client portal template. Patients view medical reports, prescriptions, appointments, invoices, raise support requests. Staff/admin side manages those requests and records.

Built as **template project** — showcase UI/UX patterns for healthcare portals using modern React stack. All data fake, generated/hardcoded — no real patient info, no real backend, no real auth.

## 2. Goals

- Show clean, accessible healthcare portal UI pattern usable as starter template.
- Cover core client-portal features end-to-end (UI + mock data flow), not just static screens.
- Demonstrate two roles (Patient, Staff/Admin) in one codebase.
- Ship with light + dark theme, responsive layout, reusable component set (Shadcn/Radix).

## 3. Non-Goals

- No real authentication/authorization (JWT, OAuth, sessions) — mock login only.
- No real backend/DB — static JSON/TS fixture files act as data source.
- No real payment processing — invoices/billing display + mock "pay" action only.
- No HIPAA/compliance engineering — template purpose only, explicitly dummy data.
- No real-time features (no websockets/live chat) — help desk thread is static/mock-refresh.

## 4. Tech Stack

| Layer | Choice |
|---|---|
| Framework | React + Vite |
| UI Components | Shadcn/ui |
| Primitives | Radix UI |
| Styling | Tailwind CSS (Shadcn default) |
| Routing | React Router |
| Data | Static mock fixtures (JSON/TS files), no live API |
| State | React Context / lightweight state (per-role session mock) |
| Theme | Light + Dark (Shadcn theme provider, `next-themes` pattern or equivalent) |

## 5. Roles

### 5.1 Patient
Self-service: view own reports, prescriptions, appointments, invoices; raise/view own support tickets.

### 5.2 Staff/Admin
Manage side: view all patients' tickets, respond to threads, view/manage appointments and billing records across patients. No patient-record editing beyond ticket responses (scope stays template-sized).

Role chosen at mock login (pick "Patient" or "Staff" demo account) — determines which shell/nav/pages render.

## 6. Auth (Mock)

- Login screen with dummy credentials (e.g. preset demo accounts shown on screen: `patient@demo.com` / `staff@demo.com`, any password works).
- No real validation, no password hashing, no backend call — client-side mock check against fixture list.
- On "login," store selected role+user in memory/localStorage → drives routing/nav.
- Logout clears mock session, returns to login screen.

## 7. Features

### 7.1 Dashboard (role-aware landing page)
- **Patient:** summary cards — next appointment, recent report, pending invoice, open ticket count.
- **Staff:** summary cards — open tickets count, today's appointments, recent invoices flagged.

### 7.2 Medical Reports (Patient)
- List of mock reports (name, date, type, doctor, status).
- Detail view per report (mock findings text, attached mock file link/placeholder).
- Filter/search by date or type.
- Download action (mock — triggers dummy PDF/file or placeholder download).

### 7.3 Prescriptions (Patient)
- List of mock prescriptions (medicine name, dosage, prescribing doctor, date, refill status).
- Download action (mock PDF/placeholder, same pattern as reports).
- Status badges: Active / Expired / Refill Requested.

### 7.4 Appointment Calendar
- **Patient:** calendar view (month/week) showing mock upcoming/past appointments. Click empty slot → mock booking form (doctor/department select, date/time, reason) → adds to local mock state, confirmation toast. Cancel/reschedule existing appointment (mock, updates local state only).
- **Staff:** calendar view across all patients (or list view grouped by day), see who's booked, basic status (confirmed/pending/cancelled).

### 7.5 Billing Dashboard (Invoices)
- **Patient:** list of invoices (date, service, amount, status: Paid/Unpaid/Overdue). Detail view per invoice (line items, mock breakdown). "Pay Now" button → mock success modal, updates status to Paid locally (no real payment gateway).
- **Staff:** list/table of all patients' invoices, filter by status, mark-as-paid action (mock).

### 7.6 Help Desk (Support Requests)
- **Patient:** ticket list (subject, status: Open/In Progress/Resolved, last updated). Create new ticket (subject, category, message). Ticket detail = message thread view (patient + staff messages), patient can reply (mock, appends to local state).
- **Staff:** ticket queue across all patients, filter by status, open ticket → reply (mock, appends to thread), change status (Open → In Progress → Resolved).

### 7.7 Shared/Cross-cutting
- Responsive sidebar/topbar navigation, role-aware menu items.
- Light/Dark theme toggle, persisted (localStorage).
- Toast notifications (Shadcn `sonner`/`toast`) for mock actions (booked, paid, ticket replied, etc).
- Empty states + loading skeletons (even though data is static, simulate loading skeleton briefly for realism).
- 404 / not-found page.

## 8. Mock Data Layer

- Location: `/src/data/*.ts` (or `.json`) — one file per domain: `patients.ts`, `reports.ts`, `prescriptions.ts`, `appointments.ts`, `invoices.ts`, `tickets.ts`, `users.ts` (login accounts).
- Each domain fixture cross-referenced by `patientId` so Staff views can aggregate across patients.
- Runtime "mutations" (booking, paying, replying) held in local React state seeded from fixtures — resets on page reload (no persistence layer beyond localStorage for session/theme). This is explicit, acceptable limitation for template.

## 9. Information Architecture / Routes (draft)

```
/login
/dashboard                     (role-aware)
/reports                       (patient)
/reports/:id
/prescriptions                 (patient)
/appointments                  (patient: calendar+booking | staff: all-patients view)
/billing                       (patient: own invoices | staff: all invoices)
/billing/:id
/support                       (patient: own tickets | staff: ticket queue)
/support/:id
/settings                      (theme, mock profile info)
```

## 10. Design/UX Notes

- Component set: Shadcn/ui (buttons, cards, tables, dialogs, tabs, badges, calendar, form) + Radix primitives underneath.
- Consistent card-based dashboard layout; data-table pattern for lists (reports, invoices, tickets) with search/filter/sort.
- Status uses consistent badge color convention (e.g. green=good/paid/resolved, yellow=pending, red=overdue/open-urgent).
- Accessibility: rely on Radix's built-in a11y (focus trap, ARIA) — no extra a11y work needed beyond correct component usage.

## 11. Explicit Assumptions (flag if wrong)

- "Staff/Admin" = single generic staff role — no further sub-roles (e.g. doctor vs receptionist) unless told otherwise.
- Mock booking/pay/reply actions only mutate local/session state — not written back to fixture files.
- No multi-language/i18n requirement assumed.
- No mobile app — responsive web only.

## 12. Out of Scope (future/template-extension ideas, not building now)

- Real backend integration (REST/GraphQL API swap-in).
- Real auth provider integration.
- Real payment gateway integration.
- Real-time chat/notifications (websocket).
- Multi-clinic/multi-tenant support.

## 13. Open Questions

- None currently — all key scope decisions captured in Sections 5–7 above based on stakeholder answers (2026-07-13).

---

**Next step:** review this doc, confirm scope, then proceed to project scaffold (Vite + Shadcn init) and folder structure.
