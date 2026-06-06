import AgentForm from '@/components/AgentForm'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import QRCodeGenerator from '@/components/QRCodeGenerator'
import { prisma } from '@/lib/prisma'
import { createQRCode } from '@/lib/qrcode'
import { getServerAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

async function updateAgent(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const fonction = formData.get('fonction') as string
  const service = formData.get('service') as string
  const nom = formData.get('nom') as string
  const postnom = formData.get('postnom') as string
  const prenom = formData.get('prenom') as string
  const telephone = formData.get('telephone') as string
  const email = formData.get('email') as string
  const photo = formData.get('photo') as string
  const statut = (formData.get('statut') as string) ?? 'ACTIF'

  const agent = await prisma.agent.update({
    where: { id },
    data: {
      fonction,
      service,
      nom,
      postnom: postnom || null,
      prenom: prenom || null,
      telephone: telephone || null,
      email: email || null,
      photo: photo || null,
      statut,
    },
  })

  if (!agent.qrCode) {
    const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
    const profileUrl = `${baseUrl}/profile/${agent.id}`
    const qrData = await createQRCode(profileUrl)
    await prisma.agent.update({ where: { id }, data: { qrCode: qrData } })
  }

  redirect(`/agents/${id}`)
}

export default async function AgentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
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
          <h1 className="text-2xl font-semibold">Agent non trouvé</h1>
          <p className="mt-3">Vérifiez l'identifiant ou retournez à la liste des agents.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr] lg:px-6">
        <Sidebar />

        <section className="space-y-6">
          <div className="card-surface p-6">
            <h1 className="text-3xl font-semibold text-slate-900">Fiche agent</h1>
            <p className="mt-2 text-slate-600">Modifiez les informations et consultez le QR Code du profil.</p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <div>
              <div className="card-surface p-6">
                <h2 className="text-xl font-semibold text-slate-900">Informations</h2>
                <div className="mt-6 space-y-3 text-sm text-slate-600">
                  <p><span className="font-semibold text-slate-900">Matricule :</span> {agent.matricule}</p>
                  <p><span className="font-semibold text-slate-900">Nom complet :</span> {agent.nom} {agent.postnom ?? ''} {agent.prenom ?? ''}</p>
                  <p><span className="font-semibold text-slate-900">Fonction :</span> {agent.fonction}</p>
                  <p><span className="font-semibold text-slate-900">Service :</span> {agent.service}</p>
                  <p><span className="font-semibold text-slate-900">Téléphone :</span> {agent.telephone ?? 'Non renseigné'}</p>
                  <p><span className="font-semibold text-slate-900">Email :</span> {agent.email ?? 'Non renseigné'}</p>
                  <p><span className="font-semibold text-slate-900">Statut :</span> {agent.statut}</p>
                </div>
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
                }}
                buttonLabel="Mettre à jour"
              />
            </div>

            <div className="space-y-6">
              <div className="card-surface p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">QR Code profil</p>
                    <h2 className="text-xl font-semibold text-slate-900">Accès public</h2>
                  </div>
                </div>
                <QRCodeGenerator value={agent.qrCode ?? `${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/profile/${agent.id}`} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
