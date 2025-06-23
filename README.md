# Ride-Sharing App

<p align="center">
  <strong>A fully functional ride-sharing app built with Next.js, Firebase, and Google Maps API.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#technical-documentation">Technical Documentation</a> •
  <a href="#setup">Setup</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

---

## Features

*   **User Authentication**: Secure user authentication with email and password, powered by Firebase Authentication.
*   **Real-time Maps**: Interactive maps using Google Maps API to display the user's current location and the route for a ride.
*   **Live Location Tracking**: Real-time location updates for both the user and the driver during a ride.
*   **Costing Algorithm**: Accurate cost estimation using the Google Maps Distance Matrix API to calculate the distance and estimated time for a ride.
*   **Wallet**: A digital wallet for each user, with the ability to view their balance and transaction history.
*   **Driver Assignment**: A dynamic driver assignment system that randomly assigns an available driver to a new trip.
*   **Ride History**: Users can view their past rides and trip details.
*   **Responsive Design**: A mobile-first design that works on all screen sizes.

## Technical Documentation

### Technologies Used

*   **[Next.js](https://nextjs.org/)**: A React framework for building server-side rendered and statically generated web applications.
*   **[Firebase](https://firebase.google.com/)**: A platform for building web and mobile applications, providing a suite of tools for authentication, database management, and more.
*   **[Google Maps API](https://developers.google.com/maps)**: A set of APIs for adding maps and location-based features to applications.
*   **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapidly building custom user interfaces.
*   **[TypeScript](https://www.typescriptlang.org/)**: A typed superset of JavaScript that compiles to plain JavaScript.

### Architecture

The application is built with a modern, component-based architecture. The frontend is built with Next.js and React, and the backend is powered by Firebase.

*   **Frontend**: The frontend is built with Next.js and React, and uses Tailwind CSS for styling. The app is divided into several pages, each with its own route. The pages are composed of reusable React components.
*   **Backend**: The backend is powered by Firebase, which provides a suite of tools for authentication, database management, and more.
    *   **Firebase Authentication**: Used for user authentication with email and password.
    *   **Firestore**: A NoSQL database for storing user data, trip history, and other application data.
*   **Google Maps API**: The app uses the Google Maps API to display maps, track locations, and calculate distances.

### File Structure

```
.
├── app
│   ├── api
│   │   └── create-payment-intent
│   │       └── route.ts
│   ├── booking
│   │   └── page.tsx
│   ├── confirmed
│   │   └── page.tsx
│   ├── driver
│   │   ├── accepted
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── history
│   │   └── page.tsx
│   ├── login
│   │   └── page.tsx
│   ├── ongoing
│   │   └── page.tsx
│   ├── profile
│   │   └── page.tsx
│   ├── register
│   │   └── page.tsx
│   ├── search
│   │   └── page.tsx
│   ├── wallet
│   │   ├── page-new.tsx
│   │   ├── page-old.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page-backup.tsx
│   ├── page-simple.tsx
│   ├── page-test.tsx
│   ├── page-working.tsx
│   └── page.tsx
├── components
│   ├── LocationPicker.tsx
│   ├── Map.tsx
│   ├── PaymentMethodSelector.tsx
│   ├── RideTypeSelector.tsx
│   ├── theme-provider.tsx
│   └── ui
│       ├── ...
├── contexts
│   ├── AuthContext.tsx
│   ├── GoogleMapsContext.tsx
│   ├── LocationContext.tsx
│   └── RideContext.tsx
├── hooks
│   ├── use-mobile.tsx
│   ├── use-toast.ts
│   └── useNotifications.ts
├── lib
│   ├── firebase.ts
│   ├── types.ts
│   └── utils.ts
├── public
│   ├── ...
├── scripts
│   └── seed-drivers.js
├── styles
│   └── globals.css
├── .env.local
├── .gitignore
├── components.json
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

## Setup

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v14 or later)
*   [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/ride-sharing-app.git
    ```

2.  **Install the dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Firebase and Google Maps API:**

    *   Create a new project in the [Firebase console](https://console.firebase.google.com/).
    *   Enable Firestore and Authentication.
    *   Create a new web app and copy the Firebase configuration.
    *   Create a new project in the [Google Cloud Console](https://console.cloud.google.com/).
    *   Enable the Maps JavaScript API, Places API, and Distance Matrix API.
    *   Create a new API key and copy it.
    *   Create a `.env.local` file in the root of the project and add your Firebase and Google Maps API keys:

        ```
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"
        NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
        NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
        NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_FIREBASE_MEASUREMENT_ID"
        NEXT_PUBLIC_FIREBASE_VAPID_KEY="YOUR_FIREBASE_VAPID_KEY"
        ```

4.  **Seed the database:**

    *   Run the following command to seed the database with driver data:

        ```bash
        node scripts/seed-drivers.js
        ```

5.  **Run the development server:**

    ```bash
    npm run dev
    ```

    The app will be available at `http://localhost:3000`.

## Deployment

### Deploy to Vercel

The easiest way to deploy your ride-sharing app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

#### Quick Deploy

1. **Push to GitHub**: First, push your code to a GitHub repository.

2. **Connect to Vercel**: 
   - Go to [vercel.com](https://vercel.com)
   - Sign up/in with your GitHub account
   - Click "New Project"
   - Import your ride-sharing-app repository

3. **Configure Environment Variables**: In your Vercel project dashboard, go to Settings > Environment Variables and add:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
   NEXT_PUBLIC_FIREBASE_API_KEY
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   NEXT_PUBLIC_FIREBASE_PROJECT_ID
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   NEXT_PUBLIC_FIREBASE_APP_ID
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
   NEXT_PUBLIC_FIREBASE_VAPID_KEY
   ```

4. **Deploy**: Click "Deploy" and Vercel will automatically build and deploy your app.

#### Manual Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# For production deployment
vercel --prod
```

#### Firebase Configuration for Production

Before deploying, make sure to:

1. **Update Firebase Security Rules**: Configure your Firestore security rules for production
2. **Add Domain to Firebase**: Add your Vercel domain to Firebase Auth authorized domains
3. **Update CORS Settings**: Configure Firebase to allow requests from your Vercel domain

#### Post-Deployment Checklist

- [ ] Verify all environment variables are set correctly
- [ ] Test user authentication flow
- [ ] Test Google Maps integration
- [ ] Verify Firestore read/write operations
- [ ] Test the complete booking flow
- [ ] Check mobile responsiveness

### Alternative Deployments

#### Deploy to Netlify
```bash
# Build the project
npm run build

# Deploy to Netlify (install netlify-cli first)
npm install -g netlify-cli
netlify deploy --prod --dir=.next
```

#### Deploy to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
