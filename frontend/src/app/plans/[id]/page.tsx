'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import GoogleMapsButton from '@/components/GoogleMapsButton'
import RouteMap from '@/components/RouteMap'
import RouteSummary from '@/components/RouteSummary'
import StopList from '@/components/StopList'
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0 text-center text-gray-500">
            Loading plan details...
          </div>
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Link href="/dashboard" className="text-sm text-indigo-600 hover:text-indigo-500">
              Back to dashboard
            </Link>
            <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error || 'Delivery plan not found.'}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Link href="/dashboard" className="text-sm text-indigo-600 hover:text-indigo-500">
            Back to dashboard
          </Link>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{plan.title}</h1>
              <p className="mt-2 text-sm text-gray-600">{plan.start_address}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-gray-100 px-3 py-1 font-medium capitalize text-gray-700">
                  {plan.status.replace('_', ' ')}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                  {plan.stops.length} stops
                </span>
                {plan.share_code && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                    Share: {plan.share_code}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleOptimize}
                disabled={isOptimizing || plan.stops.length === 0}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
              >
                {isOptimizing ? 'Optimizing...' : 'Optimize Route'}
              </button>
              {googleMapsLink && (
                <GoogleMapsButton link={googleMapsLink}>Open Route in Google Maps</GoogleMapsButton>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 space-y-6">
            <section>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Route Preview</h2>
              <RouteMap
                startLat={plan.start_lat}
                startLng={plan.start_lng}
                stops={plan.stops}
              />
            </section>

            <RouteSummary
              totalDistance={plan.total_distance_km}
              totalDuration={plan.total_duration_minutes}
            />

            <section>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Delivery Stops</h2>
              {plan.stops.length === 0 ? (
                <div className="rounded-lg bg-white p-6 text-center text-gray-500 shadow">
                  No stops in this delivery plan yet.
                </div>
              ) : (
                <StopList stops={plan.stops} />
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
