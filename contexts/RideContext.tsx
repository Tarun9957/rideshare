"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Ride, Location, PaymentMethod } from "@/lib/types"
import { useAuth } from "./AuthContext"

interface RideContextType {
  currentRide: Ride | null
  rideHistory: Ride[]
  loading: boolean
  requestRide: (
    pickup: Location,
    destination: Location,
    rideType: string,
    paymentMethod: PaymentMethod,
    scheduledTime?: Date,
  ) => Promise<string>
  cancelRide: (rideId: string, reason: string) => Promise<void>
  acceptRide: (rideId: string) => Promise<void>
  startRide: (rideId: string) => Promise<void>
  completeRide: (rideId: string, actualFare: number) => Promise<void>
  updateRideLocation: (rideId: string, location: Location) => Promise<void>
  rateRide: (rideId: string, rating: number, comment?: string) => Promise<void>
}

const RideContext = createContext<RideContextType | undefined>(undefined)

export function RideProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [currentRide, setCurrentRide] = useState<Ride | null>(null)
  const [rideHistory, setRideHistory] = useState<Ride[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return

    // Listen for current ride
    const currentRideQuery = query(
      collection(db, "rides"),
      where(user.userType === "rider" ? "riderId" : "driverId", "==", user.id),
      where("status", "in", ["requested", "accepted", "driver_arriving", "driver_arrived", "in_progress"]),
      orderBy("requestedAt", "desc"),
      limit(1),
    )

    const unsubscribeCurrent = onSnapshot(currentRideQuery, (snapshot) => {
      if (!snapshot.empty) {
        const rideData = snapshot.docs[0].data()
        setCurrentRide({ id: snapshot.docs[0].id, ...rideData } as Ride)
      } else {
        setCurrentRide(null)
      }
    })

    // Listen for ride history
    const historyQuery = query(
      collection(db, "rides"),
      where(user.userType === "rider" ? "riderId" : "driverId", "==", user.id),
      where("status", "in", ["completed", "cancelled"]),
      orderBy("requestedAt", "desc"),
      limit(50),
    )

    const unsubscribeHistory = onSnapshot(historyQuery, (snapshot) => {
      const rides = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Ride)
      setRideHistory(rides)
    })

    return () => {
      unsubscribeCurrent()
      unsubscribeHistory()
    }
  }, [user])

  const requestRide = async (
    pickup: Location,
    destination: Location,
    rideType: string,
    paymentMethod: PaymentMethod,
    scheduledTime?: Date,
  ): Promise<string> => {
    if (!user) throw new Error("User not authenticated")

    setLoading(true)
    try {
      const rideData: Omit<Ride, "id"> = {
        riderId: user.id,
        status: "requested",
        pickup,
        destination,
        estimatedFare: calculateFare(pickup, destination, rideType),
        distance: calculateDistance(pickup, destination),
        duration: calculateDuration(pickup, destination),
        rideType: rideType as any,
        scheduledTime,
        requestedAt: new Date(),
        paymentMethod,
        route: [pickup, destination],
      }

      const docRef = await addDoc(collection(db, "rides"), {
        ...rideData,
        requestedAt: Timestamp.fromDate(rideData.requestedAt),
        scheduledTime: scheduledTime ? Timestamp.fromDate(scheduledTime) : null,
      })

      return docRef.id
    } finally {
      setLoading(false)
    }
  }

  const cancelRide = async (rideId: string, reason: string) => {
    await updateDoc(doc(db, "rides", rideId), {
      status: "cancelled",
      cancelledAt: Timestamp.now(),
      cancellationReason: reason,
    })
  }

  const acceptRide = async (rideId: string) => {
    if (!user) throw new Error("User not authenticated")

    await updateDoc(doc(db, "rides", rideId), {
      driverId: user.id,
      status: "accepted",
      acceptedAt: Timestamp.now(),
    })
  }

  const startRide = async (rideId: string) => {
    await updateDoc(doc(db, "rides", rideId), {
      status: "in_progress",
      startedAt: Timestamp.now(),
    })
  }

  const completeRide = async (rideId: string, actualFare: number) => {
    await updateDoc(doc(db, "rides", rideId), {
      status: "completed",
      completedAt: Timestamp.now(),
      actualFare,
    })
  }

  const updateRideLocation = async (rideId: string, location: Location) => {
    await updateDoc(doc(db, "rides", rideId), {
      route: [...(currentRide?.route || []), location],
    })
  }

  const rateRide = async (rideId: string, rating: number, comment?: string) => {
    if (!user) throw new Error("User not authenticated")

    await updateDoc(doc(db, "rides", rideId), {
      rating: {
        score: rating,
        comment,
        ratedBy: user.id,
        ratedAt: Timestamp.now(),
      },
    })
  }

  // Helper functions
  const calculateFare = (pickup: Location, destination: Location, rideType: string): number => {
    const distance = calculateDistance(pickup, destination)
    const baseFare = 2.5
    const perKmRate = rideType === "premium" ? 2.0 : rideType === "comfort" ? 1.5 : 1.0
    return baseFare + distance * perKmRate
  }

  const calculateDistance = (pickup: Location, destination: Location): number => {
    // Haversine formula for distance calculation
    const R = 6371 // Earth's radius in km
    const dLat = ((destination.latitude - pickup.latitude) * Math.PI) / 180
    const dLon = ((destination.longitude - pickup.longitude) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pickup.latitude * Math.PI) / 180) *
        Math.cos((destination.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const calculateDuration = (pickup: Location, destination: Location): number => {
    const distance = calculateDistance(pickup, destination)
    return Math.round(distance * 2.5) // Rough estimate: 2.5 minutes per km
  }

  return (
    <RideContext.Provider
      value={{
        currentRide,
        rideHistory,
        loading,
        requestRide,
        cancelRide,
        acceptRide,
        startRide,
        completeRide,
        updateRideLocation,
        rateRide,
      }}
    >
      {children}
    </RideContext.Provider>
  )
}

export function useRide() {
  const context = useContext(RideContext)
  if (context === undefined) {
    throw new Error("useRide must be used within a RideProvider")
  }
  return context
}
