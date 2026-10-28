import { useState } from 'react'
import { oficiales } from './data/oficiales'
import { seguimiento } from './data/seguimiento'
import type { DefenseQuestion } from './types/quiz'
import { prepareSession } from './session'
import { MathText } from './MathText'

const bank = [...oficiales, ...seguimiento]
const categories = [...new Set(bank.map(q => q.category))]
const typeNames = { multiple: 'Alternativas', open: 'Respuesta oral', evidence: 'Localizar evidencia' }
const formats = [
  { value: 'all', label: 'Todas' },
  { value: 'closed', label: 'Selección múltiple' },
  { value: 'open', label: 'Desarrollo' },
] as const
type Format = (typeof formats)[number]['value']
const matchesFormat = (q: DefenseQuestion, format: Format) => format === 'all' || (format === 'open') === (q.type === 'open')
type Answer = { selected: number | null; revealed: boolean; covered: number[]; draft: string }
const emptyAnswer: Answer = { selected: null, revealed: false, covered: [], draft: '' }
const earnedPoints = (q: DefenseQuestion, a: Answer = emptyAnswer) => q.type === 'open' ? a.covered.length / q.points.length : Number(a.selected === q.correctOption)

export default function App() {
  const [mode, setMode] = useState('all')
  const [filter, setFilter] = useState(categories[0])
  const [kind, setKind] = useState('multiple')
  const [format, setFormat] = useState<Format>('all')
  const [session, setSession] = useState<DefenseQuestion[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [finished, setFinished] = useState(false)
  const question = session[questionIndex]
  const { selected: selectedOption, revealed, covered, draft } = answers[questionIndex] ?? emptyAnswer
  const pool = bank.filter(q => mode === 'category' ? q.category === filter : mode === 'type' ? q.type === kind : true)
    .filter(q => mode === 'type' || matchesFormat(q, format))
  const simulationSize = Math.min(10, pool.length)
  const scores = session.map((q, i) => earnedPoints(q, answers[i]))
  const score = scores.reduce((sum, value) => sum + value, 0)

  function updateAnswer(patch: Partial<Answer>) {
    setAnswers(prev => {
      const next = [...prev]
      next[questionIndex] = { ...(prev[questionIndex] ?? emptyAnswer), ...patch }
      return next
    })
  }
  const setSelectedOption = (selected: number) => updateAnswer({ selected })
  const setRevealed = (revealed: boolean) => updateAnswer({ revealed })
  const setCovered = (covered: number[]) => updateAnswer({ covered })
  const setDraft = (draft: string) => updateAnswer({ draft })

  function startQuiz() {
    setSession(prepareSession(pool, mode === 'simulation'))
    setQuestionIndex(0)
    setAnswers([])
    setFinished(false)
  }
  function nextQuestion() {
    if (questionIndex === session.length - 1) setFinished(true)
    else setQuestionIndex(questionIndex + 1)
  }
  function previousQuestion() {
    if (questionIndex > 0) setQuestionIndex(questionIndex - 1)
  }
  function goHome() { setSession([]); setFinished(false); setAnswers([]) }

  return (
    <main className="page-shell">
      <header className="topbar">
        <button className="wordmark home-button" onClick={goHome}><span className="wordmark-icon">∑</span> defensa<span className="wordmark-dot">.</span></button>
        <span className="topbar-note">INFO-1165 · Practicar con evidencia</span>
      </header>
      <section className="quiz-layout" aria-labelledby="quiz-title">
        <aside className="quiz-intro">
          <p className="eyebrow">Naive Bayes mixto · R</p>
          <h1 id="quiz-title">Prepara tu defensa</h1>
          <p className="intro-copy">Explica el método, interpreta los resultados y ubica la evidencia. Las respuestas orales se evalúan con tu propia pauta.</p>
          <div className="study-note"><span className="study-note-icon" aria-hidden="true">✳</span><p>Practica explicar el <strong>porqué.</strong></p></div>
          {session.length > 0 && <button className="home-button secondary" onClick={goHome}>Volver al inicio</button>}
        </aside>
        <section className="quiz-card">
          {!session.length ? <>
            <p className="question-kicker">45 PREGUNTAS · 10 TEMAS OFICIALES</p>
            <h2>Elige tu práctica</h2>
            <label className="field">Modo<select value={mode} onChange={e => setMode(e.target.value)}>
              <option value="all">Todas las preguntas</option><option value="category">Por categoría</option><option value="type">Solo un tipo</option><option value="simulation">Simulacro</option>
            </select></label>
            {mode === 'category' && <label className="field">Categoría<select value={filter} onChange={e => setFilter(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></label>}
            {mode === 'type' && <label className="field">Tipo<select value={kind} onChange={e => setKind(e.target.value)}>{Object.entries(typeNames).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>}
            {mode !== 'type' && <div className="field" role="radiogroup" aria-label="Formato de pregunta">Formato
              <div className="segmented">{formats.map(f => <button key={f.value} id={`format-${f.value}`} type="button" role="radio" aria-checked={format === f.value} className={format === f.value ? 'active' : ''} onClick={() => setFormat(f.value)}>{f.label}</button>)}</div>
            </div>}
            <p className="intro-copy">{!pool.length ? 'No hay preguntas con esta combinación de filtros.' : mode === 'simulation' ? `${simulationSize} preguntas aleatorias${format === 'all' ? ', con al menos 4 respuestas orales' : ''}.` : `${pool.length} preguntas. El orden de preguntas y alternativas cambia en cada sesión.`}</p>
            <button className="next-button" disabled={!pool.length} onClick={startQuiz}>Comenzar →</button>
          </> : finished ? <>
            <p className="question-kicker">PRÁCTICA COMPLETADA</p><h2>Resultado: {Math.round(score / session.length * 100)} %</h2>
            <p>Las alternativas valen un punto. En las respuestas orales cuenta la proporción de puntos de pauta que marcaste.</p>
            <ul className="results">{[...new Set(session.map(q => q.category))].map(category => {
              const indices = session.flatMap((q, i) => q.category === category ? [i] : [])
              const percent = Math.round(indices.reduce((s, i) => s + scores[i], 0) / indices.length * 100)
              return <li key={category}><span>{category} <small>({indices.length} preguntas)</small></span><strong>{percent} %</strong></li>
            })}</ul>
            <button className="next-button" onClick={goHome}>Elegir otra práctica</button>
          </> : <>
            <div className="card-topline"><span>Pregunta <strong>{questionIndex + 1}</strong> de {session.length}</span><span>{typeNames[question.type]}</span></div>
            <progress className="quiz-progress" value={questionIndex} max={session.length} aria-label="Progreso de la práctica" />
            <div className="question-block"><p className="question-kicker">{question.category}</p><h2><MathText text={question.prompt} /></h2></div>
            {question.type === 'open' ? <>
              <label className="field">Tu respuesta (también puedes decirla en voz alta)<textarea value={draft} onChange={e => setDraft(e.target.value)} placeholder="Explica con tus palabras antes de revelar la pauta…" /></label>
              {!revealed && <button className="next-button" onClick={() => setRevealed(true)}>Revelar pauta</button>}
              {revealed && <fieldset className="rubric"><legend>Marca únicamente los puntos que cubriste</legend>{question.points.map((point, i) => <label key={point}><input type="checkbox" checked={covered.includes(i)} onChange={e => setCovered(e.target.checked ? [...covered, i] : covered.filter(p => p !== i))} /><MathText text={point} /></label>)}<p>Autoevaluación: {covered.length} de {question.points.length} puntos.</p></fieldset>}
            </> : <div className="answer-list">{question.options.map((option, index) => <button key={option} className={`answer-option${selectedOption !== null && index === question.correctOption ? ' correct' : ''}${selectedOption === index && index !== question.correctOption ? ' wrong' : ''}`} disabled={selectedOption !== null} onClick={() => { setSelectedOption(index); setRevealed(true) }}><span className="option-letter">{String.fromCharCode(65 + index)}</span><MathText text={option} /></button>)}</div>}
            {revealed && <div className="explanation" role="status">
              <strong>{question.type === 'open' ? 'Pauta de respuesta · autoevaluación' : selectedOption === question.correctOption ? '¡Correcto!' : 'Respuesta incorrecta'}</strong>
              <p><MathText text={question.explanation} /></p>
              {question.type !== 'open' && <ul>{question.options.map((option, i) => <li key={option}><strong>{i === question.correctOption ? 'Correcta' : 'Distractor'}: </strong><MathText text={option} /><p><MathText text={question.optionExplanations[i]} /></p></li>)}</ul>}
              <p><strong>Cifra clave: </strong><MathText text={question.keyFigure} /></p>
              <strong>Evidencia en el proyecto R</strong>{question.evidence.map(file => <code key={file}>{file}</code>)}
              <p><strong>Fuente: </strong>{question.source}</p>
            </div>}
            <footer className="card-footer"><button className="prev-button" id="prev-question" disabled={questionIndex === 0} onClick={previousQuestion}>← Anterior</button><span className="keyboard-hint">Cada respuesta cuenta</span><button className="next-button" disabled={!revealed} onClick={nextQuestion}>{questionIndex === session.length - 1 ? 'Ver resultado' : 'Continuar'} →</button></footer>
          </>}
        </section>
      </section>
      <footer className="page-footer"><span>HECHO PARA APRENDER</span><span>INFO-1165 · DEFENSA</span></footer>
    </main>
  )
}
