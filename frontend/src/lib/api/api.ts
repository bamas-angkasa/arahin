// API client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    const isFormBody = options.body instanceof URLSearchParams
    const config: RequestInit = {
      headers: {
        ...(isFormBody ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    const response = await fetch(url, config)
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }
    return response.json()
  }

  // Auth
  async login(email: string, password: string) {
    const formData = new URLSearchParams()
    formData.set('username', email)
    formData.set('password', password)

    return this.request('/auth/login', {
      method: 'POST',
      body: formData,
    })
  }

  async register(name: string, email: string, password: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
  }

  async getMe() {
    return this.request('/auth/me')
  }

  // Delivery Plans
  async getDeliveryPlans() {
    return this.request('/delivery-plans')
  }

  async createDeliveryPlan(plan: any) {
    return this.request('/delivery-plans', {
      method: 'POST',
      body: JSON.stringify(plan),
    })
  }

  async getDeliveryPlan(id: number) {
    return this.request(`/delivery-plans/${id}`)
  }

  async updateDeliveryPlan(id: number, plan: any) {
    return this.request(`/delivery-plans/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(plan),
    })
  }

  async deleteDeliveryPlan(id: number) {
    return this.request(`/delivery-plans/${id}`, {
      method: 'DELETE',
    })
  }

  async bulkCreateStops(planId: number, stops: any[]) {
    return this.request(`/delivery-plans/${planId}/stops/bulk`, {
      method: 'POST',
      body: JSON.stringify({ stops }),
    })
  }

  async optimizePlan(planId: number) {
    return this.request(`/delivery-plans/${planId}/optimize`, {
      method: 'POST',
    })
  }

  async getGoogleMapsLink(planId: number) {
    return this.request(`/delivery-plans/${planId}/google-maps-link`)
  }

  // Driver
  async getDriverView(shareCode: string) {
    return this.request(`/driver/${shareCode}`)
  }

  async markStopDelivered(stopId: number) {
    return this.request(`/driver/stops/${stopId}/mark-delivered`, {
      method: 'PATCH',
    })
  }

  async markStopFailed(stopId: number) {
    return this.request(`/driver/stops/${stopId}/mark-failed`, {
      method: 'PATCH',
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
