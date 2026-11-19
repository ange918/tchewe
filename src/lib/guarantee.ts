/**
 * Le discours unique sur la garantie de 30 %.
 *
 * Cette somme n'est jamais versée à la plateforme : elle reste sur un compte
 * ouvert au nom du porteur, chez une banque partenaire. Les écrans qui en
 * parlent lisent ces textes pour ne pas se contredire.
 */

export const GUARANTEE_FAQ = {
  question: 'Est-ce que je donne cet argent à quelqu’un ?',
  answer:
    'Non. Vous le déposez sur un compte ouvert à votre nom, chez une banque partenaire. Il n’est versé ni à la plateforme, ni à qui que ce soit d’autre : il reste le vôtre. Nous demandons seulement la preuve que ces fonds sont bien là.',
} as const

export const GUARANTEE_STEPS = [
  {
    title: 'Ouvrez votre compte',
    text: 'Chez une banque partenaire, et à votre nom. Pas au nom de la plateforme.',
  },
  {
    title: 'Déposez les 30 %',
    text: 'Sur ce compte, le vôtre. L’argent ne quitte pas votre patrimoine.',
  },
  {
    title: 'Envoyez la preuve',
    text: 'Le reçu de dépôt et le justificatif du compte. Nous vérifions, nous n’encaissons pas.',
  },
] as const
