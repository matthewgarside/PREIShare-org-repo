# PREIshare Investor Dashboard Shell — Verification Checklist

**Sprint:** 3  
**Date:** 2026-10-01  
**Sources of truth:** `docs/investor-dashboard-brief.md`, `docs/dashboard-ia.md`, `docs/component-plan.md`

## Status key

- Pass = requirement met for Sprint 3.
- Fail = in-scope item is not working as required.
- Deferred = intentionally outside Sprint 3 scope.

| Check | Status | Evidence | Fix Note or Deferral Reason |
|---|---|---|---|
| 1. Dashboard routes | Pass | The dashboard route structure is present in `src/routes/dashboard.tsx` and the route files for `/dashboard`, `/dashboard/portfolio`, `/dashboard/deals`, and `/dashboard/profile`. | No fix required. |
| 2. Shared AppShell layout | Pass | `src/components/layout/AppShell.tsx` wraps all dashboard pages with the shared sidebar, header, and main content area. | No fix required. |
| 3. Sidebar navigation | Pass | `src/components/layout/Sidebar.tsx` renders the dashboard navigation and `src/components/layout/NavItems.tsx` defines the shared links for Home, Portfolio, Deals, and Profile. | No fix required. |
| 4. Active navigation state | Pass | `NavItems` compares the current pathname to the route and sets `aria-current="page"` on the active link. | No fix required. |
| 5. Header page titles | Pass | `src/components/layout/Header.tsx` reads the active route and resolves the matching page title from the dashboard navigation config. | No fix required. |
| 6. Dashboard Home widgets | Pass | `src/routes/dashboard/index.tsx` renders `StatsCard`, `PortfolioSummary`, and `RecentActivity` in the Home view. | No fix required. |
| 7. Portfolio page | Pass | `src/routes/dashboard/portfolio.tsx` renders `PortfolioTable` and the page is in the dashboard route tree. | No fix required. |
| 8. Deals page | Pass | `src/routes/dashboard/deals.tsx` renders `DealsList` for the dashboard deals view. | No fix required. |
| 9. Profile page | Pass | `src/routes/dashboard/profile.tsx` renders `ProfileCard` and the route is present in the dashboard tree. | No fix required. |
| 10. Mock-data clarity | Pass | The dashboard uses labeled sample content such as “Sample data for demonstration only” and “Sample dashboard data. All financial values and deal counts are placeholders.” | No fix required. |
| 11. Desktop responsiveness | Pass | The desktop shell in `src/styles/dashboard.css` uses a two-column dashboard layout with a fixed sidebar and content region for larger screens. | No fix required. |
| 12. Mobile responsiveness | Pass | The same stylesheet uses stacked/mobile-friendly grid rules and allows the portfolio table to scroll horizontally inside the content area instead of overflowing the layout. | No fix required. |
| 13. Keyboard accessibility | Pass | Links and tab targets include visible focus styles, and the nav uses standard link semantics with `aria-current` for the active route. | No fix required. |
| 14. Build/typecheck verification | Pass | Verified with `npm run build && npm run typecheck`. The build completed successfully and TypeScript finished without errors. | No fix required. |
| 15. Out-of-scope items | Deferred | These are intentionally outside Sprint 3 and are not part of the dashboard shell: real authentication, live Supabase/PostgreSQL data, payments, admin tools, and real investor financial calculations. | Deferred by scope. |

## Deferred items from Sprint 3 scope

| Item | Status | Reason |
|---|---|---|
| Real authentication | Deferred | Not part of the investor dashboard shell; add in a later sprint when auth flows are defined. |
| Live Supabase/PostgreSQL data | Deferred | The dashboard is intentionally mock-only for Sprint 3. |
| Payments | Deferred | Payment workflows are outside this shell and not required for dashboard review. |
| Admin tools | Deferred | Admin functionality is explicitly out of scope for the investor dashboard shell. |
| Real investor financial calculations | Deferred | The app uses placeholder values and sample portfolio metrics only. |

## Sprint 3 summary

The PREIshare investor dashboard shell meets the Sprint 3 brief and IA for the four dashboard areas: Home, Portfolio, Deals, and Profile. The shell is shared, route-based, mock-data labeled, and build-verified. The deferred items remain explicitly outside this sprint and should not be added to the shell until the product requirements are defined.

## Sign-off for handoff

- [x] All in-scope checks pass for the Sprint 3 dashboard shell.
- [x] Deferred items are limited to agreed out-of-scope work.
- [x] The shell is ready for demo review against the PREIshare investor dashboard story.

**Overall result:** Ready for stakeholder handoff

**Verifier signature:** PREIshare Sprint 3 review