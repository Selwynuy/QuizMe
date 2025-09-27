'use client'

import { useEffect, useState } from 'react'

export function ProgressDashboard() {
  const [data, setData] = useState<{
    totalReviews7d: number
    accuracy: number
    streak: number
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

  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-3">
      <div className="rounded-lg border bg-white p-5">
        <div className="text-sm text-[--color-text-secondary]">Reviews (7d)</div>
        <div className="mt-2 text-2xl font-semibold">{total}</div>
        <div className="mt-3 h-2 w-full rounded bg-gray-100">
          <div
            className="h-2 rounded bg-[--color-secondary]"
            style={{ width: `${Math.min(total, 100)}%` }}
          />
        </div>
      </div>
      <div className="rounded-lg border bg-white p-5">
        <div className="text-sm text-[--color-text-secondary]">Accuracy</div>
        <div className="mt-2 text-2xl font-semibold">{accuracy}%</div>
        <div className="mt-3 h-2 w-full rounded bg-gray-100">
          <div className="h-2 rounded bg-[--color-accent]" style={{ width: `${accuracy}%` }} />
        </div>
      </div>
      <div className="rounded-lg border bg-white p-5">
        <div className="text-sm text-[--color-text-secondary]">Streak</div>
        <div className="mt-2 text-2xl font-semibold">{streak}d</div>
        <div className="mt-3 text-xs text-[--color-text-secondary]">Past 7 days</div>
      </div>
    </section>
  )
}
