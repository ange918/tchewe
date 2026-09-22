import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 px-6 text-slate-100">
      <h1 className="text-4xl font-semibold tracking-tight">Tchewe</h1>
      <p className="text-slate-400">React + TypeScript + Vite + Tailwind CSS</p>
      <button
        type="button"
        onClick={() => setCount((value) => value + 1)}
        className="rounded-md bg-indigo-500 px-4 py-2 font-medium transition hover:bg-indigo-400"
      >
        Compteur : {count}
      </button>
    </main>
  )
}

export default App
