import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import useAuthStore from '@/stores/useAuthStore'
import useGameStore from '@/stores/useGameStore'
import { Swords, UserCircle2, Clock } from 'lucide-react'

export default function Lobby() {
  const { users, currentUser } = useAuthStore()
  const { invite, invitations } = useGameStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
    }
  }, [currentUser, navigate])

  if (!currentUser) return null

  const otherUsers = users.filter((u) => u.id !== currentUser.id)

  const handleInvite = (toId: string) => {
    invite(currentUser.id, toId)
    toast.success('Invitation sent!')
  }

  const getInviteStatus = (toId: string) => {
    const recentInvite = invitations
      .filter((i) => i.fromId === currentUser.id && i.toId === toId)
      .pop()

    return recentInvite?.status
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-100 tracking-tight">Player Lobby</h2>
        <p className="text-slate-400 mt-2">
          Find other registered players and invite them to a match.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherUsers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
            No other players are currently registered.
          </div>
        ) : (
          otherUsers.map((user) => {
            const status = getInviteStatus(user.id)
            const isPending = status === 'pending'
            const isDeclined = status === 'declined'

            return (
              <Card
                key={user.id}
                className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors"
              >
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  <div className="bg-indigo-500/20 p-3 rounded-full text-indigo-400">
                    <UserCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-200">{user.username}</CardTitle>
                    <CardDescription className="text-slate-400 text-sm">
                      Joined {new Date(user.registeredAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleInvite(user.id)}
                    disabled={isPending}
                    variant={isPending ? 'secondary' : 'default'}
                    className={`w-full ${!isPending ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'}`}
                  >
                    {isPending ? (
                      <>
                        <Clock className="w-4 h-4 mr-2" /> Invite Sent
                      </>
                    ) : isDeclined ? (
                      <>
                        <Swords className="w-4 h-4 mr-2" /> Invite Again
                      </>
                    ) : (
                      <>
                        <Swords className="w-4 h-4 mr-2" /> Invite to Play
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
