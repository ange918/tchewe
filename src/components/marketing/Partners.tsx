import { Badge } from '../ui/Badge'
import { Reveal, RevealGroup, RevealItem } from '../ui/motion'

interface Partner {
  name: string
  role: string
  logo: string
}

const PARTNERS: Partner[] = [
  {
    name: 'Banque Mondiale',
    role: 'Bailleur institutionnel — dotation du fonds d’amorçage et appui structurel',
    logo: '/images/partners/banque-mondiale.svg',
  },
  {
    name: 'Union Européenne',
    role: 'Cofinancement des projets à fort impact social et transition écologique',
    logo: '/images/partners/union-europeenne.svg',
  },
  {
    name: 'Organisation Mondiale de la Santé (OMS)',
    role: 'Appui aux initiatives de santé communautaire et d’hygiène publique',
    logo: '/images/partners/oms.svg',
  },
  {
    name: 'Mastercard',
    role: 'Inclusion financière, autonomisation économique des jeunes et entrepreneuriat',
    logo: '/images/partners/mastercard.svg',
  },
  {
    name: 'Coopération Internationale',
    role: 'Appui technique, mobilité et suivi des indicateurs d’impact',
    logo: '/images/partners/cooperation-internationale.svg',
  },
]

function PartnerTile({ partner }: { partner: Partner }) {
  return (
    <RevealItem
      as="li"
      className="group flex flex-col items-center gap-4 rounded-2xl border border-ink-200/80 bg-white p-6 text-center transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-600/5">
      <span className="flex h-20 w-20 items-center justify-center rounded-2xl border border-ink-100 bg-white p-3 shadow-xs transition group-hover:border-brand-200 group-hover:shadow-md">
        <img
          src={partner.logo}
          alt={partner.name}
          className="h-full w-full object-contain transition duration-200 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </span>
      <span>
        <span className="block text-[1.02rem] font-extrabold tracking-[-0.015em] text-ink-900">
          {partner.name}
        </span>
        <span className="mt-1.5 block text-sm leading-relaxed text-ink-500">{partner.role}</span>
      </span>
    </RevealItem>
  )
}

export function Partners() {
  return (
    <section id="partenaires" className="scroll-mt-20 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <Reveal className="max-w-2xl">
          <Badge tone="outline">Ils soutiennent le programme</Badge>
          <h2 className="mt-5 text-3xl leading-[1.05] text-ink-900 sm:text-4xl lg:text-5xl">
            Partenaires &amp; sponsors
          </h2>
          <p className="mt-4 text-lg text-ink-600">
            L’enveloppe de l’édition 2026 est constituée par un collectif de bailleurs
            institutionnels et partenaires internationaux, qui accompagnent et soutiennent le
            financement des projets retenus.
          </p>
        </Reveal>

        <RevealGroup as="ul" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PARTNERS.map((partner) => (
            <PartnerTile key={partner.name} partner={partner} />
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
