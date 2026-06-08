'use client'

import { signOut } from 'next-auth/react'

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <img src="/logo.jpeg" alt="RIGOS" className="navbar-logo" />
          <div>
            <p className="navbar-title">RIGOS</p>
            <p className="text-sm text-slate-500">Gestion des cartes de service</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="btn-logout"
        >
          Deconnexion
        </button>
      </div>
    </header>
  )
}
