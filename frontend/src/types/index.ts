// Type definitions
export interface User {
  id: number
  name: string
  email: string
  created_at: string
}

export interface DeliveryPlan {
  id: number
  user_id: number
  title: string
  start_address: string
  start_lat?: number
  start_lng?: number
  status: 'draft' | 'optimized' | 'in_delivery' | 'completed'
  total_distance_km?: number
  total_duration_minutes?: number
  share_code?: string
  created_at: string
  updated_at?: string
}

export interface DeliveryPlanWithStops extends DeliveryPlan {
  stops: DeliveryStop[]
}

export interface DeliveryStop {
  id: number
  delivery_plan_id: number
  recipient_name: string
  phone: string
  raw_address: string
  formatted_address?: string
  lat?: number
  lng?: number
  note?: string
  priority: number
  sequence_order?: number
  status: 'pending' | 'in_progress' | 'delivered' | 'failed'
  estimated_arrival?: string
  delivered_at?: string
  created_at: string
  updated_at?: string
}

export interface OptimizedRoute {
  stops: DeliveryStop[]
  total_distance_km: number
  total_duration_minutes: number
}

export interface DriverRouteView {
  plan: {
    id: number
    title: string
    start_address: string
    total_distance_km?: number
    total_duration_minutes?: number
  }
  stops: DeliveryStop[]
}
