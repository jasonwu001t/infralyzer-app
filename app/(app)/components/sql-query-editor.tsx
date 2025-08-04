/**
 * Used by: sql-lab
 * Purpose: Main SQL query editor with syntax highlighting and execution controls
 */
"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Play, Save, Loader2, Code2, Info } from 'lucide-react'

export interface SavedQuery {
  id: string
  name: string
  query: string
  description: string
  createdAt: string
  lastRun: string
  favorite: boolean
}

export interface QueryTemplate {
  id: string
  name: string
  description: string
  query: string
  category: string
}

export interface QueryResult {
  headers: string[]
  rows: any[][]
  executionTime: number
  rowCount: number
  executedAt: string
}



interface SqlQueryEditorProps {
  query: string
  onQueryChange: (query: string) => void
  onExecute: () => void
  isExecuting: boolean
  onSaveQuery?: (savedQuery: SavedQuery) => void
}

export default function SqlQueryEditor({ 
  query, 
  onQueryChange, 
  onExecute, 
  isExecuting, 
  onSaveQuery 
}: SqlQueryEditorProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [queryName, setQueryName] = useState('')
  const [queryDescription, setQueryDescription] = useState('')
  
  // Query parameters state
  const [billingPeriodStart, setBillingPeriodStart] = useState('')
  const [billingPeriodEnd, setBillingPeriodEnd] = useState('')
  const [servicePeriodStart, setServicePeriodStart] = useState('')
  const [servicePeriodEnd, setServicePeriodEnd] = useState('')

  const saveQuery = () => {
    if (!queryName.trim() || !query.trim() || !onSaveQuery) return

    const savedQuery: SavedQuery = {
      id: `query_${Date.now()}`,
      name: queryName.trim(),
      query: query.trim(),
      description: queryDescription.trim(),
      createdAt: new Date().toISOString(),
      lastRun: new Date().toISOString(),
      favorite: false
    }

    onSaveQuery(savedQuery)
    setSaveDialogOpen(false)
    setQueryName('')
    setQueryDescription('')
  }

  const formatQuery = () => {
    // Basic SQL formatting
    const formatted = query
      .replace(/\bSELECT\b/gi, '\nSELECT')
      .replace(/\bFROM\b/gi, '\nFROM')
      .replace(/\bWHERE\b/gi, '\nWHERE')
      .replace(/\bGROUP BY\b/gi, '\nGROUP BY')
      .replace(/\bORDER BY\b/gi, '\nORDER BY')
      .replace(/\bHAVING\b/gi, '\nHAVING')
      .replace(/\bJOIN\b/gi, '\n  JOIN')
      .replace(/\bLEFT JOIN\b/gi, '\n  LEFT JOIN')
      .replace(/\bRIGHT JOIN\b/gi, '\n  RIGHT JOIN')
      .replace(/\bINNER JOIN\b/gi, '\n  INNER JOIN')
      .replace(/\bON\b/gi, '\n    ON')
      .replace(/\bAND\b/gi, '\n    AND')
      .replace(/\bOR\b/gi, '\n    OR')
      .trim()

    onQueryChange(formatted)
  }

  const clearQuery = () => {
    onQueryChange('')
  }

  const insertParameter = (paramType: string) => {
    let paramValue = ''
    let paramName = ''
    
    switch(paramType) {
      case 'billing_start':
        paramValue = billingPeriodStart ? `${billingPeriodStart}T00:00:00Z` : '2024-01-01T00:00:00Z'
        paramName = 'billing_period_start'
        break
      case 'billing_end':
        paramValue = billingPeriodEnd ? `${billingPeriodEnd}T23:59:59Z` : '2024-01-31T23:59:59Z'
        paramName = 'billing_period_end'
        break
      case 'service_start':
        paramValue = servicePeriodStart ? `${servicePeriodStart}T00:00:00Z` : '2024-01-01T00:00:00Z'
        paramName = 'service_period_start'
        break
      case 'service_end':
        paramValue = servicePeriodEnd ? `${servicePeriodEnd}T23:59:59Z` : '2024-01-31T23:59:59Z'
        paramName = 'service_period_end'
        break
    }
    
    const insertion = `'${paramValue}' -- ${paramName}`
    const newQuery = query + (query.trim() ? ' ' : '') + insertion
    onQueryChange(newQuery)
  }

  const insertQuickFilter = (filterType: string) => {
    let filterClause = ''
    
    switch(filterType) {
      case 'date_range':
        const start = billingPeriodStart ? `${billingPeriodStart}T00:00:00Z` : '2024-01-01T00:00:00Z'
        const end = billingPeriodEnd ? `${billingPeriodEnd}T23:59:59Z` : '2024-01-31T23:59:59Z'
        filterClause = `line_item_usage_start_date BETWEEN '${start}' AND '${end}'`
        break
      case 'ec2_only':
        filterClause = `product_product_name = 'Amazon Elastic Compute Cloud - Compute'`
        break
      case 'rds_only':
        filterClause = `product_product_name LIKE '%RDS%'`
        break
      case 'cost_threshold':
        filterClause = `line_item_unblended_cost > 100`
        break
    }
    
    const whereClause = query.toUpperCase().includes('WHERE') ? ` AND ${filterClause}` : ` WHERE ${filterClause}`
    const newQuery = query + whereClause
    onQueryChange(newQuery)
  }



  const validateQuery = () => {
    if (!query.trim()) return { isValid: false, message: 'Query cannot be empty' }
    
    const upperQuery = query.toUpperCase().trim()
    const dangerousKeywords = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER']
    const hasDangerous = dangerousKeywords.some(keyword => upperQuery.includes(keyword))
    
    if (hasDangerous) {
      return { isValid: false, message: 'Destructive operations are not allowed in SQL Lab' }
    }
    
    return { isValid: true, message: '' }
  }

  const validation = validateQuery()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              SQL Query Editor
            </CardTitle>
            <CardDescription>
              Write and execute SQL queries against AWS Cost and Usage Report data
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={formatQuery}
              disabled={!query.trim()}
            >
              Format
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearQuery}
              disabled={!query.trim()}
            >
              Clear
            </Button>
            {onSaveQuery && (
              <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={!query.trim()}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Query</DialogTitle>
                    <DialogDescription>
                      Save this query for future use and easy access.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="query-name">Query Name</Label>
                      <Input
                        id="query-name"
                        value={queryName}
                        onChange={(e) => setQueryName(e.target.value)}
                        placeholder="e.g., Monthly Cost by Service"
                      />
                    </div>
                    <div>
                      <Label htmlFor="query-description">Description (optional)</Label>
                      <Input
                        id="query-description"
                        value={queryDescription}
                        onChange={(e) => setQueryDescription(e.target.value)}
                        placeholder="What does this query do?"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={saveQuery} 
                      disabled={!queryName.trim() || !query.trim()}
                    >
                      Save Query
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Query Parameters Section */}
        <div className="border rounded-lg p-4 bg-muted/20">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium">Query Parameters</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertQuickFilter('date_range')}
                disabled={!billingPeriodStart || !billingPeriodEnd}
              >
                Insert Date Filter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertQuickFilter('ec2_only')}
              >
                EC2 Only
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertQuickFilter('cost_threshold')}
              >
                Cost > $100
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="billing-start" className="text-xs">Billing Period Start</Label>
              <div className="flex gap-1">
                <Input
                  id="billing-start"
                  type="date"
                  value={billingPeriodStart}
                  onChange={(e) => setBillingPeriodStart(e.target.value)}
                  className="text-xs"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertParameter('billing_start')}
                  className="px-2"
                  title="Insert into query"
                >
                  +
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="billing-end" className="text-xs">Billing Period End</Label>
              <div className="flex gap-1">
                <Input
                  id="billing-end"
                  type="date"
                  value={billingPeriodEnd}
                  onChange={(e) => setBillingPeriodEnd(e.target.value)}
                  className="text-xs"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertParameter('billing_end')}
                  className="px-2"
                  title="Insert into query"
                >
                  +
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="service-start" className="text-xs">Service Period Start</Label>
              <div className="flex gap-1">
                <Input
                  id="service-start"
                  type="date"
                  value={servicePeriodStart}
                  onChange={(e) => setServicePeriodStart(e.target.value)}
                  className="text-xs"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertParameter('service_start')}
                  className="px-2"
                  title="Insert into query"
                >
                  +
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="service-end" className="text-xs">Service Period End</Label>
              <div className="flex gap-1">
                <Input
                  id="service-end"
                  type="date"
                  value={servicePeriodEnd}
                  onChange={(e) => setServicePeriodEnd(e.target.value)}
                  className="text-xs"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertParameter('service_end')}
                  className="px-2"
                  title="Insert into query"
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="sql-editor">SQL Query</Label>
          <Textarea
            id="sql-editor"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="SELECT * FROM aws_cost_usage_report WHERE line_item_usage_start_date >= '2024-01-01T00:00:00Z'..."
            className="font-mono text-sm min-h-[200px] resize-y"
          />
        </div>

        {!validation.isValid && query.trim() && (
          <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertDescription>{validation.message}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            <p>Available tables: <code>aws_cost_usage_report</code></p>
            <p>Tip: Use LIMIT to avoid large result sets • Dates use ISO format: <code>2024-01-01T00:00:00Z</code></p>
          </div>
          
          <Button 
            onClick={onExecute} 
            disabled={isExecuting || !query.trim() || !validation.isValid}
            className="min-w-[100px]"
          >
            {isExecuting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Execute
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
          <p className="font-medium mb-1">Common AWS CUR Fields:</p>
          <div className="grid grid-cols-2 gap-2">
            <span><code>line_item_usage_start_date</code></span>
            <span><code>product_product_name</code></span>
            <span><code>line_item_unblended_cost</code></span>
            <span><code>line_item_resource_id</code></span>
            <span><code>product_instance_type</code></span>
            <span><code>line_item_usage_amount</code></span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Component API configuration
const SQL_QUERY_EDITOR_API_CONFIG = {
  relevantFilters: [] as string[], // Editor state is independent of filters
  endpoint: '/api/sql-lab/query-editor',
  cacheDuration: 0, // No caching for editor state
}

// Export API configuration for documentation
export { SQL_QUERY_EDITOR_API_CONFIG }