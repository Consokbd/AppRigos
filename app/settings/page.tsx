import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { getServerAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const session = await getServerAuthSession()
  if (!session) {
    redirect('/login')
  }

  const settings = [
    { label: 'URL publique', value: process.env.NEXTAUTH_URL ?? 'http://localhost:3000' },
    { label: 'Email administrateur', value: process.env.ADMIN_EMAIL ?? 'admin@app-rigos.local' },
    { label: 'Email operateur', value: process.env.OPERATOR_EMAIL ?? 'operator@app-rigos.local' },
  ]

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr] lg:px-6">
        <Sidebar />
        <section className="space-y-6">
          <div className="card-surface p-6">
            <h1 className="text-3xl font-semibold text-slate-900">Parametres</h1>
            <p className="mt-2 text-slate-600">Controlez les valeurs importantes utilisees par l'application.</p>
          </div>

          <div className="grid gap-4">
            {settings.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{item.label}</p>
                <p className="mt-2 font-semibold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
