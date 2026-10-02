# PREIshare Dashboard Routing Plan

## Existing Route Inventory

| Route file | URL | Purpose |
| --- | --- | --- |
| `src/routes/__root.tsx` | App-wide | Provides the document shell, shared header and footer, styles, and router tools. |
| `src/routes/index.tsx` | `/` | Shows the starter home page and links to the dashboard. |
| `src/routes/about.tsx` | `/about` | Shows information about the TanStack Start starter. |
| `src/routes/dashboard.tsx` | `/dashboard` (parent) | Currently provides the dashboard `AppShell` and an `Outlet` for the selected page. The planned layout file below is `src/routes/dashboard/route.tsx`. |
| `src/routes/dashboard/index.tsx` | `/dashboard` (overview) | Shows sample portfolio metrics, open deals, portfolio summary, and recent activity. |
| `src/routes/dashboard/portfolio.tsx` | `/dashboard/portfolio` | Shows the investor's portfolio page with sample holdings. |
| `src/routes/dashboard/deals.tsx` | `/dashboard/deals` | Shows current investment opportunities. |
| `src/routes/dashboard/profile.tsx` | `/dashboard/profile` | Shows investor profile information. |

## Requirements That Need Routes

- Investors need a visible dashboard header and clear navigation. The dashboard layout and its child routes provide the shell and destinations ([Must-Have Shell Areas](preishare-dashboard-requirements.md#must-have-shell-areas), [Investor Goals](preishare-dashboard-requirements.md#investor-goals)).
- Investors need a quick view of portfolio value and open deals. The overview route displays these summary metrics ([Investor Goals](preishare-dashboard-requirements.md#investor-goals)).
- Investors need recent activity in the demo. The overview shows a short placeholder activity area; a separate full activity page can come later ([Must-Have Shell Areas](preishare-dashboard-requirements.md#must-have-shell-areas), [Success Criteria](preishare-dashboard-requirements.md#success-criteria)).
- All dashboard content for this demo can remain mock or placeholder content; no database or API route is needed ([Must Have This Sprint](preishare-dashboard-requirements.md#must-have-this-sprint)).

## Planned Dashboard Route Tree

```text
/dashboard                 Parent layout: src/routes/dashboard/route.tsx (to create)
/dashboard                 Overview index: src/routes/dashboard/index.tsx (exists)
/dashboard/portfolio       Portfolio page: src/routes/dashboard/portfolio.tsx (exists)
/dashboard/deals           Deals page: src/routes/dashboard/deals.tsx (exists)
/dashboard/profile         Profile page: src/routes/dashboard/profile.tsx (exists)
/dashboard/activity        Later placeholder: src/routes/dashboard/activity.tsx (to create later)
```

The planned parent layout file, `src/routes/dashboard/route.tsx`, provides the shared shell and renders the active child through an `Outlet`. The separate `src/routes/dashboard/index.tsx` provides the home-page content. Existing child route files provide their own page content. The Activity route is only a later placeholder for a full activity page; the current sprint needs only an activity preview on the overview.

## Navigation Label Map

| Label | Path | Related need in the requirements |
| --- | --- | --- |
| Overview | `/dashboard` | [See portfolio value or similar metrics and open deals](preishare-dashboard-requirements.md#investor-goals); [review recent activity](preishare-dashboard-requirements.md#investor-goals). |
| Portfolio | `/dashboard/portfolio` | [Find dashboard areas through clear navigation](preishare-dashboard-requirements.md#investor-goals). |
| Deals | `/dashboard/deals` | [See open deals](preishare-dashboard-requirements.md#investor-goals). |
| Profile | `/dashboard/profile` | [Find dashboard areas through clear navigation](preishare-dashboard-requirements.md#investor-goals); this destination already exists in the app. |
| Activity | `/dashboard/activity` | [Review recent activity](preishare-dashboard-requirements.md#investor-goals); later placeholder for a full activity page. Do not show it as an active link until that route exists; the overview preview meets this sprint's need. |

## Planned Files To Create

| File | Status | Purpose |
| --- | --- | --- |
| `src/routes/dashboard/route.tsx` | Planned for the dashboard layout | Holds the shared shell and `Outlet`, separate from the overview index. Move the current parent layout here; do not keep `src/routes/dashboard.tsx` active as a second `/dashboard` parent. |
| `src/routes/dashboard/activity.tsx` | Later placeholder | Provides a future destination for a full activity page; not finished page content for this sprint. |

## Route-to-Requirement Mapping

| Requirement | Route | Route file | Purpose |
| --- | --- | --- | --- |
| See a header and navigate between dashboard areas | `/dashboard` and child routes | `src/routes/dashboard/route.tsx` (planned) | Keeps the shared dashboard shell around each selected page. |
| Get a quick view of portfolio value and open deals | `/dashboard` | `src/routes/dashboard/index.tsx` | Shows sample investment metrics and a portfolio summary. |
| Review recent activity | `/dashboard` | `src/routes/dashboard/index.tsx` | Shows recent activity using placeholder entries. |
| Review investment holdings | `/dashboard/portfolio` | `src/routes/dashboard/portfolio.tsx` | Shows the portfolio page and its sample holdings. |
| Explore investment opportunities | `/dashboard/deals` | `src/routes/dashboard/deals.tsx` | Shows available deals using demo content. |
| Open a full activity page later | `/dashboard/activity` | `src/routes/dashboard/activity.tsx` (later placeholder) | Reserves a future destination; the current overview preview meets this sprint's activity need. |

## Scope Notes

This plan covers the investor dashboard shell and its related overview and navigation. It does not add authentication, admin, payment, settings, database/API routes, or unrelated future features. Dashboard content remains mock or placeholder data for this demo.