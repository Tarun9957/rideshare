#!/bin/bash

# Ride-Sharing App Deployment Script for Vercel
# This script helps you deploy your app to Vercel

echo "🚗 Ride-Sharing App - Vercel Deployment Helper"
echo "=============================================="

# Check if required tools are installed
command -v git >/dev/null 2>&1 || { echo "❌ Git is required but not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ Node.js/npm is required but not installed. Aborting." >&2; exit 1; }

echo "✅ Prerequisites check passed"

# Check if .env.local exists and has required variables
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "📝 Please create .env.local file with your API keys"
    echo "💡 Use .env.example as a template"
    exit 1
fi

# Check for placeholder values
if grep -q "YOUR_" .env.local; then
    echo "⚠️  Warning: Found placeholder values in .env.local"
    echo "🔧 Please replace all 'YOUR_*' values with actual API keys"
    echo ""
    echo "Required API keys:"
    echo "  - Google Maps API Key"
    echo "  - Firebase configuration"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Test build locally
echo "🔨 Testing local build..."
if npm run build; then
    echo "✅ Local build successful"
else
    echo "❌ Local build failed. Please fix errors before deploying."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install vercel --legacy-peer-deps
fi

# Initialize git repository if not already done
if [ ! -d ".git" ]; then
    echo "🔧 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Ride-sharing app ready for deployment"
fi

echo ""
echo "🚀 Ready to deploy!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub (if not done already)"
echo "2. Run 'vercel' to deploy"
echo "3. Add environment variables in Vercel dashboard"
echo "4. Update Firebase Auth domain with your Vercel URL"
echo ""
echo "🌐 Environment variables to add in Vercel:"
grep "NEXT_PUBLIC_" .env.local | cut -d'=' -f1

echo ""
read -p "Deploy now with Vercel CLI? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Deploying to Vercel..."
    vercel
fi

echo ""
echo "✨ Deployment helper completed!"
echo "📖 For detailed instructions, see README.md"
