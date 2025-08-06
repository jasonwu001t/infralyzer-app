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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Download, Save, CheckCircle, Clock, Eye, Search, Filter, ChevronUp, ChevronDown, FilterX, Maximize2, Minimize2, X, Table2 } from 'lucide-react'

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
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Filtering and sorting state
  const [globalSearch, setGlobalSearch] = useState('')
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({})
  const [excelFilters, setExcelFilters] = useState<Record<string, Set<string>>>({})
  const [numericFilters, setNumericFilters] = useState<Record<string, { operator: string; value: string }>>({})
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
    
    // Apply Excel-style filters
    Object.entries(excelFilters).forEach(([columnName, selectedValues]) => {
      if (selectedValues.size > 0) {
        const columnIndex = results.headers.indexOf(columnName)
        if (columnIndex >= 0) {
          filteredRows = filteredRows.filter(row => {
            const cellValue = String(row[columnIndex] || '')
            return selectedValues.has(cellValue)
          })
        }
      }
    })
    
    // Apply numeric filters
    Object.entries(numericFilters).forEach(([columnName, filter]) => {
      if (filter.operator && filter.value.trim()) {
        const columnIndex = results.headers.indexOf(columnName)
        if (columnIndex >= 0) {
          const filterValue = parseFloat(filter.value)
          if (!isNaN(filterValue)) {
            filteredRows = filteredRows.filter(row => {
              const cellValue = parseFloat(String(row[columnIndex] || ''))
              if (isNaN(cellValue)) return false
              
              switch (filter.operator) {
                case '>': return cellValue > filterValue
                case '<': return cellValue < filterValue
                case '>=': return cellValue >= filterValue
                case '<=': return cellValue <= filterValue
                case '=': return cellValue === filterValue
                case '!=': return cellValue !== filterValue
                default: return true
              }
            })
          }
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
      }, [results, globalSearch, columnFilters, excelFilters, numericFilters, sortColumn, sortDirection])

  // Get unique values for Excel-style filters
  const getUniqueValues = (columnName: string): string[] => {
    if (!results) return []
    const columnIndex = results.headers.indexOf(columnName)
    if (columnIndex < 0) return []
    
    const uniqueValues = new Set<string>()
    results.rows.forEach(row => {
      const value = String(row[columnIndex] || '')
      uniqueValues.add(value)
    })
    
    return Array.from(uniqueValues).sort()
  }

  // Check if a column contains mostly numeric values
  const isNumericColumn = (columnName: string): boolean => {
    if (!results) return false
    const columnIndex = results.headers.indexOf(columnName)
    if (columnIndex < 0) return false
    
    const sampleSize = Math.min(100, results.rows.length) // Check first 100 rows
    let numericCount = 0
    
    for (let i = 0; i < sampleSize; i++) {
      const value = results.rows[i][columnIndex]
      if (value !== null && value !== undefined && value !== '') {
        const num = parseFloat(String(value))
        if (!isNaN(num)) {
          numericCount++
        }
      }
    }
    
    // Consider it numeric if more than 70% of non-empty values are numbers
    const nonEmptyCount = results.rows.slice(0, sampleSize).filter(row => {
      const value = row[columnIndex]
      return value !== null && value !== undefined && value !== ''
    }).length
    
    return nonEmptyCount > 0 && (numericCount / nonEmptyCount) > 0.7
  }

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

  const handleExcelFilter = (columnName: string, value: string, checked: boolean) => {
    setExcelFilters(prev => {
      const newFilters = { ...prev }
      if (!newFilters[columnName]) {
        newFilters[columnName] = new Set()
      }
      
      if (checked) {
        newFilters[columnName].add(value)
      } else {
        newFilters[columnName].delete(value)
        if (newFilters[columnName].size === 0) {
          delete newFilters[columnName]
        }
      }
      
      return newFilters
    })
  }

  const selectAllValues = (columnName: string) => {
    const uniqueValues = getUniqueValues(columnName)
    setExcelFilters(prev => ({
      ...prev,
      [columnName]: new Set(uniqueValues)
    }))
  }

  const deselectAllValues = (columnName: string) => {
    setExcelFilters(prev => {
      const newFilters = { ...prev }
      delete newFilters[columnName]
      return newFilters
    })
  }

  const handleNumericFilter = (columnName: string, operator: string, value: string) => {
    if (!operator || !value.trim()) {
      setNumericFilters(prev => {
        const newFilters = { ...prev }
        delete newFilters[columnName]
        return newFilters
      })
    } else {
      setNumericFilters(prev => ({
        ...prev,
        [columnName]: { operator, value }
      }))
    }
  }

  const clearAllFilters = () => {
    setGlobalSearch('')
    setColumnFilters({})
    setExcelFilters({})
    setNumericFilters({})
    setSortColumn(null)
    setSortDirection('asc')
  }

  const hasActiveFilters = () => {
    return globalSearch.length > 0 ||
           Object.keys(columnFilters).length > 0 ||
           Object.keys(excelFilters).length > 0 ||
           Object.keys(numericFilters).length > 0 ||
           sortColumn !== null
  }

  // Excel-style filter dropdown component
  const ExcelFilter = ({ columnName }: { columnName: string }) => {
    const [filterSearch, setFilterSearch] = useState('')
    const [numericMode, setNumericMode] = useState(false)
    const uniqueValues = getUniqueValues(columnName)
    const selectedValues = excelFilters[columnName] || new Set()
    const numericFilter = numericFilters[columnName] || { operator: '', value: '' }
    const isNumeric = isNumericColumn(columnName)
    const hasFilter = selectedValues.size > 0 || (numericFilter.operator && numericFilter.value)
    
    // Filter unique values based on search
    const filteredUniqueValues = uniqueValues.filter(value =>
      String(value).toLowerCase().includes(filterSearch.toLowerCase())
    )
    
    const allSelected = selectedValues.size === uniqueValues.length
    
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-6 w-6 p-0 hover:bg-muted/70 ${hasFilter ? 'text-blue-600' : 'text-muted-foreground'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Filter className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Filter: {columnName}</span>
              <div className="flex items-center gap-1">
                {isNumeric && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => setNumericMode(!numericMode)}
                  >
                    {numericMode ? 'List' : 'Numbers'}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={() => {
                    deselectAllValues(columnName)
                    handleNumericFilter(columnName, '', '')
                  }}
                >
                  <FilterX className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-3">
            {/* Numeric Mode */}
            {isNumeric && numericMode ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={numericFilter.operator}
                    onValueChange={(value) => handleNumericFilter(columnName, value, numericFilter.value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Op" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=">">&gt;</SelectItem>
                      <SelectItem value=">=">&gt;=</SelectItem>
                      <SelectItem value="<">&lt;</SelectItem>
                      <SelectItem value="<=">&lt;=</SelectItem>
                      <SelectItem value="=">=</SelectItem>
                      <SelectItem value="!=">!=</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Value"
                    type="number"
                    value={numericFilter.value}
                    onChange={(e) => handleNumericFilter(columnName, numericFilter.operator, e.target.value)}
                    className="text-xs h-8 col-span-2"
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Enter numeric comparison (e.g., &gt; 100)
                </div>
              </div>
            ) : (
              <>
                {/* Search within filter values */}
                <div className="mb-3">
                  <Input
                    placeholder="Search values..."
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <Checkbox
                    id={`select-all-${columnName}`}
                    checked={allSelected}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        selectAllValues(columnName)
                      } else {
                        deselectAllValues(columnName)
                      }
                    }}
                  />
                  <Label htmlFor={`select-all-${columnName}`} className="text-sm font-medium">
                    Select All ({filteredUniqueValues.length}/{uniqueValues.length})
                  </Label>
                </div>
                
                <Separator className="mb-3" />
                
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredUniqueValues.slice(0, 100).map((value, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Checkbox
                        id={`${columnName}-${index}`}
                        checked={selectedValues.has(value)}
                        onCheckedChange={(checked) => {
                          handleExcelFilter(columnName, value, checked as boolean)
                        }}
                      />
                      <Label
                        htmlFor={`${columnName}-${index}`}
                        className="text-xs font-mono cursor-pointer flex-1 truncate"
                        title={value}
                      >
                        {value || '(empty)'}
                      </Label>
                    </div>
                  ))}
                  {filteredUniqueValues.length > 100 && (
                    <div className="text-xs text-muted-foreground text-center py-2">
                      Showing first 100 of {filteredUniqueValues.length} filtered values
                    </div>
                  )}
                  {filteredUniqueValues.length === 0 && filterSearch && (
                    <div className="text-xs text-muted-foreground text-center py-2">
                      No values match "{filterSearch}"
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    )
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
    const isFiltered = filteredCount !== results.rowCount || Object.keys(excelFilters).length > 0 || Object.keys(numericFilters).length > 0
    
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
          <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
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

  const ResultsContent = () => (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Table2 className="h-5 w-5 text-orange-600" />
              Query Results
            </CardTitle>
            <CardDescription className="text-sm">
              Executed at {new Date(results.executedAt).toLocaleString()}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setShowFilters(!showFilters)}
                className="h-8 px-3 text-xs"
              >
                <Filter className="h-3 w-3 mr-1" />
                Filters
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                className="h-8 px-3 text-xs"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-3 w-3 mr-1" />
                ) : (
                  <Maximize2 className="h-3 w-3 mr-1" />
                )}
                {isFullscreen ? "Exit" : "Expand"}
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={downloadCSV}
                className="h-8 px-3 text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                CSV
              </Button>
              
              {onSaveResult && (
                <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-8 px-3 text-xs"
                    >
                      <Save className="h-3 w-3 mr-1" />
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
      <CardContent className="p-6">
        {/* Filtering Controls */}
        {showFilters && (
          <div className="mb-6 space-y-4 p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Data Filters</Label>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={clearAllFilters}
                disabled={!hasActiveFilters()}
                className="h-7 px-3 text-xs"
              >
                <FilterX className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>
            
            {/* Global Search */}
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search across all columns..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="max-w-sm text-sm"
              />
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
        
        <div className="flex-1 overflow-hidden p-4">
          <div className="h-full border rounded-lg overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                {filteredAndSortedData.headers.map((header, index) => (
                  <TableHead 
                    key={index} 
                    className="font-semibold bg-muted/50 select-none p-2 min-w-[120px] border-r last:border-r-0"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div 
                        className="flex items-center gap-1 cursor-pointer hover:text-blue-600 flex-1"
                        onClick={() => handleSort(header)}
                      >
                        <span className="truncate" title={header}>{header}</span>
                        {sortColumn === header && (
                          sortDirection === 'asc' ? 
                            <ChevronUp className="h-3 w-3" /> : 
                            <ChevronDown className="h-3 w-3" />
                        )}
                      </div>
                      <ExcelFilter columnName={header} />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-muted/50">
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} className="font-mono text-xs border-r last:border-r-0">
                      {formatValue(cell)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
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

  // Fullscreen mode
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="h-full flex flex-col">
          {/* Fullscreen Header */}
          <div className="border-b bg-card p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Query Results (Fullscreen)</h2>
                <p className="text-sm text-muted-foreground">
                  Executed at {new Date(results.executedAt).toLocaleString()}
                </p>
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
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsFullscreen(false)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Fullscreen Content */}
          <div className="flex-1 overflow-hidden p-4">
            <div className="h-full flex flex-col">
              {/* Filters Panel */}
              {showFilters && (
                <div className="mb-4 p-4 border rounded-lg bg-muted/20 flex-shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm">Filters</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={clearAllFilters}
                      disabled={!hasActiveFilters()}
                    >
                      <FilterX className="h-4 w-4 mr-1" />
                      Clear All
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label className="text-xs font-medium">Global Search</Label>
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search all columns..."
                          value={globalSearch}
                          onChange={(e) => setGlobalSearch(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    
                    {results.headers.slice(0, 3).map((header) => (
                      <div key={header}>
                        <Label className="text-xs font-medium">{header}</Label>
                        <Input
                          placeholder={`Filter ${header}...`}
                          value={columnFilters[header] || ''}
                          onChange={(e) => setColumnFilters(prev => ({
                            ...prev,
                            [header]: e.target.value
                          }))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Results Table with Full Height */}
              <div className="flex-1 overflow-hidden border rounded-lg">
                <div className="h-full overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow>
                        {results.headers.map((header, index) => (
                          <TableHead key={index} className="border-r last:border-r-0 relative min-w-[120px]">
                            <div className="flex items-center justify-between">
                              <div 
                                className="flex items-center gap-1 cursor-pointer select-none"
                                onClick={() => handleSort(header)}
                              >
                                <span className="truncate font-medium text-xs">{header}</span>
                                {sortColumn === header && (
                                  sortDirection === 'asc' ? (
                                    <ChevronUp className="h-3 w-3" />
                                  ) : (
                                    <ChevronDown className="h-3 w-3" />
                                  )
                                )}
                              </div>
                              <ExcelFilter columnName={header} />
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedData.rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex} className="hover:bg-muted/50">
                          {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex} className="border-r last:border-r-0 text-xs font-mono">
                              {formatValue(cell)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Normal mode
  return <ResultsContent />
}

// Component API configuration
const SQL_QUERY_RESULTS_API_CONFIG = {
  relevantFilters: [] as string[], // Results are specific to executed queries
  endpoint: '/api/sql-lab/query-results',
  cacheDuration: 0, // No caching for live query results
}

// Export API configuration for documentation
export { SQL_QUERY_RESULTS_API_CONFIG, type QueryResult, type SavedResult }