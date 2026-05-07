import { useSyncExternalStore } from 'react'
import { createStore } from './main'

export type Invitation = {
  id: string
  fromId: string
  toId: string
  status: 'pending' | 'accepted' | 'declined'
  started?: boolean
}

type GameState = {
  invitations: Invitation[]
}

const gameStore = createStore<GameState>('game_store', {
  invitations: [],
})

export default function useGameStore() {
  const state = useSyncExternalStore(gameStore.subscribe, gameStore.getSnapshot)

  const invite = (fromId: string, toId: string) => {
    const newInv: Invitation = {
      id: crypto.randomUUID(),
      fromId,
      toId,
      status: 'pending',
    }
    gameStore.setState((prev) => ({
      ...prev,
      invitations: [...prev.invitations, newInv],
    }))
    return newInv
  }

  const acceptInvite = (id: string) => {
    gameStore.setState((prev) => ({
      ...prev,
      invitations: prev.invitations.map((i) => (i.id === id ? { ...i, status: 'accepted' } : i)),
    }))
  }

  const declineInvite = (id: string) => {
    gameStore.setState((prev) => ({
      ...prev,
      invitations: prev.invitations.map((i) => (i.id === id ? { ...i, status: 'declined' } : i)),
    }))
  }

  const markStarted = (id: string) => {
    gameStore.setState((prev) => ({
      ...prev,
      invitations: prev.invitations.map((i) => (i.id === id ? { ...i, started: true } : i)),
    }))
  }

  return { ...state, invite, acceptInvite, declineInvite, markStarted }
}
