# RideShare - Premium Ride-Sharing App

A feature-rich, production-ready ride-sharing application built with Next.js, Firebase, and modern web technologies. This app provides a complete ride-sharing experience for both riders and drivers with real-time features, seamless payments, and intuitive mobile-first design.

## 🚀 Features

### For Riders
- **Smart Booking**: Location-based pickup and destination selection with autocomplete
- **Multiple Ride Types**: Economy, Comfort, Premium, and XL options
- **Real-time Tracking**: Live driver location and ETA updates
- **Flexible Payments**: Multiple payment methods including cards, wallet, and cash
- **Ride Scheduling**: Book rides for later with advanced scheduling
- **Promo Codes**: Apply discount codes and promotional offers
- **Ride History**: Complete history with ratings and receipts
- **Safety Features**: Emergency contacts, trip sharing, and safety center
- **Wallet Integration**: Built-in wallet with auto-reload and transaction history

### For Drivers
- **Driver Dashboard**: Comprehensive earnings and ride statistics
- **Online/Offline Toggle**: Control availability with smart matching
- **Ride Management**: Accept, start, and complete rides seamlessly
- **Navigation Integration**: Turn-by-turn directions and route optimization
- **Earnings Tracking**: Real-time earnings with detailed breakdowns
- **Document Management**: Upload and manage required documents
- **Vehicle Management**: Multiple vehicle support with photos

### Technical Features
- **Real-time Updates**: Firebase Firestore for live data synchronization
- **Push Notifications**: Firebase Cloud Messaging for instant updates
- **Location Services**: Advanced geolocation with background tracking
- **Offline Support**: Progressive Web App with offline capabilities
- **Authentication**: Secure phone-based OTP authentication
- **State Management**: Context-based state management with TypeScript
- **Responsive Design**: Mobile-first design that works on all devices

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Firebase (Firestore, Auth, Storage, Functions)
- **Styling**: Tailwind CSS, shadcn/ui components
- **Maps**: Google Maps API / Mapbox (configurable)
- **Payments**: Stripe integration ready
- **Push Notifications**: Firebase Cloud Messaging
- **PWA**: Service Worker, Web App Manifest

## 📱 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Firebase project with Firestore, Auth, and Storage enabled
- Google Maps API key (optional for enhanced location features)

### 1. Clone and Install
\`\`\`bash
git clone <repository-url>
cd rideshare-app
npm install
\`\`\`

### 2. Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Phone provider)
3. Enable Firestore Database
4. Enable Storage
5. Enable Cloud Messaging
6. Get your Firebase config

### 3. Environment Variables
Create a `.env.local` file in the root directory:

\`\`\`env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key

# Optional: Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key
\`\`\`

### 4. Firebase Security Rules
Set up Firestore security rules:

\`\`\`javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Rides can be read/written by participants
    match /rides/{rideId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.riderId || 
         request.auth.uid == resource.data.driverId);
    }
    
    // Allow ride creation
    match /rides/{rideId} {
      allow create: if request.auth != null;
    }
  }
}
\`\`\`

### 5. Run the Application
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the app in action!

## 🔧 Configuration

### Firebase Functions (Optional)
For advanced features like automated matching and payments, deploy Firebase Functions:

\`\`\`bash
cd functions
npm install
firebase deploy --only functions
\`\`\`

### Push Notifications
1. Generate VAPID keys in Firebase Console
2. Add the VAPID key to your environment variables
3. Configure service worker for background notifications

### Maps Integration
Replace the placeholder map components with actual map implementations:
- Google Maps: `@googlemaps/react-wrapper`
- Mapbox: `react-map-gl`

## 📊 Database Schema

### Users Collection
\`\`\`typescript
{
  id: string
  email: string
  phone: string
  name: string
  userType: 'rider' | 'driver'
  rating: number
  totalRides: number
  isVerified: boolean
  preferences: UserPreferences
  createdAt: Timestamp
}
\`\`\`

### Rides Collection
\`\`\`typescript
{
  id: string
  riderId: string
  driverId?: string
  status: RideStatus
  pickup: Location
  destination: Location
  estimatedFare: number
  actualFare?: number
  rideType: string
  requestedAt: Timestamp
  paymentMethod: PaymentMethod
  route: Location[]
}
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Firebase Hosting
\`\`\`bash
npm run build
firebase deploy --only hosting
\`\`\`

## 🔐 Security Features

- **Phone Authentication**: Secure OTP-based login
- **Data Validation**: Client and server-side validation
- **Privacy Controls**: User data protection and privacy settings
- **Secure Payments**: PCI-compliant payment processing
- **Real-time Security**: Live monitoring and fraud detection

## 📈 Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component with lazy loading
- **Caching**: Aggressive caching for static assets
- **PWA**: Service worker for offline functionality
- **Bundle Analysis**: Webpack bundle analyzer integration

## 🧪 Testing

\`\`\`bash
# Run tests
npm test

# Run e2e tests
npm run test:e2e

# Run performance tests
npm run test:performance
\`\`\`

## 📱 Mobile App

This web app is PWA-ready and can be installed on mobile devices. For native mobile apps:
- **React Native**: Port components to React Native
- **Capacitor**: Wrap the web app with Capacitor
- **Expo**: Use Expo for rapid mobile development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs and request features via GitHub Issues
- **Community**: Join our Discord server for community support

## 🎯 Roadmap

- [ ] Advanced driver matching algorithms
- [ ] Multi-language support
- [ ] Voice commands integration
- [ ] AR navigation features
- [ ] Electric vehicle support
- [ ] Corporate accounts
- [ ] API for third-party integrations

---

**Ready to revolutionize transportation? Start building with RideShare today!** 🚗💨
