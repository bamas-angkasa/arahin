'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import ThemeToggle from '@/components/ThemeToggle'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { apiClient } from '@/lib/api/api'

const previewStops = ['Alun-Alun Kota', 'Jl. Ijen', 'Sawojajar', 'Dinoyo']

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
    <main className="min-h-screen overflow-hidden bg-background bg-geo-radial text-foreground">
      <div className="pointer-events-none fixed inset-0 geo-grid opacity-35 dark:opacity-100" />
      <div className="pointer-events-none fixed -left-36 top-12 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none fixed -right-28 bottom-6 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-5 py-8 lg:grid-cols-[1fr_440px] lg:px-8">
        <div className="absolute right-5 top-6 lg:right-8">
          <ThemeToggle />
        </div>

        <section className="hidden lg:block">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-lg font-semibold text-primary-foreground shadow-glow">
              A
            </span>
            <span className="text-xl font-semibold">Arahin</span>
          </Link>

          <div className="mt-14 max-w-xl">
            <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-primary/10">
              Dispatch control center
            </p>
            <h1 className="mt-5 text-5xl font-semibold leading-tight tracking-normal">
              Operasi pengiriman lebih tenang, cepat, dan terarah.
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Masuk untuk melihat rute harian, urutan stop, driver aktif, dan buka navigasi langsung di Google Maps.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-card/92 p-5 shadow-soft backdrop-blur dark:shadow-panel">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Malang Kota Route</p>
                <p className="text-sm text-muted-foreground">12 stops - optimized</p>
              </div>
              <span className="rounded-full bg-emerald-500/12 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                Live
              </span>
            </div>

            <div className="relative h-72 overflow-hidden rounded-xl border border-border bg-muted/60">
              <div className="absolute inset-0 opacity-70">
                <div className="h-full w-full bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:36px_36px]" />
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.16),transparent_24%),radial-gradient(circle_at_78%_70%,rgb(20_184_166/0.12),transparent_26%)]" />
              <div className="absolute left-12 top-14 h-36 w-44 rounded-br-[80px] border-b-4 border-r-4 border-primary/70" />
              <div className="absolute bottom-20 right-28 h-28 w-40 rounded-tl-[80px] border-l-4 border-t-4 border-primary/70" />
              <div className="absolute left-10 top-12 h-4 w-4 rounded-full bg-primary shadow-[0_0_0_8px_hsl(var(--primary)/0.12)]" />
              <div className="absolute left-32 top-28 h-4 w-4 rounded-full bg-primary shadow-[0_0_0_8px_hsl(var(--primary)/0.12)]" />
              <div className="absolute bottom-16 right-24 h-4 w-4 rounded-full bg-primary shadow-[0_0_0_8px_hsl(var(--primary)/0.12)]" />

              <div className="absolute right-5 top-5 rounded-xl border border-border bg-card/90 p-3 text-xs shadow-sm backdrop-blur">
                <p className="font-semibold">Fleet load</p>
                <p className="mt-1 text-muted-foreground">82% capacity</p>
              </div>

              <div className="absolute bottom-5 left-5 rounded-xl border border-border bg-card/92 p-4 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Next stop</p>
                <p className="mt-1 text-sm font-semibold">Jl. Ijen No. 10</p>
                <p className="text-xs text-muted-foreground">ETA 12 min</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {previewStops.map((stop, index) => (
                <div key={stop} className="rounded-xl border border-border bg-background/60 p-2">
                  <p className="text-xs font-semibold text-primary">{index === 0 ? 'S' : index}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{stop}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-lg font-semibold text-primary-foreground shadow-glow">
              A
            </span>
            <span className="text-xl font-semibold">Arahin</span>
          </div>

          <Card className="bg-card/94 shadow-soft backdrop-blur dark:shadow-panel">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Sign in</CardTitle>
              <CardDescription>Continue to your route optimization dashboard.</CardDescription>
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

                <div className="rounded-xl border border-border bg-muted/60 p-3 text-sm text-muted-foreground">
                  Demo account: <span className="font-medium text-foreground">demo@arahin.com</span> /{' '}
                  <span className="font-medium text-foreground">password123</span>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{' '}
                  <Link href="/register" className="font-medium text-primary hover:text-primary/80">
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
