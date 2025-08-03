// Shared Dashboard Filter Management
// Handles filters across multiple dashboard components

import React, { createContext, useContext, useState, useEffect } from 'react'

// Dashboard filter types
export interface DashboardFilters {
  dateRange: {
    start: string
    end: string
    preset?: 'mtd' | 'last-month' | 'last-3-months' | 'ytd' | 'custom'
  }
  services: string[]
  accounts: string[]
  regions: string[]
  environments: string[]
  costTypes: ('list' | 'billed' | 'effective')[]
  tags: Record<string, string[]>
  minCost?: number
  granularity: 'daily' | 'weekly' | 'monthly'
}

// Default filters
export const DEFAULT_FILTERS: DashboardFilters = {
  dateRange: {
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    end: new Date().toISOString(),
    preset: 'mtd'
  },
  services: [],
  accounts: [],
  regions: [],
  environments: [],
  costTypes: ['effective'],
  tags: {},
  granularity: 'daily'
}

// Filter context
const DashboardFilterContext = createContext<{
  filters: DashboardFilters
  updateFilters: (updates: Partial<DashboardFilters>) => void
  resetFilters: () => void
  isLoading: boolean
} | null>(null)

// Custom hook for dashboard filters
export function useDashboardFilters() {
  const context = useContext(DashboardFilterContext)
  
  // Always initialize fallback hooks
  const [fallbackFilters, setFallbackFilters] = useState<DashboardFilters>(DEFAULT_FILTERS)
  const [fallbackIsLoading, setFallbackIsLoading] = useState(false)

  if (!context) {
    // Return fallback implementation for components used outside provider
    return {
      filters: fallbackFilters,
      updateFilters: (updates: Partial<DashboardFilters>) => {
        setFallbackIsLoading(true)
        setFallbackFilters(prev => ({ ...prev, ...updates }))
        // Simulate filter application delay
        setTimeout(() => setFallbackIsLoading(false), 500)
      },
      resetFilters: () => {
        setFallbackIsLoading(true)
        setFallbackFilters(DEFAULT_FILTERS)
        setTimeout(() => setFallbackIsLoading(false), 300)
      },
      isLoading: fallbackIsLoading
    }
  }
  return context
}

// Filter utilities
export const filterUtils = {
  // Check if filters are applied
  hasActiveFilters: (filters: DashboardFilters): boolean => {
    return filters.services.length > 0 ||
           filters.accounts.length > 0 ||
           filters.regions.length > 0 ||
           filters.environments.length > 0 ||
           Object.keys(filters.tags).length > 0 ||
           filters.minCost !== undefined
  },

  // Get filter summary for display
  getFilterSummary: (filters: DashboardFilters): string => {
    const parts = []
    if (filters.services.length > 0) parts.push(`${filters.services.length} services`)
    if (filters.accounts.length > 0) parts.push(`${filters.accounts.length} accounts`)
    if (filters.regions.length > 0) parts.push(`${filters.regions.length} regions`)
    if (filters.environments.length > 0) parts.push(`${filters.environments.length} environments`)
    if (Object.keys(filters.tags).length > 0) parts.push(`${Object.keys(filters.tags).length} tag filters`)
    if (filters.minCost) parts.push(`min cost $${filters.minCost}`)
    
    return parts.length > 0 ? parts.join(', ') : 'No filters applied'
  },

  // Convert filters to API query parameters
  toQueryParams: (filters: DashboardFilters): Record<string, any> => {
    return {
      startDate: filters.dateRange.start,
      endDate: filters.dateRange.end,
      services: filters.services.join(','),
      accounts: filters.accounts.join(','),
      regions: filters.regions.join(','),
      environments: filters.environments.join(','),
      costTypes: filters.costTypes.join(','),
      granularity: filters.granularity,
      minCost: filters.minCost,
      tags: JSON.stringify(filters.tags)
    }
  },

  // Check if component should refetch data based on filter changes
  shouldRefetch: (prevFilters: DashboardFilters, newFilters: DashboardFilters, relevantKeys: (keyof DashboardFilters)[]): boolean => {
    return relevantKeys.some(key => {
      const prev = prevFilters[key]
      const current = newFilters[key]
      return JSON.stringify(prev) !== JSON.stringify(current)
    })
  }
}

// Hook for components that only care about specific filter changes
export function useFilteredData<T>(
  dataFetcher: (filters: DashboardFilters) => Promise<T>,
  relevantFilters: (keyof DashboardFilters)[],
  dependencies: any[] = []
) {
  const { filters, isLoading: filtersLoading } = useDashboardFilters()
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    const fetchData = async () => {
      if (filtersLoading) return
      
      setIsLoading(true)
      setError(null)

      try {
        const result = await dataFetcher(filters)
        if (!isCancelled) {
          setData(result)
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch data')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isCancelled = true
    }
  }, [filters, filtersLoading, ...dependencies])

  return { data, isLoading, error, refetch: () => dataFetcher(filters) }
}

// Provider component (for dashboard page)
export function DashboardFilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<DashboardFilters>(DEFAULT_FILTERS)
  const [isLoading, setIsLoading] = useState(false)

  const updateFilters = (updates: Partial<DashboardFilters>) => {
    setIsLoading(true)
    setFilters(prev => ({ ...prev, ...updates }))
    
    // Simulate API call delay for filter application
    setTimeout(() => setIsLoading(false), 500)
  }

  const resetFilters = () => {
    setIsLoading(true)
    setFilters(DEFAULT_FILTERS)
    setTimeout(() => setIsLoading(false), 300)
  }

  return React.createElement(
    DashboardFilterContext.Provider,
    {
      value: {
        filters,
        updateFilters,
        resetFilters,
        isLoading
      }
    },
    children
  )
}