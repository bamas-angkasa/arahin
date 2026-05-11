'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import DashboardShell from '@/components/DashboardShell'
import DriverList from '@/components/DriverList'
import RouteDetailsModal from '@/components/RouteDetailsModal'
import RouteMap from '@/components/RouteMap'
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

      <div className="grid gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
        <section className="space-y-5">
          <Card className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Today routes</p>
                <p className="mt-1 text-3xl font-semibold">{plans.length}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Optimized</p>
                <p className="mt-1 text-3xl font-semibold text-blue-600">{stats.optimized}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Stops</p>
                <p className="mt-1 text-3xl font-semibold">{stats.stops}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Active Routes</h2>
                <p className="text-sm text-slate-500">Tap a route to preview stops and map flow.</p>
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
              <div className="space-y-3">
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
                          <p className="mt-1 truncate text-sm text-slate-500">{plan.start_address}</p>
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

          <DriverList />
        </section>

        <section className="min-h-[calc(100vh-126px)] space-y-5">
          <Card className="overflow-hidden p-0">
            <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Live Route Map</h2>
                <p className="text-sm text-slate-500">
                  {selectedPlan
                    ? `${selectedPlan.title} - ${selectedPlan.stops.length} stops`
                    : 'Select a route to see delivery flow'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
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
                  className="h-[520px] rounded-xl"
                />
              ) : (
                <div className="flex h-[520px] items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  No route selected
                </div>
              )}
            </div>
          </Card>
        </section>
      </div>

      <RouteDetailsModal
        plan={selectedPlan}
        googleMapsLink={selectedMapsLink}
        isOptimizing={isOptimizing}
        onClose={() => setSelectedPlan(null)}
        onOptimize={optimizeSelectedPlan}
      />
    </DashboardShell>
  )
}
