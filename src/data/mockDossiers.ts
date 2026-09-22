import type { FileMeta } from '../lib/fileVault'
import type { DossierStatus, PhaseResult } from '../store/application'

export interface AdminDossier {
  id: string
  reference: string
  applicant: string
  email: string
  title: string
  amount: number
  durationMonths: number
  summary: string
  submittedAt: number
  status: DossierStatus
  documents: FileMeta[]
  phases: PhaseResult[]
  reviewNote?: string
  funding?: {
    iban: string
    bankName: string
    depositReceipt: FileMeta[]
    accountProof: FileMeta[]
    submittedAt: number
  }
  /** Vrai pour le dossier réellement déposé depuis l'espace porteur de ce navigateur. */
  live?: boolean
}

const DAY = 24 * 60 * 60 * 1000

function doc(name: string, size: number): FileMeta {
  return {
    id: `mock-${name}`,
    name,
    size,
    type: 'application/pdf',
    uploadedAt: Date.now(),
  }
}

/**
 * Jeu de données de démonstration du back-office. Les pièces jointes n'ont pas de
 * blob associé : le visualiseur affiche un état « document indisponible ».
 */
export const MOCK_DOSSIERS: AdminDossier[] = [
  {
    id: 'd1',
    reference: 'INF-2026-1042',
    applicant: 'Aminata Diallo',
    email: 'a.diallo@exemple.com',
    title: 'Unité de transformation de mangues séchées',
    amount: 9500,
    durationMonths: 18,
    summary:
      'Installation d’une unité de séchage solaire pour réduire les pertes post-récolte des producteurs de mangues de la région, et créer douze emplois directs dont huit pour des femmes.',
    submittedAt: Date.now() - 2 * DAY,
    status: 'submitted',
    documents: [doc('pitch-deck.pdf', 2_400_000), doc('business-plan.pdf', 1_800_000), doc('registre-commerce.pdf', 420_000)],
    phases: [],
  },
  {
    id: 'd2',
    reference: 'INF-2026-1043',
    applicant: 'Koffi Mensah',
    email: 'k.mensah@exemple.com',
    title: 'Plateforme de collecte et recyclage de plastique',
    amount: 10000,
    durationMonths: 24,
    summary:
      'Réseau de points de collecte rémunérés et atelier de broyage, pour alimenter les fabricants locaux de mobilier urbain recyclé.',
    submittedAt: Date.now() - 4 * DAY,
    status: 'submitted',
    documents: [doc('dossier-complet.pdf', 3_100_000)],
    phases: [],
  },
  {
    id: 'd3',
    reference: 'INF-2026-1031',
    applicant: 'Fatou Ndiaye',
    email: 'f.ndiaye@exemple.com',
    title: 'Clinique mobile de dépistage',
    amount: 8200,
    durationMonths: 12,
    summary:
      'Camionnette équipée pour le dépistage du diabète et de l’hypertension dans les zones rurales mal desservies.',
    submittedAt: Date.now() - 7 * DAY,
    status: 'awaiting_next_phase',
    documents: [doc('pitch-deck.pdf', 1_900_000), doc('agrement-sanitaire.pdf', 310_000)],
    phases: [{ phase: 1, score: 9, total: 10, completedAt: Date.now() - 2 * DAY }],
  },
  {
    id: 'd4',
    reference: 'INF-2026-1028',
    applicant: 'Yacine Benali',
    email: 'y.benali@exemple.com',
    title: 'Atelier de couture éco-responsable',
    amount: 6500,
    durationMonths: 12,
    summary:
      'Atelier de confection à partir de chutes textiles récupérées, avec un programme de formation pour dix apprenties.',
    submittedAt: Date.now() - 9 * DAY,
    status: 'approved',
    documents: [doc('business-plan.pdf', 1_200_000)],
    phases: [],
  },
  {
    id: 'd5',
    reference: 'INF-2026-1019',
    applicant: 'Sarah Kouassi',
    email: 's.kouassi@exemple.com',
    title: 'Micro-ferme aquaponique urbaine',
    amount: 9800,
    durationMonths: 18,
    summary:
      'Production maraîchère et piscicole en circuit fermé sur toiture, approvisionnant les cantines scolaires du quartier.',
    submittedAt: Date.now() - 12 * DAY,
    status: 'evaluated',
    documents: [doc('pitch-deck.pdf', 2_050_000), doc('etude-technique.pdf', 890_000)],
    phases: [
      { phase: 1, score: 9, total: 10, completedAt: Date.now() - 8 * DAY },
      { phase: 2, score: 8, total: 10, completedAt: Date.now() - 6 * DAY },
      { phase: 3, score: 10, total: 10, completedAt: Date.now() - 4 * DAY },
    ],
  },
  {
    id: 'd6',
    reference: 'INF-2026-1007',
    applicant: 'Moussa Traoré',
    email: 'm.traore@exemple.com',
    title: 'Kits solaires pour écoles rurales',
    amount: 10000,
    durationMonths: 15,
    summary:
      'Équipement de vingt salles de classe en éclairage solaire et bornes de recharge, avec maintenance assurée localement.',
    submittedAt: Date.now() - 18 * DAY,
    status: 'proofs_submitted',
    documents: [doc('business-plan.pdf', 1_600_000)],
    phases: [
      { phase: 1, score: 10, total: 10, completedAt: Date.now() - 14 * DAY },
      { phase: 2, score: 9, total: 10, completedAt: Date.now() - 12 * DAY },
      { phase: 3, score: 9, total: 10, completedAt: Date.now() - 10 * DAY },
    ],
    funding: {
      iban: 'FR7630006000011234567890189',
      bankName: 'Banque Partenaire',
      depositReceipt: [doc('recu-depot-3000eur.pdf', 240_000)],
      accountProof: [doc('justificatif-compte.pdf', 180_000)],
      submittedAt: Date.now() - 2 * DAY,
    },
  },
  {
    id: 'd7',
    reference: 'INF-2026-1002',
    applicant: 'Leïla Haddad',
    email: 'l.haddad@exemple.com',
    title: 'Coopérative de savonnerie artisanale',
    amount: 7400,
    durationMonths: 12,
    summary:
      'Transformation d’huiles végétales locales en savons certifiés, portée par une coopérative de quinze productrices.',
    submittedAt: Date.now() - 24 * DAY,
    status: 'proofs_submitted',
    documents: [doc('dossier.pdf', 2_300_000)],
    phases: [
      { phase: 1, score: 8, total: 10, completedAt: Date.now() - 20 * DAY },
      { phase: 2, score: 8, total: 10, completedAt: Date.now() - 18 * DAY },
      { phase: 3, score: 9, total: 10, completedAt: Date.now() - 16 * DAY },
    ],
    funding: {
      iban: 'FR7612739000405678901234567',
      bankName: 'Banque Partenaire',
      depositReceipt: [doc('bordereau-versement.pdf', 195_000)],
      accountProof: [doc('capture-compte.pdf', 640_000)],
      submittedAt: Date.now() - 1 * DAY,
    },
  },
  {
    id: 'd8',
    reference: 'INF-2025-0914',
    applicant: 'Ibrahim Sow',
    email: 'i.sow@exemple.com',
    title: 'Service de réparation de vélos-cargos',
    amount: 5600,
    durationMonths: 9,
    summary:
      'Atelier mobile de réparation et location de vélos-cargos pour les commerçants du centre-ville.',
    submittedAt: Date.now() - 40 * DAY,
    status: 'financed',
    documents: [doc('business-plan.pdf', 1_050_000)],
    phases: [
      { phase: 1, score: 9, total: 10, completedAt: Date.now() - 34 * DAY },
      { phase: 2, score: 9, total: 10, completedAt: Date.now() - 32 * DAY },
      { phase: 3, score: 8, total: 10, completedAt: Date.now() - 30 * DAY },
    ],
    funding: {
      iban: 'FR7610011000201234567890123',
      bankName: 'Banque Partenaire',
      depositReceipt: [doc('recu-depot.pdf', 210_000)],
      accountProof: [doc('rib.pdf', 90_000)],
      submittedAt: Date.now() - 26 * DAY,
    },
  },
]
