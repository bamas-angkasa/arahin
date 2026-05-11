'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { apiClient } from '@/lib/api/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const token = await apiClient.login(email, password)
      localStorage.setItem('token', token.access_token)
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Incorrect email or password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-5 py-8 lg:grid-cols-[1fr_440px] lg:px-8">
        <section className="hidden lg:block">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-semibold text-white shadow-sm">
              A
            </span>
            <span className="text-xl font-semibold">Arahin</span>
          </Link>

          <div className="mt-14 max-w-xl">
            <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              Dispatch control center
            </p>
            <h1 className="mt-5 text-5xl font-semibold leading-tight tracking-normal">
              Operasi pengiriman lebih tenang, cepat, dan terarah.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-500">
              Masuk untuk melihat rute harian, urutan stop, driver aktif, dan buka navigasi langsung
              di Google Maps.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Malang Kota Route</p>
                <p className="text-sm text-slate-500">12 stops • optimized</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Live
              </span>
            </div>

            <div className="relative h-72 overflow-hidden rounded-xl bg-slate-100">
              <div className="absolute inset-0 opacity-60">
                <div className="h-full w-full bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:36px_36px]" />
              </div>
              <div className="absolute left-10 top-12 h-4 w-4 rounded-full bg-blue-600 shadow-[0_0_0_8px_rgba(37,99,235,0.12)]" />
              <div className="absolute left-32 top-28 h-4 w-4 rounded-full bg-blue-600 shadow-[0_0_0_8px_rgba(37,99,235,0.12)]" />
              <div className="absolute bottom-16 right-24 h-4 w-4 rounded-full bg-blue-600 shadow-[0_0_0_8px_rgba(37,99,235,0.12)]" />
              <div className="absolute left-12 top-14 h-36 w-44 rounded-br-[80px] border-b-4 border-r-4 border-blue-500" />
              <div className="absolute bottom-20 right-28 h-28 w-40 rounded-tl-[80px] border-l-4 border-t-4 border-blue-500" />
              <div className="absolute bottom-5 left-5 rounded-xl border border-gray-200 bg-white/95 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Next stop</p>
                <p className="mt-1 text-sm font-semibold">Jl. Ijen No. 10</p>
                <p className="text-xs text-slate-500">ETA 12 min</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-semibold text-white shadow-sm">
              A
            </span>
            <span className="text-xl font-semibold">Arahin</span>
          </div>

          <Card className="border-gray-200 shadow-soft">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Sign in</CardTitle>
              <CardDescription>
                Continue to your route optimization dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="demo@arahin.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="password123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {error && <Alert role="alert">{error}</Alert>}

                <Button type="submit" disabled={isSubmitting} className="h-11 w-full">
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>

                <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
                  Demo account: <span className="font-medium text-slate-700">demo@arahin.com</span> /{' '}
                  <span className="font-medium text-slate-700">password123</span>
                </div>

                <p className="text-center text-sm text-slate-500">
                  Don't have an account?{' '}
                  <Link href="/register" className="font-medium text-blue-600 hover:text-blue-700">
                    Sign up
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
