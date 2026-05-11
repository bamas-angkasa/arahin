interface BulkStopInputProps {
  value: string
  onChange: (value: string) => void
}

export default function BulkStopInput({ value, onChange }: BulkStopInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Delivery Stops (Bulk Paste)
      </label>
      <p className="text-sm text-gray-500 mb-2">
        Format: Recipient Name | Phone | Address | Note
      </p>
      <textarea
        rows={10}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Budi | 08123456789 | Jl. Ijen No. 10 Malang | Rumah pagar hitam&#10;Sinta | 081999888777 | Jl. Soekarno Hatta No. 20 Malang | Titip satpam"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}