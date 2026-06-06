'use client'

import Link from 'next/link'

export default function Sidebar() {
  const navItems = [
    { href: '/dashboard', label: 'Tableau de bord' },
    { href: '/agents', label: 'Agents' },
    { href: '/agents/new', label: 'Nouvel agent' },
  ]

  return (
    <aside className="sidebar">
      <div>
        <p className="sidebar-title">Navigation</p>
        <h2 className="mt-3 text-xl font-semibold text-slate-900">RIGOS</h2>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="nav-link"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
