"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Star, 
  Search,
  Navigation2,
  Home,
  Briefcase,
  History,
  TrendingUp
} from "lucide-react"
import Link from "next/link"

const popularDestinations = [
  { name: "Downtown Mall", address: "123 Main Street, Downtown", distance: "2.1 km", time: "8 min" },
  { name: "City Airport", address: "Airport Terminal, Aviation Blvd", distance: "12.5 km", time: "18 min" },
  { name: "University Campus", address: "456 College Ave, University District", distance: "5.3 km", time: "12 min" },
  { name: "Business District", address: "789 Corporate Dr, Business Park", distance: "7.8 km", time: "15 min" },
  { name: "Central Station", address: "Central Train Station, Platform A", distance: "3.2 km", time: "10 min" },
  { name: "Hospital Complex", address: "General Hospital, Medical Center", distance: "4.6 km", time: "11 min" }
]

const savedPlaces = [
  { id: "home", name: "Home", address: "Your home address", icon: Home },
  { id: "work", name: "Work", address: "Your workplace", icon: Briefcase }
]

export default function SearchPage() {
  const router = useRouter()
  const [user, loading] = useAuthState(auth)
  const [pickup, setPickup] = useState("Current Location")
  const [destination, setDestination] = useState("")
  const [showDestinations, setShowDestinations] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleDestinationSelect = (place: any) => {
    setDestination(place.address)
    setShowDestinations(false)
    
    // Calculate estimated distance and time (mock calculation)
    const distance = parseFloat(place.distance?.replace(' km', '') || '5.0')
    const estimatedTime = parseInt(place.time?.replace(' min', '') || '12')
    
    // Navigate to booking page with parameters
    const params = new URLSearchParams({
      pickup: pickup,
      destination: place.address,
      distance: distance.toString(),
      time: estimatedTime.toString()
    })
    
    router.push(`/booking?${params.toString()}`)
  }

  const handleSearch = () => {
    if (!destination.trim()) return
    
    // Mock distance and time calculation
    const distance = Math.random() * 10 + 2 // 2-12 km
    const estimatedTime = Math.ceil(distance * 1.5) // rough estimate
    
    const params = new URLSearchParams({
      pickup: pickup,
      destination: destination,
      distance: distance.toFixed(1),
      time: estimatedTime.toString()
    })
    
    router.push(`/booking?${params.toString()}`)
  }

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
        <div className="flex items-center p-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Where to?</h1>
            <p className="text-sm text-gray-600">Choose your destination</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* Location Inputs */}
        <Card className="card-glass border-0 p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                <MapPin className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">Pickup Location</label>
                <Input
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="mt-1 border-gray-200 focus:ring-blue-500"
                  placeholder="Enter pickup location"
                />
              </div>
            </div>
            
            <div className="ml-4 border-l-2 border-gray-200 h-6"></div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mt-1">
                <Navigation2 className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">Destination</label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value)
                      setShowDestinations(e.target.value.length === 0)
                    }}
                    onFocus={() => setShowDestinations(true)}
                    className="flex-1 border-gray-200 focus:ring-blue-500"
                    placeholder="Where are you going?"
                  />
                  <Button 
                    onClick={handleSearch}
                    disabled={!destination.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Saved Places */}
        {showDestinations && (
          <Card className="card-glass border-0 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Places</h3>
            <div className="space-y-3">
              {savedPlaces.map((place) => (
                <button
                  key={place.id}
                  onClick={() => handleDestinationSelect({ address: place.address, distance: "3.2 km", time: "10 min" })}
                  className="w-full flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <place.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{place.name}</p>
                    <p className="text-sm text-gray-600">{place.address}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Popular Destinations */}
        {showDestinations && (
          <Card className="card-glass border-0 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Popular Destinations</h3>
            </div>
            
            <div className="space-y-3">
              {popularDestinations.map((place, index) => (
                <button
                  key={index}
                  onClick={() => handleDestinationSelect(place)}
                  className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{place.name}</p>
                      <p className="text-sm text-gray-600">{place.address}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{place.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{place.distance}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Recent Trips */}
        {showDestinations && (
          <Card className="card-glass border-0 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <History className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Destinations</h3>
            </div>
            
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600">No recent trips yet</p>
              <p className="text-sm text-gray-500 mt-1">Your recent destinations will appear here</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
