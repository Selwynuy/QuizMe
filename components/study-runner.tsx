'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

type Card = { id: string; front: string; back: string }

export function StudyRunner({ deckId }: { deckId: string }) {
  const [card, setCard] = useState<Card | null>(null)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // session state
  const [seenCount, setSeenCount] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [sessionActive, setSessionActive] = useState(true)
  const [startTs] = useState(() => Date.now())
  const [elapsedMs, setElapsedMs] = useState(0)
  const timerRef = useRef<number | null>(null)

  // Get session key for this deck
  const sessionKey = `study_session_${deckId}`

  // Get seen cards from localStorage
  const getSeenCards = () => {
    try {
      const stored = localStorage.getItem(sessionKey)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  // Add card to seen list
  const markCardAsSeen = (cardId: string) => {
    const seen = getSeenCards()
    if (!seen.includes(cardId)) {
      const updated = [...seen, cardId]
      localStorage.setItem(sessionKey, JSON.stringify(updated))
    }
  }

  // Check if all cards have been seen
  const checkSessionComplete = async () => {
    const seen = getSeenCards()
    const res = await fetch(`/api/cards?deckId=${deckId}`)
    const data = await res.json()
    const totalCards = data.cards?.length || 0
    return seen.length >= totalCards
  }

  async function loadNext(excludeId?: string) {
    setLoading(true)
    setError(null)

    // Check if session is complete
    const isComplete = await checkSessionComplete()
    if (isComplete) {
      setCard(null)
      setLoading(false)
      return
    }

    // Get all cards and filter out seen ones client-side
    const res = await fetch(`/api/cards?deckId=${deckId}`)
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Failed to load cards')
      setLoading(false)
      return
    }

    const allCards = data.cards || []
    const seen = getSeenCards()
    const availableCards = allCards.filter(
      (card) => !seen.includes(card.id) && (!excludeId || card.id !== excludeId),
    )

    if (availableCards.length === 0) {
      setCard(null)
      setLoading(false)
      return
    }

    // Simple selection: first available card
    setCard(availableCards[0])
    setFlipped(false)
    setLoading(false)
  }

  useEffect(() => {
    loadNext()
  }, [deckId])

  async function grade(g: 0 | 1 | 2 | 3) {
    if (!card) return
    await fetch('/api/study/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deckId, cardId: card.id, grade: g }),
    })
    setSeenCount((n) => n + 1)
    if (g >= 2) setCorrectCount((n) => n + 1)
    markCardAsSeen(card.id)
    await loadNext() // No need to pass card.id since we filter client-side
  }

  // keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!sessionActive) return
      if (e.key === ' ' || e.key.toLowerCase() === 'f') {
        e.preventDefault()
        setFlipped((v) => !v)
        return
      }
      if (!flipped) return
      if (e.key === '1') grade(0)
      if (e.key === '2') grade(1)
      if (e.key === '3') grade(2)
      if (e.key === '4') grade(3)
      if (e.key === 'ArrowLeft') grade(0)
      if (e.key === 'ArrowRight') grade(3)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flipped, sessionActive, card])

  // swipe gestures (basic)
  const touchStartX = useRef<number | null>(null)
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null
  }, [])
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current == null) return
      const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current
      if (Math.abs(dx) > 60) {
        if (!flipped) {
          setFlipped(true)
        } else {
          if (dx < 0) grade(0)
          else grade(3)
        }
      }
      touchStartX.current = null
    },
    [flipped, grade],
  )

  // timer
  useEffect(() => {
    if (!sessionActive) return
    timerRef.current = window.setInterval(() => setElapsedMs(Date.now() - startTs), 1000)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [sessionActive, startTs])

  const accuracy = useMemo(
    () => (seenCount === 0 ? 0 : Math.round((correctCount / seenCount) * 100)),
    [seenCount, correctCount],
  )

  function endSession() {
    setSessionActive(false)
  }

  return (
    <div className="mt-8">
      {loading && <div className="text-sm text-[--color-text-secondary]">Loading…</div>}
      {error && <div className="text-sm text-[--color-error]">{error}</div>}
      {!loading && !card && (
        <div className="space-y-4">
          <div className="text-sm text-[--color-text-secondary]">
            {seenCount === 0
              ? 'No cards found in this deck. Add some cards to start studying!'
              : 'No more cards due. Nice work!'}
          </div>
          {seenCount > 0 && (
            <div className="text-sm">
              Seen: {seenCount} • Accuracy: {accuracy}% • Time: {Math.floor(elapsedMs / 60000)}:
              {String(Math.floor((elapsedMs % 60000) / 1000)).padStart(2, '0')}
            </div>
          )}
          <div>
            <Button
              variant="outline"
              onClick={() => {
                setSeenCount(0)
                setCorrectCount(0)
                setElapsedMs(0)
                localStorage.removeItem(sessionKey) // Clear session
                setSessionActive(true)
                loadNext()
              }}
            >
              {seenCount === 0 ? 'Try Again' : 'Start New Session'}
            </Button>
          </div>
        </div>
      )}
      {card && (
        <Card onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Flashcard</CardTitle>
              <div className="text-xs text-[--color-text-secondary]">
                Seen {seenCount} • {accuracy}% • {Math.floor(elapsedMs / 60000)}:
                {String(Math.floor((elapsedMs % 60000) / 1000)).padStart(2, '0')}
              </div>
            </div>
            <div className="mt-2">
              <Progress
                value={Math.min(100, seenCount === 0 ? 0 : Math.min(100, (seenCount % 20) * 5))}
              />
              <div className="mt-1 text-xs text-[--color-text-secondary]">Card {seenCount + 1}</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mx-auto max-w-prose">
              <div
                className={
                  'relative mx-auto mt-2 grid h-56 place-items-center rounded-lg border bg-background text-center text-lg transition-transform duration-300 cursor-pointer ' +
                  (flipped
                    ? 'rotate-y-180 [transform-style:preserve-3d]'
                    : '[transform-style:preserve-3d]')
                }
                style={{ perspective: '1000px' } as any}
                onClick={() => setFlipped((v) => !v)}
                role="button"
                aria-label={flipped ? 'Hide answer' : 'Show answer'}
              >
                <div className={'absolute inset-0 grid place-items-center px-6 backface-hidden'}>
                  <div>Q: {card.front}</div>
                </div>
                <div
                  className={
                    'absolute inset-0 grid place-items-center px-6 rotate-y-180 backface-hidden'
                  }
                >
                  <div>A: {card.back}</div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" className="min-w-40" onClick={() => setFlipped((v) => !v)}>
                {flipped ? 'Hide Answer' : 'Show Answer'} (Space)
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (card) {
                    markCardAsSeen(card.id)
                    loadNext()
                  }
                }}
              >
                Skip
              </Button>
              <div className="ml-auto" />
              <Button variant="outline" size="sm" onClick={endSession}>
                End Session
              </Button>
            </div>
            {flipped && (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Button variant="destructive" onClick={() => grade(0)}>
                  Again (1)
                </Button>
                <Button onClick={() => grade(1)}>Hard (2)</Button>
                <Button onClick={() => grade(2)}>Good (3)</Button>
                <Button variant="default" onClick={() => grade(3)}>
                  Easy (4)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
