import { Badge } from '../components/ui/Badge'
import { ButtonLink } from '../components/ui/Button'
import { Arch } from '../components/ui/Card'
import { LogoMark } from '../components/ui/Logo'

const ELIGIBILITY = [
  'Porteur majeur, résidant dans l’un des pays couverts par l’édition 2026.',
  'Projet à impact social, environnemental ou éducatif, déjà formalisé.',
  'Montant sollicité compris entre 2 000 € et 10 000 €.',
  'Durée d’exécution prévisionnelle inférieure à 24 mois.',
  'Capacité à déposer l’apport de garantie de 30 % du montant sollicité.',
  'Dossier complet : pitch deck, business plan et documents d’enregistrement légal.',
]

const FUNDERS = [
  {
    name: 'Fonds d’Impact',
    role: 'Bailleur principal — dotation de l’enveloppe annuelle.',
  },
  {
    name: 'Coopération Internationale',
    role: 'Appui technique et suivi des indicateurs d’impact.',
  },
  {
    name: 'Alliance ONG',
    role: 'Réseau bénéficiaire du reversement de dividendes des lauréats.',
  },
  {
    name: 'Fondation Partenaire',
    role: 'Cofinancement des projets éducatifs et de santé.',
  },
  {
    name: 'Banque Partenaire',
    role: 'Ouverture des comptes et réception des apports de garantie.',
  },
]

const FAQ = [
  {
    q: 'La subvention doit-elle être remboursée ?',
    a: 'Non. Il s’agit d’une subvention non remboursable dès lors que les conditions du programme sont respectées et que l’usage des fonds reste traçable et justifié.',
  },
  {
    q: 'À quoi sert l’apport de garantie de 30 % ?',
    a: 'Il constitue la preuve d’engagement du porteur. Il est déposé sur un compte ouvert auprès de la banque partenaire avant l’émission de l’ordre de virement de la subvention.',
  },
  {
    q: 'Pourquoi trois sessions de QCM espacées de 48 heures ?',
    a: 'L’espacement permet d’évaluer la constance du porteur et de limiter la sous-traitance des réponses. Chaque session porte sur un bloc de compétences distinct.',
  },
  {
    q: 'Que se passe-t-il si je manque une session ?',
    a: 'La session reste accessible tant que la phase suivante n’est pas ouverte. Passé ce délai, le dossier est réexaminé par l’administration.',
  },
  {
    q: 'Le reversement de dividendes aux ONG est-il obligatoire ?',
    a: 'Oui. C’est un engagement contractuel accepté à l’inscription : il alimente les éditions suivantes du programme.',
  },
]

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-ink-100 py-12 lg:py-16">
      <h2 className="text-2xl text-ink-900 sm:text-3xl">{title}</h2>
      <div className="mt-5 space-y-4 text-[0.98rem] leading-relaxed text-ink-600">{children}</div>
    </section>
  )
}

export function About() {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-10 sm:px-6 lg:grid lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-14 lg:pt-20">
          <div>
            <Badge tone="outline">Notre vision</Badge>
            <h1 className="mt-5 text-[2.4rem] leading-[0.98] text-brand-600 sm:text-5xl lg:text-[3.6rem]">
              Financer celles et ceux qui font bouger les lignes.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
              INNOVA FUND est un programme d’appui au financement porté par un collectif de bailleurs
              institutionnels et privés. Notre conviction : l’accès au capital d’amorçage ne devrait
              dépendre ni du réseau, ni du lieu de naissance, mais de la solidité du projet et de
              l’engagement du porteur.
            </p>
            <div className="mt-8">
              <ButtonLink to="/auth/register" size="lg">
                Présenter mon projet
              </ButtonLink>
            </div>
          </div>

          <div className="mt-12 lg:mt-0">
            <Arch className="relative aspect-4/3 bg-brand-600">
              <div className="absolute inset-0 bg-linear-to-br from-brand-500 to-brand-800" />
              <div className="grid-motif absolute inset-0 opacity-35" />
              <div className="absolute inset-0 flex items-center justify-center">
                <LogoMark className="h-28 w-28 text-white/80" />
              </div>
            </Arch>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <Section id="eligibilite" title="Critères d’éligibilité">
          <ul className="space-y-2.5">
            {ELIGIBILITY.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="bailleurs" title="Nos bailleurs">
          <p>
            L’enveloppe de l’édition 2026 est constituée par les partenaires suivants. Les noms
            affichés sur ce site sont des intitulés de démonstration, à remplacer par les identités
            réelles des bailleurs du programme.
          </p>
          <ul className="mt-2 divide-y divide-ink-100 rounded-2xl border border-ink-200/80">
            {FUNDERS.map((funder) => (
              <li key={funder.name} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <span className="font-bold tracking-[-0.01em] text-ink-900">{funder.name}</span>
                <span className="text-sm text-ink-500 sm:text-right">{funder.role}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="cgu" title="Conditions générales d’utilisation">
          <p>
            L’inscription au programme vaut acceptation pleine et entière des engagements suivants,
            rappelés et validés explicitement lors de la création du compte :
          </p>
          <ol className="space-y-3">
            <li>
              <strong className="font-bold text-ink-900">Subvention non remboursable.</strong> Les
              fonds accordés ne donnent lieu à aucun remboursement tant que les conditions du
              programme sont respectées et que l’usage des fonds est justifié.
            </li>
            <li>
              <strong className="font-bold text-ink-900">
                Reversement de dividendes aux ONG partenaires.
              </strong>{' '}
              Le lauréat s’engage à reverser une part de ses dividendes aux ONG partenaires, selon
              les modalités fixées par la convention de financement.
            </li>
            <li>
              <strong className="font-bold text-ink-900">Apport de garantie de 30 %.</strong> Le
              porteur dépose, avant le virement, un apport équivalent à 30 % du montant sollicité sur
              un compte ouvert auprès de la banque partenaire.
            </li>
          </ol>
        </Section>

        <Section id="confidentialite" title="Charte de confidentialité">
          <p>
            Les données transmises (identité, date de naissance, pièces du dossier, coordonnées
            bancaires) sont collectées pour l’unique instruction de votre candidature. Elles sont
            accessibles aux seuls agents habilités du programme et à ses bailleurs dans le cadre du
            contrôle de l’usage des fonds.
          </p>
          <p>
            La collecte est limitée au strict nécessaire. Vous disposez d’un droit d’accès, de
            rectification et de suppression de vos données, exerçable depuis votre espace membre ou
            sur demande auprès de l’administration du programme.
          </p>
        </Section>

        <Section id="faq" title="Questions fréquentes">
          <dl className="divide-y divide-ink-100 rounded-2xl border border-ink-200/80">
            {FAQ.map((item) => (
              <div key={item.q} className="p-5">
                <dt className="font-bold tracking-[-0.01em] text-ink-900">{item.q}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-ink-600">{item.a}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="mentions" title="Mentions légales">
          <p>
            INNOVA FUND — programme d’appui au financement, édition 2026. Les informations publiées
            sur ce site sont fournies à titre indicatif et ne constituent pas une offre de
            financement ferme. L’attribution d’une subvention reste soumise à l’instruction complète
            du dossier et à la validation des pièces justificatives.
          </p>
        </Section>
      </div>
    </>
  )
}
