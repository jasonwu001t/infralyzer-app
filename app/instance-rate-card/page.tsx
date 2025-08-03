"use client"

import React, { useState, useEffect, useMemo } from 'react'
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  TrendingDown, 
  TrendingUp,
  Server,
  Cpu,
  HardDrive,
  Network,
  DollarSign,
  Clock,
  Shield,
  BarChart3
} from 'lucide-react'

interface InstancePricing {
  instance_type: string
  metadata: {
    vcpu: string
    memory: string
    storage: string
    network_performance: string
    instance_family?: string
  }
  pricing: {
    ondemand: {
      hourly_price: number
      monthly_price: number
      savings_vs_ondemand_pct: number
    }
    spot: {
      hourly_price: number
      monthly_price: number
      savings_vs_ondemand_pct: number
    }
    reserved_1yr: {
      hourly_price: number
      monthly_price: number
      savings_vs_ondemand_pct: number
    }
    savings_plan: {
      hourly_price: number
      monthly_price: number
      savings_vs_ondemand_pct: number
    }
  }
}

interface ApiResponse {
  success: boolean
  data: InstancePricing[]
  region: string
  operating_system: string
  timestamp: string
}

export default function InstanceRateCardPage() {
  const [pricingData, setPricingData] = useState<InstancePricing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('us-east-1')
  const [selectedOS, setSelectedOS] = useState('Linux')
  const [selectedFamily, setSelectedFamily] = useState('all')
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  }>({ key: 'instance_type', direction: 'asc' })

  const regions = [
    { value: 'us-east-1', label: 'US East (N. Virginia)' },
    { value: 'us-west-2', label: 'US West (Oregon)' },
    { value: 'eu-west-1', label: 'Europe (Ireland)' },
    { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' }
  ]

  const instanceFamilies = [
    { value: 'all', label: 'All Families' },
    { value: 't3', label: 'T3 - Burstable Performance' },
    { value: 'c5', label: 'C5 - Compute Optimized' },
    { value: 'm5', label: 'M5 - General Purpose' },
    { value: 'r5', label: 'R5 - Memory Optimized' }
  ]

  const fetchPricingData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/aws-pricing?region=${selectedRegion}&os=${selectedOS}`)
      const result: ApiResponse = await response.json()
      
      if (result.success) {
        setPricingData(result.data)
      } else {
        setError('Failed to fetch pricing data')
      }
    } catch (err) {
      setError('Network error while fetching data')
      console.error('Error fetching pricing data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPricingData()
  }, [selectedRegion, selectedOS])

  const filteredAndSortedData = useMemo(() => {
    const filtered = pricingData.filter(item => {
      const matchesSearch = item.instance_type.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFamily = selectedFamily === 'all' || 
        item.metadata.instance_family === selectedFamily ||
        item.instance_type.startsWith(selectedFamily)
      
      return matchesSearch && matchesFamily
    })

    // Sort data
    filtered.sort((a, b) => {
      let aValue: string | number | undefined
      let bValue: string | number | undefined

      if (sortConfig.key.includes('.')) {
        const keys = sortConfig.key.split('.')
        aValue = keys.reduce((obj: Record<string, unknown>, key: string) => obj?.[key] as Record<string, unknown>, a as Record<string, unknown>) as string | number | undefined
        bValue = keys.reduce((obj: Record<string, unknown>, key: string) => obj?.[key] as Record<string, unknown>, b as Record<string, unknown>) as string | number | undefined
      } else {
        aValue = (a as Record<string, string | number>)[sortConfig.key]
        bValue = (b as Record<string, string | number>)[sortConfig.key]
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return 0
    })

    return filtered
  }, [pricingData, searchTerm, selectedFamily, sortConfig])

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(4)}`
  }

  const formatSavings = (savings: number) => {
    if (savings <= 0) return null
    return (
      <Badge variant="secondary" className="text-green-600">
        -{savings.toFixed(1)}%
      </Badge>
    )
  }

  const exportData = () => {
    const csv = [
      ['Instance Type', 'vCPUs', 'Memory', 'Storage', 'Network Performance', 
       'On-Demand Hourly', 'Spot Hourly', 'Reserved 1yr Hourly', 'Savings Plan Hourly'],
      ...filteredAndSortedData.map(item => [
        item.instance_type,
        item.metadata.vcpu,
        item.metadata.memory,
        item.metadata.storage,
        item.metadata.network_performance,
        item.pricing.ondemand.hourly_price,
        item.pricing.spot.hourly_price,
        item.pricing.reserved_1yr.hourly_price,
        item.pricing.savings_plan.hourly_price
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `instance-rate-card-${selectedRegion}-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            <span className="text-lg font-bold">Infralyzer</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/#features" className="text-sm font-medium hover:underline">
              Features
            </Link>
            <Link href="/#ai-insights" className="text-sm font-medium hover:underline">
              AI Insights
            </Link>
            <Link href="/instance-rate-card" className="text-sm font-medium hover:underline text-primary">
              Instance Rate Card
            </Link>
            <Link href="/#multicloud" className="text-sm font-medium hover:underline">
              Multi-Cloud
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto space-y-6 p-8 pt-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">Instance Rate Card</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col justify-between space-y-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Instance Rate Card</h1>
            <p className="text-muted-foreground">
              Compare EC2 instance pricing across different purchasing options - similar to {' '}
              <a 
                href="https://instances.vantage.sh/?id=fccadbaa38d870b3d52e6307bc9325d186bf0d80" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Vantage instances tool
              </a>
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Server className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium leading-none">
                    Total Instances
                  </p>
                  <p className="text-2xl font-bold">
                    {filteredAndSortedData.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium leading-none">
                    Avg Spot Savings
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {filteredAndSortedData.length > 0 
                      ? (filteredAndSortedData.reduce((acc, item) => 
                          acc + item.pricing.spot.savings_vs_ondemand_pct, 0) / filteredAndSortedData.length
                        ).toFixed(1) + '%'
                      : '0%'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium leading-none">
                    Avg Reserved Savings
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {filteredAndSortedData.length > 0 
                      ? (filteredAndSortedData.reduce((acc, item) => 
                          acc + item.pricing.reserved_1yr.savings_vs_ondemand_pct, 0) / filteredAndSortedData.length
                        ).toFixed(1) + '%'
                      : '0%'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium leading-none">
                    Region
                  </p>
                  <p className="text-2xl font-bold">
                    {regions.find(r => r.value === selectedRegion)?.label.split(' ')[0] || selectedRegion}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Instances</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="e.g., t3.micro, c5.large"
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="family">Instance Family</Label>
                <Select value={selectedFamily} onValueChange={setSelectedFamily}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select family" />
                  </SelectTrigger>
                  <SelectContent>
                    {instanceFamilies.map((family) => (
                      <SelectItem key={family.value} value={family.value}>
                        {family.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="os">Operating System</Label>
                <Select value={selectedOS} onValueChange={setSelectedOS}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select OS" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Linux">Linux</SelectItem>
                    <SelectItem value="Windows">Windows</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={fetchPricingData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Table */}
        <Card>
          <CardHeader>
            <CardTitle>Instance Pricing Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading pricing data...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64 text-red-500">
                <span>Error: {error}</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => handleSort('instance_type')}
                      >
                        Instance Type
                        {sortConfig.key === 'instance_type' && (
                          sortConfig.direction === 'asc' ? <TrendingUp className="inline h-4 w-4 ml-1" /> : <TrendingDown className="inline h-4 w-4 ml-1" />
                        )}
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => handleSort('metadata.vcpu')}
                      >
                        <div className="flex items-center gap-1">
                          <Cpu className="h-4 w-4" />
                          vCPUs
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => handleSort('metadata.memory')}
                      >
                        <div className="flex items-center gap-1">
                          <HardDrive className="h-4 w-4" />
                          Memory
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <Network className="h-4 w-4" />
                          Network
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => handleSort('pricing.ondemand.hourly_price')}
                      >
                        On-Demand
                        {sortConfig.key === 'pricing.ondemand.hourly_price' && (
                          sortConfig.direction === 'asc' ? <TrendingUp className="inline h-4 w-4 ml-1" /> : <TrendingDown className="inline h-4 w-4 ml-1" />
                        )}
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => handleSort('pricing.spot.hourly_price')}
                      >
                        Spot
                        {sortConfig.key === 'pricing.spot.hourly_price' && (
                          sortConfig.direction === 'asc' ? <TrendingUp className="inline h-4 w-4 ml-1" /> : <TrendingDown className="inline h-4 w-4 ml-1" />
                        )}
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => handleSort('pricing.reserved_1yr.hourly_price')}
                      >
                        Reserved (1yr)
                        {sortConfig.key === 'pricing.reserved_1yr.hourly_price' && (
                          sortConfig.direction === 'asc' ? <TrendingUp className="inline h-4 w-4 ml-1" /> : <TrendingDown className="inline h-4 w-4 ml-1" />
                        )}
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => handleSort('pricing.savings_plan.hourly_price')}
                      >
                        Savings Plan
                        {sortConfig.key === 'pricing.savings_plan.hourly_price' && (
                          sortConfig.direction === 'asc' ? <TrendingUp className="inline h-4 w-4 ml-1" /> : <TrendingDown className="inline h-4 w-4 ml-1" />
                        )}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedData.map((instance) => (
                      <TableRow key={instance.instance_type} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <Badge variant="outline">{instance.instance_type}</Badge>
                        </TableCell>
                        <TableCell>{instance.metadata.vcpu}</TableCell>
                        <TableCell>{instance.metadata.memory}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {instance.metadata.network_performance}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">{formatPrice(instance.pricing.ondemand.hourly_price)}/hr</span>
                            <span className="text-xs text-muted-foreground">
                              ${instance.pricing.ondemand.monthly_price.toFixed(2)}/mo
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">{formatPrice(instance.pricing.spot.hourly_price)}/hr</span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">
                                ${instance.pricing.spot.monthly_price.toFixed(2)}/mo
                              </span>
                              {formatSavings(instance.pricing.spot.savings_vs_ondemand_pct)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">{formatPrice(instance.pricing.reserved_1yr.hourly_price)}/hr</span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">
                                ${instance.pricing.reserved_1yr.monthly_price.toFixed(2)}/mo
                              </span>
                              {formatSavings(instance.pricing.reserved_1yr.savings_vs_ondemand_pct)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">{formatPrice(instance.pricing.savings_plan.hourly_price)}/hr</span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">
                                ${instance.pricing.savings_plan.monthly_price.toFixed(2)}/mo
                              </span>
                              {formatSavings(instance.pricing.savings_plan.savings_vs_ondemand_pct)}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Need More Advanced FinOps Features?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get access to comprehensive cost analytics, AI-powered optimization recommendations, 
                multi-cloud support, and advanced reporting with our full platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/login">
                    Explore Full Platform
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">
                    Start Free Trial
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-12">
        <div className="container mx-auto px-4 py-8 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <span className="font-bold">Infralyzer</span>
              <span className="text-muted-foreground">- Instance Rate Card</span>
            </div>
            <div className="flex gap-4 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link>
              <Link href="/#features" className="text-muted-foreground hover:text-foreground">Features</Link>
              <Link href="/login" className="text-muted-foreground hover:text-foreground">Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}