/**
 * Emplacements visuels de l'interface.
 *
 * Les fichiers livrés sont des illustrations vectorielles au format de la charte.
 * Pour passer à des photographies : déposer le fichier dans `public/images/` et
 * remplacer le chemin ci-dessous — aucun autre changement n'est nécessaire, les
 * composants lisent uniquement cette table.
 *
 * Formats recommandés pour un remplacement photo :
 *   heroArch   4:3 vertical  — au moins 1200 × 900
 *   ctaBand    16:9 large    — au moins 1600 × 900
 *   authPanel  4:5 vertical  — au moins 1200 × 1500
 *   aboutArch  16:9 large    — au moins 1600 × 900
 */
export const MEDIA = {
  heroArch: '/images/hero-gears.jpg',
  ctaBand: '/images/cta-community-funding.jpg',
  authPanel: '/images/cta-community-funding.jpg',
  aboutArch: '/images/impact-city.svg',
} as const

/** Textes alternatifs — à mettre à jour en même temps que les fichiers. */
export const MEDIA_ALT = {
  heroArch: 'Deux mains unissant des engrenages bleus symbolisant l’innovation et le partenariat',
  ctaBand: 'Mains entourant des piles de pièces et des figurines représentant la communauté et le financement de projets',
  authPanel: 'Mains protégeant et finançant des figurines communautaires et des projets d’impact',
  aboutArch: 'Réseau de projets financés au crépuscule',
} as const
