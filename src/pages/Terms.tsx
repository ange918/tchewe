import { Badge } from '../components/ui/Badge'
import { ButtonLink } from '../components/ui/Button'
import { ArrowRightIcon, CheckCircleIcon, ShieldIcon } from '../components/ui/icons'
import { Enter, Reveal } from '../components/ui/motion'

export function Terms() {
  return (
    <>
      {/* En-tête */}
      <section className="border-b border-ink-100 bg-ink-50/60 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Enter>
            <Badge tone="brand">Cadre réglementaire & contractuel</Badge>
            <h1 className="mt-4 text-3xl leading-tight font-extrabold text-ink-900 sm:text-4xl lg:text-5xl">
              Conditions Générales du Programme INNOVA FUND
            </h1>
            <p className="mt-4 text-base text-ink-600 sm:text-lg">
              Édition 2026 — Programme d’appui au financement des initiatives entrepreneuriales à fort impact social, environnemental et technologique.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-ink-500">
              <span>Dernière mise à jour : 22 septembre 2026</span>
              <span>•</span>
              <span>Applicable à tous les candidats et lauréats</span>
            </div>
          </Enter>
        </div>
      </section>

      {/* Corps des conditions */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="prose prose-ink max-w-none space-y-12">
          
          {/* Article 1 */}
          <Reveal as="section" className="rounded-2xl border border-ink-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-black text-sm">
                01
              </span>
              <h2 className="text-xl font-bold text-ink-900">
                Objet du Programme & Nature du Financement
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-700">
              <p>
                Le programme <strong>INNOVA FUND (Édition 2026)</strong> est un mécanisme d’appui financier et technique institué en partenariat avec des bailleurs multilatéraux (Banque Mondiale, Union Européenne, OMS, Mastercard, Coopération Internationale).
              </p>
              <p>
                Il a pour vocation d’octroyer une <strong>subvention non remboursable</strong> comprise entre <strong>2 000 €</strong> et <strong>650 000 €</strong> par projet sélectionné, destinée exclusivement à financer le démarrage, l’accélération ou l’extension d’initiatives créatrices de valeur sociétale, économique ou environnementale mesurable.
              </p>
              <div className="mt-3 rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-emerald-900 text-xs font-medium leading-relaxed flex items-start gap-2.5">
                <CheckCircleIcon className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Non-remboursabilité :</strong> Les sommes perçues ne constituent ni un prêt ni une dette. Elles sont définitivement acquises au porteur de projet sous réserve du strict respect de la destination des fonds déclarée et des obligations de reddition de comptes.
                </span>
              </div>
            </div>
          </Reveal>

          {/* Article 2 */}
          <Reveal as="section" className="rounded-2xl border border-ink-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-black text-sm">
                02
              </span>
              <h2 className="text-xl font-bold text-ink-900">
                Critères d’Éligibilité des Candidats
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-700">
              <p>Pour être recevable, toute candidature doit satisfaire cumulativement aux conditions suivantes :</p>
              <ul className="list-disc pl-5 space-y-1.5 text-ink-700">
                <li>Être une personne physique majeure (18 ans révolus) ou une personne morale légalement constituée ou en cours d'immatriculation.</li>
                <li>Résider ou déployer les activités du projet dans l’une des zones géographiques couvertes par l’édition 2026.</li>
                <li>Présenter un plan d’affaires (Business Plan), une présentation synthétique (Pitch Deck) et les pièces d’identité requises.</li>
                <li>Solliciter une subvention comprise dans la fourchette officielle de 2 000 € à 650 000 €, avec un calendrier d'exécution prévisionnel de 3 à 24 mois.</li>
                <li>Attester de l’authenticité des pièces justificatives fournies lors de la soumission du dossier.</li>
              </ul>
            </div>
          </Reveal>

          {/* Article 3 */}
          <Reveal as="section" className="rounded-2xl border border-ink-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-black text-sm">
                03
              </span>
              <h2 className="text-xl font-bold text-ink-900">
                Processus d’Évaluation & Sessions QCM
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-700">
              <p>
                L’accès au financement repose sur un processus méritocratique standardisé et transparent :
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Instruction administrative :</strong> Vérification de la complétude du dossier, de la viabilité du plan d’affaires et de la conformité réglementaire par le comité de gestion.
                </li>
                <li>
                  <strong>Phase 1 — Fondamentaux entrepreneuriaux (J0) :</strong> Session de 10 questions chronométrées testant la vision stratégique, la gestion opérationnelle et l’ancrage terrain.
                </li>
                <li>
                  <strong>Phase 2 — Modèle économique & Finance (J+2) :</strong> Session de 10 questions chronométrées débloquée 48 heures après la Phase 1.
                </li>
                <li>
                  <strong>Phase 3 — Impact social, environnemental & Gouvernance (J+4) :</strong> Session finale de 10 questions chronométrées débloquée 48 heures après la Phase 2.
                </li>
              </ol>
              <p className="text-xs text-ink-500 italic mt-2">
                L’intervalle de 48 heures est inaltérable : il garantit l’égalité de traitement entre candidats et certifie l’implication continue du porteur de projet.
              </p>
            </div>
          </Reveal>

          {/* Article 4 */}
          <Reveal as="section" className="rounded-2xl border border-brand-200 bg-brand-50/30 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white font-black text-sm">
                04
              </span>
              <h2 className="text-xl font-bold text-ink-900">
                Garantie d’Engagement de 30 % & Compte Bancaire Partenaire
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-700">
              <p>
                Conformément aux protocoles d’accord signés avec nos institutions financières partenaires, l’octroi effectif de la subvention requiert le versement préalable d'un <strong>apport d’engagement de 30 %</strong> du montant sollicité.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 mt-4">
                <div className="rounded-xl border border-ink-200 bg-white p-4">
                  <h3 className="font-bold text-ink-900 text-xs uppercase tracking-wider">Finalité de la garantie</h3>
                  <p className="mt-1.5 text-xs text-ink-600 leading-normal">
                    Atteste de la capacité d’action du porteur, prévient les candidatures fictives et sécurise la trésorerie de démarrage du projet.
                  </p>
                </div>
                <div className="rounded-xl border border-ink-200 bg-white p-4">
                  <h3 className="font-bold text-ink-900 text-xs uppercase tracking-wider">Séquestre et traçabilité</h3>
                  <p className="mt-1.5 text-xs text-ink-600 leading-normal">
                    L’apport est versé sur un compte bancaire dédié et reste affecté aux opérations du projet du candidat.
                  </p>
                </div>
              </div>
              <p className="text-xs text-ink-600 mt-2">
                Le candidat doit téléverser le reçu de dépôt ainsi que le relevé d’identité bancaire dans son espace membre pour validation par le pôle d'audit avant le virement de la subvention.
              </p>
            </div>
          </Reveal>

          {/* Article 5 */}
          <Reveal as="section" className="rounded-2xl border border-ink-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-black text-sm">
                05
              </span>
              <h2 className="text-xl font-bold text-ink-900">
                Reversement Solidaire aux ONG Partenaires
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-700">
              <p>
                En adhérant au programme INNOVA FUND, chaque lauréat souscrit au principe de <strong>solidarité circulaire</strong>.
              </p>
              <p>
                Dès lors que le projet franchit le seuil de rentabilité opérationnelle constaté au terme du deuxième exercice comptable, le bénéficiaire s’engage à rétrocéder une quote-part convenue de ses dividendes nets (stipulée dans la convention particulière de subvention) aux associations et ONG partenaires du réseau.
              </p>
              <p>
                Ce mécanisme garantit le réapprovisionnement perpétuel du fonds d’amorçage au bénéfice des futures promotions d’entrepreneurs.
              </p>
            </div>
          </Reveal>

          {/* Article 6 */}
          <Reveal as="section" className="rounded-2xl border border-ink-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-black text-sm">
                06
              </span>
              <h2 className="text-xl font-bold text-ink-900">
                Virement des Fonds & Audit d’Utilisation
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-700">
              <p>
                Après vérification administrative de la conformité du dossier, des scores obtenus aux trois sessions de QCM et de la constatation du dépôt de garantie de 30 %, <strong>l’ordre de virement irrévocable</strong> de la subvention est émis vers les coordonnées bancaires transmises.
              </p>
              <p>
                Le bénéficiaire s’engage à conserver l'ensemble des factures et pièces comptables relatives aux dépenses effectuées au moyen de la subvention pendant une durée minimale de cinq (5) ans, afin de satisfaire à tout contrôle inopiné mandaté par les auditeurs institutionnels.
              </p>
            </div>
          </Reveal>

          {/* Article 7 */}
          <Reveal as="section" className="rounded-2xl border border-ink-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-black text-sm">
                07
              </span>
              <h2 className="text-xl font-bold text-ink-900">
                Protection des Données & Confidentialité
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-700">
              <p>
                Toutes les données à caractère personnel ainsi que les documents techniques (plans d’affaires, secrets de fabrication, éléments de propriété intellectuelle) sont traités avec le plus haut niveau de confidentialité.
              </p>
              <p>
                Ils sont réservés aux membres du comité d’examen et ne font l’objet d’aucune cession commerciale à des tiers. Le candidat dispose d’un droit permanent d’accès, de rectification et de consultation de son historique de traitement.
              </p>
            </div>
          </Reveal>

        </div>

        {/* Bloc d'action en bas de page */}
        <Reveal className="mt-12 rounded-3xl bg-ink-900 p-8 text-center sm:p-10">
          <ShieldIcon className="mx-auto h-10 w-10 text-brand-400" />
          <h3 className="mt-4 text-2xl font-bold text-white">
            Prêt à soumettre votre dossier ?
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-ink-300">
            L’inscription est gratuite et s’effectue en quelques minutes. Votre dossier est ensuite suivi en temps réel sur votre tableau de bord.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink to="/auth/register" size="lg">
              Créer mon compte candidat
              <ArrowRightIcon className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink to="/#processus" variant="secondary" size="lg" className="bg-white/10 text-white ring-white/20 hover:bg-white/20">
              Revoir les 6 étapes
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </>
  )
}
