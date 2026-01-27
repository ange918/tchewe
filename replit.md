# My Marketing App

## Overview
A Next.js 16 marketing application built with React 19, TypeScript, and Tailwind CSS 4.

## Tech Stack
- **Framework**: Next.js 16.1.5 (App Router)
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5

## Project Structure
```
src/
  app/
    layout.tsx    - Root layout component
    page.tsx      - Home page
    globals.css   - Global styles
    favicon.ico   - App favicon
public/           - Static assets
```

## Running the Application
- **Development**: `npm run dev` (runs on http://0.0.0.0:5000)
- **Build**: `npm run build`
- **Production**: `npm run start` (runs on http://0.0.0.0:5000)
- **Lint**: `npm run lint`

## Configuration
- Next.js configured to allow all dev origins for Replit proxy compatibility
- Server binds to 0.0.0.0:5000 for external access
