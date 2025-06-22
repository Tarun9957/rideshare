import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { RideProvider } from "@/contexts/RideContext"
import { LocationProvider } from "@/contexts/LocationContext"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RideShare - Your Ride, Your Way",
  description: "Premium ride-sharing experience with real-time tracking and seamless payments",
  manifest: "/manifest.json",
  themeColor: "#1f2937",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LocationProvider>
            <RideProvider>
              {children}
              <Toaster />
              <div id="recaptcha-container"></div>
            </RideProvider>
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
