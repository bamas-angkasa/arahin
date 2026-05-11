interface GoogleMapsButtonProps {
  link: string
  children?: React.ReactNode
}

export default function GoogleMapsButton({ link, children }: GoogleMapsButtonProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      {children || 'Open in Google Maps'}
    </a>
  )
}