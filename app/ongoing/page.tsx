"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc, updateDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { 
  Phone, 
  MessageCircle, 
  Shield, 
  Share, 
  MapPin, 
  Navigation, 
  Star,
  Timer,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Car
} from "lucide-react"
import Link from "next/link"
import Map from "@/components/Map"

interface Trip {
  id: string
  from: string
  to: string
  distance: number
  estimatedTime: number
  rideType: string
  paymentMethod: string
  fare: number
  status: string
  driver?: {
    name: string
    photo?: string
    rating: number
    phone: string
    car: {
      model: string
      color: string
      licensePlate: string
    }
  }
  createdAt: Date
}

function OngoingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, loading] = useAuthState(auth)
  const { toast } = useToast()
  
  const [trip, setTrip] = useState<Trip | null>(null)
  const [tripLoading, setTripLoading] = useState(true)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [completing, setCompleting] = useState(false)

  const tripId = searchParams.get('tripId')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (tripId && user) {
      fetchTripDetails()
    } else if (!tripId) {
      router.push('/')
    }
  }, [user, loading, tripId, router])

  useEffect(() => {
    // Timer for trip duration
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const fetchTripDetails = async () => {
    if (!tripId || !user) return

    try {
      setTripLoading(true)
      const tripDoc = await getDoc(doc(db, 'trips', tripId))
      
      if (tripDoc.exists()) {
        const data = tripDoc.data()
        
        // Assign a random driver if not already assigned
        if (!data.driver) {
          const driversCollection = collection(db, "drivers");
          const driversSnapshot = await getDocs(driversCollection);
          const drivers = driversSnapshot.docs.map(doc => doc.data());
          const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];

          await updateDoc(doc(db, 'trips', tripId), {
            driver: randomDriver,
            status: 'driver_assigned',
            updatedAt: serverTimestamp()
          })
        }

        setTrip({
          id: tripDoc.id,
          from: data.from,
          to: data.to,
          distance: data.distance,
          estimatedTime: data.estimatedTime,
          rideType: data.rideType,
          paymentMethod: data.paymentMethod,
          fare: data.fare,
          status: data.status,
          driver: data.driver || {
            name: "Michael Johnson",
            photo: "/placeholder-user.jpg",
            rating: 4.9,
            phone: "+1 (555) 123-4567",
            car: {
              model: "Toyota Camry",
              color: "Silver",
              licensePlate: "ABC-123"
            }
          },
          createdAt: data.createdAt?.toDate() || new Date()
        })
      } else {
        toast({
          title: "Trip not found",
          description: "The requested trip could not be found.",
          variant: "destructive",
        })
        router.push('/')
      }
    } catch (error) {
      console.error('Error fetching trip details:', error)
      toast({
        title: "Error",
        description: "Failed to load trip details.",
        variant: "destructive",
      })
    } finally {
      setTripLoading(false)
    }
  }

  const handleCompleteTrip = async () => {
    if (!trip || !user) return

    try {
      setCompleting(true)
      
      await updateDoc(doc(db, 'trips', trip.id), {
        status: 'completed',
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      toast({
        title: "Trip Completed! 🎉",
        description: "Thank you for riding with us.",
      })

      router.push('/history')
    } catch (error) {
      console.error('Error completing trip:', error)
      toast({
        title: "Error",
        description: "Failed to complete trip.",
        variant: "destructive",
      })
    } finally {
      setCompleting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getRemainingTime = () => {
    if (!trip) return 0
    const elapsed = Math.floor(timeElapsed / 60)
    return Math.max(0, trip.estimatedTime - elapsed)
  }

  if (loading || tripLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !trip) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="p-4 pt-12">
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900">Trip in Progress</h1>
            <p className="text-sm text-gray-600">Enjoy your ride</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* Trip Status */}
        <Card className="card-glass border-0 bg-green-50/80 border-green-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Navigation className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">En route to destination</p>
                <p className="text-sm text-green-700">{getRemainingTime()} minutes remaining</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-green-600">{getRemainingTime()}</p>
              <p className="text-xs text-green-600 font-medium">MIN</p>
            </div>
          </div>
        </Card>

        <Map pickup={trip.from} destination={trip.to} />

        {/* Driver Info */}
        <Card className="card-glass border-0 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={trip.driver?.photo} />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg">
                  {trip.driver?.name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{trip.driver?.name}</h3>
                <div className="flex items-center space-x-2 mb-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{trip.driver?.rating}</span>
                  <Badge variant="outline" className="text-xs">Verified</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {trip.driver?.car.color} {trip.driver?.car.model} • {trip.driver?.car.licensePlate}
                </p>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Button size="sm" variant="outline" className="border-gray-200">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button size="sm" variant="outline" className="border-gray-200">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </Button>
            </div>
          </div>
        </Card>

        {/* Trip Details */}
        <Card className="card-glass border-0 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Trip Details</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Distance remaining</span>
              <span className="font-semibold">{(trip.distance * 0.7).toFixed(1)} km</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Estimated fare</span>
              <span className="font-semibold text-green-600">${trip.fare.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Payment method</span>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <span className="font-semibold">
                  {trip.paymentMethod === 'card' ? 'Credit Card ****1234' : 
                   trip.paymentMethod === 'wallet' ? 'Digital Wallet' : 'Cash'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Trip time</span>
              <div className="flex items-center space-x-2">
                <Timer className="h-4 w-4 text-gray-500" />
                <span className="font-semibold">{formatTime(timeElapsed)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Route Info */}
        <Card className="card-glass border-0 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Route</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                <MapPin className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">From</p>
                <p className="text-sm text-gray-600">{trip.from}</p>
              </div>
            </div>
            
            <div className="ml-4 border-l-2 border-gray-200 h-6"></div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mt-1">
                <Navigation className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">To</p>
                <p className="text-sm text-gray-600">{trip.to}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Safety & Actions */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 py-4 flex flex-col space-y-1">
              <Share className="h-5 w-5" />
              <span className="text-xs">Share Trip</span>
            </Button>
            <Button variant="outline" className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 py-4 flex flex-col space-y-1">
              <Shield className="h-5 w-5" />
              <span className="text-xs">Safety</span>
            </Button>
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 py-4 flex flex-col space-y-1">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-xs">Emergency</span>
            </Button>
          </div>

          <Button
            onClick={handleCompleteTrip}
            disabled={completing}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg"
          >
            {completing ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Completing Trip...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Complete Trip</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function OngoingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    }>
      <OngoingContent />
    </Suspense>
  )
}
