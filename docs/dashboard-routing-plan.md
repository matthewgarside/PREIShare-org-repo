# PREIshare Dashboard Routing Plan

## Existing Route Inventory

| Route file | URL | Purpose |
| --- | --- | --- |
| `src/routes/__root.tsx` | App-wide | Provides the document shell, shared header and footer, styles, and router tools. |
| `src/routes/index.tsx` | `/` | Shows the starter home page and links to the dashboard. |
| `src/routes/about.tsx` | `/about` | Shows information about the TanStack Start starter. |
| `src/routes/dashboard.tsx` | `/dashboard` (parent) | Provides the dashboard `AppShell` and an `Outlet` for the selected page. |
| `src/routes/dashboard/index.tsx` | `/dashboard` (overview) | Shows sample portfolio metrics, open deals, portfolio summary, and recent activity. |
| `src/routes/dashboard/portfolio.tsx` | `/dashboard/portfolio` | Shows the investor's portfolio page with sample holdings. |
| `src/routes/dashboard/deals.tsx` | `/dashboard/deals` | Shows current investment opportunities. |
| `src/routes/dashboard/profile.tsx` | `/dashboard/profile` | Shows investor profile information. |

## Requirements That Need Routes

- Investors need a dashboard they can open and navigate. The `/dashboard` parent provides the shared shell; its child pages provide the destinations.
- Investors need a quick view of portfolio value and open deals. The `/dashboard` overview displays these summary metrics.
- Investors need to review recent activity. The `/dashboard` overview displays sample activity.
- Investors need clear navigation to their portfolio and available deals. The portfolio and deals pages have their own routes.
- The demo uses mock or placeholder content. These requirements do not need database or API routes.

## Planned Dashboard Route Tree

```text
/dashboard                 Dashboard parent shell
/dashboard                 Overview index page
/dashboard/portfolio       Portfolio page
/dashboard/deals           Investment opportunities page
/dashboard/profile         Investor profile page
```

The dashboard parent route provides the shared shell and renders the active child through an `Outlet`. Child route files provide page-specific content. The overview index shares the `/dashboard` URL with its parent layout.

## Route-to-Requirement Mapping

| Requirement | Route | Route file | Purpose |
| --- | --- | --- | --- |
| See the dashboard header and navigate between dashboard areas | `/dashboard` and child routes | `src/routes/dashboard.tsx` | Keeps the shared dashboard shell around each selected page. |
| Get a quick view of portfolio value and open deals | `/dashboard` | `src/routes/dashboard/index.tsx` | Shows sample investment metrics and a portfolio summary. |
| Review recent activity | `/dashboard` | `src/routes/dashboard/index.tsx` | Shows recent activity using placeholder entries. |
| Review investment holdings | `/dashboard/portfolio` | `src/routes/dashboard/portfolio.tsx` | Shows the portfolio page and its sample holdings. |
| Explore investment opportunities | `/dashboard/deals` | `src/routes/dashboard/deals.tsx` | Shows available deals using demo content. |

## Scope Notes

This plan covers only the investor dashboard shell and its current overview, portfolio, deals, and profile pages. It does not add authentication, admin, payment, settings, database/API routes, or unrelated future features. Dashboard content remains mock or placeholder data for this demo.