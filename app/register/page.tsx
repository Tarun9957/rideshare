"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Car, User, Mail, Lock, Phone, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const { signUpWithEmail } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSignUp = async () => {
    if (!formData.name.trim()) {
      setError("Please enter your full name")
      return
    }

    if (!formData.email.trim()) {
      setError("Please enter a valid email address")
      return
    }

    if (!formData.password.trim()) {
      setError("Please enter a password")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      return
    }

    setLoading(true)
    setError("")

    try {
      await signUpWithEmail(formData.email, formData.password, formData.name, formData.phone)
      router.push("/")
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError("Email address is already registered. Please sign in instead.")
      } else if (error.code === 'auth/invalid-email') {
        setError("Invalid email address format.")
      } else if (error.code === 'auth/weak-password') {
        setError("Password is too weak. Please choose a stronger password.")
      } else {
        setError("Failed to create account. Please try again.")
      }
      console.error("Sign up error:", error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 relative">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link href="/login">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 mr-4">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Create Account</h1>
              <p className="text-purple-100">Join RideShare Pro today</p>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/20 mx-auto mb-4">
              <Car className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Welcome to the Future</h2>
            <p className="text-purple-100 text-sm">Create your account to get started</p>
          </div>

          {/* Registration Form */}
          <Card className="glass-effect border-white/20 shadow-2xl p-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-12 py-3 bg-white/10 border-white/20 text-white placeholder-gray-300 focus:border-white/40 focus:bg-white/15 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-12 py-3 bg-white/10 border-white/20 text-white placeholder-gray-300 focus:border-white/40 focus:bg-white/15 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="pl-12 py-3 bg-white/10 border-white/20 text-white placeholder-gray-300 focus:border-white/40 focus:bg-white/15 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-12 py-3 bg-white/10 border-white/20 text-white placeholder-gray-300 focus:border-white/40 focus:bg-white/15 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-12 py-3 bg-white/10 border-white/20 text-white placeholder-gray-300 focus:border-white/40 focus:bg-white/15 rounded-xl"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
                  <p className="text-red-200 text-sm text-center">{error}</p>
                </div>
              )}

              <Button
                onClick={handleSignUp}
                disabled={loading}
                className="w-full bg-white text-purple-600 hover:bg-purple-50 disabled:opacity-50 py-3 text-lg font-semibold rounded-xl shadow-lg transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-purple-100 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-white hover:underline font-medium">
                Sign in
              </Link>
            </p>
            <p className="text-xs text-purple-200 mt-4 opacity-80">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
