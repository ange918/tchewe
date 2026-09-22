import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * Compte à rebours court (QCM) piloté par `requestAnimationFrame`.
 *
 * L'horloge est calée sur `performance.now()` plutôt que sur un compteur
 * incrémental : l'affichage reste fluide et le temps imparti reste juste même si
 * une frame est sautée. Changer `resetKey` relance le chrono — la remise à zéro
 * se fait pendant le rendu, avant la première frame, pour éviter un clignotement
 * à zéro entre deux questions.
 */
export function useCountdown(durationMs: number, onExpire: () => void, resetKey: string | number) {
  const [remaining, setRemaining] = useState(durationMs)
  const [activeKey, setActiveKey] = useState(resetKey)

  if (activeKey !== resetKey) {
    setActiveKey(resetKey)
    setRemaining(durationMs)
  }

  const expireRef = useRef(onExpire)
  useLayoutEffect(() => {
    expireRef.current = onExpire
  })

  useEffect(() => {
    let frame = 0
    const start = performance.now()

    const tick = (now: number) => {
      const left = Math.max(0, durationMs - (now - start))
      setRemaining(left)
      if (left <= 0) {
        expireRef.current()
        return
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [durationMs, resetKey])

  return remaining
}

/**
 * Compte à rebours long (verrouillage 48 h).
 *
 * Seule l'horloge est dans l'état : le temps restant est dérivé au rendu, ce qui
 * évite de resynchroniser un compteur quand la date cible change.
 */
export function useDeadline(target: number | null) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!target) return
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [target])

  return target ? Math.max(0, target - now) : 0
}
