"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MapPin, Search, Clock, Star } from "lucide-react"
import { useLocation } from "@/contexts/LocationContext"
import type { Location, SavedPlace } from "@/lib/types"
import { useAuth } from "@/contexts/AuthContext"

interface LocationPickerProps {
  onLocationSelect: (location: Location) => void
  placeholder?: string
  initialValue?: string
}

export function LocationPicker({
  onLocationSelect,
  placeholder = "Where to?",
  initialValue = "",
}: LocationPickerProps) {
  const { searchPlaces, currentLocation } = useLocation()
  const { user } = useAuth()
  const [query, setQuery] = useState(initialValue)
  const [results, setResults] = useState<Location[]>([])
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([])
  const [recentPlaces, setRecentPlaces] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    // Load saved places and recent places
    if (user) {
      // Mock data - replace with actual Firebase queries
      setSavedPlaces([
        {
          id: "1",
          userId: user.id,
          name: "Home",
          location: { latitude: 40.7128, longitude: -74.006, address: "123 Home St, New York, NY" },
          type: "home",
        },
        {
          id: "2",
          userId: user.id,
          name: "Work",
          location: { latitude: 40.7589, longitude: -73.9851, address: "456 Work Ave, Manhattan, NY" },
          type: "work",
        },
      ])

      setRecentPlaces([
        { latitude: 40.7505, longitude: -73.9934, address: "Times Square, New York, NY", name: "Times Square" },
        { latitude: 40.7614, longitude: -73.9776, address: "Central Park, New York, NY", name: "Central Park" },
      ])
    }
  }, [user])

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery)

    if (searchQuery.length > 2) {
      setLoading(true)
      try {
        const places = await searchPlaces(searchQuery)
        setResults(places)
        setShowResults(true)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setLoading(false)
      }
    } else {
      setResults([])
      setShowResults(false)
    }
  }

  const handleLocationSelect = (location: Location) => {
    setQuery(location.address)
    setShowResults(false)
    onLocationSelect(location)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowResults(true)}
          placeholder={placeholder}
          className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        />
      </div>

      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border-gray-700 max-h-96 overflow-y-auto z-50">
          {/* Current Location */}
          {currentLocation && (
            <div className="p-3 border-b border-gray-700">
              <Button
                variant="ghost"
                className="w-full justify-start text-left p-0 h-auto"
                onClick={() => handleLocationSelect(currentLocation)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-400">Current Location</p>
                    <p className="text-sm text-gray-400">{currentLocation.address}</p>
                  </div>
                </div>
              </Button>
            </div>
          )}

          {/* Saved Places */}
          {savedPlaces.length > 0 && query.length === 0 && (
            <div className="p-3 border-b border-gray-700">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Saved Places</h3>
              {savedPlaces.map((place) => (
                <Button
                  key={place.id}
                  variant="ghost"
                  className="w-full justify-start text-left p-2 h-auto mb-1"
                  onClick={() => handleLocationSelect(place.location)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{place.name}</p>
                      <p className="text-sm text-gray-400">{place.location.address}</p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}

          {/* Recent Places */}
          {recentPlaces.length > 0 && query.length === 0 && (
            <div className="p-3 border-b border-gray-700">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Recent</h3>
              {recentPlaces.map((place, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left p-2 h-auto mb-1"
                  onClick={() => handleLocationSelect(place)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{place.name}</p>
                      <p className="text-sm text-gray-400">{place.address}</p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}

          {/* Search Results */}
          {results.length > 0 && (
            <div className="p-3">
              {loading && <p className="text-gray-400 text-sm">Searching...</p>}
              {results.map((result, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left p-2 h-auto mb-1"
                  onClick={() => handleLocationSelect(result)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{result.name}</p>
                      <p className="text-sm text-gray-400">{result.address}</p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}

          {query.length > 2 && results.length === 0 && !loading && (
            <div className="p-4 text-center text-gray-400">No results found for "{query}"</div>
          )}
        </Card>
      )}
    </div>
  )
}
