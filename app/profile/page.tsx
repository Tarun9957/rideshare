"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Star,
  Settings,
  CreditCard,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  User,
  Home,
  History,
  Moon,
  Globe,
  Phone,
  Mail,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

export default function ProfilePage() {
  const { user, signOut } = useAuth()

  if (!user) return null

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Profile</h1>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-4 space-y-6">
        {/* Profile Header */}
        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.avatar || "/placeholder.svg?height=80&width=80"} />
              <AvatarFallback className="text-xl">
                {user.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user.name || "User"}</h2>
              <p className="text-gray-400">{user.phone}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-semibold">{user.rating.toFixed(1)}</span>
                </div>
                <Badge variant="secondary">{user.totalRides} rides</Badge>
                {user.isVerified && <Badge className="bg-green-600">Verified</Badge>}
              </div>
            </div>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">Edit Profile</Button>
        </Card>

        {/* Account Settings */}
        <Card className="bg-gray-800 border-gray-700 p-4">
          <h3 className="font-semibold mb-4">Account</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Phone Number</p>
                  <p className="text-sm text-gray-400">{user.phone}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-gray-400">{user.email || "Not added"}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <span className="font-medium">Payment Methods</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="bg-gray-800 border-gray-700 p-4">
          <h3 className="font-semibold mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-gray-400" />
                <span className="font-medium">Push Notifications</span>
              </div>
              <Switch defaultChecked={user.preferences.notifications} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Moon className="h-5 w-5 text-gray-400" />
                <span className="font-medium">Dark Mode</span>
              </div>
              <Switch defaultChecked={user.preferences.darkMode} />
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Language</p>
                  <p className="text-sm text-gray-400">English</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </Card>

        {/* Support & Legal */}
        <Card className="bg-gray-800 border-gray-700 p-4">
          <h3 className="font-semibold mb-4">Support & Legal</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <HelpCircle className="h-5 w-5 text-gray-400" />
                <span className="font-medium">Help Center</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <span className="font-medium">Safety</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5 text-gray-400" />
                <span className="font-medium">Privacy Policy</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5 text-gray-400" />
                <span className="font-medium">Terms of Service</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </Card>

        {/* Sign Out */}
        <Card className="bg-gray-800 border-gray-700 p-4">
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </Card>

        {/* App Info */}
        <div className="text-center text-gray-500 text-sm pb-6">
          <p>RideShare v1.0.0</p>
          <p>© 2024 RideShare Inc.</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
        <div className="flex justify-around py-3">
          <Link href="/">
            <Button variant="ghost" className="flex flex-col items-center space-y-1 text-gray-400">
              <Home className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Button>
          </Link>
          <Link href="/history">
            <Button variant="ghost" className="flex flex-col items-center space-y-1 text-gray-400">
              <History className="h-5 w-5" />
              <span className="text-xs">Rides</span>
            </Button>
          </Link>
          <Link href="/wallet">
            <Button variant="ghost" className="flex flex-col items-center space-y-1 text-gray-400">
              <CreditCard className="h-5 w-5" />
              <span className="text-xs">Wallet</span>
            </Button>
          </Link>
          <Button variant="ghost" className="flex flex-col items-center space-y-1 text-blue-400">
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
