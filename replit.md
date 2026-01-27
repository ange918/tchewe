# TCHÉ WÊ — Collection AFFIN

## Overview
A luxury fashion website for the TCHÉ WÊ brand, showcasing the AFFIN collection. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4. Features an editorial, museum-like design with strong African cultural identity.

## Tech Stack
- **Framework**: Next.js 16.1.5 (App Router)
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5
- **Fonts**: Playfair Display (serif) + Inter (sans-serif)

## Design System
- **Colors**:
  - Primary Black: #0B0B0B
  - Primary Gold: #C9A24D
  - Light Gold: #E6C77A
  - Grey Text: #B5B5B5
- **Typography**: Playfair Display for titles, Inter for body text
- **Visual Style**: Luxury, editorial, couture, museum-like

## Project Structure
```
src/
  app/
    layout.tsx          - Root layout with Header/Footer
    page.tsx            - Home page (Hero, About, Collection, Contact)
    globals.css         - Global styles and design tokens
    tenues/
      [slug]/
        page.tsx        - Dynamic outfit detail page
  components/
    Header.tsx          - Sticky header with logo and social icons
    Footer.tsx          - Minimal footer
    OutfitCard.tsx      - Collection grid card component
    SocialIcons.tsx     - Social media icons component
    index.ts            - Component exports
  data/
    tenues.ts           - 25 outfit data with descriptions and materials
public/
  images/               - Outfit images (placeholder ready)
```

## Pages
- `/` - Home page with Hero, About, Collection (25 outfits), and Contact sections
- `/tenues/[slug]` - Individual outfit detail pages with description and materials

## Running the Application
- **Development**: `npm run dev` (runs on http://0.0.0.0:5000)
- **Build**: `npm run build`
- **Production**: `npm run start` (runs on http://0.0.0.0:5000)
- **Lint**: `npm run lint`

## Configuration
- Next.js configured to allow Replit dev origins for proxy compatibility
- Server binds to 0.0.0.0:5000 for external access
- Static generation enabled for outfit detail pages

## Recent Changes
- 2026-01-27: Initial build of luxury fashion website with full AFFIN collection
