import { prisma } from '@/lib/prisma'

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const agent = await prisma.agent.findUnique({ where: { id } })
  if (!agent) {
    return (
      <div className="min-h-screen bg-surface px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-red-50 p-8 text-red-800 shadow-soft">
          <h1 className="text-2xl font-semibold">Profil introuvable</h1>
          <p className="mt-3">Le QR Code ne correspond à aucun agent.</p>
        </div>
      </div>
    )
  }

  const fullName = `${agent.nom} ${agent.postnom ?? ''} ${agent.prenom ?? ''}`.trim()

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <div className="rounded-3xl bg-primary p-6 text-white shadow-soft">
            <div className="h-40 w-40 overflow-hidden rounded-3xl bg-slate-100">
              {agent.photo ? (
                <img src={agent.photo} alt={fullName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-lg font-semibold text-slate-700">Photo</div>
              )}
            </div>
            <div className="mt-6 space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-200">Carte de service</p>
              <h1 className="text-2xl font-semibold">{fullName}</h1>
              <p className="text-sm text-slate-100">{agent.fonction}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Informations de l'agent</h2>
              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                <li><span className="font-semibold text-slate-900">Matricule :</span> {agent.matricule}</li>
                <li><span className="font-semibold text-slate-900">Service :</span> {agent.service}</li>
                <li><span className="font-semibold text-slate-900">Téléphone :</span> {agent.telephone ?? 'Non renseigné'}</li>
                <li><span className="font-semibold text-slate-900">Email :</span> {agent.email ?? 'Non renseigné'}</li>
                <li><span className="font-semibold text-slate-900">Statut :</span> {agent.statut}</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">QR Code</h2>
              <div className="mt-6 flex items-center justify-center rounded-3xl bg-slate-100 p-6">
                {agent.qrCode ? (
                  <img src={agent.qrCode} alt="QR Code" className="h-44 w-44 object-contain" />
                ) : (
                  <p className="text-sm text-slate-500">QR Code non disponible</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
