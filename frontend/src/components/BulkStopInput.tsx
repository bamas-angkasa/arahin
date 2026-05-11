import { Textarea } from '@/components/ui/textarea'

interface BulkStopInputProps {
  value: string
  onChange: (value: string) => void
}

export default function BulkStopInput({ value, onChange }: BulkStopInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Delivery Stops</label>
      <p className="text-sm text-muted-foreground">
        Format per line: Recipient Name | Phone | Address | Note
      </p>
      <Textarea
        rows={10}
        placeholder="Budi | 08123456789 | Jl. Ijen No. 10 Malang | Rumah pagar hitam&#10;Sinta | 081999888777 | Jl. Soekarno Hatta No. 20 Malang | Titip satpam"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
