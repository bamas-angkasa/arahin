'use client'

import type * as Leaflet from 'leaflet'
import { useEffect, useMemo, useRef } from 'react'

interface RouteMapProps {
  startLat?: number
  startLng?: number
  stops: Array<{
    lat?: number
    lng?: number
    recipient_name?: string
    raw_address?: string
    sequence_order?: number
  }>
}

export default function RouteMap({ startLat, startLng, stops }: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<Leaflet.Map | null>(null)

  const orderedStops = useMemo(
    () =>
      stops
        .filter((stop) => typeof stop.lat === 'number' && typeof stop.lng === 'number')
        .sort((a, b) => (a.sequence_order || 999) - (b.sequence_order || 999)),
    [stops],
  )

  const routePoints = useMemo(() => {
    if (typeof startLat !== 'number' || typeof startLng !== 'number') {
      return []
    }

    return [
      { lat: startLat, lng: startLng, label: 'Start', address: 'Start location' },
      ...orderedStops.map((stop, index) => ({
        lat: stop.lat as number,
        lng: stop.lng as number,
        label: `${stop.sequence_order || index + 1}. ${stop.recipient_name || 'Stop'}`,
        address: stop.raw_address || '',
      })),
    ]
  }, [orderedStops, startLat, startLng])

  useEffect(() => {
    let isMounted = true

    function escapeHtml(value: string) {
      return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    }

    async function renderMap() {
      const L = await import('leaflet')

      if (!isMounted || !containerRef.current || routePoints.length === 0) {
        return
      }

      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }

      const map = L.map(containerRef.current, {
        scrollWheelZoom: false,
      })
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map)

      const latLngs = routePoints.map((point) => L.latLng(point.lat, point.lng))

      L.polyline(latLngs, {
        color: '#4f46e5',
        weight: 5,
        opacity: 0.85,
      }).addTo(map)

      routePoints.forEach((point, index) => {
        const markerLabel = index === 0 ? 'S' : String(index)
        const icon = L.divIcon({
          className: 'route-marker',
          html: `<span>${markerLabel}</span>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        })

        L.marker([point.lat, point.lng], { icon })
          .addTo(map)
          .bindPopup(`<strong>${escapeHtml(point.label)}</strong><br />${escapeHtml(point.address)}`)
      })

      map.fitBounds(L.latLngBounds(latLngs), { padding: [28, 28] })
    }

    if (!containerRef.current || routePoints.length === 0) {
      return undefined
    }

    renderMap()

    return () => {
      isMounted = false
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [routePoints])

  if (routePoints.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-lg bg-gray-200">
        <p className="text-gray-500">Route needs coordinates before it can be visualized.</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="h-96 overflow-hidden rounded-lg border border-gray-200 shadow" />
  )
}
