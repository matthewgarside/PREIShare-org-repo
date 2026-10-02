# PREIshare Sprint 3 Architecture Decisions

## TanStack Start File-Based Routing

### Context
PREIshare's investor dashboard has four distinct areas, each of which needs a stable URL: Home (`/dashboard`), Portfolio (`/dashboard/portfolio`), Deals (`/dashboard/deals`), and Profile (`/dashboard/profile`). The route structure should be easy to inspect and extend as the dashboard grows.

### Decision
Use TanStack Start with TanStack Router file-based routing. Route definitions live in `src/routes/`; the dashboard layout route is `src/routes/dashboard.tsx`, and its child pages are represented by route files under `src/routes/dashboard/`. The router generates route registration from this structure rather than maintaining a second, manually synchronized route table.

### Consequences
The file tree provides a direct, reviewable relationship between a page and its URL, while the router handles registration. This avoids duplicated route declarations drifting apart. When adding a dashboard page, developers should add the appropriate route file and update the shared navigation configuration where needed; they should not introduce a competing manual route table. Route files still need to follow TanStack Router's file-route conventions.

## Shared AppShell Layout

### Context
All four investor pages need the same navigation, page header, and main content region. Duplicating those pieces in every route would allow spacing, titles, and navigation behavior to diverge.

### Decision
`AppShell` composes the shared `Sidebar` and `Header` with the main content region. The `/dashboard` layout route renders `AppShell` around an `Outlet`, so each nested route supplies its page content inside the shell's main region.

### Consequences
Shared layout changes can be made once and appear consistently across Home, Portfolio, Deals, and Profile. Page route files can focus on their own content. Future developers should preserve this boundary: avoid copying sidebar/header markup into page routes, and keep page-specific content in the nested route rather than embedding it in the shared shell. The tradeoff is that changes to `AppShell` affect every dashboard page and should be checked across all four routes.

## Shared Navigation Configuration

### Context
The same four areas appear in the sidebar, active-route state, URLs, and page titles. If each part keeps its own labels and paths, small edits can create mismatched links, incorrect active states, or titles that do not match the selected page.

### Decision
Keep navigation labels, paths, and page titles together in `src/components/layout/navConfig.ts`. `NavItems` renders the configured links and marks the current page; `Header` reads the current path and uses the same configuration to select its title.

### Consequences
One shared configuration keeps the sidebar label, destination URL, selected navigation state, and header title aligned. When changing or adding an area, update this configuration rather than copying route metadata into `Sidebar`, `NavItems`, or `Header`. The configuration describes dashboard navigation, not TanStack Router's route registration; the route files remain the source of the actual file-based routes.

## Mock Data Boundary

### Context
Sprint 3 is a demo-ready dashboard shell, not a live financial product. Home metrics, holdings, deals, activity, and profile details are sample or placeholder content and must not be mistaken for investor account information.

### Decision
Dashboard widgets display clearly labeled mock/sample data only. Keep UI components responsible for presenting content rather than coupling their structure and behavior to temporary sample values or a pretend production data service. The component boundaries should allow real data to be supplied later without rebuilding the dashboard presentation.

### Consequences
The shell can be reviewed and exercised before data services exist, and the labels help prevent sample figures from being represented as live financial results. Mock values do not validate real calculations, data access, or account permissions. When integrating real data, developers should define the data contracts and calculations separately, then connect them at the route or component boundary while retaining appropriate loading, empty, and error handling. Supabase/PostgreSQL integration and real investor calculations are not part of the current implementation.

## Responsive and Accessibility Baseline

### Context
Investors need to reach the same dashboard areas on wide screens and narrow phone-sized screens. Navigation or content that only works with a pointer or only fits on desktop would undermine that goal.

### Decision
Preserve the responsive layout rules in `src/styles/dashboard.css`, including narrow-screen navigation, layout changes at wider breakpoints, and contained horizontal scrolling for the portfolio table. Keep semantic landmarks such as the sidebar, navigation, header, and main content, along with visible keyboard focus styles and active-page semantics.

### Consequences
These choices help keep all four areas reachable and the content usable at narrow widths, while semantic structure and focus indicators support keyboard users. Later layout or feature changes should be checked at the 375-pixel viewport used by the Sprint 3 brief as well as on desktop, and should not remove focus visibility or landmarks as incidental styling. The current baseline is not a substitute for a broader accessibility audit.

## Next Sprint Foundations

The Sprint 3 architecture leaves room for future work, but none of the following is implemented by this dashboard shell:

- Supabase authentication, with access requirements and protected-route behavior defined before implementation.
- Live portfolio and deal data, connected through agreed data contracts and reviewed financial calculations.
- pgvector-powered search, once the relevant data and product requirements are established.
- GitHub Actions CI to automate the project's agreed verification checks.

Treat these as future foundations to plan and implement in later work, not as existing capabilities of the Sprint 3 dashboard.