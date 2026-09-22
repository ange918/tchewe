import type { PhaseNumber } from '../store/application'

export interface Question {
  id: string
  statement: string
  options: string[]
  answer: number
  /** Temps imparti, en secondes (5 à 10 s selon la difficulté). */
  seconds: number
}

export interface Phase {
  phase: PhaseNumber
  title: string
  theme: string
  day: string
  questions: Question[]
}

export const PHASES: Phase[] = [
  {
    phase: 1,
    title: 'Phase 1 — Fondamentaux entrepreneuriaux',
    theme: 'Votre compréhension du projet, du marché et de l’équipe.',
    day: 'J0',
    questions: [
      {
        id: 'p1q1',
        statement: 'Que désigne la « proposition de valeur » d’un projet ?',
        options: [
          'Le bénéfice concret apporté au bénéficiaire',
          'Le montant du capital social',
          'La liste des fournisseurs',
          'Le nombre de salariés',
        ],
        answer: 0,
        seconds: 8,
      },
      {
        id: 'p1q2',
        statement: 'Un « marché cible » se définit d’abord par :',
        options: [
          'La couleur du logo',
          'Un segment de clients aux besoins homogènes',
          'Le nombre de concurrents',
          'Le montant de la subvention',
        ],
        answer: 1,
        seconds: 7,
      },
      {
        id: 'p1q3',
        statement: 'Le sigle MVP signifie :',
        options: [
          'Marge Variable Prévisionnelle',
          'Modèle de Valeur Partagée',
          'Produit minimum viable',
          'Montant Validé par le Projet',
        ],
        answer: 2,
        seconds: 6,
      },
      {
        id: 'p1q4',
        statement: 'Une étude de marché sert principalement à :',
        options: [
          'Valider l’existence d’une demande solvable',
          'Recruter des associés',
          'Obtenir un numéro fiscal',
          'Fixer la durée du bail',
        ],
        answer: 0,
        seconds: 7,
      },
      {
        id: 'p1q5',
        statement: 'Dans une analyse SWOT, le « T » correspond à :',
        options: ['Trésorerie', 'Menaces (Threats)', 'Technologie', 'Territoire'],
        answer: 1,
        seconds: 6,
      },
      {
        id: 'p1q6',
        statement: 'Le premier risque d’un projet porté par une seule personne est :',
        options: [
          'Un excès de financement',
          'Une croissance trop rapide',
          'La dépendance à un fondateur unique',
          'Un trop grand nombre de clients',
        ],
        answer: 2,
        seconds: 8,
      },
      {
        id: 'p1q7',
        statement: 'Un avantage concurrentiel durable repose sur :',
        options: [
          'Un prix cassé temporaire',
          'Une ressource difficile à imiter',
          'Une campagne publicitaire unique',
          'Un local plus grand',
        ],
        answer: 1,
        seconds: 8,
      },
      {
        id: 'p1q8',
        statement: 'Que contient un résumé exécutif ?',
        options: [
          'Les relevés bancaires des associés',
          'Les statuts complets de la société',
          'La synthèse du projet, du marché et des besoins',
          'Le détail des fiches de paie',
        ],
        answer: 2,
        seconds: 7,
      },
      {
        id: 'p1q9',
        statement: 'Un indicateur de performance (KPI) doit avant tout être :',
        options: ['Mesurable', 'Confidentiel', 'Annuel', 'Facultatif'],
        answer: 0,
        seconds: 6,
      },
      {
        id: 'p1q10',
        statement: 'La « durée d’exécution » d’un projet désigne :',
        options: [
          'L’ancienneté du porteur',
          'La période nécessaire à la réalisation des activités financées',
          'La durée de vie du matériel',
          'Le délai de paiement des fournisseurs',
        ],
        answer: 1,
        seconds: 7,
      },
    ],
  },
  {
    phase: 2,
    title: 'Phase 2 — Modèle économique & gestion financière',
    theme: 'Votre capacité à piloter des ressources et un budget.',
    day: 'J+2',
    questions: [
      {
        id: 'p2q1',
        statement: 'Le seuil de rentabilité est atteint lorsque :',
        options: [
          'Le chiffre d’affaires couvre l’ensemble des charges',
          'La trésorerie est à zéro',
          'Le premier client signe',
          'La subvention est versée',
        ],
        answer: 0,
        seconds: 8,
      },
      {
        id: 'p2q2',
        statement: 'Une charge fixe est une charge qui :',
        options: [
          'Varie avec le volume vendu',
          'Ne dépend pas du niveau d’activité',
          'N’est jamais payée',
          'Est toujours annuelle',
        ],
        answer: 1,
        seconds: 7,
      },
      {
        id: 'p2q3',
        statement: 'Le besoin en fonds de roulement finance :',
        options: [
          'Les dividendes',
          'Les investissements immobiliers',
          'Le décalage entre encaissements et décaissements',
          'Les amendes fiscales',
        ],
        answer: 2,
        seconds: 9,
      },
      {
        id: 'p2q4',
        statement: 'Une subvention non remboursable :',
        options: [
          'Doit être restituée avec intérêts',
          'N’a pas à être remboursée si les conditions sont respectées',
          'Se transforme automatiquement en prêt',
          'Est versée en actions',
        ],
        answer: 1,
        seconds: 7,
      },
      {
        id: 'p2q5',
        statement: 'La marge brute correspond à :',
        options: [
          'Chiffre d’affaires − coût des ventes',
          'Chiffre d’affaires + subventions',
          'Trésorerie − dettes',
          'Capital − emprunts',
        ],
        answer: 0,
        seconds: 8,
      },
      {
        id: 'p2q6',
        statement: 'Un plan de trésorerie se construit :',
        options: [
          'Une seule fois en fin d’exercice',
          'Mois par mois, en encaissements et décaissements',
          'Uniquement en cas de perte',
          'À la demande de la banque seulement',
        ],
        answer: 1,
        seconds: 8,
      },
      {
        id: 'p2q7',
        statement: 'L’amortissement d’un équipement traduit :',
        options: [
          'Sa revente immédiate',
          'Son assurance obligatoire',
          'La répartition de son coût sur sa durée d’usage',
          'Sa garantie constructeur',
        ],
        answer: 2,
        seconds: 9,
      },
      {
        id: 'p2q8',
        statement: 'Un budget prévisionnel crédible repose sur :',
        options: [
          'Des hypothèses chiffrées et justifiées',
          'Les chiffres du concurrent le plus grand',
          'Une estimation au plus optimiste',
          'Le montant maximal de la subvention',
        ],
        answer: 0,
        seconds: 8,
      },
      {
        id: 'p2q9',
        statement: 'Le « runway » d’un projet désigne :',
        options: [
          'La durée avant épuisement de la trésorerie',
          'La longueur du cycle de production',
          'Le délai de livraison moyen',
          'La durée du bail commercial',
        ],
        answer: 0,
        seconds: 7,
      },
      {
        id: 'p2q10',
        statement: 'Une garantie de 30 % sur un financement de 10 000 € représente :',
        options: ['300 €', '1 000 €', '3 000 €', '7 000 €'],
        answer: 2,
        seconds: 6,
      },
    ],
  },
  {
    phase: 3,
    title: 'Phase 3 — Impact, conformité & gouvernance',
    theme: 'Vos engagements vis-à-vis des bailleurs et des bénéficiaires.',
    day: 'J+4',
    questions: [
      {
        id: 'p3q1',
        statement: 'Un projet « à fort impact » se mesure d’abord par :',
        options: [
          'Son budget de communication',
          'Les bénéfices sociaux ou environnementaux produits',
          'Le nombre de pages du dossier',
          'La notoriété du porteur',
        ],
        answer: 1,
        seconds: 8,
      },
      {
        id: 'p3q2',
        statement: 'La traçabilité des dépenses consiste à :',
        options: [
          'Conserver une pièce justificative pour chaque dépense',
          'Payer uniquement en espèces',
          'Regrouper toutes les dépenses en fin d’année',
          'Éviter les virements bancaires',
        ],
        answer: 0,
        seconds: 8,
      },
      {
        id: 'p3q3',
        statement: 'Un conflit d’intérêts doit être :',
        options: [
          'Ignoré s’il est mineur',
          'Déclaré au financeur',
          'Réglé entre associés uniquement',
          'Compensé financièrement',
        ],
        answer: 1,
        seconds: 7,
      },
      {
        id: 'p3q4',
        statement: 'Le reversement d’une part des dividendes aux ONG partenaires est :',
        options: [
          'Un engagement contractuel du programme',
          'Une option payante',
          'Une contrepartie facultative',
          'Un prêt remboursable',
        ],
        answer: 0,
        seconds: 8,
      },
      {
        id: 'p3q5',
        statement: 'Le rapport d’exécution transmis au bailleur sert à :',
        options: [
          'Renégocier le montant accordé',
          'Rendre compte de l’usage des fonds et des résultats',
          'Remplacer la comptabilité',
          'Justifier un retard de livraison',
        ],
        answer: 1,
        seconds: 8,
      },
      {
        id: 'p3q6',
        statement: 'La protection des données des bénéficiaires impose :',
        options: [
          'De publier la liste des bénéficiaires',
          'De partager les données avec tous les partenaires',
          'De limiter la collecte au strict nécessaire',
          'De conserver les données indéfiniment',
        ],
        answer: 2,
        seconds: 9,
      },
      {
        id: 'p3q7',
        statement: 'Un indicateur d’impact pertinent est :',
        options: [
          'Le nombre de réunions tenues',
          'Le nombre de bénéficiaires ayant accédé au service',
          'Le nombre de courriels envoyés',
          'Le nombre de pages du site',
        ],
        answer: 1,
        seconds: 8,
      },
      {
        id: 'p3q8',
        statement: 'En cas de changement majeur du projet financé, le porteur doit :',
        options: [
          'Attendre le rapport final',
          'Informer sans délai le financeur',
          'Modifier le budget sans le signaler',
          'Interrompre le projet',
        ],
        answer: 1,
        seconds: 7,
      },
      {
        id: 'p3q9',
        statement: 'La pérennité d’un projet financé désigne :',
        options: [
          'Sa capacité à durer après la fin de la subvention',
          'Sa durée de dépôt du dossier',
          'La durée de validité du RIB',
          'Le temps de traitement administratif',
        ],
        answer: 0,
        seconds: 8,
      },
      {
        id: 'p3q10',
        statement: 'Le dépôt de la garantie de 30 % intervient :',
        options: [
          'Avant la soumission du dossier',
          'Pendant la phase 1 du QCM',
          'Après la réussite des trois phases d’évaluation',
          'Après le versement de la subvention',
        ],
        answer: 2,
        seconds: 7,
      },
    ],
  },
]

export function getPhase(phase: PhaseNumber): Phase {
  const found = PHASES.find((item) => item.phase === phase)
  if (!found) throw new Error(`Phase ${phase} introuvable`)
  return found
}

/** Score minimal, en pourcentage, pour valider une phase. */
export const PASS_THRESHOLD = 60
