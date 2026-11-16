import { useEffect, useSyncExternalStore } from 'react'

type ThemeMode = 'light' | 'dark' | 'auto'

const themeListeners = new Set<() => void>()

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'auto'
  }

  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored
  }

  return 'auto'
}

function getServerMode(): ThemeMode {
  return 'auto'
}

function subscribeToTheme(onChange: () => void) {
  themeListeners.add(onChange)
  const onStorage = (event: StorageEvent) => {
    if (event.key === 'theme' || event.key === null) {
      onChange()
    }
  }

  window.addEventListener('storage', onStorage)
  return () => {
    themeListeners.delete(onChange)
    window.removeEventListener('storage', onStorage)
  }
}

function notifyThemeListeners() {
  themeListeners.forEach((listener) => listener())
}

function applyThemeMode(mode: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode

  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(resolved)

  if (mode === 'auto') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', mode)
  }

  document.documentElement.style.colorScheme = resolved
}

export default function ThemeToggle() {
  const mode = useSyncExternalStore(
    subscribeToTheme,
    getInitialMode,
    getServerMode,
  )

  useEffect(() => {
    applyThemeMode(mode)
  }, [mode])

  useEffect(() => {
    if (mode !== 'auto') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyThemeMode('auto')

    media.addEventListener('change', onChange)
    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [mode])

  function toggleMode() {
    const nextMode: ThemeMode =
      mode === 'light' ? 'dark' : mode === 'dark' ? 'auto' : 'light'
    applyThemeMode(nextMode)
    window.localStorage.setItem('theme', nextMode)
    notifyThemeListeners()
  }

  const label =
    mode === 'auto'
      ? 'Theme mode: auto (system). Click to switch to light mode.'
      : `Theme mode: ${mode}. Click to switch mode.`

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--sea-ink)] shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5"
    >
      {mode === 'auto' ? 'Auto' : mode === 'dark' ? 'Dark' : 'Light'}
    </button>
  )
}
