"use client"

import dynamic from 'next/dynamic'

const WalletPageClient = dynamic(() => import('./wallet-client'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
})

export default function WalletPage() {
  return <WalletPageClient />
}
