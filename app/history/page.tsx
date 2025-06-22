"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthState } from 'react-firebase-hooks/auth'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  ArrowLeft, 
  Clock, 
  Star, 
  CreditCard, 
  History, 
  MapPin,
  Navigation,
  Calendar,
  TrendingUp,
  Activity,
  DollarSign,
  Filter
} from "lucide-react"
import Link from "next/link"

interface Trip {
  id: string
  from: string
  to: string
  date: Date
  fare: number
  status: 'completed' | 'cancelled' | 'ongoing'
  rideType: string
  paymentMethod: string
  rating?: number
  driver?: {
    name: string
    photo?: string
    rating: number
  }
  duration?: number
}

interface UserStats {
  totalTrips: number
  totalSpent: number
  averageRating: number
  favoriteDestination: string
}

export default function HistoryPage() {
  const router = useRouter()
  const [user, loading] = useAuthState(auth)
  const [trips, setTrips] = useState<Trip[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [tripsLoading, setTripsLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      fetchTrips()
      fetchUserStats()
    }
  }, [user, loading, router])

  const fetchTrips = async () => {
    if (!user) return

    try {
      setTripsLoading(true)
      const tripsQuery = query(
        collection(db, 'trips'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
      
      const snapshot = await getDocs(tripsQuery)
      const tripsData: Trip[] = []
      
      snapshot.forEach((doc) => {
        const data = doc.data()
        tripsData.push({
          id: doc.id,
          from: data.from || 'Unknown Location',
          to: data.to || 'Unknown Destination',
          date: data.createdAt?.toDate() || new Date(),
          fare: data.fare || 0,
          status: data.status || 'completed',
          rideType: data.rideType || 'economy',
          paymentMethod: data.paymentMethod || 'card',
          rating: data.rating,
          driver: data.driver,
          duration: data.duration
        })
      })
      
      setTrips(tripsData)
    } catch (error) {
      console.error('Error fetching trips:', error)
      setTrips([])
    } finally {
      setTripsLoading(false)
    }
  }

  const fetchUserStats = async () => {
    if (!user) return

    try {
      setStatsLoading(true)
      
      const allTripsQuery = query(
        collection(db, 'trips'),
        where('userId', '==', user.uid),
        where('status', '==', 'completed')
      )
      
      const allTripsSnapshot = await getDocs(allTripsQuery)
      let totalSpent = 0
      let totalRating = 0
      let ratedTrips = 0
      const destinations: { [key: string]: number } = {}
      
      allTripsSnapshot.forEach((doc) => {
        const data = doc.data()
        totalSpent += data.fare || 0
        
        if (data.rating) {
          totalRating += data.rating
          ratedTrips++
        }
        
        if (data.to) {
          destinations[data.to] = (destinations[data.to] || 0) + 1
        }
      })
      
      const favoriteDestination = Object.keys(destinations).reduce((a, b) => 
        destinations[a] > destinations[b] ? a : b, 'None'
      )
      
      setUserStats({
        totalTrips: allTripsSnapshot.size,
        totalSpent,
        averageRating: ratedTrips > 0 ? totalRating / ratedTrips : 0,
        favoriteDestination: Object.keys(destinations).length > 0 ? favoriteDestination : 'None'
      })
    } catch (error) {
      console.error('Error fetching user stats:', error)
      setUserStats({
        totalTrips: 0,
        totalSpent: 0,
        averageRating: 0,
        favoriteDestination: 'None'
      })
    } finally {
      setStatsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-700 border-green-200'
      case 'ongoing':
        return 'bg-blue-500/10 text-blue-700 border-blue-200'
      case 'cancelled':
        return 'bg-red-500/10 text-red-700 border-red-200'
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    } else if (diffDays === 2) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const filteredTrips = trips.filter(trip => {
    if (filter === 'all') return true
    return trip.status === filter
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900">Ride History</h1>
            <p className="text-sm text-gray-600">Your trip journey</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-glass border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Trips</p>
                  {statsLoading ? (
                    <Skeleton className="h-6 w-12" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{userStats?.totalTrips || 0}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  {statsLoading ? (
                    <Skeleton className="h-6 w-16" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(userStats?.totalSpent || 0)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                  {statsLoading ? (
                    <Skeleton className="h-6 w-12" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">
                      {userStats?.averageRating ? userStats.averageRating.toFixed(1) : 'N/A'}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Favorite</p>
                  {statsLoading ? (
                    <Skeleton className="h-6 w-16" />
                  ) : (
                    <p className="text-lg font-bold text-gray-900 truncate">
                      {userStats?.favoriteDestination?.split(',')[0] || 'None'}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Card className="card-glass border-0 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Trip History</h2>
            <div className="flex space-x-2">
              {['all', 'completed', 'cancelled'].map((filterOption) => (
                <Button
                  key={filterOption}
                  variant={filter === filterOption ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(filterOption as any)}
                  className={filter === filterOption ? "bg-blue-600 hover:bg-blue-700" : "border-gray-200"}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Trip List */}
          {tripsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'No trips yet' : `No ${filter} trips`}
              </h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' 
                  ? 'Start your journey with us today!'
                  : `You don't have any ${filter} trips.`
                }
              </p>
              {filter === 'all' && (
                <Button onClick={() => router.push('/search')}>
                  Book Your First Ride
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTrips.map((trip) => (
                <div key={trip.id} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{formatDate(trip.date)}</span>
                      </div>
                      <Badge variant="outline" className={getStatusColor(trip.status)}>
                        {trip.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-sm font-medium text-gray-900 truncate">{trip.from}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <p className="text-sm text-gray-600 truncate">{trip.to}</p>
                      </div>
                    </div>
                    
                    {trip.driver && (
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-gray-500">Driver: {trip.driver.name}</span>
                        {trip.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-gray-500">{trip.rating}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900">
                      {formatCurrency(trip.fare)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{trip.rideType}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
