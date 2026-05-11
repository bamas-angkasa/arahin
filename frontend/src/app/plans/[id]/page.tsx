'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import GoogleMapsButton from '@/components/GoogleMapsButton'
import RouteMap from '@/components/RouteMap'
import RouteSummary from '@/components/RouteSummary'
import StopList from '@/components/StopList'
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
    } catch {
      setError('Could not optimize this route.')
    } finally {
      setIsOptimizing(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Card className="p-10 text-center text-muted-foreground">Loading plan details...</Card>
        </div>
      </main>
    )
  }

  if (!plan) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="text-sm font-medium text-primary hover:text-primary/80">
            Back to dashboard
          </Link>
          <Alert className="mt-6">{error || 'Delivery plan not found.'}</Alert>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="text-sm font-medium text-primary hover:text-primary/80">
          Back to dashboard
        </Link>

        <header className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal">{plan.title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{plan.start_address}</p>
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
              <GoogleMapsButton link={googleMapsLink}>Open Route in Google Maps</GoogleMapsButton>
            )}
          </div>
        </header>

        {error && <Alert className="mt-6">{error}</Alert>}

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
          <div className="space-y-6">
            <section>
              <h2 className="mb-4 text-xl font-semibold">Route Preview</h2>
              <RouteMap startLat={plan.start_lat} startLng={plan.start_lng} stops={plan.stops} />
            </section>
            <RouteSummary
              totalDistance={plan.total_distance_km}
              totalDuration={plan.total_duration_minutes}
            />
          </div>

          <section>
            <h2 className="mb-4 text-xl font-semibold">Delivery Stops</h2>
            {plan.stops.length === 0 ? (
              <Card className="p-6 text-center text-muted-foreground">
                No stops in this delivery plan yet.
              </Card>
            ) : (
              <StopList stops={plan.stops} />
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
