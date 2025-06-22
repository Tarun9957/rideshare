"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Wallet, Banknote, Plus } from "lucide-react"
import type { PaymentMethod } from "@/lib/types"
import { useAuth } from "@/contexts/AuthContext"

interface PaymentMethodSelectorProps {
  onSelect: (paymentMethod: PaymentMethod) => void
  selectedMethod?: PaymentMethod
}

export function PaymentMethodSelector({ onSelect, selectedMethod }: PaymentMethodSelectorProps) {
  const { user } = useAuth()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selected, setSelected] = useState<PaymentMethod | null>(selectedMethod || null)

  useEffect(() => {
    // Load user's payment methods from Firebase
    if (user) {
      // Mock data - replace with actual Firebase query
      const mockMethods: PaymentMethod[] = [
        {
          id: "1",
          type: "card",
          last4: "1234",
          brand: "Visa",
          isDefault: true,
        },
        {
          id: "2",
          type: "card",
          last4: "5678",
          brand: "Mastercard",
          isDefault: false,
        },
        {
          id: "3",
          type: "wallet",
          isDefault: false,
        },
        {
          id: "4",
          type: "cash",
          isDefault: false,
        },
      ]

      setPaymentMethods(mockMethods)

      if (!selected) {
        const defaultMethod = mockMethods.find((m) => m.isDefault) || mockMethods[0]
        setSelected(defaultMethod)
        onSelect(defaultMethod)
      }
    }
  }, [user])

  const handleSelect = (method: PaymentMethod) => {
    setSelected(method)
    onSelect(method)
  }

  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method.type) {
      case "card":
        return <CreditCard className="h-5 w-5" />
      case "wallet":
        return <Wallet className="h-5 w-5" />
      case "cash":
        return <Banknote className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  const getPaymentLabel = (method: PaymentMethod) => {
    switch (method.type) {
      case "card":
        return `${method.brand} •••• ${method.last4}`
      case "wallet":
        return "RideShare Wallet"
      case "cash":
        return "Cash"
      default:
        return "Payment Method"
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Payment Method</h3>
        <Button variant="ghost" size="sm" className="text-blue-400">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {paymentMethods.map((method) => (
        <Card
          key={method.id}
          className={`p-4 cursor-pointer transition-colors ${
            selected?.id === method.id
              ? "bg-blue-900/50 border-blue-500"
              : "bg-gray-800 border-gray-700 hover:border-gray-600"
          }`}
          onClick={() => handleSelect(method)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selected?.id === method.id ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                {getPaymentIcon(method)}
              </div>
              <div>
                <p className="font-medium">{getPaymentLabel(method)}</p>
                {method.isDefault && <p className="text-xs text-blue-400">Default</p>}
              </div>
            </div>
            {selected?.id === method.id && (
              <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
