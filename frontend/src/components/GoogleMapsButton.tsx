import { ReactNode } from 'react'

interface GoogleMapsButtonProps {
  link: string
  children?: ReactNode
}

export default function GoogleMapsButton({ link, children }: GoogleMapsButtonProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-10 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children || 'Open in Google Maps'}
    </a>
  )
}
