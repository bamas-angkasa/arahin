'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import DashboardShell from '@/components/DashboardShell'
import DeliveryStopCard from '@/components/DeliveryStopCard'
import GoogleMapsButton from '@/components/GoogleMapsButton'
import RouteMap from '@/components/RouteMap'
import RouteSummary from '@/components/RouteSummary'
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { apiClient } from '@/lib/api/api'
import { DeliveryPlanWithStops } from '@/types'

export default function PlanDetail() {
  const params = useParams()
  const router = useRouter()
  const planId = Number(params.id)

  const [plan, setPlan] = useState<DeliveryPlanWithStops | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [googleMapsLink, setGoogleMapsLink] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    async function loadPlan() {
      try {
        const deliveryPlan = await apiClient.getDeliveryPlan(planId)
        setPlan(deliveryPlan)
        const mapsResponse = await apiClient.getGoogleMapsLink(planId)
        setGoogleMapsLink(mapsResponse.google_maps_link)
      } catch {
        setError('Could not load this delivery plan.')
      } finally {
        setIsLoading(false)
      }
    }

    if (Number.isFinite(planId)) {
      loadPlan()
    } else {
      setError('Invalid delivery plan.')
      setIsLoading(false)
    }
  }, [planId, router])

  async function handleOptimize() {
    if (!plan) return

    setError('')
    setIsOptimizing(true)
    try {
      await apiClient.optimizePlan(plan.id)
      const refreshedPlan = await apiClient.getDeliveryPlan(plan.id)
      setPlan(refreshedPlan)
      const mapsResponse = await apiClient.getGoogleMapsLink(plan.id)
      setGoogleMapsLink(mapsResponse.google_maps_link)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not optimize this route.')
    } finally {
      setIsOptimizing(false)
    }
  }

  return (
    <DashboardShell title={plan?.title || 'Route Detail'} description="Review route flow, stops, and navigation handoff.">
      <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:text-blue-700">
        Back to routing overview
      </Link>

      {error && <Alert className="mt-4">{error}</Alert>}

      {isLoading ? (
        <Card className="mt-5 p-10 text-center text-slate-500">Loading plan details...</Card>
      ) : !plan ? (
        <Card className="mt-5 p-10 text-center text-slate-500">Delivery plan not found.</Card>
      ) : (
        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
          <section className="space-y-5">
            <Card className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Route details</p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-normal">{plan.title}</h1>
                  <p className="mt-2 max-w-2xl text-sm text-slate-500">{plan.start_address}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant={plan.status === 'optimized' ? 'success' : 'secondary'}>
                      {plan.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline">{plan.stops.length} stops</Badge>
                    {plan.share_code && <Badge variant="outline">Share: {plan.share_code}</Badge>}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleOptimize} disabled={isOptimizing || plan.stops.length === 0}>
                    {isOptimizing ? 'Optimizing...' : 'Optimize Route'}
                  </Button>
                  {googleMapsLink && (
                    <GoogleMapsButton link={googleMapsLink}>Open in Google Maps</GoogleMapsButton>
                  )}
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden p-4">
              <RouteMap
                startLat={plan.start_lat}
                startLng={plan.start_lng}
                stops={plan.stops}
                className="h-[540px]"
              />
            </Card>

            <RouteSummary
              totalDistance={plan.total_distance_km}
              totalDuration={plan.total_duration_minutes}
            />
          </section>

          <section className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold">Delivery Stops</h2>
              <p className="text-sm text-slate-500">Ordered workflow for the driver.</p>
            </div>
            {plan.stops.length === 0 ? (
              <Card className="p-6 text-center text-slate-500">No stops in this delivery plan yet.</Card>
            ) : (
              plan.stops.map((stop) => <DeliveryStopCard key={stop.id} stop={stop} />)
            )}
          </section>
        </div>
      )}
    </DashboardShell>
  )
}
