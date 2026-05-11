import * as React from 'react'

import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive'

const variants: Record<BadgeVariant, string> = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground dark:bg-slate-800 dark:text-slate-300',
  outline: 'border border-border bg-background text-foreground',
  success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200',
  destructive: 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-200',
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: BadgeVariant }) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
