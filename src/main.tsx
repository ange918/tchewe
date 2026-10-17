import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/plus-jakarta-sans'
import App from './App.tsx'
import { useAuth } from './store/auth'
import './index.css'

// Relit la session en cours et suit les connexions/déconnexions, y compris
// celles faites dans un autre onglet.
useAuth.getState().initialize()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
