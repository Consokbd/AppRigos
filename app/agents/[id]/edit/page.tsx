import AgentForm from '@/components/AgentForm'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function updateAgent(formData: FormData) {
  'use server'

  const id = formData.get('id') as string
  if (!id) return

  const matricule = formData.get('matricule') as string
  const nom = formData.get('nom') as string
  const postnom = formData.get('postnom') as string
  const prenom = formData.get('prenom') as string
  const fonction = formData.get('fonction') as string
  const service = formData.get('service') as string
  const telephone = formData.get('telephone') as string
  const email = formData.get('email') as string
  const photo = formData.get('photo') as string
  const statut = (formData.get('statut') as string) ?? 'ACTIF'
  const expiresAt = formData.get('expiresAt') as string

  await prisma.agent.update({
    where: { id },
    data: {
      matricule,
      nom,
      postnom: postnom || null,
      prenom: prenom || null,
      fonction,
      service,
      telephone: telephone || null,
      email: email || null,
      photo: photo || null,
      statut,
      expiresAt: expiresAt ? new Date(`${expiresAt}T00:00:00.000Z`) : null,
    },
  })

  revalidatePath('/agents')
  revalidatePath('/dashboard')
  revalidatePath(`/agents/${id}`)
  revalidatePath(`/cards/${id}`)
  revalidatePath(`/profile/${id}`)
  redirect(`/agents/${id}`)
}

export default async function EditAgentPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerAuthSession()
  if (!session) {
    redirect('/login')
  }

  const { id } = await params
  const agent = await prisma.agent.findUnique({ where: { id } })
  if (!agent) {
    return (
      <div className="min-h-screen bg-surface px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-red-50 p-8 text-red-800 shadow-soft">
          <h1 className="text-2xl font-semibold">Agent non trouve</h1>
          <p className="mt-3">Verifiez l'identifiant ou retournez a la liste des agents.</p>
        </div>
      </div>
    )
  }

  const fullName = `${agent.nom} ${agent.postnom ?? ''} ${agent.prenom ?? ''}`.trim()

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr] lg:px-6">
        <Sidebar />
        <section className="space-y-6">
          <div className="card-surface p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Modification</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Modifier {fullName}</h1>
            <p className="mt-2 text-slate-600">Mettez a jour les informations de l'agent et ses supports de verification.</p>
          </div>

          <AgentForm
            action={updateAgent}
            initialValues={{
              id: agent.id,
              matricule: agent.matricule,
              nom: agent.nom,
              postnom: agent.postnom ?? undefined,
              prenom: agent.prenom ?? undefined,
              fonction: agent.fonction,
              service: agent.service,
              telephone: agent.telephone ?? undefined,
              email: agent.email ?? undefined,
              photo: agent.photo ?? undefined,
              statut: agent.statut,
              expiresAt: agent.expiresAt ? agent.expiresAt.toISOString().slice(0, 10) : undefined,
            }}
            buttonLabel="Enregistrer les modifications"
          />
        </section>
      </main>
    </div>
  )
}
