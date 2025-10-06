'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface StudyIntegrationProps {
  deckId: string
  deckTitle: string
  cardCount: number
  onStartStudy: () => void
  onSaveForLater: () => void
}

export function StudyIntegration({
  deckId,
  deckTitle,
  cardCount,
  onStartStudy,
  onSaveForLater,
}: StudyIntegrationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>🎉 Deck Created Successfully!</CardTitle>
        <p className="text-sm text-muted-foreground">
          Your deck "{deckTitle}" with {cardCount} flashcards is ready to study
        </p>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700">
              <span className="text-lg">✅</span>
              <span className="font-medium">Deck saved successfully</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Your flashcards are now available in your dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={onStartStudy}
              className="h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              🚀 Start Studying Now
            </Button>
            <Button onClick={onSaveForLater} variant="outline" className="h-12 text-lg">
              📚 Save for Later
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">You can always find this deck in your dashboard</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
