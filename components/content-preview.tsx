'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface ContentPreviewProps {
  content: string
  onContentChange: (content: string) => void
  onContinue: () => void
  onBack: () => void
}

export function ContentPreview({
  content,
  onContentChange,
  onContinue,
  onBack,
}: ContentPreviewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)

  const handleEdit = () => {
    setIsEditing(true)
    setEditedContent(content)
  }

  const handleSave = () => {
    onContentChange(editedContent)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedContent(content)
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Preview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Review and edit your content before generating flashcards
        </p>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isEditing ? (
          <div className="grid gap-3">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={12}
              className="font-mono text-sm"
              placeholder="Edit your content here..."
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{content}</pre>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {content.length} characters, ~{Math.ceil(content.length / 500)} flashcards possible
              </div>
              <Button onClick={handleEdit} variant="outline" size="sm">
                Edit Content
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={onBack} variant="outline">
            Back
          </Button>
          <Button onClick={onContinue}>Generate Flashcards</Button>
        </div>
      </CardContent>
    </Card>
  )
}



