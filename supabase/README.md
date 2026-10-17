# Base de données

Le schéma de `innova-fund`, migration par migration. Les fichiers de
`migrations/` sont exportés depuis le projet Supabase et correspondent
exactement à ce qui y est appliqué (vérifié par somme de contrôle), à une
exception près, décrite ci-dessous.

## Le contenu du QCM n'est pas ici

`20261017221343_seed_quiz_bank.sql` ne contient pas les questions. Ce dépôt est
public : publier les 30 énoncés avec leur `answer_index` reviendrait à publier
le corrigé, et annulerait l'intérêt d'avoir déplacé la correction côté serveur.
Les questions sont chargées directement en base. Le fichier décrit la forme
attendue pour alimenter un nouvel environnement.

## Appliquer le schéma à un nouveau projet

```bash
npx supabase link --project-ref <ref>
npx supabase db push
```

Puis insérer la banque de questions, et promouvoir un premier administrateur —
le trigger d'inscription force `candidate`, donc la promotion ne peut venir que
d'ici :

```sql
update public.profiles set role = 'admin' where email = 'vous@exemple.fr';
```

## Régénérer les types TypeScript

```bash
npx supabase gen types typescript --project-id <ref> > ../src/lib/database.types.ts
```

Le fichier généré doit garder ses déclarations en `type` (et non `interface`) et
son bloc `__InternalSupabase`, sans quoi les types `Insert` du client se
résolvent en `never`.
