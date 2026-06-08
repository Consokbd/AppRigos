import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { getServerAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  const session = await getServerAuthSession()
  if (!session) {
    redirect('/login')
  }

  const users = [
    { name: 'Administrateur', email: process.env.ADMIN_EMAIL ?? 'admin@app-rigos.local', role: 'ADMIN' },
    { name: 'Operateur', email: process.env.OPERATOR_EMAIL ?? 'operator@app-rigos.local', role: 'OPERATOR' },
  ]

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr] lg:px-6">
        <Sidebar />
        <section className="space-y-6">
          <div className="card-surface p-6">
            <h1 className="text-3xl font-semibold text-slate-900">Utilisateurs</h1>
            <p className="mt-2 text-slate-600">Les comptes actuels sont definis par les variables d'environnement.</p>
          </div>

          <div className="grid gap-4">
            {users.map((user) => (
              <div key={user.email} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-600">{user.email}</p>
                  </div>
                  <span className="status-pill status-active">{user.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
