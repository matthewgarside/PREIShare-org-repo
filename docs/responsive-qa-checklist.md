# PREIshare Dashboard Responsive QA Checklist

**Tester:** 
**Date:** 
**Route:** `/dashboard` (overview)
**Local URL:** `http://localhost:3000/dashboard`

Leave each checkbox unchecked until the behavior has been observed in the browser. Record the viewport size and a short note for anything unexpected.

## Mobile at 375px

- [ ] Page has no horizontal overflow or sideways scrolling.
- [ ] Header branding and title remain readable and do not collide with the investor indicator.
- [ ] Desktop Sidebar is hidden and does not cover or squeeze the content.
- [ ] MobileNav control is visible.
- [ ] MobileNav opens to show all destinations, closes when toggled, and closes after selecting a destination.
- [ ] Metric cards stack or wrap without clipped labels, values, or hints.
- [ ] PortfolioSummary and its empty-state text fit without overflow.
- [ ] RecentActivity and its empty-state text fit without overflow.
- [ ] Content has readable spacing; headings and body text are not cramped or clipped.

## Tablet at 768px

- [ ] Page has no horizontal overflow or sideways scrolling.
- [ ] Header branding and title remain readable at the narrower content width.
- [ ] Sidebar is visible and usable; MobileNav is hidden, with no duplicate navigation.
- [ ] Metric cards use a readable layout and wrap without clipped text.
- [ ] PortfolioSummary and RecentActivity fit their available width without overlap or overflow.
- [ ] Content spacing and text remain readable beside the Sidebar.

## Desktop at 1280px

- [ ] Page has no horizontal overflow or sideways scrolling.
- [ ] Header branding, title, and investor indicator remain readable and aligned.
- [ ] Sidebar is visible and usable; MobileNav is hidden.
- [ ] Metric cards align in the available multi-column layout without clipping.
- [ ] PortfolioSummary and RecentActivity sit in the available layout without overlap or overflow.
- [ ] Main content has readable spacing and text at the wider viewport.

## Issues Found

Record observed issues with the route, viewport, visible symptom, and relevant component or file. Do not infer a browser result from source inspection alone.

- `/dashboard` returns HTTP 500 before rendering: the dev server reports duplicate TanStack route IDs for `/dashboard`. Responsive browser checks are blocked until the route conflict is resolved. Route changes were out of scope for this task.

## Known Limitations

- The overview currently supplies no portfolio rows or activity items, so only empty-state overflow can be checked with the current data. Populated content, including long names, descriptions, values, allocations, and timestamps, needs a later browser check when representative data is available.
- Browser verification has not been recorded in this checklist. Do not treat the unchecked items as verified.
