# 🚀 Deployment Guide

This guide will help you deploy your ride-sharing app to various platforms.

## Prerequisites

Before deploying, ensure you have:

- ✅ All environment variables configured
- ✅ Firebase project set up with Firestore and Authentication
- ✅ Google Maps API keys with required APIs enabled
- ✅ Local build tested and working (`npm run build`)

## Option 1: Vercel (Recommended)

Vercel is the recommended platform as it's optimized for Next.js applications.

### Quick Deploy

1. **Automated Script**:
   ```bash
   npm run deploy
   # or
   ./deploy.sh
   ```

2. **Manual Steps**:
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   vercel
   
   # For production
   vercel --prod
   ```

### Vercel Dashboard Setup

1. Go to [vercel.com](https://vercel.com) and connect your GitHub repository
2. Import your project
3. Add environment variables in Project Settings > Environment Variables:
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
   - `NEXT_PUBLIC_FIREBASE_VAPID_KEY`

## Option 2: Firebase Hosting

Deploy directly to Firebase Hosting:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not done)
firebase init hosting

# Build and deploy
npm run deploy:firebase
```

## Option 3: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=.next
```

## Post-Deployment Configuration

### 1. Firebase Configuration

Add your deployment domain to Firebase:

1. Go to Firebase Console > Authentication > Settings
2. Add your Vercel/deployment domain to "Authorized domains"
3. Update Firestore security rules if needed

### 2. Google Maps Configuration

1. Go to Google Cloud Console
2. Enable required APIs for your domain:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Distance Matrix API
3. Add your deployment domain to API key restrictions

### 3. Environment Variables

Ensure all environment variables are properly set in your deployment platform:

```bash
# Required variables
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key
```

## Testing Your Deployment

After deployment, test these critical features:

- [ ] User registration and login
- [ ] Location permissions and map loading
- [ ] Search functionality
- [ ] Booking flow
- [ ] Wallet functionality
- [ ] Trip history
- [ ] Mobile responsiveness

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**:
   - Ensure all variables start with `NEXT_PUBLIC_`
   - Redeploy after adding variables

2. **Firebase Auth Errors**:
   - Check authorized domains in Firebase Console
   - Verify API keys are correct

3. **Google Maps Not Loading**:
   - Check API key restrictions
   - Ensure required APIs are enabled

4. **Build Failures**:
   - Run `npm run build` locally first
   - Check for TypeScript errors
   - Verify all dependencies are installed

### Getting Help

- Check deployment logs in your platform dashboard
- Test locally with `npm run dev`
- Verify environment variables are set correctly

## Continuous Deployment

Set up automatic deployments:

### Vercel
- Connects automatically to your Git repository
- Deploys on every push to main branch

### GitHub Actions (for other platforms)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run deploy:vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

Happy deploying! 🚀
