'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface DeckOrganizationProps {
  title: string
  description: string
  isPublic: boolean
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string) => void
  onPublicChange: (isPublic: boolean) => void
  onTagsChange: (tags: string[]) => void
  onDifficultyChange: (difficulty: string) => void
  onSave: () => void
  onBack: () => void
  saving?: boolean
}

export function DeckOrganization({
  title,
  description,
  isPublic,
  onTitleChange,
  onDescriptionChange,
  onPublicChange,
  onTagsChange,
  onDifficultyChange,
  onSave,
  onBack,
  saving = false,
}: DeckOrganizationProps) {
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [difficulty, setDifficulty] = useState('intermediate')

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const newTags = [...tags, newTag.trim()]
      setTags(newTags)
      onTagsChange(newTags)
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove)
    setTags(newTags)
    onTagsChange(newTags)
  }

  const handleDifficultyChange = (newDifficulty: string) => {
    setDifficulty(newDifficulty)
    onDifficultyChange(newDifficulty)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organize Your Deck</CardTitle>
        <p className="text-sm text-muted-foreground">
          Add final details to organize and categorize your study deck
        </p>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="deck-title">Deck Title</Label>
            <Input
              id="deck-title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g. Biology - Cell Structure"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="deck-desc">Description</Label>
            <Textarea
              id="deck-desc"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Optional description of your deck"
              rows={3}
            />
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button onClick={handleAddTag} variant="outline">
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Difficulty Level</Label>
              <div className="flex gap-2">
                {['beginner', 'intermediate', 'advanced'].map((level) => (
                  <Button
                    key={level}
                    onClick={() => handleDifficultyChange(level)}
                    variant={difficulty === level ? 'default' : 'outline'}
                    size="sm"
                    className="capitalize"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is-public"
                checked={isPublic}
                onChange={(e) => onPublicChange(e.target.checked)}
              />
              <Label htmlFor="is-public">Make this deck public</Label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={onBack} variant="outline">
            Back
          </Button>
          <Button onClick={onSave} disabled={saving || !title.trim()}>
            {saving ? 'Creating Deck...' : 'Create Deck'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}



