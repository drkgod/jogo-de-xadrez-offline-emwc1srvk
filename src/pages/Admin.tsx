import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import useAuthStore from '@/stores/useAuthStore'
import { ShieldAlert, Users } from 'lucide-react'

export default function Admin() {
  const { users, currentUser } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
    } else if (!currentUser.isAdmin) {
      navigate('/lobby')
    }
  }, [currentUser, navigate])

  if (!currentUser?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 space-y-4">
        <ShieldAlert className="w-16 h-16 text-red-500/50" />
        <h2 className="text-2xl font-semibold">Access Denied</h2>
        <p>You need administrator privileges to view this page.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-indigo-400" />
          Admin Dashboard
        </h2>
        <p className="text-slate-400 mt-2">Manage and view all registered users in the system.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-200">
            <Users className="w-5 h-5" /> Registered Users
          </CardTitle>
          <CardDescription className="text-slate-400">
            A complete list of all users currently registered in the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-800 overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-950/50">
                <TableRow className="border-slate-800 hover:bg-slate-950/50">
                  <TableHead className="text-slate-400 font-medium">Username</TableHead>
                  <TableHead className="text-slate-400 font-medium">Email</TableHead>
                  <TableHead className="text-slate-400 font-medium">Role</TableHead>
                  <TableHead className="text-slate-400 font-medium text-right">
                    Registration Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="font-medium text-slate-200">{user.username}</TableCell>
                    <TableCell className="text-slate-400">{user.email}</TableCell>
                    <TableCell>
                      {user.isAdmin ? (
                        <Badge className="bg-indigo-500/20 text-indigo-300 border-none hover:bg-indigo-500/30">
                          Admin
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-slate-800 text-slate-400 border-none"
                        >
                          Player
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-slate-400">
                      {new Date(user.registeredAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
