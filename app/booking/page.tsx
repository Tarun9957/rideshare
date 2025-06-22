"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthState } from 'react-firebase-hooks/auth'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  Clock, 
  Calendar, 
  Users, 
  CreditCard,
  Star,
  Car,
  Zap,
  DollarSign,
  Shield,
  Timer,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import Link from "next/link"

// Mock data for ride types
const rideTypes = [
  {
    id: "economy",
    name: "Economy",
    icon: <Car className="h-6 w-6" />,
    time: "3-5 min",
    basePrice: 8.50,
    pricePerKm: 1.2,
    capacity: "4 seats",
    description: "Affordable rides for everyday travel",
    features: ["Standard vehicle", "Friendly drivers", "GPS tracking"]
  },
  {
    id: "premium",
    name: "Premium",
    icon: <Zap className="h-6 w-6" />,
    time: "2-4 min",
    basePrice: 15.00,
    pricePerKm: 2.1,
    capacity: "4 seats",
    description: "High-end vehicles with premium service",
    features: ["Luxury vehicle", "Professional drivers", "Premium amenities"]
  },
  {
    id: "shared",
    name: "Shared",
    icon: <Users className="h-6 w-6" />,
    time: "8-12 min",
    basePrice: 4.50,
    pricePerKm: 0.8,
    capacity: "2-3 seats",
    description: "Share your ride and split the cost",
    features: ["Shared ride", "Eco-friendly", "Best value"]
  }
]

const paymentMethods = [
  { id: "card", name: "Credit Card", icon: "💳", details: "**** 1234" },
  { id: "wallet", name: "Digital Wallet", icon: "💰", details: "$24.50 available" },
  { id: "cash", name: "Cash", icon: "💵", details: "Pay driver directly" }
]

function BookingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, loading] = useAuthState(auth)
  const { toast } = useToast()
  
  const [selectedRideType, setSelectedRideType] = useState("economy")
  const [selectedPayment, setSelectedPayment] = useState("card")
  const [promoCode, setPromoCode] = useState("")
  const [isScheduled, setIsScheduled] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)

  // Get trip data from URL params
  const pickup = searchParams.get('pickup') || "Current Location"
  const destination = searchParams.get('destination') || "Select Destination"
  const distance = parseFloat(searchParams.get('distance') || '5.2')
  const estimatedTime = parseInt(searchParams.get('time') || '12')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const selectedRide = rideTypes.find(ride => ride.id === selectedRideType)
  const basePrice = selectedRide?.basePrice || 0
  const distancePrice = (selectedRide?.pricePerKm || 0) * distance
  const subtotal = basePrice + distancePrice
  const promoDiscount = promoCode === "SAVE20" ? subtotal * 0.2 : 0
  const total = subtotal - promoDiscount

  const handleBookRide = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a ride.",
        variant: "destructive",
      })
      return
    }

    try {
      setBookingLoading(true)

      // Create trip document in Firestore
      const tripData = {
        userId: user.uid,
        from: pickup,
        to: destination,
        distance,
        estimatedTime,
        rideType: selectedRideType,
        paymentMethod: selectedPayment,
        promoCode: promoCode || null,
        basePrice,
        distancePrice,
        promoDiscount,
        fare: total,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      const docRef = await addDoc(collection(db, 'trips'), tripData)
      
      toast({
        title: "Ride Booked Successfully! 🚗",
        description: "Your driver will be assigned shortly.",
      })

      // Redirect to ongoing ride page
      router.push(`/ongoing?tripId=${docRef.id}`)
    } catch (error) {
      console.error("Failed to book ride:", error)
      toast({
        title: "Booking Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-4">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Book Your Ride</h1>
              <p className="text-sm text-gray-600">Review and confirm your trip</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Trip Details */}
            <Card className="p-6 shadow-xl border-0">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Pickup</p>
                    <p className="text-sm text-gray-600">{pickup}</p>
                  </div>
                </div>
                
                <div className="ml-4 border-l-2 border-gray-200 h-6"></div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mt-1">
                    <Navigation className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Destination</p>
                    <p className="text-sm text-gray-600">{destination}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Timer className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">{estimatedTime} min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">{distance} km</span>
                </div>
              </div>
            </Card>

            {/* Ride Options */}
            <Card className="p-6 shadow-xl border-0">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Ride</h2>
              
              <div className="space-y-3">
                {rideTypes.map((ride) => (
                  <Card
                    key={ride.id}
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      selectedRideType === ride.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedRideType(ride.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${
                          selectedRideType === ride.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {ride.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{ride.name}</h3>
                          <p className="text-sm text-gray-600">{ride.description}</p>
                          <p className="text-xs text-gray-500">{ride.capacity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">
                          ${(ride.basePrice + ride.pricePerKm * distance).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">{ride.time}</p>
                      </div>
                    </div>
                    
                    {selectedRideType === ride.id && (
                      <div className="border-t pt-3 mt-3">
                        <div className="flex flex-wrap gap-2">
                          {ride.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6 shadow-xl border-0">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <Card
                    key={method.id}
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      selectedPayment === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900">{method.name}</p>
                          <p className="text-sm text-gray-600">{method.details}</p>
                        </div>
                      </div>
                      {selectedPayment === method.id && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Promo Code */}
            <Card className="p-6 shadow-xl border-0">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Promo Code</h2>
              
              <div className="flex space-x-3">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline">Apply</Button>
              </div>
              
              {promoCode === "SAVE20" && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 font-medium">
                    ✅ Promo code applied! 20% discount
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar - Price Summary */}
          <div className="space-y-6">
            
            {/* Price Breakdown */}
            <Card className="p-6 shadow-xl border-0 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base fare</span>
                  <span className="font-medium">${basePrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Distance ({distance} km)</span>
                  <span className="font-medium">${distancePrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo discount</span>
                    <span>-${promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="font-bold text-xl text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleBookRide}
                disabled={bookingLoading || !user}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold rounded-xl shadow-lg disabled:opacity-50"
              >
                {bookingLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Booking Ride...</span>
                  </div>
                ) : (
                  "Confirm & Book Ride"
                )}
              </Button>

              <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>Secure payment protected</span>
              </div>
            </Card>

            {/* Driver Info */}
            <Card className="p-6 shadow-xl border-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What to Expect</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Quick pickup</p>
                    <p className="text-xs text-gray-600">Driver arrives in {selectedRide?.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-sm">Rated drivers</p>
                    <p className="text-xs text-gray-600">All drivers are verified & rated</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Live tracking</p>
                    <p className="text-xs text-gray-600">Track your ride in real-time</p>
                  </div>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-8 w-32 mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  )
}
