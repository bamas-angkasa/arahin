import { DeliveryStop } from '@/types'

interface StopListProps {
  stops: DeliveryStop[]
  onMarkDelivered?: (stopId: number) => void
  onMarkFailed?: (stopId: number) => void
}

export default function StopList({ stops, onMarkDelivered, onMarkFailed }: StopListProps) {
  return (
    <div className="space-y-4">
      {stops.map((stop) => (
        <div key={stop.id} className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                {stop.sequence_order && (
                  <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {stop.sequence_order}
                  </span>
                )}
                <h3 className="text-lg font-medium text-gray-900">{stop.recipient_name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  stop.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  stop.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  stop.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {stop.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{stop.phone}</p>
              <p className="text-sm text-gray-600">{stop.raw_address}</p>
              {stop.note && <p className="text-sm text-gray-500 mt-1">{stop.note}</p>}
            </div>
            {(onMarkDelivered || onMarkFailed) && (
              <div className="flex space-x-2 ml-4">
                {onMarkDelivered && (
                  <button
                    onClick={() => onMarkDelivered(stop.id)}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                  >
                    Delivered
                  </button>
                )}
                {onMarkFailed && (
                  <button
                    onClick={() => onMarkFailed(stop.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                  >
                    Failed
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
