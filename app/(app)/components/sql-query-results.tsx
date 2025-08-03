/**
 * Used by: sql-lab
 * Purpose: Display SQL query execution results with export and save functionality
 */
"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Download, Save, CheckCircle, Clock, Eye } from 'lucide-react'

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

  const downloadCSV = () => {
    if (!results) return

    const csvContent = [
      results.headers.join(','),
      ...results.rows.map(row => row.map(cell => 
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
    
    return (
      <div className="flex gap-2">
        <Badge variant="outline" className="text-xs">
          <Clock className="h-3 w-3 mr-1" />
          {results.executionTime.toFixed(0)}ms
        </Badge>
        <Badge variant="outline" className="text-xs">
          <Eye className="h-3 w-3 mr-1" />
          {results.rowCount} rows
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
        <div className="border rounded-lg overflow-auto max-h-96">
          <Table>
            <TableHeader>
              <TableRow>
                {results.headers.map((header, index) => (
                  <TableHead key={index} className="font-semibold bg-muted/50">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.rows.map((row, rowIndex) => (
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