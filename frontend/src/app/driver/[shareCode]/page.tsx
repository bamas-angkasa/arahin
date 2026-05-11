'use client'

import { useParams } from 'next/navigation'

export default function DriverView() {
  const params = useParams()
  const shareCode = params.shareCode

  // TODO: Fetch driver view data

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Delivery Route</h1>

        {/* TODO: Display stops list with actions */}
        <div className="space-y-4">
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-gray-500">Driver view coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  )
}