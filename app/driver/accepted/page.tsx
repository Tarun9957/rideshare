import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Phone, MessageCircle, Navigation } from "lucide-react"
import Link from "next/link"

export default function DriverAcceptedPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <Link href="/driver">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Ride Accepted</h1>
        <div></div>
      </div>

      {/* Trip Status */}
      <Card className="mx-4 bg-blue-900/50 border-blue-700 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Navigation className="h-5 w-5 text-blue-400" />
            <div>
              <p className="font-semibold">Heading to pickup</p>
              <p className="text-sm text-blue-300">2 minutes away</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-400">2</p>
            <p className="text-xs text-blue-300">MIN</p>
          </div>
        </div>
      </Card>

      {/* Passenger Info */}
      <Card className="mx-4 bg-gray-800 border-gray-700 p-6 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src="/placeholder.svg?height=64&width=64" />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">Alex Johnson</h3>
            <p className="text-sm text-gray-400">Passenger • 4.8 rating</p>
            <p className="text-sm text-blue-400">Waiting at pickup location</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button className="flex-1 bg-green-600 hover:bg-green-700">
            <Phone className="h-4 w-4 mr-2" />
            Call Passenger
          </Button>
          <Button variant="outline" className="flex-1 border-gray-600 text-gray-300">
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </Button>
        </div>
      </Card>

      {/* Navigation */}
      <div className="mx-4 bg-gray-700 rounded-lg mb-6 h-48 flex items-center justify-center">
        <div className="text-center">
          <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-400">Navigation View</p>
          <p className="text-sm text-gray-500">Turn-by-turn directions</p>
        </div>
      </div>

      {/* Trip Details */}
      <Card className="mx-4 bg-gray-800 border-gray-700 p-4 mb-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium">Pickup Location</p>
              <p className="text-sm text-gray-400">Downtown Mall, Main Entrance</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium">Destination</p>
              <p className="text-sm text-gray-400">Airport Terminal 1, Departure Level</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-700">
            <span className="text-gray-400">Trip Fare</span>
            <span className="text-lg font-bold text-green-400">$24.50</span>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="px-4 space-y-3">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-xl">
          Arrived at Pickup
        </Button>
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold rounded-xl">
          Start Trip
        </Button>
        <Button
          variant="outline"
          className="w-full border-red-600 text-red-400 hover:bg-red-600 hover:text-white py-3 rounded-xl"
        >
          Cancel Trip
        </Button>
      </div>
    </div>
  )
}
