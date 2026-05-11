export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Arahin
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Route Optimization for UMKM Delivery Businesses
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            Biar kurir UMKM tidak muter-muter lagi. Optimize your delivery routes efficiently.
          </p>
          <a
            href="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Optimize Your Delivery Route
          </a>
        </div>
      </div>
    </main>
  )
}