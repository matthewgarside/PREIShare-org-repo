# PREIshare Investor Dashboard — Component Inventory

## Scope
Plan reusable UI components for the responsive PREIshare investor dashboard shell and its four pages.
All content is mock or placeholder data; components do not fetch real data or connect to a database.
Authentication, payments, admin tools, settings, and other features are outside this sprint.

## Layout components (shared chrome)

| Component Name | Responsibility | Used On | Must NOT Do |
|----------------|----------------|----------|-------------|
| `AppShell` | Arrange the shared sidebar, header, and current page content in a responsive dashboard layout. | All four pages: `/dashboard`, `/dashboard/portfolio`, `/dashboard/deals`, and `/dashboard/profile`. | Define navigation data or contain page-specific investment, deal, or profile content. |
| `Sidebar` | Display the shared navigation in the dashboard sidebar area. | All four pages, inside `AppShell`. | Create or maintain a separate set of navigation labels or routes. |
| `Header` | Display the current page title and a placeholder investor label. | All four pages, inside `AppShell`. | Render navigation links or handle authentication or account management. |
| `NavItems` | Define the shared navigation labels and paths: Home (`/dashboard`), Portfolio (`/dashboard/portfolio`), Deals (`/dashboard/deals`), and Profile (`/dashboard/profile`). | All four pages, displayed by `Sidebar`. | Duplicate the navigation list in another component or contain page content. |

## Dashboard home widgets

| Component Name | Responsibility | Used On | Must NOT Do |
|----------------|----------------|----------|-------------|
| `StatsCard` | Display one labeled placeholder statistic for a quick portfolio overview. | Home at `/dashboard`; the page may display multiple instances. | Calculate real financial results, fetch data, or arrange the entire Home page. |
| `PortfolioSummary` | Display a compact mock summary of the investor's portfolio. | Home at `/dashboard`. | Replace the full investment table or calculate live portfolio performance. |
| `RecentActivity` | Display a short list of mock recent investor activity. | Home at `/dashboard`. | Fetch live activity or become a separate notifications feature. |

## Page-level components

| Component Name | Responsibility | Used On | Must NOT Do |
|----------------|----------------|----------|-------------|
| `PortfolioTable` | Display mock investments in a table or list for review. | Portfolio at `/dashboard/portfolio`. | Fetch holdings, calculate returns, or process investment actions. |
| `DealsList` | Display mock deals that are open or available to investors. | Deals at `/dashboard/deals`. | Fetch live deals or handle subscriptions and payments. |
| `ProfileCard` | Display placeholder investor name and contact information. | Profile at `/dashboard/profile`. | Handle authentication, edit credentials, or save profile changes. |

## Composition rules
1. Each component has one responsibility and is defined once in this inventory.
2. `AppShell` wraps each page; page components provide only their own page content.
3. `NavItems` is the single source of shared navigation labels and paths; `Sidebar` displays it without defining another list.
4. Components receive or display mock and placeholder content only; they do not fetch data, connect to a database, handle authentication, or process payments.

## Mapping check (IA ↔ components)
- Home (`/dashboard`) → `StatsCard`, `PortfolioSummary`, and `RecentActivity` inside `AppShell`.
- Portfolio (`/dashboard/portfolio`) → `PortfolioTable` inside `AppShell`.
- Deals (`/dashboard/deals`) → `DealsList` inside `AppShell`.
- Profile (`/dashboard/profile`) → `ProfileCard` inside `AppShell`.