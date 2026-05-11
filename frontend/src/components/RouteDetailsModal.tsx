'use client'

import GoogleMapsButton from '@/components/GoogleMapsButton'
import RouteSummary from '@/components/RouteSummary'
import StopList from '@/components/StopList'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DeliveryPlanWithStops } from '@/types'

interface RouteDetailsModalProps {
  plan: DeliveryPlanWithStops | null
  googleMapsLink?: string
  isOptimizing?: boolean
  onClose: () => void
  onOptimize: () => void
}

export default function RouteDetailsModal({
  plan,
  googleMapsLink,
  isOptimizing,
  onClose,
  onOptimize,
}: RouteDetailsModalProps) {
  if (!plan) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/30 p-3 backdrop-blur-sm sm:items-center">
      <div className="animate-soft-in max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Route details</p>
            <h2 className="mt-1 text-xl font-semibold">{plan.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{plan.start_address}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant={plan.status === 'optimized' ? 'success' : 'secondary'}>
                {plan.status.replace('_', ' ')}
              </Badge>
              <Badge variant="outline">{plan.stops.length} stops</Badge>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            X
          </button>
        </div>

        <div className="max-h-[calc(92vh-92px)] space-y-5 overflow-y-auto p-5">
          <div className="flex flex-wrap gap-3">
            <Button onClick={onOptimize} disabled={isOptimizing || plan.stops.length === 0}>
              {isOptimizing ? 'Optimizing...' : 'Optimize Route'}
            </Button>
            {googleMapsLink && (
              <GoogleMapsButton link={googleMapsLink}>Open in Google Maps</GoogleMapsButton>
            )}
          </div>

          <RouteSummary
            totalDistance={plan.total_distance_km}
            totalDuration={plan.total_duration_minutes}
          />

          <div>
            <h3 className="mb-3 font-semibold">Delivery stops</h3>
            <StopList stops={plan.stops} />
          </div>
        </div>
      </div>
    </div>
  )
}
