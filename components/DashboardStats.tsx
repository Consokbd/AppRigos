'use client'

interface DashboardStatsProps {
  total: number
  active: number
  inactive: number
  cards: number
}

export default function DashboardStats({ total, active, inactive, cards }: DashboardStatsProps) {
  const items = [
    { label: 'Total agents', value: total, accentClass: 'accent-primary' },
    { label: 'Agents actifs', value: active, accentClass: 'accent-success' },
    { label: 'Agents inactifs', value: inactive, accentClass: 'accent-red' },
    { label: 'Cartes générées', value: cards, accentClass: 'accent-secondary' },
  ]

  return (
    <div className="stats-grid">
      {items.map((item) => (
        <div key={item.label} className="stat-item">
          <span className={`stat-badge ${item.accentClass}`}>{item.label}</span>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{item.value}</p>
        </div>
      ))}
    </div>
  )
}
