import Link from 'next/link'

import ThemeToggle from '@/components/ThemeToggle'

export default function Home() {
  return (
    <main className="min-h-screen bg-background bg-geo-radial text-foreground">
      <div className="pointer-events-none fixed inset-0 geo-grid opacity-35 dark:opacity-100" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold">
            Arahin
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
            >
              Sign in
            </Link>
          </div>
        </nav>

        <section className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-primary/10">
              Route planning for daily deliveries
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-normal text-foreground md:text-6xl">
              Arahin
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Kelola rute pengiriman UMKM, urutkan lokasi, dan buka rute langsung di Google Maps.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Open Dashboard
              </Link>
              <Link
                href="/register"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-6 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:bg-muted"
              >
                Create Account
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft dark:shadow-panel">
            <div className="rounded-xl bg-muted/60 p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium">Malang Kota Route</p>
                <span className="rounded-full bg-emerald-500/12 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-300">
                  Optimized
                </span>
              </div>
              <div className="space-y-3">
                {['Alun-Alun Kota Malang', 'Jl. Ijen', 'Jl. Semeru', 'Jl. Basuki Rahmat'].map(
                  (location, index) => (
                    <div key={location} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-primary text-xs font-semibold text-primary-foreground">
                        {index === 0 ? 'S' : index}
                      </span>
                      <span className="text-sm">{location}</span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
