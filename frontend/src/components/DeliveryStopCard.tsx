import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { DeliveryStop } from '@/types'

interface DeliveryStopCardProps {
  stop: DeliveryStop
}

export default function DeliveryStopCard({ stop }: DeliveryStopCardProps) {
  return (
    <Card className="p-4 transition-all hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-semibold text-blue-600">
          {stop.sequence_order || '-'}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-semibold">{stop.recipient_name}</h3>
            <Badge variant={stop.status === 'delivered' ? 'success' : 'warning'}>
              {stop.status.replace('_', ' ')}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500">{stop.phone}</p>
          <p className="mt-2 text-sm text-slate-700">{stop.raw_address}</p>
          {stop.note && <p className="mt-2 text-sm text-slate-500">{stop.note}</p>}
        </div>
      </div>
    </Card>
  )
}
