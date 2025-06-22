export interface User {
  id: string
  email: string
  phone: string
  name: string
  avatar?: string
  userType: "rider" | "driver"
  rating: number
  totalRides: number
  createdAt: Date
  isVerified: boolean
  preferences: UserPreferences
}

export interface UserPreferences {
  notifications: boolean
  darkMode: boolean
  language: string
  currency: string
  autoAcceptRides?: boolean // for drivers
  preferredVehicleType?: string
}

export interface Driver extends User {
  vehicle: Vehicle
  documents: DriverDocuments
  isOnline: boolean
  currentLocation: Location
  earnings: DriverEarnings
  bankDetails: BankDetails
}

export interface Vehicle {
  make: string
  model: string
  year: number
  color: string
  licensePlate: string
  type: "economy" | "comfort" | "premium" | "xl"
  photos: string[]
}

export interface DriverDocuments {
  license: Document
  insurance: Document
  registration: Document
  background: Document
}

export interface Document {
  url: string
  verified: boolean
  expiryDate?: Date
  uploadedAt: Date
}

export interface DriverEarnings {
  today: number
  week: number
  month: number
  total: number
  lastPayout: Date
}

export interface BankDetails {
  accountNumber: string
  routingNumber: string
  accountHolderName: string
}

export interface Ride {
  id: string
  riderId: string
  driverId?: string
  status: RideStatus
  pickup: Location
  destination: Location
  estimatedFare: number
  actualFare?: number
  distance: number
  duration: number
  rideType: "economy" | "comfort" | "premium" | "xl"
  scheduledTime?: Date
  requestedAt: Date
  acceptedAt?: Date
  startedAt?: Date
  completedAt?: Date
  cancelledAt?: Date
  cancellationReason?: string
  paymentMethod: PaymentMethod
  promoCode?: string
  discount?: number
  route: Location[]
  rating?: Rating
  notes?: string
}

export type RideStatus =
  | "requested"
  | "accepted"
  | "driver_arriving"
  | "driver_arrived"
  | "in_progress"
  | "completed"
  | "cancelled"

export interface Location {
  latitude: number
  longitude: number
  address: string
  name?: string
}

export interface PaymentMethod {
  id: string
  type: "card" | "cash" | "wallet"
  last4?: string
  brand?: string
  isDefault: boolean
}

export interface Rating {
  score: number
  comment?: string
  ratedBy: string
  ratedAt: Date
}

export interface ChatMessage {
  id: string
  rideId: string
  senderId: string
  message: string
  timestamp: Date
  type: "text" | "location" | "system"
}

export interface Notification {
  id: string
  userId: string
  title: string
  body: string
  type: "ride" | "payment" | "promotion" | "system"
  data?: any
  read: boolean
  createdAt: Date
}

export interface PromoCode {
  code: string
  discount: number
  type: "percentage" | "fixed"
  minAmount: number
  maxDiscount: number
  expiryDate: Date
  usageLimit: number
  usedCount: number
}

export interface SavedPlace {
  id: string
  userId: string
  name: string
  location: Location
  type: "home" | "work" | "other"
}
