import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import useGameStore from '@/stores/useGameStore'
import useAuthStore from '@/stores/useAuthStore'

export function InvitationNotifier() {
  const { invitations, acceptInvite, declineInvite, markStarted } = useGameStore()
  const { currentUser, users } = useAuthStore()
  const navigate = useNavigate()
  const notified = useRef(new Set<string>())

  useEffect(() => {
    if (!currentUser) return

    const myPending = invitations.filter((i) => i.toId === currentUser.id && i.status === 'pending')

    myPending.forEach((inv) => {
      if (!notified.current.has(inv.id)) {
        notified.current.add(inv.id)
        const fromUser = users.find((u) => u.id === inv.fromId)

        toast(`Game Invitation`, {
          description: `${fromUser?.username || 'A player'} invited you to play a match!`,
          action: {
            label: 'Accept',
            onClick: () => {
              acceptInvite(inv.id)
              toast.success('Invitation accepted!')
            },
          },
          cancel: {
            label: 'Decline',
            onClick: () => declineInvite(inv.id),
          },
          duration: Number.POSITIVE_INFINITY,
          id: inv.id,
        })
      }
    })

    const myAccepted = invitations.filter(
      (i) =>
        (i.toId === currentUser.id || i.fromId === currentUser.id) &&
        i.status === 'accepted' &&
        !i.started,
    )

    if (myAccepted.length > 0) {
      const inv = myAccepted[0]
      markStarted(inv.id)
      toast.dismiss(inv.id)
      if (inv.fromId === currentUser.id) {
        toast.success('Invitation accepted! Game starting...')
      }
      navigate('/')
    }
  }, [invitations, currentUser, users, navigate, acceptInvite, declineInvite, markStarted])

  return null
}
