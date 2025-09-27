'use client'

import Link from 'next/link'
import { LogoutButton } from '@/components/logout-button'

export function NavBar() {
  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="inline-block h-6 w-6 rounded bg-[--color-primary]" />
            <span className="font-medium">QuizMe</span>
          </Link>
          <nav className="ml-6 hidden gap-5 text-sm text-[--color-text-secondary] md:flex">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/decks/new">New Deck</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/profile" className="text-sm">
            Profile
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
