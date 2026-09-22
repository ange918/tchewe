import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface CounterProps {
  end: number
  prefix?: string
  suffix?: string
  duration?: number
  separator?: string
  className?: string
}

export function Counter({
  end,
  prefix = '',
  suffix = '',
  duration = 2.2,
  separator = ' ',
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })
  const [displayValue, setDisplayValue] = useState<string>('0')

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    let animationFrameId: number

    const formatNumber = (val: number) => {
      // Formate avec espaces fines insécables ou le séparateur fourni
      return Math.round(val)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    }

    const easeOutExpo = (t: number): number => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
    }

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      const easedProgress = easeOutExpo(progress)
      const current = easedProgress * end

      setDisplayValue(formatNumber(current))

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step)
      } else {
        setDisplayValue(formatNumber(end))
      }
    }

    animationFrameId = requestAnimationFrame(step)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [isInView, end, duration, separator])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}
