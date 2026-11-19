/**
 * Le discours unique sur la garantie de 30 %.
 *
 * Cette somme n'est jamais versée à la plateforme. Elle reste sur un compte
 * ouvert au nom du porteur, dans une banque agréée de son choix. Aucune banque
 * n'est imposée, et aucun lien bancaire n'est proposé.
 */

export const GUARANTEE_REMINDER =
  'Cet argent reste à vous : la plateforme vérifie seulement la preuve, elle ne reçoit rien.'

export const GUARANTEE_FAQ = {
  question: 'Est-ce que je donne cet argent à quelqu’un ?',
  answer:
    'Non. Vous le déposez sur un compte à votre nom, dans une banque agréée de votre choix. Il n’est versé ni à la plateforme, ni à qui que ce soit d’autre : il reste le vôtre. Nous demandons seulement la preuve que ces fonds sont bien là.',
} as const

export const GUARANTEE_STEPS = [
  {
    title: 'Avoir un compte à votre nom',
    text: 'Dans une banque agréée de votre choix.',
  },
  {
    title: 'Y déposer 30 %',
    text: 'Du montant demandé, sur ce compte.',
  },
  {
    title: 'Téléverser la preuve ici',
    text: 'Le relevé ou le reçu de votre banque, au nom du titulaire.',
  },
] as const
