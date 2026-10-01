# PREIshare Investor Dashboard: Sprint 3 Client Brief

## Product summary

PREIshare members use the dashboard to scan portfolio value, browse deals, and
review their profile. Sprint 3 builds only the dashboard shell: layout,
navigation, file-based routes, reusable React UI components, and mock data.
The four areas are Home, Portfolio, Deals, and Profile.

The project uses React, TypeScript, TanStack Start, and TanStack Router
file-based routes. Portfolio and deal content in this sprint is mock data only,
not live data.

## Primary actors

| Actor | Role in this sprint |
| --- | --- |
| Investor (member) | Views the Home, Portfolio, Deals, and Profile areas. |
| Future admin | Out of scope for this sprint; no admin tools are included. |

## Investor goals

1. Open Home and see portfolio summary and recent activity placeholders.
2. Open each of the four dashboard areas using the dashboard navigation.
3. Identify the current area from its page title on desktop and phone screens.

## Must-have dashboard areas (this sprint)

These are the only dashboard areas in this sprint. Use the suggested paths for
the file-based routes.

| Area | Suggested route | Shell content |
| --- | --- | --- |
| Home | `/dashboard` | Portfolio summary and recent activity, labeled as mock or placeholder content. |
| Portfolio | `/dashboard/portfolio` | A table or list of holdings, labeled as mock or placeholder content. |
| Deals | `/dashboard/deals` | A list of deals, labeled as mock or placeholder content. |
| Profile | `/dashboard/profile` | Name and contact detail placeholders. |

## Success criteria (demo-ready shell)

- [ ] On desktop, the shared navigation provides a link to Home, Portfolio, Deals, and Profile from every dashboard area.
- [ ] Selecting each navigation link opens its matching file-based route and page title.
- [ ] Each route displays the shared navigation, header, and main content area.
- [ ] At a 375-pixel-wide viewport, all four areas remain reachable and page content has no horizontal overflow or overlap.
- [ ] Sample portfolio, deal, activity, and profile content is visibly labeled as mock or placeholder data, not live data.
- [ ] The dashboard navigation and routes contain only Home, Portfolio, Deals, and Profile.

## Sprint scope

This sprint includes the dashboard layout, navigation, four file-based routes,
reusable React UI components, and mock or placeholder content for the areas
listed above.

## Out of scope

- Authentication
- Live portfolio or deal data, database connections, or backend functionality
- Payments
- Admin tools
- Notifications
- Real financial calculations
- Pages beyond Home, Portfolio, Deals, and Profile

## Implementation notes

Use React, TypeScript, TanStack Start, and TanStack Router file-based routes.
Build the shared shell with reusable React UI components and keep sample
portfolio, deal, and activity content visibly marked as mock or placeholder.

## Open questions / assumptions

- Use English for the dashboard text.