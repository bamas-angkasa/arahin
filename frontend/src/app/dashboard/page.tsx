'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import DashboardShell from '@/components/DashboardShell'
import GoogleMapsButton from '@/components/GoogleMapsButton'
import RouteMap from '@/components/RouteMap'
import RouteSummary from '@/components/RouteSummary'
import StopList from '@/components/StopList'
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { apiClient } from '@/lib/api/api'
import { DeliveryPlan, DeliveryPlanWithStops } from '@/types'

export default function Dashboard() {
  const [plans, setPlans] = useState<DeliveryPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<DeliveryPlanWithStops | null>(null)
  const [selectedMapsLink, setSelectedMapsLink] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    async function loadPlans() {
      try {
        const deliveryPlans = await apiClient.getDeliveryPlans()
        setPlans(deliveryPlans)

        if (deliveryPlans.length > 0) {
          await openPlan(deliveryPlans[0].id, false)
        }
      } catch {
        setError('Could not load delivery plans.')
      } finally {
        setIsLoading(false)
      }
    }

    loadPlans()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  async function openPlan(planId: number, showLoading = true) {
    if (showLoading) setIsDetailLoading(true)
    try {
      const planDetail = await apiClient.getDeliveryPlan(planId)
      setSelectedPlan(planDetail)

      const mapsResponse = await apiClient.getGoogleMapsLink(planId)
      setSelectedMapsLink(mapsResponse.google_maps_link)
    } catch {
      setError('Could not load route details.')
    } finally {
      setIsDetailLoading(false)
    }
  }

  async function optimizeSelectedPlan() {
    if (!selectedPlan) return

    setError('')
    setIsOptimizing(true)
    try {
      await apiClient.optimizePlan(selectedPlan.id)
      await openPlan(selectedPlan.id, false)
      const refreshedPlans = await apiClient.getDeliveryPlans()
      setPlans(refreshedPlans)
    } catch {
      setError('Could not optimize this route.')
    } finally {
      setIsOptimizing(false)
    }
  }

  const stats = useMemo(() => {
    const optimized = plans.filter((plan) => plan.status === 'optimized').length
    const stops = selectedPlan?.stops.length || 0

    return { optimized, stops }
  }, [plans, selectedPlan])

  return (
    <DashboardShell
      title="Routing Overview"
      description="Map-first route operations for daily UMKM deliveries."
    >
      {error && <Alert className="mb-4">{error}</Alert>}

      <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <section className="space-y-5">
          <Card className="p-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Routes</p>
                <p className="mt-1 text-2xl font-semibold">{plans.length}</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-3">
                <p className="text-xs text-blue-700">Optimized</p>
                <p className="mt-1 text-2xl font-semibold text-blue-700">{stats.optimized}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Stops</p>
                <p className="mt-1 text-2xl font-semibold">{stats.stops}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">Active Routes</h2>
                <p className="text-sm text-slate-500">Select a route to preview on map.</p>
              </div>
              <Link href="/plans/new">
                <Button size="sm">New</Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">Loading routes...</div>
            ) : plans.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 p-5 text-center">
                <p className="font-medium">Belum ada rute hari ini.</p>
                <p className="mt-1 text-sm text-slate-500">Yuk buat pengiriman pertama.</p>
                <Link href="/plans/new">
                  <Button size="sm" className="mt-4">Create Route</Button>
                </Link>
              </div>
            ) : (
              <div className="max-h-[calc(100vh-310px)] space-y-3 overflow-y-auto pr-1">
                {plans.map((plan) => {
                  const isActive = selectedPlan?.id === plan.id

                  return (
                    <button
                      key={plan.id}
                      onClick={() => openPlan(plan.id)}
                      className={`w-full rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-soft ${
                        isActive
                          ? 'border-blue-200 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-blue-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{plan.title}</p>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{plan.start_address}</p>
                        </div>
                        <Badge variant={plan.status === 'optimized' ? 'success' : 'secondary'}>
                          {plan.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </Card>
        </section>

        <section className="grid min-h-[calc(100vh-126px)] gap-5 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <Card className="overflow-hidden p-0">
            <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold">
                  {selectedPlan ? selectedPlan.title : 'Live Route Map'}
                </h2>
                <p className="text-sm text-slate-500">
                  {selectedPlan
                    ? `${selectedPlan.stops.length} stops from ${selectedPlan.start_address}`
                    : 'Select a route to see delivery flow'}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {selectedPlan && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => openPlan(selectedPlan.id)}
                      disabled={isDetailLoading}
                    >
                      Refresh
                    </Button>
                    <Button onClick={optimizeSelectedPlan} disabled={isOptimizing}>
                      {isOptimizing ? 'Optimizing...' : 'Optimize'}
                    </Button>
                    {selectedMapsLink && (
                      <GoogleMapsButton link={selectedMapsLink}>Google Maps</GoogleMapsButton>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="p-4">
              {selectedPlan ? (
                <RouteMap
                  startLat={selectedPlan.start_lat}
                  startLng={selectedPlan.start_lng}
                  stops={selectedPlan.stops}
                  className="h-[calc(100vh-250px)] min-h-[430px] rounded-xl"
                />
              ) : (
                <div className="flex h-[calc(100vh-250px)] min-h-[430px] items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  No route selected
                </div>
              )}
            </div>
          </Card>

          <aside className="space-y-5">
            <Card className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    Route Details
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">
                    {selectedPlan ? selectedPlan.title : 'No route selected'}
                  </h2>
                </div>
                {selectedPlan && (
                  <Badge variant={selectedPlan.status === 'optimized' ? 'success' : 'secondary'}>
                    {selectedPlan.status.replace('_', ' ')}
                  </Badge>
                )}
              </div>

              {selectedPlan ? (
                <div className="mt-4 space-y-4">
                  <p className="text-sm leading-6 text-slate-500">{selectedPlan.start_address}</p>
                  <RouteSummary
                    totalDistance={selectedPlan.total_distance_km}
                    totalDuration={selectedPlan.total_duration_minutes}
                  />
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">Choose a route from the left panel.</p>
              )}
            </Card>

            <Card className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">Delivery Stops</h2>
                  <p className="text-sm text-slate-500">Operational stop order.</p>
                </div>
                {selectedPlan && <Badge variant="outline">{selectedPlan.stops.length}</Badge>}
              </div>

              {selectedPlan ? (
                <div className="max-h-[calc(100vh-510px)] min-h-[220px] overflow-y-auto pr-1">
                  <StopList stops={selectedPlan.stops} />
                </div>
              ) : (
                <div className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                  Stops will appear here after selecting a route.
                </div>
              )}
            </Card>
          </aside>
        </section>
      </div>
    </DashboardShell>
  )
}
