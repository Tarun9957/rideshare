"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  Wallet,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function WalletPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [balance] = useState(124.50)
  const [transactions] = useState([
    {
      id: "1",
      type: "ride",
      amount: -18.5,
      description: "Ride to Airport Terminal 1",
      date: new Date("2024-01-15T14:30:00"),
      status: "completed",
    },
    {
      id: "2",
      type: "topup",
      amount: 50.0,
      description: "Wallet top-up via Credit Card",
      date: new Date("2024-01-14T10:15:00"),
      status: "completed",
    },
    {
      id: "3",
      type: "refund",
      amount: 12.3,
      description: "Ride cancellation refund",
      date: new Date("2024-01-13T16:45:00"),
      status: "completed",
    },
    {
      id: "4",
      type: "ride",
      amount: -25.8,
      description: "Ride to Downtown Mall",
      date: new Date("2024-01-12T09:20:00"),
      status: "completed",
    },
    {
      id: "5",
      type: "bonus",
      amount: 15.0,
      description: "Referral bonus",
      date: new Date("2024-01-11T18:45:00"),
      status: "completed",
    },
      id: "4",
      type: "ride",
      amount: -8.75,
      description: "Ride to University Campus",
      date: new Date("2024-01-12T09:20:00"),
      status: "completed",
    },
  ])

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "ride":
        return <ArrowUpRight className="h-4 w-4 text-red-400" />
      case "topup":
        return <ArrowDownLeft className="h-4 w-4 text-green-400" />
      case "refund":
        return <ArrowDownLeft className="h-4 w-4 text-blue-400" />
      default:
        return <ArrowUpRight className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Wallet</h1>
        <Button variant="ghost" size="icon">
          <Gift className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-4 space-y-6">
        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Wallet className="h-6 w-6 text-white" />
              <span className="text-white font-medium">RideShare Wallet</span>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white">
              Active
            </Badge>
          </div>
          <div className="mb-4">
            <p className="text-white/80 text-sm">Available Balance</p>
            <p className="text-3xl font-bold text-white">${balance.toFixed(2)}</p>
          </div>
          <div className="flex space-x-3">
            <Button className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0">
              <Plus className="h-4 w-4 mr-2" />
              Add Money
            </Button>
            <Button variant="outline" className="flex-1 border-white/30 text-white hover:bg-white/10">
              Send Money
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gray-800 border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">Auto Pay</p>
                <p className="text-sm text-gray-400">Set up auto-reload</p>
              </div>
            </div>
          </Card>
          <Card className="bg-gray-800 border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <Gift className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">Rewards</p>
                <p className="text-sm text-gray-400">Earn cashback</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Payment Methods */}
        <Card className="bg-gray-800 border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Payment Methods</h3>
            <Button variant="ghost" size="sm" className="text-blue-400">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Visa •••• 1234</p>
                  <p className="text-sm text-gray-400">Expires 12/26</p>
                </div>
              </div>
              <Badge variant="secondary">Default</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Mastercard •••• 5678</p>
                  <p className="text-sm text-gray-400">Expires 08/27</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Transaction History */}
        <Card className="bg-gray-800 border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Transactions</h3>
            <Button variant="ghost" size="sm" className="text-blue-400">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-gray-400">
                      {transaction.date.toLocaleDateString()} •{" "}
                      {transaction.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${transaction.amount > 0 ? "text-green-400" : "text-red-400"}`}>
                    {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
        <div className="flex justify-around py-3">
          <Link href="/">
            <Button variant="ghost" className="flex flex-col items-center space-y-1 text-gray-400">
              <Home className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Button>
          </Link>
          <Link href="/history">
            <Button variant="ghost" className="flex flex-col items-center space-y-1 text-gray-400">
              <History className="h-5 w-5" />
              <span className="text-xs">Rides</span>
            </Button>
          </Link>
          <Button variant="ghost" className="flex flex-col items-center space-y-1 text-blue-400">
            <CreditCard className="h-5 w-5" />
            <span className="text-xs">Wallet</span>
          </Button>
          <Link href="/profile">
            <Button variant="ghost" className="flex flex-col items-center space-y-1 text-gray-400">
              <User className="h-5 w-5" />
              <span className="text-xs">Profile</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
