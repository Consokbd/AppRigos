import AgentForm from '@/components/AgentForm'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { prisma } from '@/lib/prisma'
import { createQRCode } from '@/lib/qrcode'
import { getServerAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function createAgent(formData: FormData) {
  'use server'
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

  const agent = await prisma.agent.create({
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

  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  const profileUrl = `${baseUrl}/profile/${agent.id}`
  const qrData = await createQRCode(profileUrl)

  await prisma.agent.update({
    where: { id: agent.id },
    data: { qrCode: qrData },
  })

  redirect(`/cards/${agent.id}`)
}

export default async function NewAgentPage() {
  const session = await getServerAuthSession()
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr] lg:px-6">
        <Sidebar />
        <section className="space-y-6">
          <div className="card-surface p-6">
            <h1 className="text-3xl font-semibold text-slate-900">Nouvel agent</h1>
            <p className="mt-2 text-slate-600">Creez une fiche agent et generez automatiquement sa carte de service.</p>
          </div>
          <AgentForm action={createAgent} />
        </section>
      </main>
    </div>
  )
}
