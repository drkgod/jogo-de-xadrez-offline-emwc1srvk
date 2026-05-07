import { useSyncExternalStore } from 'react'
import { createStore } from './main'

export type User = {
  id: string
  username: string
  email: string
  password?: string
  isAdmin: boolean
  registeredAt: string
}

type AuthState = {
  users: User[]
  currentUser: User | null
}

const initialUsers: User[] = [
  {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@xadrez.com',
    password: 'admin',
    isAdmin: true,
    registeredAt: new Date().toISOString(),
  },
]

const authStore = createStore<AuthState>('auth_store', {
  users: initialUsers,
  currentUser: null,
})

export default function useAuthStore() {
  const state = useSyncExternalStore(authStore.subscribe, authStore.getSnapshot)

  const register = (user: Omit<User, 'id' | 'isAdmin' | 'registeredAt'>) => {
    const { users } = authStore.getSnapshot()
    if (users.some((u) => u.email === user.email)) {
      return false
    }
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      isAdmin: false,
      registeredAt: new Date().toISOString(),
    }
    authStore.setState((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
    }))
    return true
  }

  const login = (email: string, password?: string) => {
    const { users } = authStore.getSnapshot()
    const user = users.find((u) => u.email === email && u.password === password)
    if (user) {
      authStore.setState((prev) => ({ ...prev, currentUser: user }))
      return true
    }
    return false
  }

  const logout = () => {
    authStore.setState((prev) => ({ ...prev, currentUser: null }))
  }

  return { ...state, register, login, logout }
}
