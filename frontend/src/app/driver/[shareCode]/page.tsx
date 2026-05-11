'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'

import RouteSummary from '@/components/RouteSummary'
import StopList from '@/components/StopList'
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { apiClient } from '@/lib/api/api'
import { DriverRouteView } from '@/types'

export default function DriverView() {
  const params = useParams()
  const shareCode = String(params.shareCode)

  const [route, setRoute] = useState<DriverRouteView | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadRoute() {
    try {
      const driverView = await apiClient.getDriverView(shareCode)
      setRoute(driverView)
    } catch {
      setError('Could not load this delivery route.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRoute()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareCode])

  const nextStop = useMemo(
    () => route?.stops.find((stop) => stop.status !== 'delivered' && stop.status !== 'failed'),
    [route],
  )

  async function markDelivered(stopId: number) {
    await apiClient.markStopDelivered(stopId)
    await loadRoute()
  }

  async function markFailed(stopId: number) {
    await apiClient.markStopFailed(stopId)
    await loadRoute()
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-lg px-4 py-5">
        <header className="mb-5">
          <p className="text-sm font-semibold text-blue-600">Driver route</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal">
            {route?.plan.title || 'Delivery Route'}
          </h1>
          {route && (
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline">{route.stops.length} stops</Badge>
              <Badge variant="secondary">{shareCode}</Badge>
            </div>
          )}
        </header>

        {error && <Alert className="mb-4">{error}</Alert>}

        {isLoading ? (
          <Card className="p-6 text-center text-slate-500">Loading route...</Card>
        ) : route ? (
          <div className="space-y-5">
            {nextStop && (
              <Card className="p-5 shadow-soft">
                <p className="text-sm font-semibold text-blue-600">Next stop</p>
                <h2 className="mt-2 text-xl font-semibold">{nextStop.recipient_name}</h2>
                <p className="mt-1 text-sm text-slate-500">{nextStop.phone}</p>
                <p className="mt-3 text-sm leading-6">{nextStop.raw_address}</p>
                {nextStop.note && <p className="mt-2 text-sm text-slate-500">{nextStop.note}</p>}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Button onClick={() => markDelivered(nextStop.id)} className="h-12">
                    Mark Delivered
                  </Button>
                  <Button variant="destructive" onClick={() => markFailed(nextStop.id)} className="h-12">
                    Failed
                  </Button>
                </div>
              </Card>
            )}

            <RouteSummary
              totalDistance={route.plan.total_distance_km}
              totalDuration={route.plan.total_duration_minutes}
            />
            <StopList
              stops={route.stops}
              onMarkDelivered={markDelivered}
              onMarkFailed={markFailed}
            />
          </div>
        ) : (
          <Card className="p-6 text-center text-slate-500">Route not found.</Card>
        )}
      </div>
    </main>
  )
}
