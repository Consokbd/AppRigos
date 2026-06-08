'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  UsersIcon,
  UserPlusIcon,
  PrinterIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  UserGroupIcon,
} from '@/components/Icons'

export default function Sidebar() {
  const pathname = usePathname() || '/dashboard'

  const navItems = [
    { href: '/dashboard', label: 'Tableau de bord', icon: UsersIcon },
    { href: '/agents', label: 'Agents', icon: UserGroupIcon },
    { href: '/agents/new', label: 'Nouvel agent', icon: UserPlusIcon },
    { href: '/cards', label: 'Impression des cartes', icon: PrinterIcon },
    { href: '/reports', label: 'Rapports', icon: DocumentChartBarIcon },
    { href: '/settings', label: 'Parametres', icon: Cog6ToothIcon },
    { href: '/users', label: 'Utilisateurs', icon: UserGroupIcon },
  ]

  return (
    <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex items-center gap-3 px-2 py-3">
        <div>
          <p className="text-2xl font-bold text-blue-600">RIGOS</p>
          <p className="text-sm text-slate-500">Administration</p>
        </div>
      </div>

      <nav className="mt-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium ${
                active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
