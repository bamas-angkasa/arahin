'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import DeliveryPlanCard from '@/components/DeliveryPlanCard'
import { Alert } from '@/components/ui/alert'
import { Card } from '@/components/ui/card'
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
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Arahin Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">Delivery Plans</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Review routes, optimize stop order, and open directions in Google Maps.
            </p>
          </div>
          <Link
            href="/plans/new"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Create New Plan
          </Link>
        </header>

        {error && <Alert className="mb-6">{error}</Alert>}

        {isLoading ? (
          <Card className="p-10 text-center text-muted-foreground">Loading delivery plans...</Card>
        ) : plans.length === 0 ? (
          <Card className="p-10 text-center">
            <h2 className="text-lg font-semibold">No delivery plans yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Create your first route to start planning.</p>
            <Link
              href="/plans/new"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Create your first plan
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <DeliveryPlanCard
                key={plan.id}
                id={plan.id}
                title={plan.title}
                status={plan.status}
                createdAt={plan.created_at}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
