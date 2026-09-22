import { useCallback, useMemo, useRef, useState } from 'react'
import { cn } from '../../lib/utils'
import { useCountdown } from '../../hooks/useCountdown'
import { TimerRing } from '../ui/TimerRing'
import type { Phase } from '../../data/quiz'

const LETTERS = ['A', 'B', 'C', 'D', 'E']
const FEEDBACK_MS = 320

/**
 * Moteur de QCM chronométré.
 *
 * Une question = un chrono. Le passage à la suivante est automatique à
 * l'expiration du temps imparti, ou juste après la sélection d'une réponse
 * (court délai de confirmation visuelle).
 */
export function QuizRunner({
  phase,
  onFinish,
}: {
  phase: Phase
  onFinish: (score: number, total: number) => void
}) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const scoreRef = useRef(0)
  const advancingRef = useRef(false)

  const question = phase.questions[index]
  const total = phase.questions.length
  const durationMs = question.seconds * 1000

  const advance = useCallback(
    (choice: number | null) => {
      if (advancingRef.current) return
      advancingRef.current = true

      if (choice === question.answer) scoreRef.current += 1

      const next = index + 1
      const commit = () => {
        advancingRef.current = false
        setSelected(null)
        if (next >= total) {
          onFinish(scoreRef.current, total)
        } else {
          setIndex(next)
        }
      }

      if (choice === null) commit()
      else setTimeout(commit, FEEDBACK_MS)
    },
    [index, onFinish, question.answer, total],
  )

  const handleExpire = useCallback(() => {
    advance(selected)
  }, [advance, selected])

  const remaining = useCountdown(durationMs, handleExpire, question.id)
  const progress = useMemo(() => ((index + 1) / total) * 100, [index, total])

  return (
    <div className="space-y-5">
      {/* Progression de la session */}
      <div>
        <div className="flex items-center justify-between text-sm font-bold text-ink-600">
          <span>
            Question {index + 1} <span className="text-ink-400">/ {total}</span>
          </span>
          <span className="hidden text-ink-400 sm:inline">{phase.title}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-200">
          <div
            className="h-full rounded-full bg-brand-600 transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-ink-200/80 bg-white p-5 sm:p-7">
        <div className="flex items-start gap-5">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl leading-snug text-ink-900 sm:text-2xl">{question.statement}</h2>
            <p className="mt-2 text-sm text-ink-500">
              Une seule réponse. Le passage à la question suivante est automatique.
            </p>
          </div>
          <TimerRing remainingMs={remaining} durationMs={durationMs} />
        </div>

        <ul className="mt-6 space-y-2.5" role="radiogroup" aria-label={question.statement}>
          {question.options.map((option, optionIndex) => {
            const active = selected === optionIndex
            return (
              <li key={option}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={selected !== null}
                  onClick={() => {
                    setSelected(optionIndex)
                    advance(optionIndex)
                  }}
                  className={cn(
                    'flex w-full items-center gap-3.5 rounded-xl border p-3.5 text-left transition',
                    'disabled:cursor-default',
                    active
                      ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-600/20'
                      : 'border-ink-200 bg-white hover:border-brand-300 hover:bg-brand-50/50',
                    selected !== null && !active && 'opacity-55',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold transition',
                      active ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600',
                    )}
                  >
                    {LETTERS[optionIndex]}
                  </span>
                  <span className="text-[0.98rem] font-semibold text-ink-800">{option}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
