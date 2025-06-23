"use client"

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Map from "@/components/Map"
import LocationPicker from "@/components/LocationPicker"
import { useGoogleMaps } from '@/contexts/GoogleMapsContext'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SearchPage() {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  const { isLoaded } = useGoogleMaps()
  const [currentLocation, setCurrentLocation] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        // @ts-ignore
        setCurrentLocation({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading || !isLoaded) {
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
        <LocationPicker />
        <Map pickup={currentLocation} destination={null} />
      </div>
    </div>
  )
}
