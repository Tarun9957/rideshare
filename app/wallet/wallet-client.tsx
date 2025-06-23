"use client"

import { useState, useEffect } from "react"
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
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore"

export default function WalletPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<any[]>([])
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, "users", user.id);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setBalance(doc.data().walletBalance || 0);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "transactions"),
        where("userId", "==", user.id),
        orderBy("date", "desc")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const transactionsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(),
        }));
        setTransactions(transactionsData);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleTopUp = async () => {
    setShowCheckoutForm(true)
  }

  const formatCurrency = (amount: number) => {
    if (typeof window === 'undefined') return `$${Math.abs(amount).toFixed(2)}`
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount))
  }

  const formatDate = (date: Date) => {
    if (typeof window === 'undefined') return date.toLocaleDateString()
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'ride':
        return <ArrowUpRight className="h-4 w-4 text-red-600" />
      case 'topup':
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case 'refund':
        return <RefreshCw className="h-4 w-4 text-blue-600" />
      case 'bonus':
        return <Gift className="h-4 w-4 text-purple-600" />
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'ride':
        return 'text-red-600'
      case 'topup':
        return 'text-green-600'
      case 'refund':
        return 'text-blue-600'
      case 'bonus':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/')}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">My Wallet</h1>
              </div>
            </div>
            
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
                {user.name?.[0] || user.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Balance Card */}
        <Card className="card-glass border-0 mb-8 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-green-100">Available Balance</CardDescription>
            <CardTitle className="text-4xl font-bold">{formatCurrency(balance)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-green-100 text-sm">
                Last updated: {formatDate(new Date())}
              </div>
              <Button 
                variant="outline" 
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                onClick={handleTopUp}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Money
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-glass border-0 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(143.60)}</p>
              </div>
            </div>
          </Card>

          <Card className="card-glass border-0 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ArrowUpRight className="w-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(1847.30)}</p>
              </div>
            </div>
          </Card>

          <Card className="card-glass border-0 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Gift className="w-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rewards Earned</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(89.50)}</p>
              </div>
            </div>
          </Card>
        </div>


        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Button
            variant="outline"
            className="h-20 flex flex-col space-y-2 border-2 border-green-200 hover:border-green-300 hover:bg-green-50"
            onClick={handleTopUp}
          >
            <Plus className="h-6 w-6 text-green-600" />
            <span className="text-sm font-medium text-green-700">Add Money</span>
          </Button>

          <Button
            variant="outline"
            className="h-20 flex flex-col space-y-2 border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
          >
            <CreditCard className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Pay Bills</span>
          </Button>

          <Button
            variant="outline"
            className="h-20 flex flex-col space-y-2 border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50"
          >
            <Gift className="h-6 w-6 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Rewards</span>
          </Button>

          <Button
            variant="outline"
            className="h-20 flex flex-col space-y-2 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          >
            <ArrowUpRight className="h-6 w-6 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Send Money</span>
          </Button>
        </div>

        {/* Recent Transactions */}
        <Card className="card-glass border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-gray-900">Recent Transactions</CardTitle>
                <CardDescription>Your latest wallet activity</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{transaction.description}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(transaction.date)}</span>
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${getTransactionColor(transaction.type)}`}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
