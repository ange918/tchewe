import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bars, Donut, type Bar, type Slice } from '../../components/admin/Charts'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import { ArrowRightIcon } from '../../components/ui/icons'
import { formatEuro } from '../../lib/utils'
import { STAGES } from '../../lib/pipeline'
import { useDossiers } from '../../hooks/useDossiers'
import { useProfiles } from '../../hooks/useProfiles'

const JOURS = 14

function Tuile({
  label,
  value,
  detail,
  accent,
}: {
  label: string
  value: string
  detail?: string
  accent?: 'brand' | 'emerald' | 'amber'
}) {
  const couleur =
    accent === 'emerald'
      ? 'text-emerald-700'
      : accent === 'amber'
        ? 'text-amber-700'
        : accent === 'brand'
          ? 'text-brand-700'
          : 'text-ink-900'

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-4 sm:p-5">
      <p className="text-[0.65rem] font-bold tracking-[0.08em] text-ink-400 uppercase">{label}</p>
      <p className={`mt-1.5 text-2xl font-extrabold tracking-[-0.04em] sm:text-3xl ${couleur}`}>
        {value}
      </p>
      {detail && <p className="mt-1 text-xs text-ink-500">{detail}</p>}
    </div>
  )
}

export function Home() {
  const { dossiers, loading: chargementDossiers } = useDossiers()
  const { profiles, loading: chargementProfils } = useProfiles()

  const parEtape: Slice[] = useMemo(
    () =>
      STAGES.map((stage) => ({
        label: stage.label,
        value: dossiers.filter((d) => stage.statuses.includes(d.status)).length,
        color: stage.color,
      })),
    [dossiers],
  )

  const totalDossiers = parEtape.reduce((somme, part) => somme + part.value, 0)

  const inscriptions: Bar[] = useMemo(() => {
    const jours: Bar[] = []
    for (let i = JOURS - 1; i >= 0; i--) {
      const jour = new Date()
      jour.setHours(0, 0, 0, 0)
      jour.setDate(jour.getDate() - i)
      const suivant = new Date(jour)
      suivant.setDate(suivant.getDate() + 1)

      jours.push({
        label: String(jour.getDate()),
        title: jour.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
        value: profiles.filter((p) => {
          const t = new Date(p.created_at).getTime()
          return t >= jour.getTime() && t < suivant.getTime()
        }).length,
      })
    }
    return jours
  }, [profiles])

  const aTraiter = dossiers.filter((d) =>
    STAGES.filter((s) => s.actionable).some((s) => s.statuses.includes(d.status)),
  ).length

  const montantVerse = dossiers
    .filter((d) => d.status === 'financed')
    .reduce((somme, d) => somme + Number(d.amount ?? 0), 0)

  const montantSollicite = dossiers
    .filter((d) => d.status !== 'rejected')
    .reduce((somme, d) => somme + Number(d.amount ?? 0), 0)

  const candidats = profiles.filter((p) => p.role === 'candidate').length
  const chargement = chargementDossiers || chargementProfils

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-3xl">
          Tableau de bord
        </h1>
        <p className="mt-1 text-ink-600">
          {chargement ? 'Chargement…' : 'Chiffres lus directement dans la base, en temps réel.'}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Tuile
          label="Porteurs inscrits"
          value={String(candidats)}
          detail={`${profiles.length} compte(s) au total`}
        />
        <Tuile label="Dossiers déposés" value={String(totalDossiers)} />
        <Tuile
          label="En attente de vous"
          value={String(aTraiter)}
          detail="Nouveaux dossiers et preuves à vérifier"
          accent={aTraiter > 0 ? 'amber' : undefined}
        />
        <Tuile
          label="Montant versé"
          value={formatEuro(montantVerse)}
          detail={`sur ${formatEuro(montantSollicite)} sollicités`}
          accent="emerald"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Répartition des dossiers"
            description="Chaque dossier occupe exactement une étape du parcours."
          />
          <CardBody>
            <Donut slices={parEtape} total={totalDossiers} totalLabel="dossiers" />
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Inscriptions"
            description={`Nouveaux comptes créés sur les ${JOURS} derniers jours.`}
          />
          <CardBody>
            <Bars bars={inscriptions} />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Par étape"
          description="Cliquez sur une étape pour voir les dossiers qui s'y trouvent."
        />
        <CardBody>
          <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {STAGES.map((stage) => {
              const nombre = dossiers.filter((d) => stage.statuses.includes(d.status)).length
              return (
                <li key={stage.slug}>
                  <Link
                    to={`/admin/${stage.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white px-4 py-3 transition hover:border-brand-300 hover:bg-ink-50"
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: stage.color }}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1 truncate text-sm font-bold text-ink-900">
                      {stage.label}
                    </span>
                    <span className="text-sm font-extrabold text-ink-900 tabular-nums">
                      {nombre}
                    </span>
                    <ArrowRightIcon className="h-4 w-4 shrink-0 text-ink-400" aria-hidden />
                  </Link>
                </li>
              )
            })}
          </ul>
        </CardBody>
      </Card>
    </div>
  )
}
