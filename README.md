# INNOVA FUND — Interface de la plateforme

Front-end de la plateforme d’appui au financement INNOVA FUND : landing page publique,
espace porteur de projet (soumission, QCM chronométré, dépôt de garantie) et back-office
d’instruction des dossiers.

**React 19 · Vite 8 · TypeScript · Tailwind CSS v4 · React Router 7 · Zustand · Boxicons**

## Démarrage

```bash
npm install
npm run dev     # http://localhost:5173
```

| Commande | Description |
| --- | --- |
| `npm run dev` | Serveur de développement (exposé sur le réseau local) |
| `npm run build` | Vérification des types puis build de production dans `dist/` |
| `npm run preview` | Sert le build de production |
| `npm run lint` | Analyse statique (oxlint) |

## Direction artistique

La charte reprend la référence visuelle fournie : indigo électrique sur fond blanc,
sans-serif géométrique à graisse forte et interlettrage serré, boutons à coins arrondis
ou en pilule, bandeaux noirs pleine largeur, et une **forme en arche** comme signature.

| Jeton | Valeur | Usage |
| --- | --- | --- |
| `--color-brand-600` | `#3d2be8` | Couleur de marque : titres, boutons, aplats |
| `--color-brand-50` → `950` | échelle complète | États, fonds, contrastes |
| `--color-ink-900` | `#0b0b0f` | Bandeaux sombres, texte principal |
| `--color-ink-50` → `500` | gris neutres | Fonds, bordures, texte secondaire |
| `--font-sans` | Plus Jakarta Sans Variable | Titres et corps de texte |
| `.arch` / `.arch-sm` | `border-radius` elliptique | Visuels en arche |
| Boutons | `rounded-full` | Tous les boutons sont entièrement arrondis |

Les jetons sont déclarés dans `src/index.css` via le bloc `@theme` de Tailwind v4. La
police est auto-hébergée (`@fontsource-variable/plus-jakarta-sans`) : aucun appel réseau
externe au chargement.

### Icônes

Le jeu d'icônes est **Boxicons**, servi par `react-icons/bi`. Les icônes ne sont jamais
importées directement dans les écrans : `src/components/ui/icons.ts` les réexporte sous
des noms métier (`ArrowRightIcon`, `ShieldIcon`, `TimerIcon`…). Un changement de
bibliothèque ne touche donc que ce fichier.

### Visuels

`src/data/media.ts` recense les quatre emplacements visuels de l'interface : arche du
héros, bande d'appel à l'action, panneau d'authentification et arche de la page à propos.
Les fichiers livrés sont des **illustrations vectorielles** (`public/images/*.svg`)
composées dans la palette de la charte.

Pour passer à des photographies : déposer le fichier dans `public/images/`, remplacer le
chemin dans `src/data/media.ts` et mettre à jour le texte alternatif correspondant. Aucun
composant n'a besoin d'être modifié — ils lisent tous cette table. Les rapports d'aspect
attendus sont documentés dans le fichier.

## Arborescence des routes

```
/                        Landing page publique
/a-propos                Vision, bailleurs, CGU, confidentialité, FAQ, mentions légales
/auth/login              Connexion
/auth/register           Inscription + acceptation explicite des CGU
/dashboard               Espace porteur — vue d’avancement
  /submission            Formulaire de présentation du projet + pièces jointes
  /evaluation            QCM chronométré (phases 1, 2, 3) et blocage 48 h
  /funding               Garantie de 30 % : coordonnées bancaires et preuves
/admin                   Back-office (redirige vers /admin/dossiers)
  /dossiers              Pipeline Kanban + fiche de révision avec visualiseur PDF
  /verifications         Comparateur de preuves et ordre de virement
```

Les routes `/dashboard` et `/admin` sont protégées par `RequireRole` : un visiteur non
connecté est renvoyé vers `/auth/login`, un rôle incorrect vers son propre espace.

## Parcours et machine à états

Le dossier du porteur suit un statut unique qui pilote l’interface (`src/store/application.ts`) :

```
draft → submitted → approved → awaiting_next_phase ⇄ approved → evaluated
      → proofs_submitted → financed          (ou rejected à l’instruction)
```

- **`draft`** — le formulaire de soumission est affiché.
- **`submitted`** — écran « Dossier en cours d’analyse » ; l’évaluation reste verrouillée.
- **`approved`** — la session de QCM en cours est ouverte.
- **`awaiting_next_phase`** — écran de blocage avec compte à rebours de 48 h (J+2, J+4).
- **`evaluated`** — dépôt de la garantie de 30 % et des justificatifs.
- **`proofs_submitted` → `financed`** — vérification puis émission de l’ordre de virement.

Le seuil de réussite d’une phase est de 60 % ; en dessous, la session peut être repassée.

## Moteur de QCM

`src/components/dashboard/QuizRunner.tsx` enchaîne les questions d’une phase :

- un chrono par question (5 à 10 s), calé sur `performance.now()` et animé par
  `requestAnimationFrame` — le tracé de l’anneau est piloté par `strokeDashoffset`, donc
  sans recalcul de mise en page à chaque frame ;
- passage automatique à la question suivante à l’expiration du temps imparti, ou juste
  après la sélection d’une réponse (court délai de confirmation visuelle) ;
- banque de 30 questions réparties en trois blocs thématiques (`src/data/quiz.ts`).

## État et synchronisation

Trois stores Zustand persistés dans `localStorage` : `auth`, `application`, `admin`.
`src/store/sync.ts` écoute l’évènement `storage` et réhydrate le store concerné : quand
le back-office approuve un dossier dans un onglet, l’espace du porteur ouvre sa première
session d’évaluation dans l’autre onglet, sans rechargement.

## Portée de cette maquette

L’interface fonctionne de bout en bout **sans backend**. Ce qui en découle :

- **Comptes** — créés et stockés dans le navigateur. Une adresse contenant `admin` ouvre
  le back-office ; toute autre adresse ouvre l’espace porteur.
- **Pièces jointes** — les métadonnées sont persistées, pas les fichiers. Après un
  rechargement, le visualiseur affiche un état « aperçu indisponible » explicite plutôt
  qu’un cadre vide.
- **Jeu de démonstration** — huit dossiers fictifs alimentent le pipeline
  (`src/data/mockDossiers.ts`), auxquels s’ajoute le dossier réellement déposé.
- **Partenaires & sponsors** — la section `src/components/marketing/Partners.tsx` liste
  des intitulés génériques. Pour afficher un partenaire réel, déposer son logo dans
  `public/images/partners/` et renseigner le champ `logo` de son entrée.

  N'y inscrire qu'une organisation qui **finance ou soutient effectivement** le programme
  et dont l'autorisation d'usage de la marque a été obtenue : un logo institutionnel
  affiché sur cette page vaut affirmation de parrainage auprès des candidats.
- **Visuels** — illustrations vectorielles, à remplacer par les photographies du
  programme (voir « Visuels » plus haut).
- **Blocage 48 h** — un bouton « Débloquer maintenant (démo) », explicitement étiqueté,
  permet de parcourir les trois phases sans attendre.
- **Lien bancaire** — `PARTNER_BANK_URL` dans `src/pages/dashboard/Funding.tsx` pointe
  vers `example.com` et doit être remplacé par le lien d’affiliation réel.

## Déploiement

`vercel.json` fixe le preset `vite`, la commande de build, le dossier de sortie et la
réécriture SPA (toute route non statique est servie par `index.html`), afin que les liens
profonds comme `/dashboard/evaluation` fonctionnent en production.
