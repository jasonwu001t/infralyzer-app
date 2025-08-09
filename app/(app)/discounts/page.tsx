"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DiscountsPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to Cost Analytics page with discounts tab
    router.replace('/cost-analytics?tab=discounts')
  }, [router])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Redirecting...</h1>
          <p className="text-muted-foreground">
            Discounts & Commitments have been merged into Cost Analytics.
          </p>
        </div>
      </div>
    </div>
  )
}
