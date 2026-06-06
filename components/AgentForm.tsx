'use client'

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
}

interface AgentFormProps {
  action: (formData: FormData) => Promise<void>
  initialValues?: AgentFormValues & { id?: string }
  buttonLabel?: string
}

export default function AgentForm({ action, initialValues, buttonLabel = 'Enregistrer' }: AgentFormProps) {
  return (
    <form action={action} className="agent-form">
      {initialValues?.id && <input type="hidden" name="id" value={initialValues.id} />}
      <div className="agent-form-section">
        <div>
          <p className="agent-form-title">Informations de l'agent</p>
          <h2 className="agent-form-subtitle">Détails du profil</h2>
        </div>

        <div className="agent-form-grid-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Matricule</span>
            <input
              name="matricule"
              defaultValue={initialValues?.matricule}
              required
              className="agent-input"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Fonction</span>
            <input
              name="fonction"
              defaultValue={initialValues?.fonction}
              required
              className="agent-input"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Nom</span>
            <input
              name="nom"
              defaultValue={initialValues?.nom}
              required
              className="agent-input"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Service</span>
            <input
              name="service"
              defaultValue={initialValues?.service}
              required
              className="agent-input"
            />
          </label>
        </div>
      </div>

      <div className="agent-form-grid-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Postnom</span>
          <input
            name="postnom"
            defaultValue={initialValues?.postnom}
            className="agent-input-muted"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Prénom</span>
          <input
            name="prenom"
            defaultValue={initialValues?.prenom}
            className="agent-input-muted"
          />
        </label>
      </div>

      <div className="agent-form-grid-3">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Téléphone</span>
          <input
            name="telephone"
            defaultValue={initialValues?.telephone}
            className="agent-input-muted"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
          <input
            name="email"
            type="email"
            defaultValue={initialValues?.email}
            className="agent-input-muted"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Photo (URL)</span>
          <input
            name="photo"
            defaultValue={initialValues?.photo}
            className="agent-input-muted"
          />
        </label>
      </div>

      <div className="agent-form-grid-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Statut</span>
          <select
            name="statut"
            defaultValue={initialValues?.statut ?? 'ACTIF'}
            className="agent-select"
          >
            <option value="ACTIF">ACTIF</option>
            <option value="INACTIF">INACTIF</option>
          </select>
        </label>
      </div>

      <div className="agent-form-actions">
        <button
          type="submit"
          className="btn-primary"
        >
          {buttonLabel}
        </button>
      </div>
    </form>
  )
}
