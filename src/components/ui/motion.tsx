import type { ReactNode } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

/**
 * Primitives d'animation de l'interface.
 *
 * Deux règles tiennent l'ensemble : les mouvements restent courts et de faible
 * amplitude (une interface administrative n'est pas une vitrine), et toute
 * animation se réduit à un simple fondu — ou disparaît — lorsque le système
 * signale `prefers-reduced-motion`.
 */

const EASE = [0.16, 1, 0.3, 1] as const

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: EASE } },
}

/** Apparition au défilement, jouée une seule fois. */
export function Reveal({
  children,
  className,
  delay = 0,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li' | 'span'
}) {
  const reduced = useReducedMotion()
  const Component = motion[as]

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      // `some` déclenche dès qu'un fragment de l'élément entre dans l'écran.
      // Un seuil en proportion (0.2) ne peut jamais être atteint par un bloc
      // plus haut que la fenêtre : sur téléphone, le contenu restait alors à
      // opacité zéro, invisible mais bien présent.
      viewport={{ once: true, amount: 'some', margin: '0px 0px -40px 0px' }}
      variants={reduced ? fadeIn : fadeUp}
      transition={{ delay }}
    >
      {children}
    </Component>
  )
}

/** Conteneur qui décale l'entrée de ses enfants `RevealItem`. */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  stagger?: number
  as?: 'div' | 'ul' | 'ol' | 'section'
}) {
  const reduced = useReducedMotion()
  const Component = motion[as]

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 'some', margin: '0px 0px -40px 0px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reduced ? 0 : stagger } },
      }}
    >
      {children}
    </Component>
  )
}

export function RevealItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'li' | 'section'
}) {
  const reduced = useReducedMotion()
  const Component = motion[as]

  return (
    <Component className={className} variants={reduced ? fadeIn : fadeUp}>
      {children}
    </Component>
  )
}

/** Entrée immédiate au montage — pour le contenu déjà visible (héros, panneaux). */
export function Enter({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={reduced ? fadeIn : fadeUp}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}
