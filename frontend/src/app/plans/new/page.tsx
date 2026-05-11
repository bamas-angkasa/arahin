'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewPlan() {
  const [title, setTitle] = useState('')
  const [startAddress, setStartAddress] = useState('')
  const [startLat, setStartLat] = useState('')
  const [startLng, setStartLng] = useState('')
  const [bulkStops, setBulkStops] = useState('')

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Create plan and bulk stops
    console.log('Create plan:', { title, startAddress, startLat, startLng, bulkStops })
    // Redirect to plan detail
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Delivery Plan</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Plan Title
              </label>
              <input
                type="text"
                id="title"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="startAddress" className="block text-sm font-medium text-gray-700">
                Start Address
              </label>
              <input
                type="text"
                id="startAddress"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={startAddress}
                onChange={(e) => setStartAddress(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startLat" className="block text-sm font-medium text-gray-700">
                  Start Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  id="startLat"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={startLat}
                  onChange={(e) => setStartLat(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="startLng" className="block text-sm font-medium text-gray-700">
                  Start Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  id="startLng"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={startLng}
                  onChange={(e) => setStartLng(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="bulkStops" className="block text-sm font-medium text-gray-700">
                Delivery Stops (Bulk Paste)
              </label>
              <p className="text-sm text-gray-500 mb-2">
                Format: Recipient Name | Phone | Address | Note
              </p>
              <textarea
                id="bulkStops"
                rows={10}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Budi | 08123456789 | Jl. Ijen No. 10 Malang | Rumah pagar hitam&#10;Sinta | 081999888777 | Jl. Soekarno Hatta No. 20 Malang | Titip satpam"
                value={bulkStops}
                onChange={(e) => setBulkStops(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Create Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}