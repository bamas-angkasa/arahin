interface RouteSummaryProps {
  totalDistance?: number
  totalDuration?: number
}

export default function RouteSummary({ totalDistance, totalDuration }: RouteSummaryProps) {
  if (!totalDistance || !totalDuration) {
    return null
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Route Summary</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Total Distance</p>
          <p className="text-2xl font-semibold text-gray-900">{totalDistance.toFixed(1)} km</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Estimated Time</p>
          <p className="text-2xl font-semibold text-gray-900">{Math.round(totalDuration)} min</p>
        </div>
      </div>
    </div>
  )
}