import type { DefenseQuestion } from './types/quiz'

export function shuffle<T>(values: T[]): T[] {
  const copy = [...values]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function prepareSession(pool: DefenseQuestion[], simulation = false): DefenseQuestion[] {
  let selected = shuffle(pool)
  if (simulation) {
    const open = selected.filter(q => q.type === 'open').slice(0, 4)
    const ids = new Set(open.map(q => q.id))
    selected = shuffle([...open, ...selected.filter(q => !ids.has(q.id)).slice(0, 6)])
  }
  return selected.map(q => {
    if (q.type === 'open') return q
    const indices = shuffle(q.options.map((_, index) => index))
    return { ...q, options: indices.map(i => q.options[i]), optionExplanations: indices.map(i => q.optionExplanations[i]), correctOption: indices.indexOf(q.correctOption) }
  })
}
