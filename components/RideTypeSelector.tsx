"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Car, Users, Crown, Truck } from "lucide-react"

interface RideType {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  price: number
  eta: string
  capacity: number
}

interface RideTypeSelectorProps {
  onSelect: (rideType: string, price: number) => void
  distance: number
}

export function RideTypeSelector({ onSelect, distance }: RideTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<string>("economy")

  const rideTypes: RideType[] = [
    {
      id: "economy",
      name: "Economy",
      description: "Affordable rides",
      icon: <Car className="h-6 w-6" />,
      price: Math.round(2.5 + distance * 1.0),
      eta: "3-5 min",
      capacity: 4,
    },
    {
      id: "comfort",
      name: "Comfort",
      description: "More space & comfort",
      icon: <Users className="h-6 w-6" />,
      price: Math.round(2.5 + distance * 1.5),
      eta: "5-8 min",
      capacity: 4,
    },
    {
      id: "premium",
      name: "Premium",
      description: "Luxury vehicles",
      icon: <Crown className="h-6 w-6" />,
      price: Math.round(2.5 + distance * 2.0),
      eta: "8-12 min",
      capacity: 4,
    },
    {
      id: "xl",
      name: "XL",
      description: "Extra space for groups",
      icon: <Truck className="h-6 w-6" />,
      price: Math.round(2.5 + distance * 1.8),
      eta: "10-15 min",
      capacity: 6,
    },
  ]

  const handleSelect = (rideType: RideType) => {
    setSelectedType(rideType.id)
    onSelect(rideType.id, rideType.price)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold mb-4">Choose a ride</h3>
      {rideTypes.map((type) => (
        <Card
          key={type.id}
          className={`p-4 cursor-pointer transition-colors ${
            selectedType === type.id
              ? "bg-blue-900/50 border-blue-500"
              : "bg-gray-800 border-gray-700 hover:border-gray-600"
          }`}
          onClick={() => handleSelect(type)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedType === type.id ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                {type.icon}
              </div>
              <div>
                <h4 className="font-semibold">{type.name}</h4>
                <p className="text-sm text-gray-400">{type.description}</p>
                <p className="text-xs text-gray-500">
                  {type.eta} • {type.capacity} seats
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">${type.price}</p>
              <p className="text-xs text-gray-400">Estimated</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
