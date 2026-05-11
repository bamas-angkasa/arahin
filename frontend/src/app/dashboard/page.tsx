'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import DeliveryPlanCard from '@/components/DeliveryPlanCard'
import { apiClient } from '@/lib/api/api'
import { DeliveryPlan } from '@/types'

export default function Dashboard() {
  const [plans, setPlans] = useState<DeliveryPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
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
      } catch {
        setError('Could not load delivery plans.')
      } finally {
        setIsLoading(false)
      }
    }

    loadPlans()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <Link
              href="/plans/new"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Create New Plan
            </Link>
          </div>

          {error && (
            <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Loading delivery plans...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No delivery plans yet.</p>
                  <Link
                    href="/plans/new"
                    className="text-indigo-600 hover:text-indigo-500 mt-2 inline-block"
                  >
                    Create your first plan
                  </Link>
                </div>
              ) : (
                plans.map((plan) => (
                  <DeliveryPlanCard
                    key={plan.id}
                    id={plan.id}
                    title={plan.title}
                    status={plan.status}
                    createdAt={plan.created_at}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
