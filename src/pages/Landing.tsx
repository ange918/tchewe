import { ArrowRight, Banknote, CheckCircle2, ClipboardList, FileCheck2, HeartHandshake, Timer, UserPlus, Wallet } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { ButtonLink } from '../components/ui/Button'
import { HeroVisual } from '../components/marketing/HeroVisual'

const PARTNERS = [
  'Fonds d’Impact',
  'Coopération Internationale',
  'Alliance ONG',
  'Fondation Partenaire',
  'Banque Partenaire',
]

const STEPS = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Inscription',
    text: 'Créez votre compte et acceptez les conditions du programme : subvention non remboursable, reversement de dividendes aux ONG, garantie de 30 %.',
  },
  {
    icon: ClipboardList,
    step: '02',
    title: 'Soumission du dossier',
    text: 'Présentez votre projet, le montant sollicité et la durée d’exécution, puis joignez votre pitch deck, business plan et documents d’enregistrement.',
  },
  {
    icon: Timer,
    step: '03',
    title: 'QCM — Phase 1 (J0)',
    text: 'Dès la validation de votre dossier par l’administration, 10 questions chronométrées évaluent vos fondamentaux entrepreneuriaux.',
  },
  {
    icon: Timer,
    step: '04',
    title: 'QCM — Phases 2 & 3 (J+2, J+4)',
    text: 'Deux sessions supplémentaires s’ouvrent toutes les 48 heures : modèle économique, gestion financière, impact et conformité.',
  },
  {
    icon: Wallet,
    step: '05',
    title: 'Dépôt de la garantie de 30 %',
    text: 'Ouvrez votre compte auprès de la banque partenaire, déposez votre apport puis transmettez le reçu et le justificatif de compte.',
  },
  {
    icon: Banknote,
    step: '06',
    title: 'Virement de la subvention',
    text: 'Après vérification des preuves par l’administration, l’ordre de virement est émis vers votre compte.',
  },
]

const COMMITMENTS = [
  {
    icon: CheckCircle2,
    title: 'Subvention non remboursable',
    text: 'Les fonds accordés n’ont pas vocation à être restitués dès lors que les conditions du programme sont respectées et que les dépenses restent traçables.',
  },
  {
    icon: HeartHandshake,
    title: 'Reversement aux ONG partenaires',
    text: 'Chaque lauréat s’engage à reverser une part de ses dividendes aux ONG partenaires du programme, afin d’alimenter les éditions suivantes.',
  },
  {
    icon: FileCheck2,
    title: 'Apport de garantie de 30 %',
    text: 'Un apport équivalent à 30 % du montant sollicité est déposé sur le compte partenaire avant le virement, comme preuve d’engagement du porteur.',
  },
]

const FIGURES = [
  { value: '10 000 €', label: 'Subvention maximale par projet' },
  { value: '30 questions', label: 'Réparties sur 3 sessions chronométrées' },
  { value: '48 h', label: 'Entre chaque phase d’évaluation' },
  { value: '2026', label: 'Édition en cours, dossiers ouverts' },
]

export function Landing() {
  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 lg:grid lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:pt-20 lg:pb-24">
          <div className="animate-[var(--animate-fade-up)]">
            <Badge className="px-3.5 py-1.5 text-[0.7rem] tracking-wide uppercase sm:text-xs">
              🌍 Programme d’Appui au Financement — Édition 2026
            </Badge>

            <h1 className="mt-6 text-[2.6rem] leading-[0.95] text-brand-600 sm:text-6xl lg:text-[4.1rem]">
              Obtenez jusqu’à 10 000 € pour financer votre projet à fort impact.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600 sm:text-xl">
              INNOVA FUND accompagne les porteurs de projets à fort impact social et environnemental
              par une <strong className="font-bold text-ink-900">subvention non remboursable</strong>,
              attribuée après une évaluation en trois sessions et le dépôt d’une garantie de 30 %.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/auth/register" size="lg" className="sm:w-auto">
                Présenter mon projet
                <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
              <ButtonLink to="/#processus" size="lg" variant="secondary">
                Découvrir le processus
              </ButtonLink>
            </div>

            <div className="mt-10 border-t border-ink-100 pt-6">
              <p className="text-xs font-bold tracking-[0.12em] text-ink-400 uppercase">
                Avec le soutien de nos bailleurs
              </p>
              <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                {PARTNERS.map((partner) => (
                  <li
                    key={partner}
                    className="text-sm font-bold tracking-[-0.01em] text-ink-300 transition hover:text-ink-400"
                  >
                    {partner}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 lg:mt-0">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Chiffres */}
      <section className="bg-ink-900">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:py-14">
          {FIGURES.map((figure) => (
            <div key={figure.label}>
              <p className="text-2xl font-extrabold tracking-[-0.035em] text-white sm:text-3xl">
                {figure.value}
              </p>
              <p className="mt-1.5 text-sm leading-snug text-ink-400">{figure.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ Processus */}
      <section id="processus" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="max-w-2xl">
            <Badge tone="outline">Le parcours</Badge>
            <h2 className="mt-5 text-3xl leading-[1.05] text-ink-900 sm:text-4xl lg:text-5xl">
              Six étapes, de l’inscription au virement.
            </h2>
            <p className="mt-4 text-lg text-ink-600">
              Chaque étape se débloque automatiquement dans votre espace dès que la précédente est
              validée. Vous suivez l’avancement de votre dossier en temps réel.
            </p>
          </div>

          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map(({ icon: Icon, ...step }) => (
              <li
                key={step.step}
                className="group relative flex flex-col rounded-2xl border border-ink-200/80 bg-white p-6 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-600/5"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-sm font-extrabold tracking-[-0.02em] text-ink-200">
                    {step.step}
                  </span>
                </div>
                <h3 className="mt-5 text-lg text-ink-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{step.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10">
            <ButtonLink to="/auth/register" size="lg">
              Démarrer mon inscription
              <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Engagements */}
      <section className="bg-ink-50/70">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="max-w-2xl">
            <Badge tone="outline">Les conditions du programme</Badge>
            <h2 className="mt-5 text-3xl leading-[1.05] text-ink-900 sm:text-4xl">
              Trois engagements à connaître avant de candidater.
            </h2>
            <p className="mt-4 text-lg text-ink-600">
              Ces conditions sont rappelées et acceptées explicitement à l’inscription. Elles
              conditionnent le versement de la subvention.
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {COMMITMENTS.map(({ icon: Icon, ...item }) => (
              <div key={item.title} className="rounded-2xl bg-white p-6 ring-1 ring-ink-200/80">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- CTA de sortie */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="relative overflow-hidden rounded-3xl bg-brand-600 px-6 py-14 text-center sm:px-12 lg:py-20">
            <div className="grid-motif absolute inset-0 opacity-30" aria-hidden />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl leading-[1.05] text-white sm:text-4xl lg:text-5xl">
                Soyez le moteur de ce qui vient ensuite.
              </h2>
              <p className="mt-4 text-lg text-brand-100">
                Les candidatures de l’édition 2026 sont ouvertes. Présentez votre projet en quelques
                minutes, l’évaluation démarre dès la validation de votre dossier.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink to="/auth/register" size="lg" variant="secondary" pill>
                  Présenter mon projet
                </ButtonLink>
                <ButtonLink
                  to="/a-propos"
                  size="lg"
                  pill
                  className="bg-white/10 text-white ring-1 ring-inset ring-white/25 hover:bg-white/20"
                >
                  En savoir plus
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
