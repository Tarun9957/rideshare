"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useJsApiLoader } from '@react-google-maps/api';

interface GoogleMapsContextType {
  isLoaded: boolean
}

const GoogleMapsContext = createContext<GoogleMapsContextType | undefined>(undefined)

export function GoogleMapsProvider({ children }: { children: ReactNode }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places', 'drawing', 'geometry'],
  })

  return (
    <GoogleMapsContext.Provider
      value={{
        isLoaded,
      }}
    >
      {children}
    </GoogleMapsContext.Provider>
  )
}

export function useGoogleMaps() {
  const context = useContext(GoogleMapsContext)
  if (context === undefined) {
    throw new Error("useGoogleMaps must be used within a GoogleMapsProvider")
  }
  return context
}
