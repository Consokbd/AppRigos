'use client'

import { useState } from 'react'

interface AgentFormValues {
  matricule?: string
  nom?: string
  postnom?: string
  prenom?: string
  fonction?: string
  service?: string
  telephone?: string
  email?: string
  photo?: string
  statut?: string
  expiresAt?: string
}

interface AgentFormProps {
  action: (formData: FormData) => Promise<void>
  initialValues?: AgentFormValues & { id?: string }
  buttonLabel?: string
}

export default function AgentForm({ action, initialValues, buttonLabel = 'Enregistrer' }: AgentFormProps) {
  const [photoPreview, setPhotoPreview] = useState(initialValues?.photo ?? '')

  async function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const imageUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      const maxWidth = 700
      const maxHeight = 900
      const ratio = Math.min(maxWidth / image.width, maxHeight / image.height, 1)
      const width = Math.round(image.width * ratio)
      const height = Math.round(image.height * ratio)
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      canvas.width = width
      canvas.height = height
      context?.drawImage(image, 0, 0, width, height)
      setPhotoPreview(canvas.toDataURL('image/jpeg', 0.84))
      URL.revokeObjectURL(imageUrl)
    }

    image.src = imageUrl
  }

  return (
    <form action={action} className="agent-form">
      {initialValues?.id && <input type="hidden" name="id" value={initialValues.id} />}
      <input type="hidden" name="photo" value={photoPreview} />

      <div className="agent-form-section">
        <div>
          <p className="agent-form-title">Informations de l'agent</p>
          <h2 className="agent-form-subtitle">Details du profil</h2>
        </div>

        <div className="agent-form-grid-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Matricule</span>
            <input name="matricule" defaultValue={initialValues?.matricule} required className="agent-input" />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Fonction</span>
            <input name="fonction" defaultValue={initialValues?.fonction} required className="agent-input" />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Nom</span>
            <input name="nom" defaultValue={initialValues?.nom} required className="agent-input" />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Service</span>
            <input name="service" defaultValue={initialValues?.service} required className="agent-input" />
          </label>
        </div>
      </div>

      <div className="agent-form-grid-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Postnom</span>
          <input name="postnom" defaultValue={initialValues?.postnom} className="agent-input-muted" />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Prenom</span>
          <input name="prenom" defaultValue={initialValues?.prenom} className="agent-input-muted" />
        </label>
      </div>

      <div className="agent-form-grid-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Telephone</span>
          <input name="telephone" defaultValue={initialValues?.telephone} className="agent-input-muted" />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
          <input name="email" type="email" defaultValue={initialValues?.email} className="agent-input-muted" />
        </label>
      </div>

      <div className="agent-form-section">
        <label className="block">
          <span className="mb-3 block text-sm font-medium text-slate-700">Photo passeport</span>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="h-36 w-28 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {photoPreview ? (
                <img src={photoPreview} alt="Apercu photo passeport" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center px-3 text-center text-xs font-semibold text-slate-400">
                  Apercu photo
                </div>
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handlePhotoChange}
                className="agent-input-muted"
              />
              <p className="mt-2 text-sm text-slate-500">Importez une photo passeport nette, de face, au format JPG, PNG ou WebP.</p>
            </div>
          </div>
        </label>
      </div>

      <div className="agent-form-grid-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Statut</span>
          <select name="statut" defaultValue={initialValues?.statut ?? 'ACTIF'} className="agent-select">
            <option value="ACTIF">ACTIF</option>
            <option value="INACTIF">INACTIF</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Date d'expiration de la carte</span>
          <input name="expiresAt" type="date" defaultValue={initialValues?.expiresAt} className="agent-input-muted" />
        </label>
      </div>

      <div className="agent-form-actions">
        <button type="submit" className="btn-primary">
          {buttonLabel}
        </button>
      </div>
    </form>
  )
}
