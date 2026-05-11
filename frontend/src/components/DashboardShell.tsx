'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

import ThemeToggle from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: 'D' },
  { label: 'Routing', href: '/dashboard', icon: 'R' },
  { label: 'Drivers', href: '/dashboard', icon: 'V' },
  { label: 'Deliveries', href: '/dashboard', icon: 'L' },
  { label: 'Analytics', href: '/dashboard', icon: 'A' },
  { label: 'Settings', href: '/dashboard', icon: 'S' },
]

interface DashboardShellProps {
  children: ReactNode
  title?: string
  description?: string
}

export default function DashboardShell({ children, title, description }: DashboardShellProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background bg-geo-radial text-foreground transition-colors">
      <div className="pointer-events-none fixed inset-0 geo-grid opacity-40 dark:opacity-100" />

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-20 border-r border-border bg-card/90 px-3 py-5 shadow-sm backdrop-blur lg:flex lg:flex-col">
        <Link
          href="/dashboard"
          className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-lg font-semibold text-primary-foreground shadow-glow"
        >
          A
        </Link>

        <nav className="mt-8 flex flex-1 flex-col items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href && item.label === 'Dashboard'

            return (
              <Link
                key={item.label}
                href={item.href}
                title={item.label}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-xl text-sm font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground',
                  isActive && 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/15',
                )}
              >
                {item.icon}
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="relative lg:pl-20">
        <header className="sticky top-0 z-20 border-b border-border bg-background/82 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Arahin Dispatch
              </p>
              {title && <h1 className="truncate text-xl font-semibold tracking-normal">{title}</h1>}
              {description && <p className="hidden text-sm text-muted-foreground sm:block">{description}</p>}
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden h-10 w-64 items-center rounded-xl border border-border bg-card px-3 text-sm text-muted-foreground shadow-sm md:flex">
                Search routes, drivers, stops
              </div>
              <ThemeToggle />
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-sm shadow-sm">
                U
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 py-5 sm:px-6 lg:px-8">{children}</div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-border bg-card/95 px-3 py-2 shadow-lg backdrop-blur lg:hidden">
        {navItems.slice(0, 4).map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-1 text-xs font-medium text-muted-foreground"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-xs">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
