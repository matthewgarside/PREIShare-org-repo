# PREIshare Sprint 3 Handoff

## Stakeholder Summary
Sprint 3 delivered the working dashboard frame for investors. Teammates can open Home, Portfolio, Deals, and Profile and move between them using the shared navigation. The pages adapt to desktop and phone-sized screens. The information shown is sample content for demonstration, not real investor account data.

## What Shipped

The four dashboard routes are:

- `/dashboard` — Home
- `/dashboard/portfolio` — Portfolio
- `/dashboard/deals` — Deals
- `/dashboard/profile` — Profile

Their route files are `src/routes/dashboard/index.tsx`, `src/routes/dashboard/portfolio.tsx`, `src/routes/dashboard/deals.tsx`, and `src/routes/dashboard/profile.tsx`. The shared route layout is implemented in `src/routes/dashboard.tsx`.

Reusable components shipped:

- `AppShell`, `Sidebar`, `Header`, and `NavItems` provide the shared layout and navigation in `src/components/layout/`.
- `StatsCard`, `PortfolioSummary`, and `RecentActivity` make up the Home view in `src/components/dashboard/`.
- `PortfolioTable`, `DealsList`, and `ProfileCard` provide content for the Portfolio, Deals, and Profile views in `src/components/dashboard/`.

The dashboard uses mock/sample data only. It does not load live investor, portfolio, deal, or activity information.

## How to Run Locally

From the repository root, install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the local URL printed by the dev server, then go to `/dashboard`.

## Demo Script

1. Start the app with `npm run dev` and open the local URL printed in the terminal.
2. Open `/dashboard` to show the Home page.
3. Visit Home (`/dashboard`) and point out its summary and recent activity sections.
4. Visit Portfolio (`/dashboard/portfolio`) and show the sample holdings table.
5. Visit Deals (`/dashboard/deals`) and show the sample deals list.
6. Visit Profile (`/dashboard/profile`) and show the placeholder investor details.
7. Resize the browser to a phone-sized width, such as 375 pixels, and show that the areas remain reachable and the page content fits the responsive layout.
8. Point out that the displayed values and lists are mock/sample data, not live account information.

## Known Limitations

These items are intentionally out of scope for the Sprint 3 dashboard shell, not bugs:

- Real authentication
- Live Supabase/PostgreSQL data
- Real investor financial calculations
- Payments
- Admin tools

## Recommended Next-Sprint Work

- Define authentication requirements and how access to dashboard routes should work before implementing authentication.
- Agree on data ownership, schemas, and query requirements for investor profiles, holdings, deals, and activity before connecting live Supabase/PostgreSQL data.
- Define and review the financial metrics the dashboard should show before replacing sample values with real calculations.
- Plan loading, empty, and error states for the dashboard views as live data is introduced.