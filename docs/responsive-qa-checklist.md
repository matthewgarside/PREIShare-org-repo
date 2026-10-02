# PREIshare Dashboard Responsive QA Checklist

**Tester:** GitHub Copilot (Playwright browser QA)
**Date:** 2026-10-01
**Route:** `/dashboard` (overview)
**Local URL:** `http://localhost:3011/dashboard`

Results below were observed in the browser at the exact CSS viewport widths. They cover the current demo content and its empty states.

## Mobile at 375px

- **Pass** — No horizontal overflow or sideways scrolling; the document and dashboard sections fit the viewport.
- **Pass** — PREIshare branding, Dashboard title, and investor indicator remain readable without overlap.
- **Pass** — Desktop Sidebar is hidden and does not cover or squeeze the content.
- **Pass** — MobileNav control is visible.
- **Pass** — MobileNav opens all four destinations, closes on toggle, and closes after selecting Portfolio; navigation reaches `/dashboard/portfolio`.
- **Pass** — Three metric cards stack in one column; labels, values, and hints are not clipped.
- **Pass** — PortfolioSummary and its empty-state text fit without overflow.
- **Pass** — RecentActivity and its empty-state text fit without overflow.
- **Pass** — Headings, body text, and spacing are readable in the 375px browser view.

## Tablet at 768px

- **Pass** — No horizontal overflow or sideways scrolling; dashboard sections fit their containers.
- **Pass** — Header branding, title, and investor indicator remain readable without overlap.
- **Pass** — Sidebar is visible with all four links; MobileNav is hidden. The Portfolio link navigates to `/dashboard/portfolio`.
- **Pass** — Metrics use two columns, with the third card wrapping below; card text is not clipped.
- **Pass** — PortfolioSummary and RecentActivity stack vertically and fit without overlap or overflow.
- **Pass** — Content spacing and text remain readable beside the Sidebar.

## Desktop at 1280px

- **Pass** — No horizontal overflow or sideways scrolling; dashboard sections fit their containers.
- **Pass** — Header branding, title, and investor indicator remain readable and aligned.
- **Pass** — Sidebar is visible with four links; MobileNav is hidden.
- **Pass** — Three metric cards align in three columns without clipping.
- **Pass** — PortfolioSummary and RecentActivity sit side by side without overlap or overflow.
- **Pass** — Main content spacing and text remain readable at the wider viewport.

## Issues Found

- The initial browser run returned HTTP 500 because two files declared the `/dashboard` parent route. The redundant root-level route was removed; the planned nested dashboard parent and child URLs remain. Route generation and browser navigation now succeed.
- No responsive layout issues were observed at 375px, 768px, or 1280px for the current demo content.

## Fix Log

| Cycle | Breakpoint | Files touched | Prompt summary | Re-test result |
| --- | --- | --- | --- | --- |
| 1 | Route blocker; all viewports | Removed duplicate root-level dashboard route; regenerated [src/routeTree.gen.ts](src/routeTree.gen.ts); updated this checklist. | Resolve the duplicate `/dashboard` route ID while retaining the planned nested parent and child destinations. | `npm run generate-routes` passed. `/dashboard` and `/dashboard/portfolio` render and navigate. Browser checks passed at 375px, 768px, and 1280px. |

## Known Limitations

- The overview currently supplies no portfolio rows or activity items. Populated content with long names, descriptions, values, allocations, and timestamps was not available for this pass and should be checked when representative data is added.

## Sign-Off

- Critical mobile checks M1–M7: **Pass**.
- Critical tablet checks T1–T5: **Pass**.
- Critical desktop checks D1–D5: **Pass**.
- Ready for stakeholder handoff: **Yes** for the current demo and empty-state content. Populated-content wrapping remains a known limitation.
