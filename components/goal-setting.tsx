'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const studyGoals = [
  {
    id: 'exam-prep',
    title: 'Exam Preparation',
    description: 'Prepare for upcoming tests and exams',
    icon: '📚',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
  },
  {
    id: 'language-learning',
    title: 'Language Learning',
    description: 'Learn new vocabulary and grammar',
    icon: '🌍',
    color: 'bg-green-50 border-green-200 text-green-700',
  },
  {
    id: 'general-knowledge',
    title: 'General Knowledge',
    description: 'Expand your knowledge base',
    icon: '🧠',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
  },
  {
    id: 'professional',
    title: 'Professional Development',
    description: 'Learn work-related skills and concepts',
    icon: '💼',
    color: 'bg-orange-50 border-orange-200 text-orange-700',
  },
  {
    id: 'certification',
    title: 'Certification Study',
    description: 'Prepare for professional certifications',
    icon: '🏆',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  },
  {
    id: 'other',
    title: 'Other',
    description: 'Custom learning goal',
    icon: '✨',
    color: 'bg-gray-50 border-gray-200 text-gray-700',
  },
]

export function GoalSetting({ onGoalSelect }: { onGoalSelect: (goal: string) => void }) {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId)
  }

  const handleContinue = () => {
    if (selectedGoal) {
      onGoalSelect(selectedGoal)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>What are you studying for?</CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose your learning goal to get personalized study recommendations
        </p>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {studyGoals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => handleGoalSelect(goal.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all hover:scale-105 ${
                selectedGoal === goal.id
                  ? `${goal.color} border-current`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{goal.icon}</span>
                <div>
                  <h3 className="font-medium">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {selectedGoal && (
          <div className="flex justify-end pt-4">
            <Button onClick={handleContinue}>
              Continue with {studyGoals.find((g) => g.id === selectedGoal)?.title}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
