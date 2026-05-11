'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('arahin-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = savedTheme ? savedTheme === 'dark' : prefersDark

    setIsDark(shouldUseDark)
    document.documentElement.classList.toggle('dark', shouldUseDark)
  }, [])

  function toggleTheme() {
    setIsDark((current) => {
      const next = !current
      window.localStorage.setItem('arahin-theme', next ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', next)
      return next
    })
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-xl border border-border bg-card px-3 text-xs font-semibold text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground',
        className,
      )}
    >
      {isDark ? 'Dark' : 'Light'}
    </button>
  )
}
