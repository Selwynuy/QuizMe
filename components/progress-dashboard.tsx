'use client'

import { useEffect, useState } from 'react'
import { Trophy, BookOpen, Flame, BarChart3 } from 'lucide-react'

export function ProgressDashboard() {
  const [data, setData] = useState<{
    totalReviews7d: number
    accuracy: number
    streak: number
    decksCount: number
  } | null>(null)

  useEffect(() => {
    let mounted = true
    fetch('/api/progress').then(async (r) => {
      const j = await r.json()
      if (mounted) setData(j)
    })
    return () => {
      mounted = false
    }
  }, [])

  const total = data?.totalReviews7d ?? 0
  const accuracy = data?.accuracy ?? 0
  const streak = data?.streak ?? 0
  const decksCount = data?.decksCount ?? 0

  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm text-[--color-text-secondary]">Decks Created</div>
          <BookOpen className="h-5 w-5 text-blue-600" />
        </div>
        <div className="mt-2 text-3xl font-bold">{decksCount}</div>
        <div className="mt-3 h-2 w-full rounded bg-gray-100">
          <div
            className="h-2 rounded bg-blue-500"
            style={{ width: `${Math.min(decksCount * 10, 100)}%` }}
          />
        </div>
      </div>
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm text-[--color-text-secondary]">Reviews (7d)</div>
          <BarChart3 className="h-5 w-5 text-purple-600" />
        </div>
        <div className="mt-2 text-3xl font-bold">{total}</div>
        <div className="mt-3 h-2 w-full rounded bg-gray-100">
          <div
            className="h-2 rounded bg-purple-500"
            style={{ width: `${Math.min(total, 100)}%` }}
          />
        </div>
      </div>
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm text-[--color-text-secondary]">Accuracy</div>
          <Trophy className="h-5 w-5 text-amber-500" />
        </div>
        <div className="mt-2 text-3xl font-bold">{accuracy}%</div>
        <div className="mt-3 h-2 w-full rounded bg-gray-100">
          <div className="h-2 rounded bg-amber-400" style={{ width: `${accuracy}%` }} />
        </div>
      </div>
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm text-[--color-text-secondary]">Current Streak</div>
          <Flame className="h-5 w-5 text-red-500" />
        </div>
        <div className="mt-2 text-3xl font-bold">{streak}d</div>
        <div className="mt-3 text-xs text-[--color-text-secondary]">Past 7 days</div>
      </div>
    </section>
  )
}
