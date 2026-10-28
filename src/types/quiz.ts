export type LegacyQuizQuestion = {
  type?: 'multiple'
  id: string
  prompt: string
  options: string[]
  correctOption: number
  explanation: string
}

type QuestionBase = {
  id: string
  prompt: string
  category: string
  evidence: string[]
  source: string
  explanation: string
  keyFigure: string
}

export type DefenseQuestion = QuestionBase & (
  | { type: 'multiple' | 'evidence'; options: string[]; correctOption: number; optionExplanations: string[] }
  | { type: 'open'; points: string[] }
)

export type QuizQuestion = LegacyQuizQuestion | DefenseQuestion

export type Quiz = {
  id: string
  title: string
  topic: string
  description: string
  estimatedMinutes: number
  questions: QuizQuestion[]
}
