import { createContext, useContext } from 'react'

interface QueryValue {
  query: string
  setQuery: (value: string) => void
}

export const AdminQueryContext = createContext<QueryValue>({
  query: '',
  setQuery: () => undefined,
})

/** Recherche partagée entre la barre latérale et les listes du back-office. */
export function useAdminQuery() {
  return useContext(AdminQueryContext)
}
