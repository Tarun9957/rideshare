"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthState } from 'react-firebase-hooks/auth'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Car, Mail, Lock, Loader2, User } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [user, loading] = useAuthState(auth)
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleAuth = async () => {
    if (!email.trim()) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    if (!password.trim() || password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      })
      return
    }

    setAuthLoading(true)

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
        toast({
          title: "Account Created Successfully! 🎉",
          description: "Welcome to RideShare!",
        })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
        toast({
          title: "Welcome Back! 👋",
          description: "You've successfully signed in.",
        })
      }
      
      router.push("/")
    } catch (error: any) {
      console.error("Auth error:", error)
      
      if (error.code === 'auth/user-not-found') {
        toast({
          title: "Account Not Found",
          description: "No account found with this email. Try signing up instead.",
          variant: "destructive",
        })
      } else if (error.code === 'auth/wrong-password') {
        toast({
          title: "Incorrect Password",
          description: "Please check your password and try again.",
          variant: "destructive",
        })
      } else if (error.code === 'auth/email-already-in-use') {
        toast({
          title: "Email Already in Use",
          description: "An account with this email already exists. Try signing in instead.",
          variant: "destructive",
        })
      } else if (error.code === 'auth/weak-password') {
        toast({
          title: "Weak Password",
          description: "Password should be at least 6 characters long.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Authentication Error",
          description: `Failed to ${isSignUp ? 'sign up' : 'sign in'}. Please try again.`,
          variant: "destructive",
        })
      }
    } finally {
      setAuthLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setEmail("demo@rideshare.com")
    setPassword("demo123")
    setAuthLoading(true)

    try {
      // Try to sign in with demo account, create if doesn't exist
      try {
        await signInWithEmailAndPassword(auth, "demo@rideshare.com", "demo123")
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          await createUserWithEmailAndPassword(auth, "demo@rideshare.com", "demo123")
        } else {
          throw error
        }
      }
      
      toast({
        title: "Demo Mode Activated! 🚗",
        description: "Welcome to the RideShare demo experience.",
      })
      
      router.push("/")
    } catch (error) {
      console.error("Demo login error:", error)
      toast({
        title: "Demo Login Failed",
        description: "Unable to access demo mode. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAuthLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to home
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Car className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-600">
              {isSignUp ? 'Join RideShare today' : 'Sign in to your RideShare account'}
            </p>
          </div>

          {/* Auth Form */}
          <Card className="card-glass border-0 shadow-xl p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 py-3 border-gray-200 focus:ring-blue-500 focus:border-blue-500 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder={isSignUp ? "Create a password (6+ characters)" : "Enter your password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                    className="pl-12 py-3 border-gray-200 focus:ring-blue-500 focus:border-blue-500 rounded-xl"
                  />
                </div>
              </div>

              <Button
                onClick={handleAuth}
                disabled={authLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-3 text-lg font-semibold rounded-xl shadow-lg transition-all"
              >
                {authLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    {isSignUp ? 'Creating Account...' : 'Signing in...'}
                  </>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </Button>

              <div className="text-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm"
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Demo Option */}
          <div className="mt-8">
            <div className="text-center mb-4">
              <span className="text-gray-500 text-sm">Or try the demo</span>
            </div>
            
            <Button 
              onClick={handleDemoLogin}
              disabled={authLoading}
              variant="outline" 
              className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 py-3 text-lg font-semibold rounded-xl"
            >
              <User className="h-5 w-5 mr-2" />
              {authLoading ? 'Loading Demo...' : 'Try Demo Account'}
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-xs text-gray-500 opacity-80">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
