"use client"

import { useEffect, useState } from "react"
import { getToken, onMessage } from "firebase/messaging"
import { messaging } from "@/lib/firebase"
import { useAuth } from "@/contexts/AuthContext"

export function useNotifications() {
  const { user } = useAuth()
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if (!messaging) return

    try {
      const permission = await Notification.requestPermission()
      setPermission(permission)

      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        })
        setToken(token)

        // Save token to user profile
        if (user && token) {
          // Update user document with FCM token
          // await updateDoc(doc(db, 'users', user.id), { fcmToken: token })
        }
      }
    } catch (error) {
      console.error("Error getting notification permission:", error)
    }
  }

  useEffect(() => {
    if (!messaging) return

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload)

      // Show notification
      if (payload.notification) {
        new Notification(payload.notification.title || "RideShare", {
          body: payload.notification.body,
          icon: "/icon-192x192.png",
        })
      }
    })

    return unsubscribe
  }, [])

  return {
    permission,
    token,
    requestPermission,
  }
}
