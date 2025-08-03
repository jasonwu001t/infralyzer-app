"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Share2, Loader2, Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { generateShareLink, type DashboardFilterState } from "@/app/lib/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardFilters({ initialFilters }: { initialFilters?: DashboardFilterState }) {
  const [filters, setFilters] = useState<DashboardFilterState>(
    initialFilters || {
      dateRange: "mtd",
      granularity: "daily",
      costType: "amortized",
    },
  )
  const [isSharing, setIsSharing] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [showShareCard, setShowShareCard] = useState(false)
  const { toast } = useToast()

  const handleFilterChange = (key: keyof DashboardFilterState) => (value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleShare = async () => {
    // If share card is already visible, hide it
    if (showShareCard) {
      setShowShareCard(false)
      return
    }

    // Generate new share link and show card
    setIsSharing(true)
    setShareUrl(null)
    const result = await generateShareLink(filters)
    if (result.success && result.key) {
      const url = `${window.location.origin}/dashboard/share/${result.key}`
      setShareUrl(url)
      setShowShareCard(true)
    } else {
      toast({
        title: "Error",
        description: result.error || "Could not create share link.",
        variant: "destructive",
      })
    }
    setIsSharing(false)
  }

  const copyToClipboard = () => {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Copied!",
      description: "Share link copied to clipboard.",
    })
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={filters.dateRange} onValueChange={handleFilterChange("dateRange")}>
          <SelectTrigger className="w-full sm:w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mtd">Month to Date</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="last-7d">Last 7 Days</SelectItem>
            <SelectItem value="last-30d">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.granularity} onValueChange={handleFilterChange("granularity")}>
          <SelectTrigger className="w-full sm:w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Granularity: Daily</SelectItem>
            <SelectItem value="monthly">Granularity: Monthly</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.costType} onValueChange={handleFilterChange("costType")}>
          <SelectTrigger className="w-full sm:w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="amortized">Cost Type: Amortized</SelectItem>
            <SelectItem value="blended">Cost Type: Blended</SelectItem>
            <SelectItem value="unblended">Cost Type: Unblended</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="w-full sm:w-auto bg-transparent">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>September 2024</span>
        </Button>
        <Button onClick={handleShare} disabled={isSharing} className="w-full sm:w-auto ml-auto">
          {isSharing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Share2 className="mr-2 h-4 w-4" />}
          Share
        </Button>
      </div>
      {shareUrl && showShareCard && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Shareable Link</CardTitle>
            <CardDescription>Anyone with this link can view this dashboard snapshot.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 p-2 border rounded-md bg-background">
              <input type="text" readOnly value={shareUrl} className="flex-grow bg-transparent outline-none text-sm" />
              <Button size="icon" variant="ghost" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
