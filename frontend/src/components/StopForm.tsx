import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface StopFormProps {
  recipientName: string
  phone: string
  rawAddress: string
  note: string
  lat?: number
  lng?: number
  onChange: (field: string, value: string | number) => void
}

export default function StopForm({
  recipientName,
  phone,
  rawAddress,
  note,
  lat,
  lng,
  onChange,
}: StopFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Recipient Name</label>
        <Input
          type="text"
          required
          value={recipientName}
          onChange={(e) => onChange('recipientName', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Phone</label>
        <Input
          type="tel"
          required
          value={phone}
          onChange={(e) => onChange('phone', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Address</label>
        <Input
          type="text"
          required
          value={rawAddress}
          onChange={(e) => onChange('rawAddress', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Latitude</label>
          <Input
            type="number"
            step="any"
            value={lat || ''}
            onChange={(e) => onChange('lat', parseFloat(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Longitude</label>
          <Input
            type="number"
            step="any"
            value={lng || ''}
            onChange={(e) => onChange('lng', parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Note</label>
        <Textarea rows={2} value={note} onChange={(e) => onChange('note', e.target.value)} />
      </div>
    </div>
  )
}
