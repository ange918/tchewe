import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { InboxIcon, SearchIcon } from '../../components/ui/icons'
import { Input } from '../../components/ui/Field'
import { Badge } from '../../components/ui/Badge'
import { Card, CardBody } from '../../components/ui/Card'
import { formatDate } from '../../lib/utils'
import { stageOf } from '../../lib/pipeline'
import { useDossiers } from '../../hooks/useDossiers'
import { useProfiles } from '../../hooks/useProfiles'

/**
 * Tous les comptes créés sur la plateforme.
 *
 * Les étapes du parcours ne montrent que les porteurs ayant déposé un dossier :
 * quelqu'un qui s'est seulement inscrit n'y figure nulle part. Cette page est
 * la seule qui répond à « qui s'est inscrit, et comment le joindre ».
 */
export function Accounts() {
  const { profiles, loading } = useProfiles()
  const { dossiers } = useDossiers()
  const [query, setQuery] = useState('')

  const liste = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return profiles
      .filter((p) =>
        needle
          ? [p.first_name, p.last_name, p.email].join(' ').toLowerCase().includes(needle)
          : true,
      )
      .map((p) => ({
        ...p,
        dossier: dossiers.find((d) => d.owner_id === p.id) ?? null,
      }))
      .reverse()
  }, [profiles, dossiers, query])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-3xl">
            Comptes inscrits
          </h1>
          <p className="mt-1 text-ink-600">
            {loading ? 'Chargement…' : `${profiles.length} compte(s), du plus récent au plus ancien.`}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <SearchIcon
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-400"
            aria-hidden
          />
          <Input
            placeholder="Rechercher un nom, une adresse…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-10"
            aria-label="Rechercher un compte"
          />
        </div>
      </div>

      {liste.length === 0 ? (
        <Card>
          <CardBody className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 text-ink-400">
              <InboxIcon className="h-6 w-6" aria-hidden />
            </span>
            <p className="max-w-sm text-sm text-ink-600">
              {loading ? 'Chargement…' : 'Aucun compte ne correspond à cette recherche.'}
            </p>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="p-0">
            <ul className="divide-y divide-ink-100">
              {liste.map((compte) => {
                const stage = compte.dossier ? stageOf(compte.dossier.status) : undefined
                const nom = `${compte.first_name} ${compte.last_name}`.trim()

                return (
                  <li
                    key={compte.id}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-ink-900">
                        {nom || 'Nom non renseigné'}
                        {compte.role === 'admin' && (
                          <span className="ml-2 align-middle">
                            <Badge tone="outline">Administrateur</Badge>
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-ink-600">
                        {compte.email ? (
                          <a href={`mailto:${compte.email}`} className="hover:underline">
                            {compte.email}
                          </a>
                        ) : (
                          '— adresse inconnue'
                        )}
                      </p>
                    </div>

                    <dl className="flex shrink-0 flex-wrap gap-x-6 gap-y-1 text-xs text-ink-500">
                      <div>
                        <dt className="font-bold tracking-[0.06em] text-ink-400 uppercase">
                          Naissance
                        </dt>
                        <dd className="mt-0.5 text-ink-700">
                          {compte.birth_date ? formatDate(compte.birth_date) : '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-bold tracking-[0.06em] text-ink-400 uppercase">
                          Inscrit le
                        </dt>
                        <dd className="mt-0.5 text-ink-700">{formatDate(compte.created_at)}</dd>
                      </div>
                      <div>
                        <dt className="font-bold tracking-[0.06em] text-ink-400 uppercase">
                          Dossier
                        </dt>
                        <dd className="mt-0.5">
                          {compte.dossier && stage ? (
                            <Link
                              to={`/admin/${stage.slug}`}
                              className="inline-flex items-center gap-1.5 font-bold text-ink-900 hover:underline"
                            >
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: stage.color }}
                                aria-hidden
                              />
                              {stage.short}
                            </Link>
                          ) : (
                            <span className="text-ink-400">Aucun dépôt</span>
                          )}
                        </dd>
                      </div>
                    </dl>
                  </li>
                )
              })}
            </ul>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
