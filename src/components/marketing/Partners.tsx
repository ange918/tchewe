import { InstitutionIcon } from '../ui/icons'
import { Badge } from '../ui/Badge'

/**
 * Partenaires & sponsors du programme.
 *
 * Les entrées ci-dessous sont des intitulés de remplacement. Pour afficher un
 * partenaire réel : déposer son logo dans `public/images/partners/` et renseigner
 * `logo` — la tuile bascule alors de l'emblème générique à l'image.
 *
 * N'inscrire ici qu'une organisation qui finance ou soutient effectivement le
 * programme et dont l'autorisation d'usage de la marque a été obtenue : un logo
 * institutionnel affiché sur cette page vaut affirmation de parrainage.
 */
interface Partner {
  name: string
  role: string
  logo?: string
}

const PARTNERS: Partner[] = [
  { name: 'Fonds d’Impact', role: 'Bailleur principal — dotation de l’enveloppe annuelle' },
  { name: 'Coopération Internationale', role: 'Appui technique et suivi des indicateurs' },
  { name: 'Alliance ONG', role: 'Réseau bénéficiaire du reversement de dividendes' },
  { name: 'Fondation Partenaire', role: 'Cofinancement des projets éducatifs et de santé' },
  { name: 'Banque Partenaire', role: 'Ouverture des comptes et dépôt des garanties' },
  { name: 'Agence de Développement', role: 'Accompagnement des lauréats après financement' },
]

function PartnerTile({ partner }: { partner: Partner }) {
  return (
    <li className="group flex flex-col items-center gap-4 rounded-2xl border border-ink-200/80 bg-white p-6 text-center transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-600/5">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
        {partner.logo ? (
          <img src={partner.logo} alt={partner.name} className="h-10 w-10 object-contain" loading="lazy" />
        ) : (
          <InstitutionIcon className="h-7 w-7" aria-hidden />
        )}
      </span>
      <span>
        <span className="block text-[0.98rem] font-extrabold tracking-[-0.015em] text-ink-900">
          {partner.name}
        </span>
        <span className="mt-1.5 block text-sm leading-relaxed text-ink-500">{partner.role}</span>
      </span>
    </li>
  )
}

export function Partners() {
  return (
    <section id="partenaires" className="scroll-mt-20 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-2xl">
          <Badge tone="outline">Ils soutiennent le programme</Badge>
          <h2 className="mt-5 text-3xl leading-[1.05] text-ink-900 sm:text-4xl lg:text-5xl">
            Partenaires &amp; sponsors
          </h2>
          <p className="mt-4 text-lg text-ink-600">
            L’enveloppe de l’édition 2026 est constituée par un collectif de bailleurs
            institutionnels et privés, qui suivent également l’usage des fonds et l’impact des
            projets financés.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PARTNERS.map((partner) => (
            <PartnerTile key={partner.name} partner={partner} />
          ))}
        </ul>

        <p className="mt-8 text-sm text-ink-400">
          Les intitulés affichés sont des emplacements de remplacement, à substituer par les
          identités des partenaires réels du programme.
        </p>
      </div>
    </section>
  )
}
