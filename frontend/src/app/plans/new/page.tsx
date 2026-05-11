'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import DashboardShell from '@/components/DashboardShell'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { apiClient } from '@/lib/api/api'

export default function NewPlan() {
  const [title, setTitle] = useState('')
  const [startAddress, setStartAddress] = useState('')
  const [startLat, setStartLat] = useState('')
  const [startLng, setStartLng] = useState('')
  const [bulkStops, setBulkStops] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const plan = await apiClient.createDeliveryPlan({
        title,
        start_address: startAddress,
        start_lat: Number(startLat),
        start_lng: Number(startLng),
      })

      const stops = bulkStops
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [recipient_name, phone, raw_address, note] = line.split('|').map((part) => part.trim())
          return {
            recipient_name,
            phone,
            raw_address,
            note: note || undefined,
            priority: 1,
          }
        })
        .filter((stop) => stop.recipient_name && stop.phone && stop.raw_address)

      if (stops.length > 0) {
        await apiClient.bulkCreateStops(plan.id, stops)
      }

      router.push(`/plans/${plan.id}`)
    } catch {
      setError('Could not create this delivery plan.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardShell title="Create Route" description="Paste stops, set a start point, and optimize quickly.">
      <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:text-blue-700">
        Back to routing overview
      </Link>

      <div className="mx-auto mt-5 max-w-5xl">
        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <Card className="p-5">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Bulk paste flow</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-normal">Create delivery route</h1>
              <p className="mt-2 text-sm text-slate-500">
                Keep it simple: route name, start location, and pasted delivery stops.
              </p>
            </div>

            {error && <Alert className="mb-5">{error}</Alert>}

            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Route name
                  </label>
                  <Input
                    id="title"
                    required
                    placeholder="Malang Kota - Morning Delivery"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="startAddress" className="text-sm font-medium">
                    Start address
                  </label>
                  <Input
                    id="startAddress"
                    required
                    placeholder="Alun-Alun Kota Malang"
                    value={startAddress}
                    onChange={(e) => setStartAddress(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="startLat" className="text-sm font-medium">
                    Latitude
                  </label>
                  <Input
                    type="number"
                    step="any"
                    id="startLat"
                    required
                    placeholder="-7.9826"
                    value={startLat}
                    onChange={(e) => setStartLat(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="startLng" className="text-sm font-medium">
                    Longitude
                  </label>
                  <Input
                    type="number"
                    step="any"
                    id="startLng"
                    required
                    placeholder="112.6308"
                    value={startLng}
                    onChange={(e) => setStartLng(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="bulkStops" className="text-sm font-medium">
                  Delivery stops
                </label>
                <p className="text-sm text-slate-500">
                  Format per line: Recipient Name | Phone | Address | Note
                </p>
                <Textarea
                  id="bulkStops"
                  rows={12}
                  placeholder="Budi | 08123456789 | Jl. Ijen No. 10 Malang | Rumah pagar hitam&#10;Sinta | 081999888777 | Jl. Soekarno Hatta No. 20 Malang | Titip satpam"
                  value={bulkStops}
                  onChange={(e) => setBulkStops(e.target.value)}
                />
              </div>
            </div>
          </Card>

          <aside className="space-y-5">
            <Card className="p-5">
              <h2 className="font-semibold">Route setup</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Stops detected</span>
                  <span className="font-semibold">{bulkStops.split('\n').filter(Boolean).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Driver</span>
                  <span className="font-semibold">Assign later</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Optimization</span>
                  <span className="font-semibold">After create</span>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="font-semibold">Quick tip</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Paste messy delivery notes into the stop box, then keep only the parts separated by
                vertical bars. This keeps route creation fast for daily operations.
              </p>
            </Card>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Creating route...' : 'Create Route'}
            </Button>
          </aside>
        </form>
      </div>
    </DashboardShell>
  )
}
