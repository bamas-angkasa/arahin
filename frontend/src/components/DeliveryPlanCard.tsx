interface DeliveryPlanCardProps {
  id: number
  title: string
  status: string
  createdAt: string
}

export default function DeliveryPlanCard({ id, title, status, createdAt }: DeliveryPlanCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1 capitalize">{status.replace('_', ' ')}</p>
        <p className="text-xs text-gray-400 mt-2">{new Date(createdAt).toLocaleDateString()}</p>
        <div className="mt-4">
          <a
            href={`/plans/${id}`}
            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
          >
            View Details →
          </a>
        </div>
      </div>
    </div>
  )
}