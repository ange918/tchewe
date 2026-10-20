import type { DossierStatus } from './database.types'

/**
 * Les étapes du parcours, en un seul endroit : la barre latérale, les routes,
 * les listes et le tableau de bord lisent toutes cette table. Ajouter une étape
 * ou changer une couleur se fait ici, et nulle part ailleurs.
 *
 * Les cinq premières forment un tunnel — une progression, pas six identités
 * sans ordre. Elles portent donc une rampe séquentielle de la charte, du clair
 * au foncé : la clarté dit l'avancement, et la lecture reste sûre pour un
 * daltonien, ce qu'une série de six teintes distinctes ne permet pas.
 *
 * « Rejeté » n'est pas une étape du tunnel mais une sortie : d'où une couleur
 * d'état, hors rampe.
 */
export interface Stage {
  /** Segment d'URL : /admin/<slug> */
  slug: string
  label: string
  /** Libellé court, pour la barre latérale. */
  short: string
  statuses: DossierStatus[]
  /** Couleur des graphiques. */
  color: string
  /** Pastille de la barre latérale. */
  dot: string
  /** Une action de l'administrateur est attendue à cette étape. */
  actionable?: boolean
}

export const STAGES: Stage[] = [
  {
    slug: 'nouveaux',
    label: 'Nouveaux dossiers',
    short: 'Nouveaux dossiers',
    statuses: ['submitted'],
    color: '#c4bbfb',
    dot: 'bg-brand-200',
    actionable: true,
  },
  {
    slug: 'qcm-en-cours',
    label: 'QCM en cours',
    short: 'QCM en cours',
    statuses: ['approved', 'awaiting_next_phase'],
    color: '#a294f8',
    dot: 'bg-brand-300',
  },
  {
    slug: 'qcm-valides',
    label: 'QCM validés',
    short: 'QCM validés',
    statuses: ['evaluated'],
    color: '#7a66f2',
    dot: 'bg-brand-400',
  },
  {
    slug: 'preuves',
    label: 'Preuves 30 % déposées',
    short: 'Preuves 30 %',
    statuses: ['proofs_submitted'],
    color: '#5741ee',
    dot: 'bg-brand-500',
    actionable: true,
  },
  {
    slug: 'finances',
    label: 'Financés',
    short: 'Financés',
    statuses: ['financed'],
    color: '#3d2be8',
    dot: 'bg-brand-600',
  },
  {
    slug: 'rejetes',
    label: 'Rejetés',
    short: 'Rejetés',
    statuses: ['rejected'],
    color: '#e11d48',
    dot: 'bg-rose-600',
  },
]

export function stageBySlug(slug: string | undefined): Stage | undefined {
  return STAGES.find((stage) => stage.slug === slug)
}

/** Les brouillons ne sont visibles de personne : rien n'a encore été déposé. */
export function stageOf(status: DossierStatus): Stage | undefined {
  return STAGES.find((stage) => stage.statuses.includes(status))
}
