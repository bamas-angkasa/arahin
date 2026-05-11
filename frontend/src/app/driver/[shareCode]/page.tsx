'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import RouteSummary from '@/components/RouteSummary'
import StopList from '@/components/StopList'
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
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

  async function markDelivered(stopId: number) {
    await apiClient.markStopDelivered(stopId)
    await loadRoute()
  }

  async function markFailed(stopId: number) {
    await apiClient.markStopFailed(stopId)
    await loadRoute()
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-6">
        <header className="mb-6">
          <p className="text-sm font-medium text-primary">Driver route</p>
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
          <Card className="p-6 text-center text-muted-foreground">Loading route...</Card>
        ) : route ? (
          <div className="space-y-5">
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
          <Card className="p-6 text-center text-muted-foreground">Route not found.</Card>
        )}
      </div>
    </main>
  )
}
