/**
 * Used by: sql-lab
 * Purpose: Query history management with recent queries and execution status
 */
"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Clock, ChevronDown, ChevronRight } from 'lucide-react'

interface SqlQueryHistoryProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  queryHistory: string[]
  onQuerySelect: (query: string) => void
}

export default function SqlQueryHistory({ isOpen, onOpenChange, queryHistory, onQuerySelect }: SqlQueryHistoryProps) {
  const truncateQuery = (query: string, maxLength: number = 80) => {
    const cleanQuery = query.replace(/\s+/g, ' ').trim()
    return cleanQuery.length > maxLength ? cleanQuery.substring(0, maxLength) + '...' : cleanQuery
  }

  const getQueryType = (query: string): string => {
    const upperQuery = query.toUpperCase().trim()
    if (upperQuery.startsWith('SELECT')) return 'SELECT'
    if (upperQuery.startsWith('INSERT')) return 'INSERT'
    if (upperQuery.startsWith('UPDATE')) return 'UPDATE'
    if (upperQuery.startsWith('DELETE')) return 'DELETE'
    if (upperQuery.startsWith('CREATE')) return 'CREATE'
    if (upperQuery.startsWith('DROP')) return 'DROP'
    if (upperQuery.startsWith('ALTER')) return 'ALTER'
    if (upperQuery.startsWith('SHOW')) return 'SHOW'
    if (upperQuery.startsWith('DESCRIBE') || upperQuery.startsWith('DESC')) return 'DESC'
    return 'OTHER'
  }

  const getQueryTypeColor = (type: string): string => {
    switch (type) {
      case 'SELECT': return 'bg-blue-100 text-blue-800'
      case 'INSERT': return 'bg-green-100 text-green-800'
      case 'UPDATE': return 'bg-yellow-100 text-yellow-800'
      case 'DELETE': return 'bg-red-100 text-red-800'
      case 'CREATE': return 'bg-purple-100 text-purple-800'
      case 'DROP': return 'bg-red-100 text-red-800'
      case 'ALTER': return 'bg-orange-100 text-orange-800'
      case 'SHOW': return 'bg-gray-100 text-gray-800'
      case 'DESC': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-2 h-auto">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="font-medium">Query History</span>
            {queryHistory.length > 0 && (
              <Badge variant="secondary" className="text-xs px-1 py-0">
                {queryHistory.length}
              </Badge>
            )}
          </div>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 mt-2">
        {queryHistory.length > 0 ? (
          <ScrollArea className="h-40">
            {queryHistory.map((query, index) => {
              const queryType = getQueryType(query)
              const typeColor = getQueryTypeColor(queryType)
              
              return (
                <div key={index} className="border rounded p-2 mb-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">Query {index + 1}</span>
                      <Badge className={`text-xs px-1 py-0 ${typeColor}`}>
                        {queryType}
                      </Badge>
                    </div>
                    <Button 
                      onClick={() => onQuerySelect(query)} 
                      size="sm" 
                      variant="outline" 
                      className="h-5 text-xs px-2"
                    >
                      Use
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    {truncateQuery(query)}
                  </p>
                </div>
              )
            })}
          </ScrollArea>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-4">
            No query history yet. Execute a query to see it here.
          </p>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

// Component API configuration
const SQL_QUERY_HISTORY_API_CONFIG = {
  relevantFilters: [] as string[], // History is user-specific, no filters needed
  endpoint: '/api/sql-lab/query-history',
  cacheDuration: 5 * 60 * 1000, // 5 minutes
}

// Export API configuration for documentation
export { SQL_QUERY_HISTORY_API_CONFIG }