"use client"

import React, { useState, useEffect } from 'react'
import { useAuth, useUserData } from "@/lib/hooks/use-auth"
import { ViewerRestricted } from "@/lib/components/role-guard"
import SqlAiAssistant from "../components/sql-ai-assistant"
import SqlTemplates from "../components/sql-templates"
import SqlQueryHistory from "../components/sql-query-history"
import SqlQueryEditor from "../components/sql-query-editor"
import SqlQueryResults from "../components/sql-query-results"
import type { QueryTemplate, SavedQuery, QueryResult, SavedResult } from "../components/sql-query-editor"

export default function SqlLabPage() {
  const { user, hasPermission } = useAuth()
  const { getSavedQueries, addSavedQuery, getQueryHistory, addQueryHistory } = useUserData()
  
  const [currentQuery, setCurrentQuery] = useState('')
  const [queryResults, setQueryResults] = useState<QueryResult | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([])
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
        favorite: q.favorite || false
      })))
      
      setQueryHistory(userHistoryData.map(h => h.query).slice(0, 20))
    }
  }, [user, getSavedQueries, getQueryHistory])

  const executeQuery = async () => {
    if (!currentQuery.trim() || isExecuting) return

    setIsExecuting(true)
    
    setTimeout(() => {
      // Add to history
      const historyItem = {
        id: `hist_${Date.now()}`,
        userId: user?.id || '',
        query: currentQuery,
        status: 'success' as const,
        executedAt: new Date().toISOString(),
        duration: Math.random() * 2000 + 500,
        resultRows: 5
      }
      
      setQueryHistory(prev => [currentQuery, ...prev.slice(0, 19)]) // Keep last 20
      addQueryHistory(historyItem)
      
      // Generate user-specific mock results based on role
      const baseData = [
        ['2024-01', 'Amazon EC2', 15420.50, 2580.5],
        ['2024-01', 'Amazon RDS', 8750.00, 1450.0], 
        ['2024-01', 'Amazon S3', 2340.80, 98765.2],
        ['2023-12', 'Amazon EC2', 14890.30, 2456.8],
        ['2023-12', 'Amazon RDS', 8234.50, 1398.2]
      ]
      
      // Adjust data based on user organization and role
      const userMultiplier = user?.organization === 'StartupCo' ? 0.3 : 1
      const roleMultiplier = user?.role === 'admin' ? 1 : user?.role === 'analyst' ? 0.8 : 0.6
      const multiplier = userMultiplier * roleMultiplier
      
      const mockResults: QueryResult = {
        headers: ['month', 'service', 'cost', 'usage'],
        rows: baseData.map(row => [
          row[0], // month
          row[1], // service
          Number((row[2] as number) * multiplier), // cost
          Number((row[3] as number) * multiplier)  // usage
        ]),
        executionTime: Math.random() * 2000 + 500,
        rowCount: 5,
        executedAt: new Date().toISOString()
      }
      
      setQueryResults(mockResults)
      setIsExecuting(false)
    }, 1500)
  }

  const handleSaveQuery = (savedQuery: SavedQuery) => {
    setSavedQueries(prev => [savedQuery, ...prev])
    addSavedQuery({
      id: savedQuery.id,
      name: savedQuery.name,
      query: savedQuery.query,
      description: savedQuery.description,
      tags: [],
      createdAt: savedQuery.createdAt,
      lastExecuted: savedQuery.lastRun,
      favorite: savedQuery.favorite
    })
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