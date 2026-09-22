import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRightIcon, InfoIcon } from '../ui/icons'
import { Badge } from '../ui/Badge'
import { ButtonLink } from '../ui/Button'
import { Reveal } from '../ui/motion'

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'financement' | 'evaluation' | 'garantie' | 'candidature'
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'non-remboursable',
    category: 'financement',
    question: 'La subvention INNOVA FUND doit-elle être remboursée ?',
    answer:
      'Non. Il s’agit d’une subvention d’amorçage non remboursable comprise entre 2 000 € et 650 000 €. Dès lors que les fonds sont alloués au projet approuvé et que les dépenses demeurent traçables et justifiées, aucune restitution n’est exigée.',
  },
  {
    id: 'garantie-30',
    category: 'garantie',
    question: 'Pourquoi un apport de garantie de 30 % est-il requis ?',
    answer:
      'L’apport de 30 % constitue la preuve d’engagement irrévocable du porteur. Il est déposé sur un compte bancaire dédié auprès de notre établissement financier partenaire avant l’émission du virement de la subvention. Cet apport reste entièrement affecté aux besoins et à la trésorerie de votre propre projet.',
  },
  {
    id: 'qcm-48h',
    category: 'evaluation',
    question: 'Pourquoi le parcours compte-t-il trois sessions QCM espacées de 48 heures ?',
    answer:
      'La cadence des trois phases (J0, J+2, J+4) teste la rigueur, l’endurance et l’implication continue du porteur de projet tout en prévenant la sous-traitance de l’évaluation. Chaque session aborde un axe stratégique : fondamentaux entrepreneuriaux (Phase 1), modèle économique & viabilité financière (Phase 2), puis impact sociétal & gouvernance (Phase 3).',
  },
  {
    id: 'ong-dividendes',
    category: 'financement',
    question: 'En quoi consiste le reversement solidaire aux ONG partenaires ?',
    answer:
      'Le programme fonctionne sur un principe de solidarité circulaire. Dès lors que votre entreprise atteint son seuil de rentabilité avérée (à partir du 2e exercice), vous vous engagez à reverser une quote-part convenue de vos dividendes aux ONG partenaires afin de financer les promotions suivantes d’entrepreneurs.',
  },
  {
    id: 'delais-virement',
    category: 'garantie',
    question: 'Quel est le délai de virement effectif de la subvention ?',
    answer:
      'Dès la validation des 3 sessions de QCM et la vérification des pièces de garantie (reçu de versement de 30 % et justificatif de compte) par le comité administratif, l’ordre de virement irrévocable est émis sous 48 à 72 heures ouvrées vers votre compte.',
  },
  {
    id: 'candidats-eligibles',
    category: 'candidature',
    question: 'Qui peut soumettre un projet à l’édition 2026 ?',
    answer:
      'Toute personne physique majeure (18 ans et plus) ou morale légalement enregistrée, résidant ou exerçant dans les zones couvertes par l’édition 2026. Le projet doit porter un impact social, environnemental, éducatif ou technologique mesurable et requérir une enveloppe entre 2 000 € et 650 000 € sur un calendrier de 3 à 24 mois.',
  },
  {
    id: 'documents-requis',
    category: 'candidature',
    question: 'Quels sont les documents obligatoires pour déposer un dossier ?',
    answer:
      'Vous devez fournir : votre pitch deck (présentation synthétique), votre plan d’affaires (Business Plan prévisionnel chiffré), ainsi qu’une pièce d’identité valide du porteur (et les statuts ou le registre du commerce si la société est déjà constituée).',
  },
  {
    id: 'echec-qcm',
    category: 'evaluation',
    question: 'Que se passe-t-il si je ne valide pas une session de QCM ?',
    answer:
      'Chaque session chronométrée comporte 10 questions professionnelles. En cas de note insuffisante, votre dossier fait l’objet d’un réexamen par le comité technique qui peut vous accorder un créneau de rattrapage ou vous orienter vers nos mentors partenaires avant réévaluation.',
  },
]

const CATEGORIES = [
  { id: 'all', label: 'Toutes les questions' },
  { id: 'financement', label: 'Financement & Subvention' },
  { id: 'evaluation', label: 'Évaluation & QCM' },
  { id: 'garantie', label: 'Garantie bancaire 30 %' },
  { id: 'candidature', label: 'Candidature & Documents' },
] as const

export function FAQSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [openId, setOpenId] = useState<string | null>('non-remboursable')

  const filteredItems = FAQ_ITEMS.filter((item) =>
    selectedCategory === 'all' ? true : item.category === selectedCategory
  )

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section id="faq" className="scroll-mt-20 border-t border-ink-100 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal className="text-center">
          <Badge tone="brand">Foire aux questions</Badge>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
            Questions fréquentes sur le programme
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-ink-600 sm:text-lg">
            Retrouvez toutes les réponses essentielles sur le fonctionnement des subventions,
            les 3 étapes de QCM, l'apport de garantie de 30 % et les modalités de versement.
          </p>
        </Reveal>

        {/* Filtres par thématiques */}
        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition sm:text-sm ${
                  active
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                    : 'bg-ink-50 text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </Reveal>

        {/* Liste accordéons animés */}
        <div className="mt-10 divide-y divide-ink-200/80 rounded-3xl border border-ink-200/80 bg-ink-50/40 p-2 shadow-xs sm:p-4">
          {filteredItems.map((item) => {
            const isOpen = openId === item.id

            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl transition duration-200"
              >
                <button
                  type="button"
                  id={`faq-btn-${item.id}`}
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold text-ink-900 transition hover:bg-white sm:text-lg"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xs font-black text-brand-600">
                      ?
                    </span>
                    <span>{item.question}</span>
                  </span>

                  {/* Indicateur +/- animé */}
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ${
                      isOpen
                        ? 'rotate-180 bg-brand-600 text-white'
                        : 'bg-ink-100 text-ink-600'
                    }`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={isOpen ? 'M5 12h14' : 'M12 5v14m-7-7h14'}
                      />
                    </svg>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden bg-white px-5 pb-5 pt-1 text-sm leading-relaxed text-ink-600 sm:text-base"
                    >
                      <div className="rounded-xl border border-brand-100 bg-brand-50/40 p-4 text-ink-700">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* Bloc d'aide complémentaire */}
        <Reveal className="mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl border border-ink-200 bg-white p-6 shadow-xs sm:flex-row sm:p-8">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <InfoIcon className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-base font-bold text-ink-900 sm:text-lg">
                Vous avez d'autres questions sur le règlement ?
              </h3>
              <p className="mt-0.5 text-xs text-ink-600 sm:text-sm">
                Consultez le texte intégral des conditions générales ou lancez votre candidature.
              </p>
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-2.5 sm:w-auto sm:flex-row">
            <ButtonLink to="/conditions" variant="secondary" size="md">
              Voir les conditions
            </ButtonLink>
            <ButtonLink to="/auth/register" size="md">
              Démarrer mon inscription
              <ArrowRightIcon className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
