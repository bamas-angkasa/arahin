import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

const drivers = [
  {
    name: 'Raka Pratama',
    contact: '0812-4400-1190',
    status: 'Delivering',
    routes: 2,
    initials: 'RP',
  },
  {
    name: 'Sari Wulandari',
    contact: '0813-5512-8821',
    status: 'Idle',
    routes: 0,
    initials: 'SW',
  },
  {
    name: 'Dimas Hadi',
    contact: '0819-9002-7762',
    status: 'Active',
    routes: 1,
    initials: 'DH',
  },
]

function variantForStatus(status: string) {
  if (status === 'Delivering') return 'secondary'
  if (status === 'Active') return 'success'
  return 'outline'
}

export default function DriverList() {
  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Drivers</h2>
          <p className="text-sm text-slate-500">Operational availability</p>
        </div>
        <Badge variant="outline">{drivers.length}</Badge>
      </div>

      <div className="space-y-3">
        {drivers.map((driver) => (
          <div
            key={driver.name}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-slate-50/70 p-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xs font-semibold text-white">
              {driver.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{driver.name}</p>
              <p className="truncate text-xs text-slate-500">{driver.contact}</p>
            </div>
            <div className="text-right">
              <Badge variant={variantForStatus(driver.status)}>{driver.status}</Badge>
              <p className="mt-1 text-xs text-slate-500">{driver.routes} route</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
