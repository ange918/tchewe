# Tchewe

Application React construite avec Vite, TypeScript et Tailwind CSS.

## Prérequis

- Node.js 20+
- npm

## Démarrage

```bash
npm install
npm run dev
```

Le serveur de développement écoute sur http://localhost:5173 (exposé sur le réseau local via `host: true`).

## Scripts

| Commande | Description |
| --- | --- |
| `npm run dev` | Démarre le serveur de développement Vite |
| `npm run build` | Vérifie les types (`tsc -b`) puis génère le build de production dans `dist/` |
| `npm run preview` | Sert localement le build de production |
| `npm run lint` | Analyse le code avec oxlint |

## Structure

```
index.html        Point d'entrée HTML
public/           Fichiers statiques servis tels quels
src/main.tsx      Montage de l'application React
src/App.tsx       Composant racine
src/index.css     Import de Tailwind CSS
```
