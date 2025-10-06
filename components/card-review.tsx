'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface CardDraft {
  front: string
  back: string
}

interface CardReviewProps {
  cards: CardDraft[]
  onCardsChange: (cards: CardDraft[]) => void
  onContinue: () => void
  onGenerateMore: () => void
  onBack: () => void
}

export function CardReview({
  cards,
  onCardsChange,
  onContinue,
  onGenerateMore,
  onBack,
}: CardReviewProps) {
  const [editingCard, setEditingCard] = useState<number | null>(null)
  const [editedCards, setEditedCards] = useState<CardDraft[]>(cards)
  const [approvedCards, setApprovedCards] = useState<Set<number>>(new Set())

  const handleEditCard = (index: number) => {
    setEditingCard(index)
  }

  const handleSaveCard = (index: number) => {
    onCardsChange(editedCards)
    setEditingCard(null)
  }

  const handleDeleteCard = (index: number) => {
    const newCards = editedCards.filter((_, i) => i !== index)
    setEditedCards(newCards)
    onCardsChange(newCards)
    setApprovedCards((prev) => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
  }

  const handleApproveCard = (index: number) => {
    setApprovedCards((prev) => new Set([...prev, index]))
  }

  const handleRejectCard = (index: number) => {
    setApprovedCards((prev) => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
  }

  const handleCardChange = (index: number, field: 'front' | 'back', value: string) => {
    setEditedCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, [field]: value } : card)),
    )
  }

  const approvedCount = approvedCards.size
  const totalCount = cards.length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Generated Cards</CardTitle>
        <p className="text-sm text-muted-foreground">
          Review and edit your flashcards. Approve the ones you want to keep.
        </p>
        <div className="text-sm text-blue-600">
          {approvedCount} of {totalCount} cards approved
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 max-h-96 overflow-y-auto">
          {editedCards.map((card, index) => (
            <div
              key={index}
              className={`border rounded-lg p-3 ${
                approvedCards.has(index) ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}
            >
              {editingCard === index ? (
                <div className="grid gap-2">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Question</label>
                    <Input
                      value={card.front}
                      onChange={(e) => handleCardChange(index, 'front', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Answer</label>
                    <Textarea
                      value={card.back}
                      onChange={(e) => handleCardChange(index, 'back', e.target.value)}
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleSaveCard(index)} size="sm">
                      Save
                    </Button>
                    <Button onClick={() => setEditingCard(null)} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium text-gray-900">Q: {card.front}</div>
                    <div className="flex gap-1">
                      {approvedCards.has(index) ? (
                        <Button
                          onClick={() => handleRejectCard(index)}
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-300"
                        >
                          ✓ Approved
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleApproveCard(index)}
                          variant="outline"
                          size="sm"
                          className="text-gray-600"
                        >
                          Approve
                        </Button>
                      )}
                      <Button onClick={() => handleEditCard(index)} variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteCard(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">A: {card.back}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={onBack} variant="outline">
            Back
          </Button>
          <Button onClick={onGenerateMore} variant="outline">
            Generate 5 More Cards
          </Button>
          <Button onClick={onContinue} disabled={approvedCount === 0}>
            Continue with {approvedCount} Cards
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
