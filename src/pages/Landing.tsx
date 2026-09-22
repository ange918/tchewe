import { ArrowRightIcon, BadgeCheckIcon, CheckCircleIcon, ClipboardIcon, DonateIcon, MoneyIcon, TimerIcon, UserPlusIcon, WalletIcon } from '../components/ui/icons'
import { Badge } from '../components/ui/Badge'
import { ButtonLink } from '../components/ui/Button'
import { HeroVisual } from '../components/marketing/HeroVisual'
import { Partners } from '../components/marketing/Partners'
import { FAQSection } from '../components/marketing/FAQSection'
import { Counter } from '../components/ui/Counter'
import { MEDIA, MEDIA_ALT } from '../data/media'
import { Enter, Reveal, RevealGroup, RevealItem } from '../components/ui/motion'

const PARTNERS = [
  { name: 'Banque Mondiale', logo: '/images/partners/banque-mondiale.svg' },
  { name: 'Union Européenne', logo: '/images/partners/union-europeenne.svg' },
  { name: 'OMS', logo: '/images/partners/oms.svg' },
  { name: 'Mastercard', logo: '/images/partners/mastercard.svg' },
  { name: 'Coopération Internationale', logo: '/images/partners/cooperation-internationale.svg' },
]

const STEPS = [
  {
    icon: UserPlusIcon,
    step: '01',
    title: 'Inscription',
    text: 'Créez votre compte et acceptez les conditions du programme : subvention non remboursable, reversement de dividendes aux ONG, garantie de 30 %.',
    image: '/images/steps/01-inscription.jpg',
  },
  {
    icon: ClipboardIcon,
    step: '02',
    title: 'Soumission du dossier',
    text: 'Présentez votre projet, le montant sollicité et la durée d’exécution, puis joignez votre pitch deck, business plan et documents d’enregistrement.',
    image: '/images/steps/02-soumission.jpg',
  },
  {
    icon: TimerIcon,
    step: '03',
    title: 'QCM — Phase 1 (J0)',
    text: 'Dès la validation de votre dossier par l’administration, 10 questions chronométrées évaluent vos fondamentaux entrepreneuriaux.',
    image: '/images/steps/03-quiz1.jpg',
  },
  {
    icon: TimerIcon,
    step: '04',
    title: 'QCM — Phases 2 & 3 (J+2, J+4)',
    text: 'Deux sessions supplémentaires s’ouvrent toutes les 48 heures : modèle économique, gestion financière, impact et conformité.',
    image: '/images/steps/04-quiz2.jpg',
  },
  {
    icon: WalletIcon,
    step: '05',
    title: 'Dépôt de la garantie de 30 %',
    text: 'Ouvrez votre compte auprès de la banque partenaire, déposez votre apport puis transmettez le reçu et le justificatif de compte.',
    image: '/images/steps/05-garantie.jpg',
  },
  {
    icon: MoneyIcon,
    step: '06',
    title: 'Virement de la subvention',
    text: 'Après vérification des preuves par l’administration, l’ordre de virement est émis vers votre compte.',
    image: '/images/steps/06-virement.jpg',
  },
]

const COMMITMENTS = [
  {
    icon: CheckCircleIcon,
    title: 'Subvention non remboursable',
    text: 'Les fonds accordés n’ont pas vocation à être restitués dès lors que les conditions du programme sont respectées et que les dépenses restent traçables.',
  },
  {
    icon: DonateIcon,
    title: 'Reversement aux ONG partenaires',
    text: 'Chaque lauréat s’engage à reverser une part de ses dividendes aux ONG partenaires du programme, afin d’alimenter les éditions suivantes.',
  },
  {
    icon: BadgeCheckIcon,
    title: 'Apport de garantie de 30 %',
    text: 'Un apport équivalent à 30 % du montant sollicité est déposé sur le compte partenaire avant le virement, comme preuve d’engagement du porteur.',
  },
]

const FIGURES = [
  { isCounter: true, end: 650000, suffix: ' €', label: 'Subvention maximale par projet' },
  { isCounter: true, end: 30, suffix: ' questions', label: 'Réparties sur 3 sessions chronométrées' },
  { isCounter: true, end: 48, suffix: ' h', label: 'Entre chaque phase d’évaluation' },
  { isCounter: false, value: '2026', label: 'Édition en cours, dossiers ouverts' },
]

export function Landing() {
  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 lg:grid lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:pt-20 lg:pb-24">
          <div>
            <Enter>
            <h1 className="text-[2.6rem] leading-[0.95] text-brand-600 sm:text-6xl lg:text-[4.1rem]">
              Obtenez jusqu’à 650 000 € pour financer votre projet à fort impact.
            </h1>

            </Enter>

            <Enter delay={0.08}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600 sm:text-xl">
              INNOVA FUND accompagne les porteurs de projets à fort impact social et environnemental
              par une <strong className="font-bold text-ink-900">subvention non remboursable</strong>,
              attribuée après une évaluation en trois sessions et le dépôt d’une garantie de 30 %.
            </p>

            </Enter>

            <Enter delay={0.16} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/auth/register" size="lg" className="sm:w-auto">
                Présenter mon projet
                <ArrowRightIcon className="h-4 w-4" aria-hidden />
              </ButtonLink>
              <ButtonLink to="/#processus" size="lg" variant="secondary">
                Découvrir le processus
              </ButtonLink>
            </Enter>

            <Enter delay={0.24} className="mt-10 border-t border-ink-100 pt-6">
              <p className="text-xs font-bold tracking-[0.12em] text-ink-400 uppercase">
                Avec le soutien de nos partenaires institutionnels
              </p>
              <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                {PARTNERS.map((partner) => (
                  <li
                    key={partner.name}
                    className="inline-flex items-center gap-2 rounded-xl border border-ink-200/70 bg-white px-3 py-1.5 shadow-2xs transition hover:border-brand-200 hover:shadow-xs"
                  >
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="h-5 w-5 object-contain"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-xs font-bold tracking-[-0.01em] text-ink-700">
                      {partner.name}
                    </span>
                  </li>
                ))}
              </ul>
            </Enter>
          </div>

          <Enter delay={0.12} className="mt-14 lg:mt-0">
            <HeroVisual />
          </Enter>
        </div>
      </section>

      {/* ------------------------------------------------------------- Chiffres */}
      <section className="relative overflow-hidden bg-ink-950">
        <img
          src={MEDIA.ctaBand}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-[2px]" />
        <div className="grid-motif absolute inset-0 opacity-15" aria-hidden />

        <RevealGroup className="relative mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:py-16">
          {FIGURES.map((figure) => (
            <RevealItem key={figure.label}>
              <p className="text-2xl font-extrabold tracking-[-0.035em] text-white sm:text-3xl lg:text-4xl">
                {figure.isCounter && figure.end !== undefined ? (
                  <Counter end={figure.end} suffix={figure.suffix} />
                ) : (
                  figure.value
                )}
              </p>
              <p className="mt-1.5 text-sm leading-snug text-ink-300">{figure.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ------------------------------------------------------------ Processus */}
      <section id="processus" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <Reveal className="max-w-2xl">
            <Badge tone="outline">Le parcours</Badge>
            <h2 className="mt-5 text-3xl leading-[1.05] text-ink-900 sm:text-4xl lg:text-5xl">
              Six étapes, de l’inscription au virement.
            </h2>
            <p className="mt-4 text-lg text-ink-600">
              Chaque étape se débloque automatiquement dans votre espace dès que la précédente est
              validée. Vous suivez l’avancement de votre dossier en temps réel.
            </p>
          </Reveal>

          <RevealGroup as="ol" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map(({ icon: Icon, ...step }) => (
              <RevealItem
                as="li"
                key={step.step}
                className="group relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-2xl border border-ink-200/80 bg-ink-950 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-400 hover:shadow-2xl hover:shadow-ink-950/30"
              >
                {/* Image couvrant l'intégralité de la carte (Full Card) */}
                <img
                  src={step.image}
                  alt={step.title}
                  className="absolute inset-0 h-full w-full object-cover object-center brightness-90 transition duration-700 ease-out group-hover:scale-105 group-hover:brightness-95"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Voile dégradé léger pour garantir la clarté de l'image tout en assurant le contraste */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/40 to-ink-950/20 transition duration-300 group-hover:via-ink-950/30" />

                {/* En-tête de la carte : icône et numéro d'étape */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 text-brand-600 shadow-lg backdrop-blur-md ring-1 ring-white/40 transition duration-300 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="rounded-lg bg-ink-950/75 px-3 py-1 font-mono text-xs font-black tracking-wider text-amber-300 shadow-md backdrop-blur-md ring-1 ring-white/20">
                    ÉTAPE {step.step}
                  </span>
                </div>

                {/* Bloc de texte en bas : cartouche en verre dépoli ultra-lisible */}
                <div className="relative z-10 mt-auto rounded-xl border border-white/15 bg-ink-950/80 p-4.5 shadow-xl backdrop-blur-md transition duration-300 group-hover:border-white/25 group-hover:bg-ink-950/85">
                  <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-amber-300">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink-200">
                    {step.text}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-10">
            <ButtonLink to="/auth/register" size="lg">
              Démarrer mon inscription
              <ArrowRightIcon className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      <Partners />

      {/* ---------------------------------------------------------- Engagements */}
      <section className="bg-ink-50/70">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <Reveal className="max-w-2xl">
            <Badge tone="outline">Les conditions du programme</Badge>
            <h2 className="mt-5 text-3xl leading-[1.05] text-ink-900 sm:text-4xl">
              Trois engagements à connaître avant de candidater.
            </h2>
            <p className="mt-4 text-lg text-ink-600">
              Ces conditions sont rappelées et acceptées explicitement à l’inscription. Elles
              conditionnent le versement de la subvention.
            </p>
          </Reveal>

          <RevealGroup className="mt-12 grid gap-4 lg:grid-cols-3">
            {COMMITMENTS.map(({ icon: Icon, ...item }) => (
              <RevealItem key={item.title} className="rounded-2xl bg-white p-6 ring-1 ring-ink-200/80">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ------------------------------------------------------------- Section FAQ */}
      <FAQSection />

      {/* --------------------------------------------------------- CTA de sortie */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="relative overflow-hidden rounded-3xl bg-brand-800 px-6 py-16 text-center sm:px-12 lg:py-24">
            <img
              src={MEDIA.ctaBand}
              alt={MEDIA_ALT.ctaBand}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-ink-950/65" />
            <div className="grid-motif absolute inset-0 opacity-20" aria-hidden />
            <Reveal className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl leading-[1.05] text-white sm:text-4xl lg:text-5xl">
                Soyez le moteur de ce qui vient ensuite.
              </h2>
              <p className="mt-4 text-lg text-brand-100">
                Les candidatures de l’édition 2026 sont ouvertes. Présentez votre projet en quelques
                minutes, l’évaluation démarre dès la validation de votre dossier.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink to="/auth/register" size="lg" variant="secondary">
                  Présenter mon projet
                </ButtonLink>
                <ButtonLink
                  to="/a-propos"
                  size="lg"
                  className="bg-white/10 text-white ring-1 ring-inset ring-white/25 hover:bg-white/20"
                >
                  En savoir plus
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
