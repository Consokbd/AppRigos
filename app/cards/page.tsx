import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CardsIndexPage() {
  const session = await getServerAuthSession()
  if (!session) {
    redirect('/login')
  }

  const agents = await prisma.agent.findMany({
    orderBy: { createdAt: 'desc' },
    take: 25,
  })

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr] lg:px-6">
        <Sidebar />
        <section className="space-y-6">
          <div className="card-surface p-6">
            <h1 className="text-3xl font-semibold text-slate-900">Impression des cartes</h1>
            <p className="mt-2 text-slate-600">Selectionnez un agent pour ouvrir sa carte de service, telecharger le PDF ou imprimer.</p>
          </div>

          <div className="space-y-3">
            {agents.length === 0 ? (
              <div className="card-surface p-6 text-slate-600">Aucun agent disponible.</div>
            ) : (
              agents.map((agent) => {
                const fullName = `${agent.nom} ${agent.postnom ?? ''} ${agent.prenom ?? ''}`.trim()

                return (
                  <div key={agent.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{fullName}</p>
                        <p className="mt-1 text-sm text-slate-600">{agent.matricule} - {agent.fonction}</p>
                      </div>
                      <Link href={`/cards/${agent.id}`} className="btn-primary">
                        Ouvrir la carte
                      </Link>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
