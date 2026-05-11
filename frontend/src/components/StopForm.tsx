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
  onChange
}: StopFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Recipient Name</label>
        <input
          type="text"
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={recipientName}
          onChange={(e) => onChange('recipientName', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={phone}
          onChange={(e) => onChange('phone', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <input
          type="text"
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={rawAddress}
          onChange={(e) => onChange('rawAddress', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Latitude</label>
          <input
            type="number"
            step="any"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={lat || ''}
            onChange={(e) => onChange('lat', parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Longitude</label>
          <input
            type="number"
            step="any"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={lng || ''}
            onChange={(e) => onChange('lng', parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Note</label>
        <textarea
          rows={2}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={note}
          onChange={(e) => onChange('note', e.target.value)}
        />
      </div>
    </div>
  )
}