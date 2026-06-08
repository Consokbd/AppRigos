import { prisma } from '@/lib/prisma'
import { getServerAuthSession } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import AgentCard from '@/components/AgentCard'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

async function deleteAgent(formData: FormData) {
  'use server'
  const agentId = formData.get('id') as string
  if (!agentId) return

  await prisma.agent.delete({ where: { id: agentId } })
  revalidatePath('/agents')
  revalidatePath('/dashboard')
}

export default async function AgentsPage({ searchParams }: { searchParams?: Promise<{ q?: string; sort?: string; page?: string }> }) {
  const session = await getServerAuthSession()
  if (!session) {
    redirect('/login')
  }

  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const q = resolvedSearchParams?.q ?? ''
  const sort = resolvedSearchParams?.sort ?? 'createdAt'
  const page = Math.max(1, Number(resolvedSearchParams?.page ?? '1'))
  const take = 10
  const skip = (page - 1) * take

  const where = q
    ? {
        OR: [
          { nom: { contains: q, mode: 'insensitive' as const } },
          { postnom: { contains: q, mode: 'insensitive' as const } },
          { prenom: { contains: q, mode: 'insensitive' as const } },
          { matricule: { contains: q, mode: 'insensitive' as const } },
          { fonction: { contains: q, mode: 'insensitive' as const } },
          { service: { contains: q, mode: 'insensitive' as const } },
        ],
      }
    : {}

  const orderBy = sort === 'nom' ? { nom: 'asc' as const } : sort === 'status' ? { statut: 'asc' as const } : { createdAt: 'desc' as const }

  const [agents, totalCount, totalActive, totalInactive] = await Promise.all([
    prisma.agent.findMany({ where, orderBy, skip, take }),
    prisma.agent.count({ where }),
    prisma.agent.count({ where: { statut: 'ACTIF' } }),
    prisma.agent.count({ where: { statut: { not: 'ACTIF' } } }),
  ])

  const totalPages = Math.max(1, Math.ceil(totalCount / take))

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr] lg:px-6">
        <Sidebar />

        <section className="space-y-6">
          <div className="card-surface p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-slate-900">Agents</h1>
                <p className="mt-2 text-slate-500">Recherchez, triez et gerez les fiches agent.</p>
              </div>

              <a href="/agents/new" className="btn-primary px-5 py-3">
                + Nouvel agent
              </a>
            </div>

            <form method="get" className="mt-6 grid gap-3 md:grid-cols-[1fr_auto_auto]">
              <input
                name="q"
                defaultValue={q}
                placeholder="Rechercher par nom, matricule ou fonction"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
              <select
                name="sort"
                defaultValue={sort}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
                <option value="createdAt">Plus recents</option>
                <option value="nom">Nom A-Z</option>
                <option value="status">Statut</option>
              </select>
              <button type="submit" className="btn-primary px-5 py-3">
                Appliquer
              </button>
            </form>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Total agents" value={totalCount} />
            <StatCard label="Actifs" value={totalActive} className="text-success" />
            <StatCard label="Inactifs" value={totalInactive} className="text-red-600" />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-sm text-slate-500">Resultats</p>
            <p className="text-lg font-semibold text-slate-900">
              {totalCount} agent{totalCount > 1 ? 's' : ''} trouve{totalCount > 1 ? 's' : ''}
            </p>
          </div>

          <div className="space-y-4">
            {agents.length === 0 ? (
              <div className="card-surface p-6 text-slate-600">Aucun agent trouve pour cette recherche.</div>
            ) : (
              agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} deleteAction={deleteAgent} />
              ))
            )}
          </div>

          <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-sm text-slate-600">Page {page} sur {totalPages}</p>
            <div className="flex gap-3">
              <a
                href={`?q=${encodeURIComponent(q)}&sort=${sort}&page=${Math.max(1, page - 1)}`}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                Precedent
              </a>
              <a
                href={`?q=${encodeURIComponent(q)}&sort=${sort}&page=${Math.min(totalPages, page + 1)}`}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                Suivant
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function StatCard({ label, value, className = 'text-slate-900' }: { label: string; value: number; className?: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <p className={`mt-4 text-3xl font-semibold ${className}`}>{value}</p>
    </div>
  )
}
