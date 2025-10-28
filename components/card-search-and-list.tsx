'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { CardList } from '@/components/card-list'

export function CardSearchAndList({ deckId }: { deckId: string }) {
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<'created_at' | 'updated_at'>('created_at')
  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search cards…"
          className="w-full sm:max-w-sm"
        />
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Sort:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="h-9 rounded-md border bg-white px-2 text-sm"
          >
            <option value="created_at">Recent</option>
            <option value="updated_at">Last updated</option>
          </select>
        </div>
      </div>
      <CardList deckId={deckId} query={q} sort={sort} />
    </div>
  )
}



