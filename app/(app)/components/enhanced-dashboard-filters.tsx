"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  CalendarIcon, 
  Share2, 
  Loader2, 
  Copy, 
  Filter, 
  X, 
  Search,
  RefreshCw,
  Download,
  Settings,
  GitCompare,
  Calendar,
  Globe,
  Building,
  Tag,
  DollarSign,
  Users
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { generateShareLink, type DashboardFilterState } from "@/app/lib/actions"

interface EnhancedDashboardFilterState extends DashboardFilterState {
  accounts?: string[]
  services?: string[]
  regions?: string[]
  tags?: { [key: string]: string[] }
  costThreshold?: { min?: number; max?: number }
  comparisonMode?: boolean
  comparisonPeriod?: {
    primary: string
    secondary: string
  }
}

export default function EnhancedDashboardFilters({ initialFilters }: { initialFilters?: EnhancedDashboardFilterState }) {
  const [filters, setFilters] = useState<EnhancedDashboardFilterState>(
    initialFilters || {
      dateRange: "mtd",
      granularity: "daily", 
      costType: "amortized",
      accounts: [],
      services: [],
      regions: [],
      tags: {},
      costThreshold: {},
      comparisonMode: false,
      comparisonPeriod: {
        primary: "mtd",
        secondary: "last-month"
      }
    }
  )
  const [isSharing, setIsSharing] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [showShareCard, setShowShareCard] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // Demo data for filter options
  const filterOptions = {
    accounts: [
      { id: "123456789012", name: "Production Account", spend: "$45,230" },
      { id: "123456789013", name: "Development Account", spend: "$12,450" },
      { id: "123456789014", name: "Staging Account", spend: "$8,900" },
      { id: "123456789015", name: "Security Account", spend: "$3,200" },
      { id: "123456789016", name: "Data Lake Account", spend: "$18,750" }
    ],
    services: [
      { name: "Amazon EC2", spend: "$28,450", growth: "+5.2%" },
      { name: "Amazon RDS", spend: "$15,230", growth: "-2.1%" },
      { name: "Amazon S3", spend: "$8,900", growth: "+12.3%" },
      { name: "Amazon Lambda", spend: "$6,780", growth: "+35.4%" },
      { name: "Amazon CloudFront", spend: "$4,320", growth: "+8.1%" },
      { name: "Amazon EBS", spend: "$12,100", growth: "+2.8%" },
      { name: "Amazon VPC", spend: "$2,890", growth: "+1.5%" },
      { name: "AWS Support", spend: "$1,200", growth: "0%" }
    ],
    regions: [
      { name: "us-east-1", displayName: "N. Virginia", spend: "$42,150" },
      { name: "us-west-2", displayName: "Oregon", spend: "$18,930" },
      { name: "eu-west-1", displayName: "Ireland", spend: "$12,340" },
      { name: "ap-southeast-1", displayName: "Singapore", spend: "$8,760" },
      { name: "us-east-2", displayName: "Ohio", spend: "$6,450" }
    ],
    tags: {
      Environment: ["Production", "Development", "Staging", "Testing"],
      Team: ["Frontend", "Backend", "DevOps", "Data", "Security"],
      Project: ["WebApp", "Mobile", "Analytics", "ML Pipeline", "API Gateway"],
      CostCenter: ["Engineering", "Marketing", "Sales", "Operations"]
    }
  }

  const handleFilterChange = (key: keyof EnhancedDashboardFilterState) => (value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleArrayFilterChange = (key: 'accounts' | 'services' | 'regions') => (value: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      [key]: checked 
        ? [...(prev[key] || []), value]
        : (prev[key] || []).filter(item => item !== value)
    }))
  }

  const handleTagFilterChange = (tagKey: string, tagValue: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      tags: {
        ...prev.tags,
        [tagKey]: checked
          ? [...(prev.tags?.[tagKey] || []), tagValue]
          : (prev.tags?.[tagKey] || []).filter(item => item !== tagValue)
      }
    }))
  }

  const handleComparisonPeriodChange = (period: 'primary' | 'secondary') => (value: string) => {
    setFilters((prev) => ({
      ...prev,
      comparisonPeriod: {
        ...prev.comparisonPeriod!,
        [period]: value
      }
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      dateRange: "mtd",
      granularity: "daily",
      costType: "amortized",
      accounts: [],
      services: [],
      regions: [],
      tags: {},
      costThreshold: {},
      comparisonMode: false,
      comparisonPeriod: {
        primary: "mtd",
        secondary: "last-month"
      }
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.accounts?.length) count += filters.accounts.length
    if (filters.services?.length) count += filters.services.length
    if (filters.regions?.length) count += filters.regions.length
    if (filters.tags) {
      Object.values(filters.tags).forEach(values => {
        count += values.length
      })
    }
    return count
  }

  const handleShare = async () => {
    if (showShareCard) {
      setShowShareCard(false)
      return
    }

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

  const filteredServices = filterOptions.services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Main Filter Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Time Range Selection */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={filters.dateRange} onValueChange={handleFilterChange("dateRange")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mtd">Month to Date</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-7d">Last 7 Days</SelectItem>
              <SelectItem value="last-30d">Last 30 Days</SelectItem>
              <SelectItem value="last-90d">Last 90 Days</SelectItem>
              <SelectItem value="last-12m">Last 12 Months</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Comparison Mode Toggle */}
        <Button
          variant={filters.comparisonMode ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterChange("comparisonMode")(!filters.comparisonMode)}
        >
          <GitCompare className="h-4 w-4 mr-2" />
          {filters.comparisonMode ? "Exit Comparison" : "Compare Periods"}
        </Button>

        {/* Cost Type & Granularity */}
        <Select value={filters.granularity} onValueChange={handleFilterChange("granularity")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily View</SelectItem>
            <SelectItem value="weekly">Weekly View</SelectItem>
            <SelectItem value="monthly">Monthly View</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.costType} onValueChange={handleFilterChange("costType")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="amortized">Amortized Cost</SelectItem>
            <SelectItem value="blended">Blended Cost</SelectItem>
            <SelectItem value="unblended">Unblended Cost</SelectItem>
            <SelectItem value="net">Net Cost</SelectItem>
          </SelectContent>
        </Select>

        {/* Advanced Filters Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="ml-2">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleShare} disabled={isSharing} size="sm">
            {isSharing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Share2 className="mr-2 h-4 w-4" />}
            Share
          </Button>
        </div>
      </div>

      {/* Comparison Period Selection */}
      {filters.comparisonMode && (
        <Card className="bg-blue-50/50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <GitCompare className="h-4 w-4" />
              Period Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-blue-900">Primary Period</label>
                <Select 
                  value={filters.comparisonPeriod?.primary} 
                  onValueChange={handleComparisonPeriodChange("primary")}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mtd">Month to Date</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="last-7d">Last 7 Days</SelectItem>
                    <SelectItem value="last-30d">Last 30 Days</SelectItem>
                    <SelectItem value="last-90d">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-blue-900">Compare Against</label>
                <Select 
                  value={filters.comparisonPeriod?.secondary} 
                  onValueChange={handleComparisonPeriodChange("secondary")}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="last-quarter">Last Quarter</SelectItem>
                    <SelectItem value="last-year">Last Year</SelectItem>
                    <SelectItem value="prev-period">Previous Period</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Advanced Filters</CardTitle>
                <CardDescription>Filter your dashboard data by accounts, services, regions, and tags</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  Clear All
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowAdvancedFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Tabs defaultValue="accounts" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="accounts" className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  Accounts
                </TabsTrigger>
                <TabsTrigger value="services" className="flex items-center gap-1">
                  <Settings className="h-3 w-3" />
                  Services
                </TabsTrigger>
                <TabsTrigger value="regions" className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  Regions
                </TabsTrigger>
                <TabsTrigger value="tags" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  Tags
                </TabsTrigger>
                <TabsTrigger value="cost" className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Cost Range
                </TabsTrigger>
              </TabsList>

              <TabsContent value="accounts" className="space-y-3">
                <div className="space-y-2">
                  {filterOptions.accounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-2 rounded-lg border">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={account.id}
                          checked={filters.accounts?.includes(account.id)}
                          onCheckedChange={(checked) => 
                            handleArrayFilterChange("accounts")(account.id, !!checked)
                          }
                        />
                        <div>
                          <label htmlFor={account.id} className="text-sm font-medium cursor-pointer">
                            {account.name}
                          </label>
                          <div className="text-xs text-muted-foreground">{account.id}</div>
                        </div>
                      </div>
                      <Badge variant="secondary">{account.spend}</Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="services" className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredServices.map((service) => (
                    <div key={service.name} className="flex items-center justify-between p-2 rounded-lg border">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={service.name}
                          checked={filters.services?.includes(service.name)}
                          onCheckedChange={(checked) => 
                            handleArrayFilterChange("services")(service.name, !!checked)
                          }
                        />
                        <label htmlFor={service.name} className="text-sm font-medium cursor-pointer">
                          {service.name}
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{service.spend}</Badge>
                        <Badge 
                          variant="outline" 
                          className={service.growth.startsWith('+') ? 'text-red-600' : 'text-green-600'}
                        >
                          {service.growth}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="regions" className="space-y-3">
                <div className="space-y-2">
                  {filterOptions.regions.map((region) => (
                    <div key={region.name} className="flex items-center justify-between p-2 rounded-lg border">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={region.name}
                          checked={filters.regions?.includes(region.name)}
                          onCheckedChange={(checked) => 
                            handleArrayFilterChange("regions")(region.name, !!checked)
                          }
                        />
                        <div>
                          <label htmlFor={region.name} className="text-sm font-medium cursor-pointer">
                            {region.displayName}
                          </label>
                          <div className="text-xs text-muted-foreground">{region.name}</div>
                        </div>
                      </div>
                      <Badge variant="secondary">{region.spend}</Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tags" className="space-y-4">
                {Object.entries(filterOptions.tags).map(([tagKey, tagValues]) => (
                  <div key={tagKey} className="space-y-2">
                    <label className="text-sm font-medium">{tagKey}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {tagValues.map((tagValue) => (
                        <div key={`${tagKey}-${tagValue}`} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${tagKey}-${tagValue}`}
                            checked={filters.tags?.[tagKey]?.includes(tagValue)}
                            onCheckedChange={(checked) => 
                              handleTagFilterChange(tagKey, tagValue, !!checked)
                            }
                          />
                          <label 
                            htmlFor={`${tagKey}-${tagValue}`} 
                            className="text-sm cursor-pointer"
                          >
                            {tagValue}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="cost" className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Minimum Cost Threshold</label>
                    <Input
                      type="number"
                      placeholder="Enter minimum cost"
                      value={filters.costThreshold?.min || ""}
                      onChange={(e) => 
                        handleFilterChange("costThreshold")({
                          ...filters.costThreshold,
                          min: e.target.value ? parseFloat(e.target.value) : undefined
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Maximum Cost Threshold</label>
                    <Input
                      type="number"
                      placeholder="Enter maximum cost"
                      value={filters.costThreshold?.max || ""}
                      onChange={(e) => 
                        handleFilterChange("costThreshold")({
                          ...filters.costThreshold,
                          max: e.target.value ? parseFloat(e.target.value) : undefined
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Display */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.accounts?.map((account) => (
            <Badge key={account} variant="secondary" className="gap-1">
              Account: {filterOptions.accounts.find(a => a.id === account)?.name}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleArrayFilterChange("accounts")(account, false)}
              />
            </Badge>
          ))}
          {filters.services?.map((service) => (
            <Badge key={service} variant="secondary" className="gap-1">
              Service: {service}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleArrayFilterChange("services")(service, false)}
              />
            </Badge>
          ))}
          {filters.regions?.map((region) => (
            <Badge key={region} variant="secondary" className="gap-1">
              Region: {filterOptions.regions.find(r => r.name === region)?.displayName}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleArrayFilterChange("regions")(region, false)}
              />
            </Badge>
          ))}
          {filters.tags && Object.entries(filters.tags).map(([tagKey, tagValues]) =>
            tagValues.map((tagValue) => (
              <Badge key={`${tagKey}-${tagValue}`} variant="secondary" className="gap-1">
                {tagKey}: {tagValue}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleTagFilterChange(tagKey, tagValue, false)}
                />
              </Badge>
            ))
          )}
        </div>
      )}

      {/* Share Card */}
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