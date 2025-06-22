'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  MapPin, 
  Car, 
  CreditCard, 
  History
} from 'lucide-react'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RideShare
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/wallet')}
                className="border-gray-200 hover:bg-gray-50"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Wallet
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name || 'Rider'}! 👋
          </h2>
          <p className="text-gray-600">Ready for your next adventure?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Button
            onClick={() => router.push('/search')}
            className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-6 rounded-2xl shadow-xl transition-all transform hover:scale-105"
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg">Book a Ride</p>
                <p className="text-sm opacity-90">Find your destination</p>
              </div>
            </div>
          </Button>

          <Button
            onClick={() => router.push('/history')}
            variant="outline"
            className="h-32 border-2 border-gray-200 hover:border-gray-300 p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <History className="w-6 h-6 text-gray-600" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg text-gray-900">Trip History</p>
                <p className="text-sm text-gray-600">View past rides</p>
              </div>
            </div>
          </Button>

          <Button
            onClick={() => router.push('/wallet')}
            variant="outline"
            className="h-32 border-2 border-gray-200 hover:border-gray-300 p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-gray-600" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg text-gray-900">My Wallet</p>
                <p className="text-sm text-gray-600">Manage payments</p>
              </div>
            </div>
          </Button>
        </div>

        {/* Welcome Card */}
        <Card className="p-8 shadow-xl border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Welcome to RideShare!</h3>
            <p className="text-blue-100 mb-6">
              Experience premium rides with professional drivers and seamless payments.
            </p>
            <Button
              onClick={() => router.push('/search')}
              variant="outline"
              className="bg-white text-blue-600 hover:bg-gray-100 border-white"
            >
              Book Your First Ride
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
