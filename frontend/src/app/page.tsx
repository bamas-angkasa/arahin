import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold">
            Arahin
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Sign in
          </Link>
        </nav>

        <section className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
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
                className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Open Dashboard
              </Link>
              <Link
                href="/register"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-6 text-sm font-medium transition-all hover:-translate-y-0.5 hover:bg-slate-50"
              >
                Create Account
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium">Malang Kota Route</p>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
                  Optimized
                </span>
              </div>
              <div className="space-y-3">
                {['Alun-Alun Kota Malang', 'Jl. Ijen', 'Jl. Semeru', 'Jl. Basuki Rahmat'].map(
                  (location, index) => (
                    <div key={location} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600 text-xs font-semibold text-white">
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
