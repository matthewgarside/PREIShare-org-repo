# PREIshare Dashboard Component Architecture

This document describes the frontend structure for PREIshare's investor dashboard. The dashboard is a demo experience: its displayed content can use mock or placeholder data, and the shared shell is reused across dashboard routes.

## Component Inventory

| Component Name | Responsibility | Parent | Child Components | Layout Region | Notes |
| --- | --- | --- | --- | --- | --- |
| AppShell | Place the shared dashboard header, navigation, and active page content. | Dashboard layout route | Header, Sidebar, MobileNav; page content | Entire dashboard frame | Shared by the overview and dashboard child routes. |
| Header | Show the dashboard title and PREIshare identity at the top of the page. | AppShell | None required | Top of the dashboard | Keep the title simple and consistent across dashboard pages. |
| Sidebar | Provide navigation to the dashboard's investor destinations on larger screens. | AppShell | None required | Beside main content | Uses the same destinations as MobileNav and indicates the active route. |
| MobileNav | Provide access to the dashboard's investor destinations on small screens. | AppShell | None required | Compact navigation area for mobile | Replaces the sidebar's navigation function on small screens and indicates the active route. |
| MetricCard | Present one short investor dashboard metric, such as a portfolio summary or open-deal count. | Dashboard home page | None required | Metrics area in main content | Reusable for each metric; receives display text rather than investor-specific data rules. |
| PortfolioSummary | Show a concise summary of portfolio rows or summary items on the overview. | Dashboard home page | None required | Main content, below or alongside metrics | Can show an empty message when no summary items are provided. |
| RecentActivity | Show a short list of recent activity items on the overview. | Dashboard home page | None required | Main content, below or alongside the portfolio summary | Uses mock or placeholder items for this demo. |

## Beginner-Level Props

Props are the simple values a parent gives a component so it can display the right content. Keep investor content supplied to the component; do not place real investor data or business rules in a component's responsibility.

- **AppShell:** `children` (the active route's page content), `navigationItems` (the shared list of destination labels and paths), `activeRoute` (the current path).
- **Header:** `title` (text shown as the page or dashboard title).
- **Sidebar:** `items` (navigation labels and paths), `activeRoute` (the current path).
- **MobileNav:** `items` (the same navigation labels and paths as Sidebar), `activeRoute` (the current path).
- **MetricCard:** `label` (metric name), `value` (display text or number), `hint` (optional short supporting text).
- **PortfolioSummary:** `rows` or `summaryItems` (display-ready portfolio summary entries), `emptyMessage` (text shown when there are no entries).
- **RecentActivity:** `items` (activity entries with display text and time), `emptyMessage` (text shown when there are no entries).

Navigation items should point to the existing dashboard destinations: Overview, Portfolio, Deals, and Profile. A full Activity destination is not part of the current route plan; recent activity is shown only as an overview section.

## Parent / Child Structure

The dashboard layout route renders one shared **AppShell** around whichever dashboard page is active. The shell contains the **Header**, the **Sidebar** for larger screens, the **MobileNav** for small screens, and the main content area for the active page. Sidebar and MobileNav receive the same destination list so investors can reach the same pages at every screen size.

The `/dashboard` overview page places its dashboard content in the shell's main area. That overview contains reusable **MetricCard** instances, a **PortfolioSummary**, and a **RecentActivity** section. The Portfolio, Deals, and Profile pages also render inside AppShell, while their page-specific content remains in their route pages.

```text
AppShell
- Header
- Sidebar
- MobileNav
- Main content area (active dashboard route)

Dashboard Home (/dashboard)
- MetricCard (one per summary metric)
- PortfolioSummary
- RecentActivity
```

## Layout Regions

- **Header:** Runs across the top of the dashboard shell and displays the dashboard title and PREIshare identity.
- **Sidebar:** Sits beside the main content on tablet and desktop, with links to Overview, Portfolio, Deals, and Profile.
- **MobileNav:** Provides those same destinations in a compact navigation area on mobile. It takes over navigation access when a persistent sidebar does not fit.
- **Main content:** Occupies the remaining page area and displays the active route's content.
- **Metrics:** On Dashboard Home, appear near the top of the main content as a group of MetricCards, including summary information such as portfolio value or open deals when supplied.
- **Portfolio Summary:** Appears in Dashboard Home's main content after or alongside the metrics, depending on available width.
- **Recent Activity:** Appears in Dashboard Home's main content near the Portfolio Summary. It is an overview preview, not a separate active destination in this route plan.

## Responsive Behavior

- **Mobile:** Use MobileNav to provide the same investor destinations as the Sidebar. Do not leave navigation unavailable when the desktop Sidebar no longer fits. Stack main content sections in one column. MetricCards can stack or wrap while keeping labels, values, and optional hints readable. Portfolio summary entries and activity items should remain visible without requiring a wide table or hover-only controls.
- **Tablet:** Keep navigation available through a compact Sidebar or MobileNav layout, with the active route clear. Reflow the main content into one or two columns as space permits. MetricCards may share a row when their text remains readable; otherwise wrap them. Keep the portfolio summary and activity list usable at the available width.
- **Desktop:** Show the Sidebar beside the main content and keep the Header across the top. Use a multi-column metrics layout when there is room. PortfolioSummary and RecentActivity may sit side by side or stack, based on readable content width.

At every size, content should reflow rather than become cramped: metric values and labels must remain readable, and portfolio and activity content must remain accessible.

## Route Alignment

The dashboard layout route owns AppShell and keeps it in place while the active child route changes. This makes the header and navigation reusable without duplicating them on each page.

- `/dashboard`: Dashboard Home displays MetricCards, PortfolioSummary, and RecentActivity.
- `/dashboard/portfolio`: Displays the portfolio page inside the shared AppShell.
- `/dashboard/deals`: Displays the deals page inside the shared AppShell.
- `/dashboard/profile`: Displays the profile page inside the shared AppShell.

The Sidebar and MobileNav use the same four destinations and reflect which route is active. The route plan reserves a possible full activity page for later; it is not added to navigation or treated as a current route here.

## Out of Scope

This component plan does not include:

- Authentication
- Payments or wire transfers
- Admin tools
- Live database data or real financial calculations
- Charts libraries
- Settings panels
- Backend API implementation
- Tax reports, PDF export, map views, or unrelated future features
- A separate full activity route