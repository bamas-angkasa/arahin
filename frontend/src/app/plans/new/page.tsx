'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="text-sm font-medium text-primary hover:text-primary/80">
          Back to dashboard
        </Link>

        <Card className="mt-6 shadow-soft">
          <CardHeader>
            <CardTitle className="text-2xl">Create Delivery Plan</CardTitle>
            <CardDescription>
              Add a starting point and paste delivery stops in one batch.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <Alert>{error}</Alert>}

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Plan Title
                  </label>
                  <Input
                    id="title"
                    required
                    placeholder="Malang Kota - Central Route"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="startAddress" className="text-sm font-medium">
                    Start Address
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
                    Start Latitude
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
                    Start Longitude
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
                  Delivery Stops
                </label>
                <p className="text-sm text-muted-foreground">
                  Format per line: Recipient Name | Phone | Address | Note
                </p>
                <Textarea
                  id="bulkStops"
                  rows={10}
                  placeholder="Budi | 08123456789 | Jl. Ijen No. 10 Malang | Rumah pagar hitam&#10;Sinta | 081999888777 | Jl. Soekarno Hatta No. 20 Malang | Titip satpam"
                  value={bulkStops}
                  onChange={(e) => setBulkStops(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating plan...' : 'Create Plan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
