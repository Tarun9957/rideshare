import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Clock, Settings } from "lucide-react"
import Link from "next/link"

export default function DriverPage() {
  const rideRequests = [
    {
      id: 1,
      pickup: "Downtown Mall",
      destination: "Airport Terminal 1",
      distance: "12.5 km",
      fare: "$24.50",
      time: "2 min away",
      passenger: "Alex Johnson",
    },
    {
      id: 2,
      pickup: "Central Station",
      destination: "University Campus",
      distance: "6.2 km",
      fare: "$12.30",
      time: "5 min away",
      passenger: "Sarah Wilson",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <div>
          <h1 className="text-xl font-semibold">Driver Dashboard</h1>
          <p className="text-sm text-gray-400">Welcome back, Michael</p>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Online Status */}
      <Card className="mx-4 bg-gray-800 border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">You're Online</h3>
            <p className="text-sm text-green-400">Ready to accept rides</p>
          </div>
          <Switch defaultChecked className="data-[state=checked]:bg-green-600" />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-400">8</p>
            <p className="text-xs text-gray-400">Rides Today</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">$156</p>
            <p className="text-xs text-gray-400">Earnings</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-400">4.9</p>
            <p className="text-xs text-gray-400">Rating</p>
          </div>
        </div>
      </Card>

      {/* Map Placeholder */}
      <div className="mx-4 bg-gray-700 rounded-lg mb-6 h-48 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-400">Driver Location</p>
          <p className="text-sm text-gray-500">Your current position</p>
        </div>
      </div>

      {/* Ride Requests */}
      <div className="px-4">
        <h2 className="text-lg font-semibold mb-4">New Ride Requests</h2>
        <div className="space-y-4">
          {rideRequests.map((request) => (
            <Card key={request.id} className="bg-gray-800 border-gray-700 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>
                      {request.passenger
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{request.passenger}</p>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-400">{request.time}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-400">{request.fare}</p>
                  <p className="text-xs text-gray-400">{request.distance}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-sm">{request.pickup}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p className="text-sm">{request.destination}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Link href="/driver/accepted" className="flex-1">
                  <Button className="w-full bg-green-600 hover:bg-green-700">Accept</Button>
                </Link>
                <Button
                  variant="outline"
                  className="flex-1 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  Decline
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
