import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import useAuthStore from '@/stores/useAuthStore'
import { Crown, UserPlus } from 'lucide-react'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { register, currentUser } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) {
      navigate('/lobby')
    }
  }, [currentUser, navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    const success = register({ username, email, password })
    if (success) {
      toast.success('Account created successfully! Please log in.')
      navigate('/login')
    } else {
      toast.error('An account with this email already exists')
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl">
        <CardHeader className="space-y-3">
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2 text-indigo-400">
            <Crown className="w-8 h-8" />
          </CardTitle>
          <CardTitle className="text-2xl text-center text-slate-100">Create an Account</CardTitle>
          <CardDescription className="text-center text-slate-400">
            Join the community and play with others
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-300">
                Username
              </Label>
              <Input
                id="username"
                placeholder="chessmaster99"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="player@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-200"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              <UserPlus className="w-4 h-4 mr-2" /> Sign Up
            </Button>
            <p className="text-sm text-slate-400 text-center">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
              >
                Log in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
