/**
 * Used by: sql-lab
 * Purpose: Display SQL query execution results with export and save functionality
 */
"use client"

import React, { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Save, CheckCircle, Clock, Eye, Search, Filter, ChevronUp, ChevronDown } from 'lucide-react'

interface QueryResult {
  headers: string[]
  rows: (string | number | null)[][]
  executionTime: number
  rowCount: number
  queryName?: string
  executedAt: string
}

interface SavedResult {
  id: string
  name: string
  query: string
  result: QueryResult
  savedAt: string
}

interface SqlQueryResultsProps {
  results: QueryResult | null
  currentQuery: string
  onSaveResult?: (savedResult: SavedResult) => void
}

export default function SqlQueryResults({ results, currentQuery, onSaveResult }: SqlQueryResultsProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [resultName, setResultName] = useState('')
  
  // Filtering and sorting state
  const [globalSearch, setGlobalSearch] = useState('')
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({})
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [showFilters, setShowFilters] = useState(false)

  // Filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    if (!results) return { headers: [], rows: [] }
    
    let filteredRows = results.rows
    
    // Apply global search
    if (globalSearch.trim()) {
      const searchTerm = globalSearch.toLowerCase()
      filteredRows = filteredRows.filter(row =>
        row.some(cell => 
          String(cell || '').toLowerCase().includes(searchTerm)
        )
      )
    }
    
    // Apply column-specific filters
    Object.entries(columnFilters).forEach(([columnName, filterValue]) => {
      if (filterValue.trim()) {
        const columnIndex = results.headers.indexOf(columnName)
        if (columnIndex >= 0) {
          const filterTerm = filterValue.toLowerCase()
          filteredRows = filteredRows.filter(row =>
            String(row[columnIndex] || '').toLowerCase().includes(filterTerm)
          )
        }
      }
    })
    
    // Apply sorting
    if (sortColumn) {
      const columnIndex = results.headers.indexOf(sortColumn)
      if (columnIndex >= 0) {
        filteredRows = [...filteredRows].sort((a, b) => {
          const aVal = a[columnIndex]
          const bVal = b[columnIndex]
          
          // Handle null/undefined values
          if (aVal === null || aVal === undefined) return 1
          if (bVal === null || bVal === undefined) return -1
          
          // Try numeric comparison first
          const aNum = Number(aVal)
          const bNum = Number(bVal)
          if (!isNaN(aNum) && !isNaN(bNum)) {
            return sortDirection === 'asc' ? aNum - bNum : bNum - aNum
          }
          
          // String comparison
          const aStr = String(aVal).toLowerCase()
          const bStr = String(bVal).toLowerCase()
          if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1
          if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1
          return 0
        })
      }
    }
    
    return {
      headers: results.headers,
      rows: filteredRows
    }
  }, [results, globalSearch, columnFilters, sortColumn, sortDirection])

  const handleSort = (columnName: string) => {
    if (sortColumn === columnName) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnName)
      setSortDirection('asc')
    }
  }

  const handleColumnFilter = (columnName: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [columnName]: value
    }))
  }

  const clearAllFilters = () => {
    setGlobalSearch('')
    setColumnFilters({})
    setSortColumn(null)
    setSortDirection('asc')
  }

  const downloadCSV = () => {
    if (!results) return

    const csvContent = [
      filteredAndSortedData.headers.join(','),
      ...filteredAndSortedData.rows.map(row => row.map(cell => 
        typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
      ).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `query_results_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const saveResults = () => {
    if (!results || !resultName.trim() || !onSaveResult) return

    const savedResult: SavedResult = {
      id: `result_${Date.now()}`,
      name: resultName.trim(),
      query: currentQuery,
      result: results,
      savedAt: new Date().toISOString()
    }

    onSaveResult(savedResult)
    setSaveDialogOpen(false)
    setResultName('')
  }

  const formatValue = (value: string | number | null): string => {
    if (value === null || value === undefined) return '-'
    if (typeof value === 'number') {
      if (value % 1 === 0) return value.toLocaleString()
      return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
    return String(value)
  }

  const getStatusBadge = () => {
    if (!results) return null
    
    const isLargeResult = results.rowCount > 1000
    const isSlowQuery = results.executionTime > 5000
    const filteredCount = filteredAndSortedData.rows.length
    const isFiltered = filteredCount !== results.rowCount
    
    return (
      <div className="flex gap-2">
        <Badge variant="outline" className="text-xs">
          <Clock className="h-3 w-3 mr-1" />
          {results.executionTime.toFixed(0)}ms
        </Badge>
        <Badge variant="outline" className="text-xs">
          <Eye className="h-3 w-3 mr-1" />
          {isFiltered ? `${filteredCount} / ${results.rowCount}` : `${results.rowCount}`} rows
        </Badge>
        {isLargeResult && (
          <Badge variant="secondary" className="text-xs">
            Large Result
          </Badge>
        )}
        {isSlowQuery && (
          <Badge variant="destructive" className="text-xs">
            Slow Query
          </Badge>
        )}
        {isFiltered && (
          <Badge variant="blue" className="text-xs">
            Filtered
          </Badge>
        )}
      </div>
    )
  }

  if (!results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Query Results</CardTitle>
          <CardDescription>Execute a query to see results here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <div className="text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No results to display</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Query Results</CardTitle>
            <CardDescription>
              Executed at {new Date(results.executedAt).toLocaleString()}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <Button size="sm" variant="outline" onClick={downloadCSV}>
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              
              {onSaveResult && (
                <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save Query Results</DialogTitle>
                      <DialogDescription>
                        Give your results a name to save them for later reference.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="result-name">Result Name</Label>
                        <Input
                          id="result-name"
                          value={resultName}
                          onChange={(e) => setResultName(e.target.value)}
                          placeholder="e.g., Monthly EC2 Costs Analysis"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={saveResults} 
                        disabled={!resultName.trim()}
                      >
                        Save Results
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtering Controls */}
        {showFilters && (
          <div className="mb-4 space-y-4 p-4 border rounded-lg bg-muted/20">
            {/* Global Search */}
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Search across all columns..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="max-w-sm"
              />
              <Button 
                size="sm" 
                variant="outline" 
                onClick={clearAllFilters}
                disabled={!globalSearch && Object.keys(columnFilters).length === 0 && !sortColumn}
              >
                Clear All
              </Button>
            </div>
            
            {/* Column-specific filters */}
            {results && results.headers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {results.headers.slice(0, 9).map((header) => ( // Limit to first 9 columns to avoid UI clutter
                  <div key={header} className="space-y-1">
                    <Label className="text-xs text-muted-foreground">{header}</Label>
                    <Input
                      placeholder={`Filter ${header}...`}
                      value={columnFilters[header] || ''}
                      onChange={(e) => handleColumnFilter(header, e.target.value)}
                      className="text-xs h-8"
                    />
                  </div>
                ))}
                {results.headers.length > 9 && (
                  <div className="text-xs text-muted-foreground self-end pb-2">
                    + {results.headers.length - 9} more columns
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        <div className="border rounded-lg overflow-auto max-h-96">
          <Table>
            <TableHeader>
              <TableRow>
                {filteredAndSortedData.headers.map((header, index) => (
                  <TableHead 
                    key={index} 
                    className="font-semibold bg-muted/50 cursor-pointer hover:bg-muted/70 select-none"
                    onClick={() => handleSort(header)}
                  >
                    <div className="flex items-center gap-1">
                      {header}
                      {sortColumn === header && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="h-3 w-3" /> : 
                          <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} className="font-mono text-xs">
                      {formatValue(cell)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {results.rowCount > 100 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border">
            <p className="text-sm text-blue-800">
              <strong>Performance tip:</strong> Large result sets can impact performance. 
              Consider adding LIMIT clauses or filtering your data for better performance.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Component API configuration
const SQL_QUERY_RESULTS_API_CONFIG = {
  relevantFilters: [] as string[], // Results are specific to executed queries
  endpoint: '/api/sql-lab/query-results',
  cacheDuration: 0, // No caching for live query results
}

// Export API configuration for documentation
export { SQL_QUERY_RESULTS_API_CONFIG, type QueryResult, type SavedResult }