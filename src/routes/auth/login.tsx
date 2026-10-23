// --- src/routes/auth/login.tsx (scaffold shape) ---
// Browser form posts credentials via the browser Supabase client (or a safe server action).
// On success → navigate to /dashboard. On failure → show error text.
// Must NOT import service-role keys or server-only secrets.

// --- src/routes/auth/signup.tsx (scaffold shape) ---
// Same rules as login: email + password, clear errors, no secret keys in the bundle.
// On success → session established → navigate toward /dashboard (or login if email confirm is required).

// --- src/routes/dashboard/route.tsx (scaffold shape) ---
// Layout route for /dashboard/*
// beforeLoad (or server equivalent):
//   const user = await getUser()
//   if (!user) throw redirect({ to: '/auth/login' })
// Render <Outlet /> for child dashboard pages when authenticated.
// Optional: sign-out button that calls signOut() then redirects to /auth/login.