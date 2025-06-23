"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Location } from "@/lib/types"

interface LocationContextType {
  currentLocation: Location | null
  loading: boolean
  error: string | null
  requestLocation: () => Promise<void>
  watchLocation: () => void
  stopWatching: () => void
  searchPlaces: (query: string) => Promise<Location[]>
  reverseGeocode: (lat: number, lng: number) => Promise<string>
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [watchId, setWatchId] = useState<number | null>(null)

  const requestLocation = async () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        })
      })

      const address = await reverseGeocode(position.coords.latitude, position.coords.longitude)

      setCurrentLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        address,
        name: "Current Location",
      })
    } catch (err) {
      setError("Failed to get location. Please enable location services.")
    } finally {
      setLoading(false)
    }
  }

  const watchLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) return

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const address = await reverseGeocode(position.coords.latitude, position.coords.longitude)

        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address,
          name: "Current Location",
        })
      },
      (err) => setError("Failed to track location"),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      },
    )

    setWatchId(id)
  }

  const stopWatching = () => {
    if (typeof window === 'undefined' || watchId === null) return
    navigator.geolocation.clearWatch(watchId)
    setWatchId(null)
  }

  const searchPlaces = async (query: string): Promise<Location[]> => {
    // Mock implementation - replace with actual geocoding service
    const mockResults: Location[] = [
      {
        latitude: 40.7128,
        longitude: -74.006,
        address: `${query} - New York, NY`,
        name: query,
      },
      {
        latitude: 40.7589,
        longitude: -73.9851,
        address: `${query} - Manhattan, NY`,
        name: query,
      },
    ]

    return new Promise((resolve) => {
      setTimeout(() => resolve(mockResults), 500)
    })
  }

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    // Mock implementation - replace with actual reverse geocoding service
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`${lat.toFixed(4)}, ${lng.toFixed(4)} - Sample Address`)
      }, 300)
    })
  }

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      requestLocation()
    }
    return () => stopWatching()
  }, [])

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        loading,
        error,
        requestLocation,
        watchLocation,
        stopWatching,
        searchPlaces,
        reverseGeocode,
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider")
  }
  return context
}
