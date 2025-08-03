"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  Code2,
  Play,
  Save,
  History,
  Bot,
  Database,
  BookOpen,
  Download,
  Plus,
  Trash2,
  Copy,
  Clock,
  Brain,
  BarChart3,
  Users,
  Loader2,
  CheckCircle,
  Info,
  ArrowRight,
  Eye,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  FileText,
  Star,
  Calendar,
  Tag,
  Bookmark
} from 'lucide-react'

interface QueryTemplate {
  id: string
  name: string
  category: string
  description: string
  query: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

interface SavedQuery {
  id: string
  name: string
  query: string
  description: string
  createdAt: string
  lastRun: string
  favorite: boolean
}

interface QueryResult {
  headers: string[]
  rows: any[][]
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

export default function SqlLabPage() {
  const [currentQuery, setCurrentQuery] = useState('')
  const [queryResults, setQueryResults] = useState<QueryResult | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([])
  const [savedResults, setSavedResults] = useState<SavedResult[]>([])
  const [queryHistory, setQueryHistory] = useState<string[]>([])
  
  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiContext, setAiContext] = useState('cost-analysis')
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [aiGeneratedQuery, setAiGeneratedQuery] = useState('')
  
  // Sidebar State
  const [aiOpen, setAiOpen] = useState(false)
  const [templatesOpen, setTemplatesOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  
  // Save/Export State
  const [saveResultName, setSaveResultName] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  // Quick Templates (simplified)
  const queryTemplates: QueryTemplate[] = [
    {
      id: 'monthly-cost',
      name: 'Monthly Cost Trends',
      category: 'Cost Analysis',
      description: 'Track monthly spending by service',
      difficulty: 'beginner',
      query: `SELECT 
    DATE_FORMAT(line_item_usage_start_date, '%Y-%m') AS month,
    product_product_name AS service,
    SUM(line_item_unblended_cost) AS cost
FROM aws_cost_usage_report 
WHERE line_item_usage_start_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
    AND line_item_line_item_type = 'Usage'
GROUP BY month, service
ORDER BY month DESC, cost DESC;`
    },
    {
      id: 'top-resources',
      name: 'Top Expensive Resources',
      category: 'Cost Analysis',
      description: 'Find your highest-cost resources',
      difficulty: 'beginner',
      query: `SELECT 
    line_item_resource_id AS resource,
    product_product_name AS service,
    SUM(line_item_unblended_cost) AS total_cost,
    SUM(line_item_usage_amount) AS usage
FROM aws_cost_usage_report 
WHERE line_item_usage_start_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)
    AND line_item_resource_id IS NOT NULL
GROUP BY resource, service
ORDER BY total_cost DESC
LIMIT 20;`
    },
    {
      id: 'untagged-resources',
      name: 'Untagged Resources',
      category: 'Governance',
      description: 'Resources missing important tags',
      difficulty: 'intermediate',
      query: `SELECT 
    product_product_name AS service,
    line_item_resource_id AS resource,
    SUM(line_item_unblended_cost) AS cost
FROM aws_cost_usage_report 
WHERE line_item_usage_start_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)
    AND (resource_tags_user_environment IS NULL OR resource_tags_user_environment = '')
    AND line_item_resource_id IS NOT NULL
GROUP BY service, resource
ORDER BY cost DESC;`
    }
  ]

  const executeQuery = async () => {
    if (!currentQuery.trim()) return
    
    setIsExecuting(true)
    
    setTimeout(() => {
      // Add to history
      setQueryHistory(prev => [currentQuery, ...prev.slice(0, 19)]) // Keep last 20
      
      const mockResults: QueryResult = {
        headers: ['month', 'service', 'cost', 'usage'],
        rows: [
          ['2024-01', 'Amazon EC2', 15420.50, 2580.5],
          ['2024-01', 'Amazon RDS', 8750.00, 1450.0],
          ['2024-01', 'Amazon S3', 2340.80, 98765.2],
          ['2023-12', 'Amazon EC2', 14890.30, 2456.8],
          ['2023-12', 'Amazon RDS', 8234.50, 1398.2]
        ],
        executionTime: Math.random() * 2000 + 500,
        rowCount: 5,
        executedAt: new Date().toISOString()
      }
      
      setQueryResults(mockResults)
      setIsExecuting(false)
    }, 1500)
  }

  const generateAIQuery = async () => {
    if (!aiPrompt.trim()) return
    
    setIsGeneratingAI(true)
    
    setTimeout(() => {
      const templates = {
        'cost-analysis': `-- AI Generated: Cost Analysis
-- Request: "${aiPrompt}"

SELECT 
    DATE_FORMAT(line_item_usage_start_date, '%Y-%m') AS billing_month,
    product_product_name AS service_name,
    SUM(line_item_unblended_cost) AS total_cost,
    AVG(line_item_unblended_rate) AS avg_rate
FROM aws_cost_usage_report 
WHERE line_item_usage_start_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
    AND line_item_line_item_type = 'Usage'
GROUP BY billing_month, service_name
ORDER BY billing_month DESC, total_cost DESC;`,
        'optimization': `-- AI Generated: Cost Optimization
-- Request: "${aiPrompt}"

SELECT 
    line_item_resource_id,
    product_instance_type,
    SUM(line_item_unblended_cost) AS cost,
    AVG(line_item_usage_amount) AS avg_usage,
    CASE 
        WHEN AVG(line_item_usage_amount) < 10 THEN 'Under-utilized'
        WHEN AVG(line_item_usage_amount) > 80 THEN 'Over-utilized'
        ELSE 'Well-utilized'
    END AS recommendation
FROM aws_cost_usage_report 
WHERE line_item_usage_start_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)
    AND product_product_name = 'Amazon Elastic Compute Cloud'
GROUP BY line_item_resource_id, product_instance_type
ORDER BY cost DESC;`,
        'governance': `-- AI Generated: Governance Analysis  
-- Request: "${aiPrompt}"

SELECT 
    product_product_name AS service,
    COALESCE(resource_tags_user_environment, 'UNTAGGED') AS environment,
    COUNT(DISTINCT line_item_resource_id) AS resource_count,
    SUM(line_item_unblended_cost) AS total_cost
FROM aws_cost_usage_report 
WHERE line_item_usage_start_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)
GROUP BY service, environment
ORDER BY total_cost DESC;`
      }
      
      setAiGeneratedQuery(templates[aiContext as keyof typeof templates] || templates['cost-analysis'])
      setIsGeneratingAI(false)
    }, 2000)
  }

  const useAIQuery = () => {
    setCurrentQuery(aiGeneratedQuery)
    setAiOpen(false) // Close AI panel after use
  }

  const useTemplate = (template: QueryTemplate) => {
    setCurrentQuery(template.query)
    setTemplatesOpen(false) // Close templates panel after use
  }

  const useHistoryQuery = (query: string) => {
    setCurrentQuery(query)
    setHistoryOpen(false) // Close history panel after use
  }

  const saveQuery = () => {
    if (!currentQuery.trim()) return
    
    const name = prompt('Enter a name for this query:')
    if (!name) return
    
    const newQuery: SavedQuery = {
      id: Date.now().toString(),
      name,
      query: currentQuery,
      description: 'Custom query',
      createdAt: new Date().toISOString(),
      lastRun: new Date().toISOString(),
      favorite: false
    }
    
    setSavedQueries(prev => [newQuery, ...prev])
  }

  const saveResults = () => {
    if (!queryResults || !saveResultName.trim()) return
    
    const newResult: SavedResult = {
      id: Date.now().toString(),
      name: saveResultName,
      query: currentQuery,
      result: queryResults,
      savedAt: new Date().toISOString()
    }
    
    setSavedResults(prev => [newResult, ...prev])
    setSaveResultName('')
    setShowSaveDialog(false)
  }

  const downloadResults = () => {
    if (!queryResults) return
    
    // Convert to CSV
    const csvContent = [
      queryResults.headers.join(','),
      ...queryResults.rows.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `query-results-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r bg-muted/30 overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Query Helpers</h2>
          <p className="text-sm text-muted-foreground">Build queries faster</p>
        </div>
        
        <div className="p-4 space-y-4">
          {/* AI Assistant Panel */}
          <Collapsible open={aiOpen} onOpenChange={setAiOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span className="font-medium">AI Assistant</span>
                </div>
                {aiOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-2">
              <div className="space-y-2">
                <Label className="text-xs">What to analyze?</Label>
                <Select value={aiContext} onValueChange={setAiContext}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cost-analysis">Cost Analysis</SelectItem>
                    <SelectItem value="optimization">Optimization</SelectItem>
                    <SelectItem value="governance">Governance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Describe what you need:</Label>
                <Textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., Show me top 10 most expensive EC2 instances"
                  className="h-16 text-xs"
                />
              </div>
              
              <Button 
                onClick={generateAIQuery} 
                disabled={isGeneratingAI || !aiPrompt.trim()}
                size="sm"
                className="w-full"
              >
                {isGeneratingAI ? (
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                ) : (
                  <Brain className="h-3 w-3 mr-2" />
                )}
                Generate Query
              </Button>
              
              {aiGeneratedQuery && (
                <div className="space-y-2">
                  <pre className="text-xs bg-background p-2 rounded border max-h-20 overflow-y-auto">
                    <code>{aiGeneratedQuery.substring(0, 150)}...</code>
                  </pre>
                  <Button onClick={useAIQuery} size="sm" className="w-full">
                    <ArrowRight className="h-3 w-3 mr-2" />
                    Use This Query
                  </Button>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Templates Panel */}
          <Collapsible open={templatesOpen} onOpenChange={setTemplatesOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="font-medium">Quick Templates</span>
                </div>
                {templatesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              {queryTemplates.map((template) => (
                <div key={template.id} className="border rounded p-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-medium">{template.name}</h4>
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      {template.difficulty}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                  <Button onClick={() => useTemplate(template)} size="sm" variant="outline" className="w-full h-6 text-xs">
                    Use Template
                  </Button>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* History Panel */}
          <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
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
                {historyOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              {queryHistory.length > 0 ? (
                <ScrollArea className="h-40">
                  {queryHistory.map((query, index) => (
                    <div key={index} className="border rounded p-2 mb-2 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Query {index + 1}</span>
                        <Button 
                          onClick={() => useHistoryQuery(query)} 
                          size="sm" 
                          variant="outline" 
                          className="h-5 text-xs px-2"
                        >
                          Use
                        </Button>
                      </div>
                      <pre className="text-xs text-muted-foreground max-h-8 overflow-hidden">
                        {query.substring(0, 60)}...
                      </pre>
                    </div>
                  ))}
                </ScrollArea>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No queries executed yet
                </p>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Saved Queries */}
          {savedQueries.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                Saved Queries
              </h3>
              <ScrollArea className="h-32">
                {savedQueries.map((saved) => (
                  <div key={saved.id} className="border rounded p-2 mb-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{saved.name}</span>
                      <Button 
                        onClick={() => setCurrentQuery(saved.query)} 
                        size="sm" 
                        variant="outline" 
                        className="h-5 text-xs px-2"
                      >
                        Load
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">SQL Lab</h1>
              <p className="text-muted-foreground">Query AWS Cost and Usage Reports</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={saveQuery} disabled={!currentQuery.trim()}>
                <Save className="h-4 w-4 mr-2" />
                Save Query
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentQuery('')}>
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Query Editor */}
        <div className="flex-1 p-4 space-y-4">
          <Card className="flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                SQL Query Editor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={currentQuery}
                onChange={(e) => setCurrentQuery(e.target.value)}
                placeholder="-- 💡 Use the sidebar helpers to build your query faster!
-- Try the AI Assistant or browse Quick Templates

SELECT 
    DATE_FORMAT(line_item_usage_start_date, '%Y-%m') AS month,
    product_product_name AS service,
    SUM(line_item_unblended_cost) AS cost
FROM aws_cost_usage_report 
WHERE line_item_usage_start_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
GROUP BY month, service
ORDER BY month DESC, cost DESC;"
                className="min-h-48 font-mono text-sm"
              />
              <div className="flex items-center gap-2">
                <Button onClick={executeQuery} disabled={isExecuting || !currentQuery.trim()} size="lg">
                  {isExecuting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {isExecuting ? 'Running Query...' : 'Run Query'}
                </Button>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Database className="h-4 w-4" />
                  <span>aws_cost_usage_report</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Query Results */}
          {queryResults && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Query Results
                    </CardTitle>
                    <CardDescription>
                      {queryResults.rowCount} rows • {queryResults.executionTime.toFixed(0)}ms
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowSaveDialog(true)}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Results
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadResults}>
                      <Download className="h-4 w-4 mr-2" />
                      Download CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <ScrollArea className="h-96">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {queryResults.headers.map((header, index) => (
                            <TableHead key={index} className="font-medium">
                              {header}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {queryResults.rows.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <TableCell key={cellIndex} className="font-mono text-sm">
                                {typeof cell === 'number' && cellIndex === 2 ? 
                                  `$${cell.toLocaleString()}` : cell}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Saved Results */}
          {savedResults.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Saved Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {savedResults.map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">{result.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {result.result.rowCount} rows • Saved {new Date(result.savedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Save Results Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Save Query Results</CardTitle>
              <CardDescription>Give this result set a name for future reference</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Result Name</Label>
                <Input
                  value={saveResultName}
                  onChange={(e) => setSaveResultName(e.target.value)}
                  placeholder="e.g., Monthly Cost Analysis - Jan 2024"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={saveResults} disabled={!saveResultName.trim()}>
                  Save Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}