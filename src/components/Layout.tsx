import { Outlet } from 'react-router-dom'
import { Crown } from 'lucide-react'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 shadow-sm z-10">
        <div className="flex items-center gap-3 text-indigo-400">
          <Crown className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tight text-slate-100">Xadrez Offline</h1>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
