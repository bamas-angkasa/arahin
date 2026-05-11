import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DeliveryStop } from '@/types'

interface StopListProps {
  stops: DeliveryStop[]
  onMarkDelivered?: (stopId: number) => void
  onMarkFailed?: (stopId: number) => void
}

function statusVariant(status: string) {
  if (status === 'delivered') return 'success'
  if (status === 'failed') return 'destructive'
  if (status === 'in_progress') return 'secondary'
  return 'warning'
}

export default function StopList({ stops, onMarkDelivered, onMarkFailed }: StopListProps) {
  return (
    <div className="space-y-3">
      {stops.map((stop) => (
        <Card key={stop.id} className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {stop.sequence_order && (
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {stop.sequence_order}
                  </span>
                )}
                <h3 className="text-base font-semibold">{stop.recipient_name}</h3>
                <Badge variant={statusVariant(stop.status)}>
                  {stop.status.replace('_', ' ')}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{stop.phone}</p>
              <p className="mt-1 text-sm">{stop.raw_address}</p>
              {stop.note && <p className="mt-2 text-sm text-muted-foreground">{stop.note}</p>}
            </div>

            {(onMarkDelivered || onMarkFailed) && (
              <div className="flex gap-2">
                {onMarkDelivered && (
                  <Button size="sm" onClick={() => onMarkDelivered(stop.id)}>
                    Delivered
                  </Button>
                )}
                {onMarkFailed && (
                  <Button size="sm" variant="destructive" onClick={() => onMarkFailed(stop.id)}>
                    Failed
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
