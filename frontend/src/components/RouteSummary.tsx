import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RouteSummaryProps {
  totalDistance?: number
  totalDuration?: number
}

export default function RouteSummary({ totalDistance, totalDuration }: RouteSummaryProps) {
  if (!totalDistance || !totalDuration) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Route Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-md bg-muted/60 p-4">
          <p className="text-sm text-muted-foreground">Total Distance</p>
          <p className="mt-1 text-2xl font-semibold">{totalDistance.toFixed(1)} km</p>
        </div>
        <div className="rounded-md bg-muted/60 p-4">
          <p className="text-sm text-muted-foreground">Estimated Time</p>
          <p className="mt-1 text-2xl font-semibold">{Math.round(totalDuration)} min</p>
        </div>
      </CardContent>
    </Card>
  )
}
