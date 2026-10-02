# PREIshare Dashboard Stakeholder Handoff

## Demo Today

The current PREIshare dashboard demo shows the investor shell in a browser with four route-based areas: Overview at `/dashboard`, Portfolio at `/dashboard/portfolio`, Deals at `/dashboard/deals`, and Profile at `/dashboard/profile`.

On the Overview page, the demo includes a page header, a desktop sidebar or mobile navigation depending on viewport size, and summary sections for metrics, portfolio summary, and recent activity. The UI is intentionally built as a demo shell: the metric labels include “Portfolio value (demo)”, “Open deals (demo)”, and “Active investments (demo)”, and the portfolio and activity sections currently render empty-state messaging instead of live investor data. The page explicitly states that these are placeholder values and not live investor data.

This sprint demonstrates the layout, navigation, and responsive shell, not live account data, authentication, or write actions.

## Requirements Traceability

| Success Criterion | Status | Evidence | Notes |
| --- | --- | --- | --- |
| The dashboard shell opens in a browser. | Met | `docs/preishare-dashboard-requirements.md`; `src/routes/dashboard/index.tsx`; `src/routes/dashboard/route.tsx`; browser checks in `docs/responsive-qa-checklist.md` | The dashboard route loads and the app renders the shell in the browser. |
| The browser view shows the header, navigation, metrics, and recent activity. | Met | `src/routes/dashboard/index.tsx`; `docs/dashboard-component-architecture.md`; `docs/responsive-qa-checklist.md` | The Overview page includes the header, navigation, metric cards, and the RecentActivity section. |
| The overview shows a portfolio value or similar summary metric and open deals. | Met | `src/routes/dashboard/index.tsx`; `docs/dashboard-routing-plan.md`; `docs/dashboard-component-architecture.md` | The home page renders demo metric cards labeled “Portfolio value (demo)” and “Open deals (demo)”. The metric values are placeholders, not real data. |
| The recent activity area shows mock or placeholder entries. | Partial | `src/routes/dashboard/index.tsx`; `docs/dashboard-routing-plan.md`; `docs/dashboard-component-architecture.md` | The route includes a RecentActivity section, but the current demo uses an empty state message rather than populated mock activity rows. |
| Navigation is visible, and its links can be selected in the browser. | Met | `docs/dashboard-component-architecture.md`; `docs/responsive-qa-checklist.md`; `src/routes/dashboard/portfolio.tsx` | Desktop Sidebar and mobile MobileNav both expose the dashboard destinations and the QA checklist confirms navigation reaches `/dashboard/portfolio`. |
| No live portfolio data, database-backed data, or real financial calculations are required for the demo. | Met | `docs/preishare-dashboard-requirements.md`; `docs/architecture-decisions.md`; `src/routes/dashboard/index.tsx` | The demo explicitly uses placeholder values and empty states, and the architecture notes state that the dashboard is a demo-ready shell rather than a live financial product. |

## Decisions Made

- Dashboard routing structure: The dashboard uses TanStack Start with file-based routes under `src/routes/`. The parent dashboard route is `/dashboard`, and nested routes provide the four demo areas: Overview, Portfolio, Deals, and Profile. The route structure is intended to be directly reviewable and easy to extend without a second manual route table.
- Reusable AppShell: The shared dashboard shell wraps the active page with a consistent header, navigation, and main content area. The layout route renders `AppShell` and then an `Outlet`, so child pages share the same shell while their content changes.
- Header: The header sits across the top of the dashboard and displays the page title and PREIshare identity. The architecture keeps the title aligned with the active route and uses the same dashboard navigation config to determine the current page name.
- Sidebar and MobileNav: The desktop sidebar and the mobile navigation provide the same four destinations: Overview, Portfolio, Deals, and Profile. The active route is indicated in the navigation, and the responsive QA notes confirm the mobile nav is visible and usable at 375px.
- Reusable dashboard widgets: The dashboard home page uses reusable components such as `MetricCard`, `PortfolioSummary`, and `RecentActivity`. These widgets are designed to receive display-ready values and empty-state text rather than hard-coded investor business rules.
- Responsive layout approach: The layout is designed to stack sections on small screens, switch to the sidebar on larger screens, and keep the dashboard readable without horizontal overflow at the tested widths of 375px, 768px, and 1280px. The QA checklist notes that no responsive issues were observed for the current demo at those widths.
- Use of mock or placeholder data: Sprint 3 intentionally uses mock or placeholder content for metrics, portfolio summary, deal information, and recent activity. The architecture notes specifically say this is a demo-ready dashboard shell and that no live portfolio, account, or financial calculations are part of the current implementation.

## Known Limitations

- Live Supabase or PostgreSQL-backed portfolio data is not implemented.
- There is no real signed-in investor identity or protected dashboard access.
- There are no write or update actions in the dashboard shell.
- There is no backend integration for portfolio, deals, profile, or activity data.
- The current Overview page has an empty-state view for portfolio and activity rather than populated mock records.
- The Sprint 3 scope intentionally excludes admin tools, payments, tax reports, and real financial calculations.

## Recommended Next Sprint Work

1. Define the authentication model and protect the dashboard routes for signed-in investors only.
2. Agree on the data contracts for investor profiles, holdings, deals, and activity, then connect the dashboard to live data sources.
3. Replace empty-state placeholders with representative mock content and test populated layouts for long names, values, and timestamps.
4. Add loading, empty, and error states for portfolio and activity data before live data is connected.
5. Define the real portfolio metrics and financial calculations that should be shown once the source data and formulas are agreed.

The current dashboard is a valid demo shell for Sprint 3, but it is not a live investor product and should be treated as a frontend foundation rather than a production-ready system.