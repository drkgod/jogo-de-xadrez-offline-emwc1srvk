import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Crown, LogOut, LayoutDashboard, Users, UserRoundPlus } from 'lucide-react'
import useAuthStore from '@/stores/useAuthStore'
import { Button } from '@/components/ui/button'
import { InvitationNotifier } from '@/components/InvitationNotifier'

export default function Layout() {
  const { currentUser, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <InvitationNotifier />
      <header className="flex flex-col md:flex-row items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 shadow-sm z-10 gap-4 md:gap-0">
        <Link
          to="/"
          className="flex items-center gap-3 text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <Crown className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tight text-slate-100">Xadrez Offline</h1>
        </Link>

        <nav className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
          {currentUser ? (
            <>
              <Link
                to="/"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Board
              </Link>
              <Link
                to="/lobby"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <Users className="w-4 h-4" /> Lobby
              </Link>
              {currentUser.isAdmin && (
                <Link
                  to="/admin"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" /> Admin Panel
                </Link>
              )}
              <div className="flex items-center gap-4 ml-2 md:ml-4 pl-2 md:pl-4 border-l border-slate-700">
                <span className="text-sm text-slate-400 hidden sm:inline">
                  Welcome, <strong className="text-slate-200">{currentUser.username}</strong>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-slate-700 hover:bg-slate-800 text-slate-300"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <UserRoundPlus className="w-4 h-4 mr-2" /> Sign Up
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </header>
      <main className="flex-1 bg-slate-950">
        <Outlet />
      </main>
    </div>
  )
}
