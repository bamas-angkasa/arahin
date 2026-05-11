'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import DashboardShell from '@/components/DashboardShell'
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { apiClient, type PlaceSuggestion } from '@/lib/api/api'

const MALANG_START = {
  title: 'Malang Kota - Delivery Route',
  address: 'Alun-Alun Kota Malang, Jl. Merdeka Selatan, Malang',
  lat: '-7.9826',
  lng: '112.6308',
}

const SAMPLE_STOPS = `Budi Santoso | 08123456789 | Jl. Ijen No. 10, Malang | Rumah pagar hitam
Sinta Dewi | 081999888777 | Jl. Soekarno Hatta No. 20, Malang | Titip satpam
Ahmad Rahman | 081555666777 | Jl. Gajayana No. 15, Malang | Apartemen lantai 5
Toko Maju | 081234000111 | Dinoyo, Malang | Drop ke kasir`

const EMPTY_STOP_DRAFT = {
  recipient_name: '',
  phone: '',
  raw_address: '',
  formatted_address: '',
  lat: '',
  lng: '',
  note: '',
}

type ParsedStop = {
  recipient_name: string
  phone: string
  raw_address: string
  formatted_address?: string
  lat?: number
  lng?: number
  note?: string
  priority: number
  rawLine: string
  isValid: boolean
}

type StopDraft = typeof EMPTY_STOP_DRAFT

function parseStopLine(line: string): ParsedStop {
  const separator = line.includes('|') ? '|' : '-'
  const parts = line.split(separator).map((part) => part.trim())
  const [recipient_name = '', phoneOrAddress = '', addressOrNote = '', note = ''] = parts
  const looksLikePhone = /(\+?62|0)\d{7,}/.test(phoneOrAddress.replace(/\s|-/g, ''))

  const phone = looksLikePhone ? phoneOrAddress : ''
  const raw_address = looksLikePhone ? addressOrNote : [phoneOrAddress, addressOrNote].filter(Boolean).join(' - ')

  return {
    recipient_name,
    phone: phone || '080000000000',
    raw_address,
    note: note || undefined,
    priority: 1,
    rawLine: line,
    isValid: Boolean(recipient_name && raw_address),
  }
}

export default function NewPlan() {
  const [title, setTitle] = useState(MALANG_START.title)
  const [startAddress, setStartAddress] = useState(MALANG_START.address)
  const [startLat, setStartLat] = useState(MALANG_START.lat)
  const [startLng, setStartLng] = useState(MALANG_START.lng)
  const [bulkStops, setBulkStops] = useState(SAMPLE_STOPS)
  const [shouldOptimize, setShouldOptimize] = useState(true)
  const [error, setError] = useState('')
  const [addressSearchMessage, setAddressSearchMessage] = useState('')
  const [addressSuggestions, setAddressSuggestions] = useState<PlaceSuggestion[]>([])
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSearchingAddress, setIsSearchingAddress] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [stopDraft, setStopDraft] = useState<StopDraft>(EMPTY_STOP_DRAFT)
  const [quickStops, setQuickStops] = useState<ParsedStop[]>([])
  const [stopAddressSuggestions, setStopAddressSuggestions] = useState<PlaceSuggestion[]>([])
  const [isStopSuggestionsOpen, setIsStopSuggestionsOpen] = useState(false)
  const [isLoadingStopSuggestions, setIsLoadingStopSuggestions] = useState(false)
  const [isResolvingStopAddress, setIsResolvingStopAddress] = useState(false)

  const router = useRouter()

  const parsedStops = useMemo(
    () =>
      bulkStops
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map(parseStopLine),
    [bulkStops],
  )

  const allStops = [...quickStops, ...parsedStops]
  const validStops = allStops.filter((stop) => stop.isValid)
  const invalidStops = allStops.filter((stop) => !stop.isValid)
  const canSubmit = title && startAddress && startLat && startLng && validStops.length > 0

  const updateStopDraft = (field: keyof StopDraft, value: string) => {
    setStopDraft((current) => ({ ...current, [field]: value }))
  }

  const appendDraftStop = () => {
    const recipient = stopDraft.recipient_name.trim()
    const phone = stopDraft.phone.trim()
    const address = stopDraft.raw_address.trim()
    const note = stopDraft.note.trim()

    if (!recipient || !address) {
      setError('Please add at least recipient name and delivery address.')
      return
    }

    const line = [recipient, phone || '080000000000', address, note].filter(Boolean).join(' | ')
    setQuickStops((current) => [
      ...current,
      {
        recipient_name: recipient,
        phone: phone || '080000000000',
        raw_address: address,
        formatted_address: stopDraft.formatted_address || undefined,
        lat: stopDraft.lat ? Number(stopDraft.lat) : undefined,
        lng: stopDraft.lng ? Number(stopDraft.lng) : undefined,
        note: note || undefined,
        priority: 1,
        rawLine: line,
        isValid: true,
      },
    ])
    setStopDraft({ ...EMPTY_STOP_DRAFT })
    setError('')
  }

  useEffect(() => {
    const query = startAddress.trim()

    if (!isSuggestionsOpen || query.length < 3) {
      setAddressSuggestions([])
      setIsLoadingSuggestions(false)
      return
    }

    let isCurrent = true
    setIsLoadingSuggestions(true)

    const timeoutId = window.setTimeout(async () => {
      try {
        const result = await apiClient.autocompleteAddress(query)
        if (isCurrent) {
          setAddressSuggestions(result.suggestions)
        }
      } catch {
        if (isCurrent) {
          setAddressSuggestions([])
        }
      } finally {
        if (isCurrent) {
          setIsLoadingSuggestions(false)
        }
      }
    }, 300)

    return () => {
      isCurrent = false
      window.clearTimeout(timeoutId)
    }
  }, [isSuggestionsOpen, startAddress])

  useEffect(() => {
    const query = stopDraft.raw_address.trim()

    if (!isStopSuggestionsOpen || query.length < 3) {
      setStopAddressSuggestions([])
      setIsLoadingStopSuggestions(false)
      return
    }

    let isCurrent = true
    setIsLoadingStopSuggestions(true)

    const timeoutId = window.setTimeout(async () => {
      try {
        const result = await apiClient.autocompleteAddress(query)
        if (isCurrent) {
          setStopAddressSuggestions(result.suggestions)
        }
      } catch {
        if (isCurrent) {
          setStopAddressSuggestions([])
        }
      } finally {
        if (isCurrent) {
          setIsLoadingStopSuggestions(false)
        }
      }
    }, 300)

    return () => {
      isCurrent = false
      window.clearTimeout(timeoutId)
    }
  }, [isStopSuggestionsOpen, stopDraft.raw_address])

  const fillStartLocation = (result: { formatted_address: string; lat: number; lng: number; source: string }) => {
    setStartAddress(result.formatted_address)
    setStartLat(String(result.lat))
    setStartLng(String(result.lng))
    setAddressSearchMessage(
      result.source === 'browser'
        ? 'Current browser location loaded. You can still edit the address or coordinates manually.'
        : result.source === 'google'
        ? 'Coordinates filled from Google Maps. You can still edit them manually.'
        : 'Coordinates filled from a local Malang preset. You can still edit them manually.',
    )
  }

  const detectCurrentLocation = (silent = false) => {
    if (!navigator.geolocation) {
      if (!silent) {
        setError('Your browser does not support current location detection.')
      }
      return
    }

    setError('')
    setAddressSearchMessage('')
    setIsDetectingLocation(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = Number(position.coords.latitude.toFixed(6))
        const lng = Number(position.coords.longitude.toFixed(6))

        try {
          const result = await apiClient.reverseGeocode(lat, lng)
          fillStartLocation(result)
        } catch {
          fillStartLocation({
            formatted_address: `Current location (${lat}, ${lng})`,
            lat,
            lng,
            source: 'browser',
          })
        } finally {
          setIsDetectingLocation(false)
        }
      },
      () => {
        setIsDetectingLocation(false)
        if (!silent) {
          setError('Could not access your current location. You can search an address or enter coordinates manually.')
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60000,
        timeout: 10000,
      },
    )
  }

  useEffect(() => {
    detectCurrentLocation(true)
  }, [])

  const handleSelectSuggestion = async (suggestion: PlaceSuggestion) => {
    setError('')
    setAddressSearchMessage('')
    setIsSuggestionsOpen(false)
    setAddressSuggestions([])
    setStartAddress(suggestion.description)
    setIsSearchingAddress(true)

    try {
      const result = await apiClient.getPlaceDetails(suggestion.place_id)
      fillStartLocation(result)
    } catch {
      setError('Could not load this place. Please try another suggestion or enter coordinates manually.')
    } finally {
      setIsSearchingAddress(false)
    }
  }

  const handleSelectStopSuggestion = async (suggestion: PlaceSuggestion) => {
    setError('')
    setIsStopSuggestionsOpen(false)
    setStopAddressSuggestions([])
    setStopDraft((current) => ({ ...current, raw_address: suggestion.description }))
    setIsResolvingStopAddress(true)

    try {
      const result = await apiClient.getPlaceDetails(suggestion.place_id)
      setStopDraft((current) => ({
        ...current,
        raw_address: result.formatted_address,
        formatted_address: result.formatted_address,
        lat: String(result.lat),
        lng: String(result.lng),
      }))
    } catch {
      setError('Could not load this stop address. You can still add it and Arahin will geocode it later.')
    } finally {
      setIsResolvingStopAddress(false)
    }
  }

  const handleSearchStartAddress = async () => {
    const query = startAddress.trim()
    setError('')
    setAddressSearchMessage('')
    setIsSuggestionsOpen(false)

    if (query.length < 3) {
      setError('Please enter a start address before searching.')
      return
    }

    setIsSearchingAddress(true)

    try {
      const result = await apiClient.geocodeAddress(query)
      fillStartLocation(result)
    } catch {
      setError('Address not found. Please adjust the address or enter latitude and longitude manually.')
    } finally {
      setIsSearchingAddress(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!canSubmit) {
      setError('Please add route information and at least one valid delivery stop.')
      return
    }

    setIsSubmitting(true)

    try {
      const plan = await apiClient.createDeliveryPlan({
        title,
        start_address: startAddress,
        start_lat: Number(startLat),
        start_lng: Number(startLng),
      })

      await apiClient.bulkCreateStops(
        plan.id,
        validStops.map(({ rawLine, isValid, ...stop }) => stop),
      )

      if (shouldOptimize) {
        try {
          await apiClient.optimizePlan(plan.id)
        } catch {
          // The plan is still useful if a few stop addresses need manual coordinate cleanup.
        }
      }

      router.push(`/plans/${plan.id}`)
    } catch {
      setError('Could not create this delivery plan.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardShell title="Create Route" description="Paste stops, confirm, and optimize in one flow.">
      <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:text-blue-700">
        Back to routing overview
      </Link>

      <form onSubmit={handleSubmit} className="mx-auto mt-5 grid max-w-7xl gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="space-y-5">
          <Card className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Step 1</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-normal">Route basics</h1>
                <p className="mt-2 text-sm text-slate-500">
                  Start from your current location, search Maps, or edit coordinates manually.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => detectCurrentLocation(false)}
                  disabled={isDetectingLocation}
                >
                  {isDetectingLocation ? 'Detecting...' : 'Use my location'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setTitle(MALANG_START.title)
                    setStartAddress(MALANG_START.address)
                    setStartLat(MALANG_START.lat)
                    setStartLng(MALANG_START.lng)
                    setAddressSearchMessage('Malang preset loaded. Coordinates remain editable.')
                  }}
                >
                  Malang preset
                </Button>
              </div>
            </div>

            {error && <Alert className="mt-5">{error}</Alert>}

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Route name
                </label>
                <Input
                  id="title"
                  required
                  placeholder="Malang Kota - Morning Delivery"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="startAddress" className="text-sm font-medium">
                  Start address
                </label>
                <div className="relative">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      id="startAddress"
                      required
                      autoComplete="off"
                      placeholder="Search place or address, e.g. Stasiun Malang"
                      value={startAddress}
                      onChange={(e) => {
                        setStartAddress(e.target.value)
                        setAddressSearchMessage('')
                        setIsSuggestionsOpen(true)
                      }}
                      onFocus={() => setIsSuggestionsOpen(startAddress.trim().length >= 3)}
                      onBlur={() => window.setTimeout(() => setIsSuggestionsOpen(false), 150)}
                      className="sm:flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSearchStartAddress}
                      disabled={isSearchingAddress}
                      className="sm:w-36"
                    >
                      {isSearchingAddress ? 'Searching...' : 'Search Maps'}
                    </Button>
                  </div>

                  {isSuggestionsOpen && (isLoadingSuggestions || addressSuggestions.length > 0) && (
                    <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                      {isLoadingSuggestions ? (
                        <div className="px-4 py-3 text-sm text-slate-500">Searching addresses...</div>
                      ) : (
                        <div className="max-h-72 overflow-y-auto py-1">
                          {addressSuggestions.map((suggestion) => (
                            <button
                              key={`${suggestion.source}-${suggestion.place_id}`}
                              type="button"
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => handleSelectSuggestion(suggestion)}
                              className="block w-full px-4 py-3 text-left transition hover:bg-slate-50"
                            >
                              <span className="block text-sm font-semibold text-slate-900">
                                {suggestion.main_text || suggestion.description}
                              </span>
                              <span className="mt-0.5 block truncate text-xs text-slate-500">
                                {suggestion.secondary_text || suggestion.description}
                              </span>
                            </button>
                          ))}
                          {addressSuggestions.some((suggestion) => suggestion.source === 'google') && (
                            <div className="border-t border-gray-100 px-4 py-2 text-right text-[11px] font-medium text-slate-400">
                              Powered by Google
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Start typing to see address suggestions. Selecting one fills latitude and longitude automatically.
                </p>
                {addressSearchMessage && (
                  <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
                    {addressSearchMessage}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="startLat" className="text-sm font-medium">
                  Latitude
                </label>
                <Input
                  type="number"
                  step="any"
                  id="startLat"
                  required
                  placeholder="-7.9826"
                  value={startLat}
                  onChange={(e) => setStartLat(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="startLng" className="text-sm font-medium">
                  Longitude
                </label>
                <Input
                  type="number"
                  step="any"
                  id="startLng"
                  required
                  placeholder="112.6308"
                  value={startLng}
                  onChange={(e) => setStartLng(e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Step 2</p>
                <h2 className="mt-1 text-xl font-semibold">Delivery stops</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Add one stop at a time or paste a daily delivery list.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setQuickStops([])
                    setBulkStops(SAMPLE_STOPS)
                  }}
                >
                  Use sample
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setQuickStops([])
                    setBulkStops('')
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-gray-200 bg-slate-50 p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="stopRecipient" className="text-sm font-medium">
                    Recipient
                  </label>
                  <Input
                    id="stopRecipient"
                    placeholder="Customer or shop name"
                    value={stopDraft.recipient_name}
                    onChange={(event) => updateStopDraft('recipient_name', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="stopPhone" className="text-sm font-medium">
                    Phone
                  </label>
                  <Input
                    id="stopPhone"
                    placeholder="08xxxxxxxxxx"
                    value={stopDraft.phone}
                    onChange={(event) => updateStopDraft('phone', event.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="stopAddress" className="text-sm font-medium">
                    Delivery address
                  </label>
                  <div className="relative">
                    <Input
                      id="stopAddress"
                      autoComplete="off"
                      placeholder="Search customer address, e.g. Jl Ijen No 10"
                      value={stopDraft.raw_address}
                      onChange={(event) => {
                        setStopDraft((current) => ({
                          ...current,
                          raw_address: event.target.value,
                          formatted_address: '',
                          lat: '',
                          lng: '',
                        }))
                        setIsStopSuggestionsOpen(true)
                      }}
                      onFocus={() => setIsStopSuggestionsOpen(stopDraft.raw_address.trim().length >= 3)}
                      onBlur={() => window.setTimeout(() => setIsStopSuggestionsOpen(false), 150)}
                    />

                    {isStopSuggestionsOpen && (isLoadingStopSuggestions || stopAddressSuggestions.length > 0) && (
                      <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                        {isLoadingStopSuggestions ? (
                          <div className="px-4 py-3 text-sm text-slate-500">Searching delivery addresses...</div>
                        ) : (
                          <div className="max-h-72 overflow-y-auto py-1">
                            {stopAddressSuggestions.map((suggestion) => (
                              <button
                                key={`stop-${suggestion.source}-${suggestion.place_id}`}
                                type="button"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => handleSelectStopSuggestion(suggestion)}
                                className="block w-full px-4 py-3 text-left transition hover:bg-slate-50"
                              >
                                <span className="block text-sm font-semibold text-slate-900">
                                  {suggestion.main_text || suggestion.description}
                                </span>
                                <span className="mt-0.5 block truncate text-xs text-slate-500">
                                  {suggestion.secondary_text || suggestion.description}
                                </span>
                              </button>
                            ))}
                            {stopAddressSuggestions.some((suggestion) => suggestion.source === 'google') && (
                              <div className="border-t border-gray-100 px-4 py-2 text-right text-[11px] font-medium text-slate-400">
                                Powered by Google
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {(isResolvingStopAddress || stopDraft.lat) && (
                    <p className="text-xs text-slate-500">
                      {isResolvingStopAddress
                        ? 'Resolving coordinates...'
                        : `Coordinates ready: ${stopDraft.lat}, ${stopDraft.lng}`}
                    </p>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="stopNote" className="text-sm font-medium">
                    Note
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      id="stopNote"
                      placeholder="Optional: gate, landmark, COD note"
                      value={stopDraft.note}
                      onChange={(event) => updateStopDraft('note', event.target.value)}
                      className="sm:flex-1"
                    />
                    <Button type="button" onClick={appendDraftStop} className="sm:w-32">
                      Add Stop
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Textarea
              id="bulkStops"
              rows={12}
              className="mt-5 font-mono text-sm"
              placeholder="Budi - Jl Ijen 10&#10;Sinta | 081999888777 | Jl. Soekarno Hatta No. 20 | Titip satpam"
              value={bulkStops}
              onChange={(e) => setBulkStops(e.target.value)}
            />
          </Card>
        </section>

        <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Route preview</h2>
                <p className="text-sm text-slate-500">Before creating route</p>
              </div>
              <Badge variant={invalidStops.length > 0 ? 'warning' : 'success'}>
                {validStops.length} valid
              </Badge>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-slate-500">Detected</p>
                <p className="mt-1 text-2xl font-semibold">{allStops.length}</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-3">
                <p className="text-blue-700">Ready</p>
                <p className="mt-1 text-2xl font-semibold text-blue-700">{validStops.length}</p>
              </div>
            </div>

            <label className="mt-5 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 text-sm">
              <span>
                <span className="block font-medium">Optimize after create</span>
                <span className="text-slate-500">Recommended for fastest workflow</span>
              </span>
              <input
                type="checkbox"
                checked={shouldOptimize}
                onChange={(e) => setShouldOptimize(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600"
              />
            </label>

            <Button type="submit" disabled={isSubmitting || !canSubmit} className="mt-5 h-12 w-full">
              {isSubmitting ? 'Creating route...' : shouldOptimize ? 'Create & Optimize' : 'Create Route'}
            </Button>
          </Card>

          <Card className="p-5">
            <h2 className="font-semibold">Stop preview</h2>
            <div className="mt-4 max-h-[360px] space-y-3 overflow-y-auto pr-1">
              {allStops.length === 0 ? (
                <p className="text-sm text-slate-500">Paste stops to see preview.</p>
              ) : (
                allStops.slice(0, 8).map((stop, index) => (
                  <div
                    key={`${stop.rawLine}-${index}`}
                    className="rounded-xl border border-gray-200 bg-white p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">
                        {index + 1}. {stop.recipient_name || 'Missing recipient'}
                      </p>
                      <Badge variant={stop.isValid ? 'success' : 'destructive'}>
                        {stop.isValid ? 'ok' : 'fix'}
                      </Badge>
                    </div>
                    <p className="mt-1 truncate text-xs text-slate-500">{stop.phone}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                      {stop.formatted_address || stop.raw_address || stop.rawLine}
                    </p>
                    {stop.lat && stop.lng && (
                      <p className="mt-2 text-[11px] font-medium text-blue-600">Coordinates ready</p>
                    )}
                  </div>
                ))
              )}
            </div>
            {allStops.length > 8 && (
              <p className="mt-3 text-xs text-slate-500">+{allStops.length - 8} more stops</p>
            )}
          </Card>
        </aside>
      </form>
    </DashboardShell>
  )
}
