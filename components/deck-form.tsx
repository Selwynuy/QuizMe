'use client'

import { useEffect, useState } from 'react'
import { PdfUpload } from '@/components/pdf-upload'
import { AIGenerate } from '@/components/ai-generate'
import { EnhancedUpload } from '@/components/enhanced-upload'
import { GoalSetting } from '@/components/goal-setting'
import { ContentPreview } from '@/components/content-preview'
import { CardReview } from '@/components/card-review'
import { DeckOrganization } from '@/components/deck-organization'
import { StudyIntegration } from '@/components/study-integration'
import { createDeck } from '@/lib/actions/decks'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function DeckForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [studyGoal, setStudyGoal] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [notes, setNotes] = useState('')
  const [draftCards, setDraftCards] = useState<{ front: string; back: string }[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showContentPreview, setShowContentPreview] = useState(false)
  const [showCardReview, setShowCardReview] = useState(false)
  const [showOrganization, setShowOrganization] = useState(false)
  const [showStudyIntegration, setShowStudyIntegration] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState('intermediate')
  const [createdDeckId, setCreatedDeckId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const cached = localStorage.getItem('deck_notes')
      if (cached) {
        setNotes(cached)
        localStorage.removeItem('deck_notes')
        // If we have pre-uploaded content, show content preview immediately
        setShowContentPreview(true)
      }

      // Load pre-generated cards from PDF upload
      const generatedCards = localStorage.getItem('generated_cards')
      if (generatedCards) {
        const cards = JSON.parse(generatedCards)
        setDraftCards(cards)
        localStorage.removeItem('generated_cards')
        // If we have pre-generated cards, show card review immediately
        setShowCardReview(true)
      }
    } catch {}
  }, [])

  function handleGoalSelect(goal: string) {
    setStudyGoal(goal)
    setCurrentStep(2)
  }

  function handleNext() {
    if (currentStep === 2) {
      if (!title.trim()) {
        setError('Title is required')
        return
      }
      setError(null)
      setCurrentStep(3)
    }
  }

  function handleBack() {
    if (currentStep === 2) {
      setCurrentStep(1)
    } else if (currentStep === 3) {
      setCurrentStep(2)
    }
  }

  function handleContentGenerated(content: string) {
    setNotes(content)
    setShowContentPreview(true)
  }

  function handleContentPreviewContinue() {
    setShowContentPreview(false)
    setShowCardReview(true)
  }

  function handleContentPreviewBack() {
    setShowContentPreview(false)
  }

  function handleCardReviewContinue() {
    setShowCardReview(false)
    setShowOrganization(true)
  }

  function handleCardReviewBack() {
    setShowCardReview(false)
    setShowContentPreview(true)
  }

  function handleGenerateMoreCards() {
    // This would trigger another AI generation
    setShowCardReview(false)
    setShowContentPreview(true)
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    const { data, error } = await createDeck({
      title,
      description,
      is_public: isPublic,
      cards: draftCards,
    })
    setSaving(false)
    if (error) {
      setError(error)
      return
    }
    if (data) {
      setCreatedDeckId(data.id)
      setShowOrganization(false)
      setShowStudyIntegration(true)
    }
  }

  function handleStartStudy() {
    if (createdDeckId) {
      window.location.href = `/study/${createdDeckId}`
    }
  }

  function handleSaveForLater() {
    if (createdDeckId) {
      window.location.href = `/decks/${createdDeckId}`
    }
  }

  return (
    <div className="grid gap-6">
      {/* Progress indicator */}
      <div className="flex items-center gap-4">
        <div
          className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
              currentStep >= 1
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-muted-foreground'
            }`}
          >
            1
          </div>
          <span className="text-sm font-medium">Goal Setting</span>
        </div>
        <div className="flex-1 h-px bg-border"></div>
        <div
          className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
              currentStep >= 2
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-muted-foreground'
            }`}
          >
            2
          </div>
          <span className="text-sm font-medium">Deck Details</span>
        </div>
        <div className="flex-1 h-px bg-border"></div>
        <div
          className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
              currentStep >= 3
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-muted-foreground'
            }`}
          >
            3
          </div>
          <span className="text-sm font-medium">Add Content</span>
        </div>
      </div>

      {currentStep === 1 && <GoalSetting onGoalSelect={handleGoalSelect} />}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Deck Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="deck-title">Title</Label>
              <Input
                id="deck-title"
                placeholder="e.g. Biology - Cell Structure"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deck-desc">Description</Label>
              <textarea
                id="deck-desc"
                className="rounded-md border px-3 py-2"
                rows={3}
                placeholder="Optional"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              Make deck public
            </label>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && !showContentPreview && !showCardReview && (
        <Card>
          <CardHeader>
            <CardTitle>Add Content</CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose how you want to add your study content
            </p>
          </CardHeader>
          <CardContent>
            <EnhancedUpload
              onContentGenerated={handleContentGenerated}
              onCardsGenerated={setDraftCards}
              hasExistingContent={notes.length > 0}
            />
          </CardContent>
        </Card>
      )}

      {showContentPreview && (
        <ContentPreview
          content={notes}
          onContentChange={setNotes}
          onContinue={handleContentPreviewContinue}
          onBack={handleContentPreviewBack}
        />
      )}

      {showCardReview && (
        <CardReview
          cards={draftCards}
          onCardsChange={setDraftCards}
          onContinue={handleCardReviewContinue}
          onGenerateMore={handleGenerateMoreCards}
          onBack={handleCardReviewBack}
        />
      )}

      {showOrganization && (
        <DeckOrganization
          title={title}
          description={description}
          isPublic={isPublic}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onPublicChange={setIsPublic}
          onTagsChange={setTags}
          onDifficultyChange={setDifficulty}
          onSave={handleSave}
          onBack={() => setShowOrganization(false)}
          saving={saving}
        />
      )}

      {showStudyIntegration && createdDeckId && (
        <StudyIntegration
          deckId={createdDeckId}
          deckTitle={title}
          cardCount={draftCards.length}
          onStartStudy={handleStartStudy}
          onSaveForLater={handleSaveForLater}
        />
      )}

      {error && <div className="text-sm text-[--color-error]">{error}</div>}

      {!showContentPreview && !showCardReview && !showOrganization && !showStudyIntegration && (
        <div className="flex gap-3">
          {currentStep === 1 ? (
            <Button variant="outline" asChild>
              <a href="/dashboard">Cancel</a>
            </Button>
          ) : currentStep === 2 ? (
            <>
              <Button onClick={handleNext}>Next</Button>
              <Button onClick={handleBack} variant="outline">
                Back
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save Deck'}
              </Button>
              <Button onClick={handleBack} variant="outline">
                Back
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
