'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-20 border-r border-gray-200 bg-white/95 px-3 py-5 shadow-sm backdrop-blur lg:flex lg:flex-col">
        <Link
          href="/dashboard"
          className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-semibold text-white shadow-sm"
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
                  'flex h-11 w-11 items-center justify-center rounded-xl text-sm font-semibold text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900',
                  isActive && 'bg-blue-50 text-blue-600 shadow-sm',
                )}
              >
                {item.icon}
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="lg:pl-20">
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-[#F8FAFC]/90 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Arahin Dispatch</p>
              {title && <h1 className="truncate text-xl font-semibold tracking-normal">{title}</h1>}
              {description && <p className="hidden text-sm text-slate-500 sm:block">{description}</p>}
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden h-10 w-64 items-center rounded-xl border border-gray-200 bg-white px-3 text-sm text-slate-400 shadow-sm md:flex">
                Search routes, drivers, stops
              </div>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm shadow-sm transition hover:bg-slate-50">
                N
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm shadow-sm transition hover:bg-slate-50">
                U
              </button>
            </div>
          </div>
        </header>

        <div className="px-4 py-5 sm:px-6 lg:px-8">{children}</div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-gray-200 bg-white px-3 py-2 shadow-lg lg:hidden">
        {navItems.slice(0, 4).map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-1 text-xs font-medium text-slate-500"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
