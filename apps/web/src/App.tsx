import { useEffect } from 'react'
import { LayoutGrid, Moon, Sun } from 'lucide-react'
import { Link, Navigate, NavLink, Outlet, Route, Routes, useLocation } from 'react-router'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Items } from './Items'
import { BrowserShare, RecentTransactions, UpcomingPayments } from './gallery/ActivitySamples'
import { ContributionHistory, SavingsTargets } from './gallery/FinanceSamples'
import { NotificationPreferences, PayoutThreshold } from './gallery/SettingsSamples'
import { useThemeStore } from './stores/theme'

const navigation = [
  { to: '/components', label: 'Components' },
  { to: '/items', label: 'Items' },
]

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomeRedirect />} />
        <Route path="components" element={<ComponentGallery />} />
        <Route path="items" element={<Items />} />
        <Route path="*" element={<Navigate to="/components" replace />} />
      </Route>
    </Routes>
  )
}

function HomeRedirect() {
  const { hash, search } = useLocation()
  const pathname = hash === '#items' ? '/items' : '/components'
  return <Navigate to={{ pathname, search }} replace />
}

function AppLayout() {
  const { pathname } = useLocation()
  const dark = useThemeStore((state) => state.dark)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const themeLabel = dark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <>
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-[90rem] flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 sm:flex-nowrap sm:px-8">
          <Link to="/components" className="inline-flex shrink-0 items-center gap-2.5 text-sm font-semibold tracking-tight">
            <span className="grid size-8 place-items-center bg-primary text-primary-foreground">
              <LayoutGrid className="size-4" aria-hidden="true" />
            </span>
            Architecture POC
          </Link>
          <nav aria-label="Examples" className="order-3 flex w-full items-center gap-1 sm:order-none sm:w-auto">
            {navigation.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) => cn(
                  'px-3 py-2 text-xs font-semibold transition-colors hover:bg-accent hover:text-accent-foreground',
                  isActive ? 'bg-muted text-foreground' : 'text-muted-foreground',
                )}
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <Button variant="outline" size="icon" className="ml-auto size-8" aria-label={themeLabel} title={themeLabel} onClick={toggleTheme}>
            {dark ? <Sun /> : <Moon />}
          </Button>
        </div>
      </header>
      <Outlet />
    </>
  )
}

function ComponentGallery() {
  return (
    <main className="mx-auto max-w-[90rem] px-4 pt-7 pb-10 sm:px-8 sm:pt-9">
      <h1 className="mb-5 text-[1.9rem] leading-tight font-semibold tracking-[-0.045em] sm:mb-6 sm:text-[2.35rem]">Component gallery</h1>
      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ContributionHistory />
        <PayoutThreshold />
        <SavingsTargets />
        <NotificationPreferences />
        <RecentTransactions />
        <BrowserShare />
        <UpcomingPayments />
      </div>
    </main>
  )
}
