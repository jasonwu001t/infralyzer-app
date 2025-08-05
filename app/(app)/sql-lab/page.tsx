"use client"

import React, { useState, useEffect } from 'react'
import { useAuth, useUserData } from "@/lib/hooks/use-auth"
import { ViewerRestricted } from "@/lib/components/role-guard"
import SqlAiAssistant from "../components/sql-ai-assistant"
import SqlTemplates from "../components/sql-templates"
import SqlQueryHistory from "../components/sql-query-history"
import SqlQueryEditor from "../components/sql-query-editor"
import SqlQueryResults from "../components/sql-query-results"
import type { QueryTemplate, QueryResult } from "../components/sql-query-editor"
import type { SavedResult } from "../components/sql-query-results"
import type { SavedQuery as UserSavedQuery } from "@/lib/types/user"

interface SavedQueryDisplay {
  id: string
  name: string
  query: string
  description: string
  createdAt: string
  lastRun: string
  favorite: boolean
}

export default function SqlLabPage() {
  const { user, hasPermission } = useAuth()
  const { getSavedQueries, addSavedQuery, getQueryHistory, addQueryHistory } = useUserData()
  
  const [currentQuery, setCurrentQuery] = useState('')
  const [queryResults, setQueryResults] = useState<QueryResult | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [savedQueries, setSavedQueries] = useState<SavedQueryDisplay[]>([])
  const [savedResults, setSavedResults] = useState<SavedResult[]>([])
  const [queryHistory, setQueryHistory] = useState<string[]>([])
  
  // Panel state
  const [aiOpen, setAiOpen] = useState(false)
  const [templatesOpen, setTemplatesOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)

  // Load user's saved queries and history
  useEffect(() => {
    if (user) {
      const userSavedQueries = getSavedQueries()
      const userHistoryData = getQueryHistory()
      
      setSavedQueries(userSavedQueries.map(q => ({
        id: q.id,
        name: q.name,
        query: q.query,
        description: q.description || '',
        createdAt: q.createdAt || new Date().toISOString(),
        lastRun: q.lastExecuted || 'Never',
        favorite: false // Convert from isPublic or add favorite functionality later
      })))
      
      setQueryHistory(userHistoryData.map(h => h.query).slice(0, 20))
    }
  }, [user, getSavedQueries, getQueryHistory])

  const executeQuery = async () => {
    if (!currentQuery.trim() || isExecuting) return

    setIsExecuting(true)
    const startTime = Date.now()
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/finops/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: currentQuery,
          engine: 'duckdb'
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const executionTime = Date.now() - startTime
      
      // Debug logging to understand API response structure
      console.log('API Response:', data)

      // Add to history
      const historyItem = {
        id: `hist_${Date.now()}`,
        userId: user?.id || '',
        query: currentQuery,
        status: 'success' as const,
        executedAt: new Date().toISOString(),
        duration: data.execution_time_ms || executionTime,
        resultRows: data.row_count || data.data?.length || 0
      }
      
      setQueryHistory(prev => [currentQuery, ...prev.slice(0, 19)]) // Keep last 20
      addQueryHistory(historyItem)

      // Transform API response to match QueryResult interface
      let transformedRows: (string | number | null)[][] = []
      let headers: string[] = []
      
      // Handle the specific API response format: { success, data, metadata, ... }
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        // API returns { success: true, data: [...objects...], metadata: {...} }
        const firstRow = data.data[0]
        if (typeof firstRow === 'object') {
          headers = Object.keys(firstRow)
          transformedRows = data.data.map((row: any) => 
            headers.map(header => {
              const value = row[header]
              // Handle nested objects by converting to JSON string
              if (value !== null && typeof value === 'object') {
                return JSON.stringify(value)
              }
              return value ?? null
            })
          )
        }
      } else if (data.columns && data.rows) {
        // Fallback: Format { columns: [...], rows: [...] }
        headers = data.columns
        if (Array.isArray(data.rows) && data.rows.length > 0) {
          if (Array.isArray(data.rows[0])) {
            transformedRows = data.rows
          } else if (typeof data.rows[0] === 'object') {
            transformedRows = data.rows.map((row: any) => 
              headers.map(header => row[header] ?? null)
            )
          }
        }
      } else if (data.headers && data.data) {
        // Fallback: Format { headers: [...], data: [...] }
        headers = data.headers
        if (Array.isArray(data.data) && data.data.length > 0) {
          if (Array.isArray(data.data[0])) {
            transformedRows = data.data
          } else if (typeof data.data[0] === 'object') {
            transformedRows = data.data.map((row: any) => 
              headers.map(header => row[header] ?? null)
            )
          }
        }
      } else if (Array.isArray(data) && data.length > 0) {
        // Fallback: Direct array of objects
        if (typeof data[0] === 'object') {
          headers = Object.keys(data[0])
          transformedRows = data.map((row: any) => 
            headers.map(header => row[header] ?? null)
          )
        }
      } else {
        // Fallback: unknown data structure
        console.warn('Unknown API response structure:', data)
        headers = ['Result']
        transformedRows = [[JSON.stringify(data)]]
      }

      const results: QueryResult = {
        headers,
        rows: transformedRows,
        executionTime: data.execution_time_ms || executionTime,
        rowCount: data.row_count || transformedRows.length,
        executedAt: new Date().toISOString()
      }
      
      setQueryResults(results)
    } catch (error) {
      console.error('Query execution failed:', error)
      
      // Add failed execution to history
      const historyItem = {
        id: `hist_${Date.now()}`,
        userId: user?.id || '',
        query: currentQuery,
        status: 'error' as const,
        executedAt: new Date().toISOString(),
        duration: Date.now() - startTime,
        resultRows: 0
      }
      
      setQueryHistory(prev => [currentQuery, ...prev.slice(0, 19)])
      addQueryHistory(historyItem)

      // Show error results
      const errorResults: QueryResult = {
        headers: ['Error'],
        rows: [[error instanceof Error ? error.message : 'Unknown error occurred']],
        executionTime: Date.now() - startTime,
        rowCount: 0,
        executedAt: new Date().toISOString()
      }
      
      setQueryResults(errorResults)
    } finally {
      setIsExecuting(false)
    }
  }

  const handleSaveQuery = (savedQuery: SavedQueryDisplay) => {
    setSavedQueries(prev => [savedQuery, ...prev])
    
    // Convert to UserSavedQuery format
    const userSavedQuery: Omit<UserSavedQuery, 'userId'> = {
      id: savedQuery.id,
      name: savedQuery.name,
      query: savedQuery.query,
      description: savedQuery.description,
      tags: [],
      isPublic: savedQuery.favorite, // Map favorite to isPublic for now
      createdAt: savedQuery.createdAt,
      lastExecuted: savedQuery.lastRun === 'Never' ? undefined : savedQuery.lastRun,
      executionCount: 0
    }
    
    addSavedQuery(userSavedQuery)
  }

  const handleSaveResult = (savedResult: SavedResult) => {
    setSavedResults(prev => [savedResult, ...prev])
    // Could add to user data if needed
  }

  const handleTemplateSelect = (template: QueryTemplate) => {
    setCurrentQuery(template.query)
  }

  const handleAiQueryGenerated = (query: string) => {
    setCurrentQuery(query)
  }

  const handleHistorySelect = (query: string) => {
    setCurrentQuery(query)
  }

  return (
    <ViewerRestricted>
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">SQL Lab</h1>
            <p className="text-muted-foreground">
              Interactive SQL environment for AWS Cost and Usage Report analysis
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - AI Assistant, Templates, History */}
          <div className="lg:col-span-1 space-y-4">
            <SqlAiAssistant
              isOpen={aiOpen}
              onOpenChange={setAiOpen}
              onQueryGenerated={handleAiQueryGenerated}
            />
            
            <SqlTemplates
              isOpen={templatesOpen}
              onOpenChange={setTemplatesOpen}
              onTemplateSelect={handleTemplateSelect}
            />
            
            <SqlQueryHistory
              isOpen={historyOpen}
              onOpenChange={setHistoryOpen}
              queryHistory={queryHistory}
              onQuerySelect={handleHistorySelect}
            />
          </div>

          {/* Main Content - Editor and Results */}
          <div className="lg:col-span-3 space-y-6">
            <SqlQueryEditor
              query={currentQuery}
              onQueryChange={setCurrentQuery}
              onExecute={executeQuery}
              isExecuting={isExecuting}
              onSaveQuery={handleSaveQuery}
            />
            
            <SqlQueryResults
              results={queryResults}
              currentQuery={currentQuery}
              onSaveResult={handleSaveResult}
            />
          </div>
        </div>
      </div>
    </ViewerRestricted>
  )
}