export const dashboardNavigation = [
  { label: 'Home', path: '/dashboard', title: 'Dashboard Overview' },
  { label: 'Portfolio', path: '/dashboard/portfolio', title: 'Portfolio' },
  { label: 'Deals', path: '/dashboard/deals', title: 'Deals' },
  { label: 'Profile', path: '/dashboard/profile', title: 'Profile' },
] as const

export function getDashboardNavigationItem(pathname: string) {
  const normalizedPath = pathname.replace(/\/$/, '') || '/'
  return dashboardNavigation.find((item) => item.path === normalizedPath)
}