import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface DeliveryPlanCardProps {
  id: number
  title: string
  status: string
  createdAt: string
}

export default function DeliveryPlanCard({ id, title, status, createdAt }: DeliveryPlanCardProps) {
  return (
    <Card className="group transition-all hover:-translate-y-0.5 hover:shadow-soft">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="leading-6">{title}</CardTitle>
          <Badge variant={status === 'optimized' ? 'success' : 'secondary'}>
            {status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Created {new Date(createdAt).toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter>
        <Link
          href={`/plans/${id}`}
          className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          View details -&gt;
        </Link>
      </CardFooter>
    </Card>
  )
}
