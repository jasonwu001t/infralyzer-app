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
import { Search, ChevronDown, ChevronRight, Database, Table2, Coins, Tag, Receipt, User, Clock, Package, DollarSign, Shield, Archive, Zap, Split, Brain, BookOpen, Loader2, ArrowRight, Copy, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface SavedQueryDisplay {
  id: string
  name: string
  query: string
  description: string
  createdAt: string
  lastRun: string
  favorite: boolean
}

interface ColumnGroup {
  name: string
  columns: string[]
  color: string
  icon: any
  description: string
}

interface DatabaseColumn {
  name: string
  type: string
}

interface DatabaseSchema {
  tables: {
    name: string
    columns: DatabaseColumn[]
  }[]
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
  const [columnsOpen, setColumnsOpen] = useState(true)
  
  // AI Assistant state
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [aiGeneratedQuery, setAiGeneratedQuery] = useState('')
  
  // Data Columns state
  const [columnSearch, setColumnSearch] = useState('')
  const [columnGroups, setColumnGroups] = useState<ColumnGroup[]>([])
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Line Item']))
  const [databaseSchema, setDatabaseSchema] = useState<DatabaseSchema | null>(null)
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set())

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

  // Load database schema and column groups
  useEffect(() => {
    loadDatabaseSchema()
  }, [])

  const loadDatabaseSchema = () => {
    // AWS CUR 2.0 schema
    const schema: DatabaseSchema = {
      tables: [{
        name: 'COST_AND_USAGE_REPORT',
        columns: [
          { name: 'bill_bill_type', type: 'VARCHAR' },
          { name: 'bill_billing_entity', type: 'VARCHAR' },
          { name: 'bill_billing_period_end_date', type: 'TIMESTAMP' },
          { name: 'bill_billing_period_start_date', type: 'TIMESTAMP' },
          { name: 'bill_invoice_id', type: 'VARCHAR' },
          { name: 'bill_invoicing_entity', type: 'VARCHAR' },
          { name: 'bill_payer_account_id', type: 'VARCHAR' },
          { name: 'bill_payer_account_name', type: 'VARCHAR' },
          { name: 'cost_category', type: 'JSON' },
          { name: 'discount', type: 'VARCHAR' },
          { name: 'discount_bundled_discount', type: 'DECIMAL' },
          { name: 'discount_total_discount', type: 'DECIMAL' },
          { name: 'identity_line_item_id', type: 'VARCHAR' },
          { name: 'identity_time_interval', type: 'TIMESTAMP' },
          { name: 'line_item_availability_zone', type: 'VARCHAR' },
          { name: 'line_item_blended_cost', type: 'DECIMAL' },
          { name: 'line_item_blended_rate', type: 'DECIMAL' },
          { name: 'line_item_currency_code', type: 'VARCHAR' },
          { name: 'line_item_legal_entity', type: 'VARCHAR' },
          { name: 'line_item_line_item_description', type: 'VARCHAR' },
          { name: 'line_item_line_item_type', type: 'VARCHAR' },
          { name: 'line_item_net_unblended_cost', type: 'DECIMAL' },
          { name: 'line_item_net_unblended_rate', type: 'DECIMAL' },
          { name: 'line_item_normalization_factor', type: 'VARCHAR' },
          { name: 'line_item_normalized_usage_amount', type: 'DECIMAL' },
          { name: 'line_item_operation', type: 'VARCHAR' },
          { name: 'line_item_product_code', type: 'VARCHAR' },
          { name: 'line_item_resource_id', type: 'VARCHAR' },
          { name: 'line_item_tax_type', type: 'VARCHAR' },
          { name: 'line_item_unblended_cost', type: 'DECIMAL' },
          { name: 'line_item_unblended_rate', type: 'DECIMAL' },
          { name: 'line_item_usage_account_id', type: 'VARCHAR' },
          { name: 'line_item_usage_account_name', type: 'VARCHAR' },
          { name: 'line_item_usage_amount', type: 'DECIMAL' },
          { name: 'line_item_usage_end_date', type: 'TIMESTAMP' },
          { name: 'line_item_usage_start_date', type: 'TIMESTAMP' },
          { name: 'line_item_usage_type', type: 'VARCHAR' },
          { name: 'pricing_currency', type: 'VARCHAR' },
          { name: 'pricing_lease_contract_length', type: 'VARCHAR' },
          { name: 'pricing_offering_class', type: 'VARCHAR' },
          { name: 'pricing_public_on_demand_cost', type: 'DECIMAL' },
          { name: 'pricing_public_on_demand_rate', type: 'DECIMAL' },
          { name: 'pricing_purchase_option', type: 'VARCHAR' },
          { name: 'pricing_rate_code', type: 'DECIMAL' },
          { name: 'pricing_rate_id', type: 'DECIMAL' },
          { name: 'pricing_term', type: 'VARCHAR' },
          { name: 'pricing_unit', type: 'VARCHAR' },
          { name: 'product', type: 'JSON' },
          { name: 'product_comment', type: 'VARCHAR' },
          { name: 'product_fee_code', type: 'DECIMAL' },
          { name: 'product_fee_description', type: 'DECIMAL' },
          { name: 'product_from_location', type: 'VARCHAR' },
          { name: 'product_from_location_type', type: 'VARCHAR' },
          { name: 'product_from_region_code', type: 'VARCHAR' },
          { name: 'product_instance_family', type: 'VARCHAR' },
          { name: 'product_instance_type', type: 'VARCHAR' },
          { name: 'product_instancesku', type: 'VARCHAR' },
          { name: 'product_location', type: 'VARCHAR' },
          { name: 'product_location_type', type: 'VARCHAR' },
          { name: 'product_operation', type: 'VARCHAR' },
          { name: 'product_pricing_unit', type: 'VARCHAR' },
          { name: 'product_product_family', type: 'VARCHAR' },
          { name: 'product_region_code', type: 'VARCHAR' },
          { name: 'product_servicecode', type: 'VARCHAR' },
          { name: 'product_sku', type: 'VARCHAR' },
          { name: 'product_to_location', type: 'VARCHAR' },
          { name: 'product_to_location_type', type: 'VARCHAR' },
          { name: 'product_to_region_code', type: 'VARCHAR' },
          { name: 'product_usagetype', type: 'VARCHAR' },
          { name: 'reservation_amortized_upfront_cost_for_usage', type: 'DECIMAL' },
          { name: 'reservation_amortized_upfront_fee_for_billing_period', type: 'DECIMAL' },
          { name: 'reservation_availability_zone', type: 'VARCHAR' },
          { name: 'reservation_effective_cost', type: 'DECIMAL' },
          { name: 'reservation_end_time', type: 'TIMESTAMP' },
          { name: 'reservation_modification_status', type: 'VARCHAR' },
          { name: 'reservation_net_amortized_upfront_cost_for_usage', type: 'DECIMAL' },
          { name: 'reservation_net_amortized_upfront_fee_for_billing_period', type: 'DECIMAL' },
          { name: 'reservation_net_effective_cost', type: 'DECIMAL' },
          { name: 'reservation_net_recurring_fee_for_usage', type: 'DECIMAL' },
          { name: 'reservation_net_unused_amortized_upfront_fee_for_billing_period', type: 'DECIMAL' },
          { name: 'reservation_net_unused_recurring_fee', type: 'DECIMAL' },
          { name: 'reservation_net_upfront_value', type: 'DECIMAL' },
          { name: 'reservation_normalized_units_per_reservation', type: 'VARCHAR' },
          { name: 'reservation_number_of_reservations', type: 'VARCHAR' },
          { name: 'reservation_recurring_fee_for_usage', type: 'DECIMAL' },
          { name: 'reservation_reservation_a_r_n', type: 'VARCHAR' },
          { name: 'reservation_start_time', type: 'TIMESTAMP' },
          { name: 'reservation_subscription_id', type: 'VARCHAR' },
          { name: 'reservation_total_reserved_normalized_units', type: 'VARCHAR' },
          { name: 'reservation_total_reserved_units', type: 'VARCHAR' },
          { name: 'reservation_units_per_reservation', type: 'VARCHAR' },
          { name: 'reservation_unused_amortized_upfront_fee_for_billing_period', type: 'DECIMAL' },
          { name: 'reservation_unused_normalized_unit_quantity', type: 'VARCHAR' },
          { name: 'reservation_unused_quantity', type: 'VARCHAR' },
          { name: 'reservation_unused_recurring_fee', type: 'DECIMAL' },
          { name: 'reservation_upfront_value', type: 'DECIMAL' },
          { name: 'resource_tags', type: 'JSON' },
          { name: 'savings_plan_amortized_upfront_commitment_for_billing_period', type: 'DECIMAL' },
          { name: 'savings_plan_end_time', type: 'TIMESTAMP' },
          { name: 'savings_plan_instance_type_family', type: 'VARCHAR' },
          { name: 'savings_plan_net_amortized_upfront_commitment_for_billing_period', type: 'DECIMAL' },
          { name: 'savings_plan_net_recurring_commitment_for_billing_period', type: 'DECIMAL' },
          { name: 'savings_plan_net_savings_plan_effective_cost', type: 'DECIMAL' },
          { name: 'savings_plan_offering_type', type: 'VARCHAR' },
          { name: 'savings_plan_payment_option', type: 'VARCHAR' },
          { name: 'savings_plan_purchase_term', type: 'VARCHAR' },
          { name: 'savings_plan_recurring_commitment_for_billing_period', type: 'DECIMAL' },
          { name: 'savings_plan_region', type: 'VARCHAR' },
          { name: 'savings_plan_savings_plan_a_r_n', type: 'VARCHAR' },
          { name: 'savings_plan_savings_plan_effective_cost', type: 'DECIMAL' },
          { name: 'savings_plan_savings_plan_rate', type: 'DECIMAL' },
          { name: 'savings_plan_start_time', type: 'TIMESTAMP' },
          { name: 'savings_plan_total_commitment_to_date', type: 'TIMESTAMP' },
          { name: 'savings_plan_used_commitment', type: 'VARCHAR' },
          { name: 'split_line_item_actual_usage', type: 'VARCHAR' },
          { name: 'split_line_item_net_split_cost', type: 'DECIMAL' },
          { name: 'split_line_item_net_unused_cost', type: 'DECIMAL' },
          { name: 'split_line_item_parent_resource_id', type: 'VARCHAR' },
          { name: 'split_line_item_public_on_demand_split_cost', type: 'DECIMAL' },
          { name: 'split_line_item_public_on_demand_unused_cost', type: 'DECIMAL' },
          { name: 'split_line_item_reserved_usage', type: 'VARCHAR' },
          { name: 'split_line_item_split_cost', type: 'DECIMAL' },
          { name: 'split_line_item_split_usage', type: 'VARCHAR' },
          { name: 'split_line_item_split_usage_ratio', type: 'VARCHAR' },
          { name: 'split_line_item_unused_cost', type: 'DECIMAL' }
        ]
      }]
    }

    // Official AWS CUR 2.0 column groups
    const groups: ColumnGroup[] = [
      {
        name: 'Bill',
        color: 'text-blue-600',
        icon: Receipt,
        description: '',
        columns: [
          'bill_bill_type', 'bill_billing_entity', 'bill_billing_period_end_date', 
          'bill_billing_period_start_date', 'bill_invoice_id', 'bill_invoicing_entity', 
          'bill_payer_account_id', 'bill_payer_account_name'
        ]
      },
      {
        name: 'Cost Category',
        color: 'text-green-600',
        icon: Tag,
        description: '',
        columns: ['cost_category']
      },
      {
        name: 'Discount',
        color: 'text-yellow-600',
        icon: Coins,
        description: '',
        columns: ['discount', 'discount_bundled_discount', 'discount_total_discount']
      },
      {
        name: 'Identity',
        color: 'text-purple-600',
        icon: User,
        description: '',
        columns: ['identity_line_item_id', 'identity_time_interval']
      },
      {
        name: 'Line Item',
        color: 'text-red-600',
        icon: Table2,
        description: '',
        columns: [
          'line_item_availability_zone', 'line_item_blended_cost', 'line_item_blended_rate',
          'line_item_currency_code', 'line_item_legal_entity', 'line_item_line_item_description',
          'line_item_line_item_type', 'line_item_net_unblended_cost', 'line_item_net_unblended_rate',
          'line_item_normalization_factor', 'line_item_normalized_usage_amount', 'line_item_operation',
          'line_item_product_code', 'line_item_resource_id', 'line_item_tax_type',
          'line_item_unblended_cost', 'line_item_unblended_rate', 'line_item_usage_account_id',
          'line_item_usage_account_name', 'line_item_usage_amount', 'line_item_usage_end_date',
          'line_item_usage_start_date', 'line_item_usage_type'
        ]
      },
      {
        name: 'Pricing',
        color: 'text-orange-600',
        icon: DollarSign,
        description: '',
        columns: [
          'pricing_currency', 'pricing_lease_contract_length', 'pricing_offering_class',
          'pricing_public_on_demand_cost', 'pricing_public_on_demand_rate', 'pricing_purchase_option',
          'pricing_rate_code', 'pricing_rate_id', 'pricing_term', 'pricing_unit'
        ]
      },
      {
        name: 'Product',
        color: 'text-cyan-600',
        icon: Package,
        description: '',
        columns: [
          'product', 'product_comment', 'product_fee_code', 'product_fee_description',
          'product_from_location', 'product_from_location_type', 'product_from_region_code',
          'product_instance_family', 'product_instance_type', 'product_instancesku',
          'product_location', 'product_location_type', 'product_operation',
          'product_pricing_unit', 'product_product_family', 'product_region_code',
          'product_servicecode', 'product_sku', 'product_to_location',
          'product_to_location_type', 'product_to_region_code', 'product_usagetype'
        ]
      },
      {
        name: 'Reservation',
        color: 'text-indigo-600',
        icon: Shield,
        description: '',
        columns: [
          'reservation_amortized_upfront_cost_for_usage', 'reservation_amortized_upfront_fee_for_billing_period',
          'reservation_availability_zone', 'reservation_effective_cost', 'reservation_end_time',
          'reservation_modification_status', 'reservation_net_amortized_upfront_cost_for_usage',
          'reservation_net_amortized_upfront_fee_for_billing_period', 'reservation_net_effective_cost',
          'reservation_net_recurring_fee_for_usage', 'reservation_net_unused_amortized_upfront_fee_for_billing_period',
          'reservation_net_unused_recurring_fee', 'reservation_net_upfront_value',
          'reservation_normalized_units_per_reservation', 'reservation_number_of_reservations',
          'reservation_recurring_fee_for_usage', 'reservation_reservation_a_r_n',
          'reservation_start_time', 'reservation_subscription_id', 'reservation_total_reserved_normalized_units',
          'reservation_total_reserved_units', 'reservation_units_per_reservation',
          'reservation_unused_amortized_upfront_fee_for_billing_period', 'reservation_unused_normalized_unit_quantity',
          'reservation_unused_quantity', 'reservation_unused_recurring_fee', 'reservation_upfront_value'
        ]
      },
      {
        name: 'Resource Tags',
        color: 'text-pink-600',
        icon: Archive,
        description: '',
        columns: ['resource_tags']
      },
      {
        name: 'Savings Plan',
        color: 'text-emerald-600',
        icon: Zap,
        description: '',
        columns: [
          'savings_plan_amortized_upfront_commitment_for_billing_period', 'savings_plan_end_time',
          'savings_plan_instance_type_family', 'savings_plan_net_amortized_upfront_commitment_for_billing_period',
          'savings_plan_net_recurring_commitment_for_billing_period', 'savings_plan_net_savings_plan_effective_cost',
          'savings_plan_offering_type', 'savings_plan_payment_option', 'savings_plan_purchase_term',
          'savings_plan_recurring_commitment_for_billing_period', 'savings_plan_region',
          'savings_plan_savings_plan_a_r_n', 'savings_plan_savings_plan_effective_cost',
          'savings_plan_savings_plan_rate', 'savings_plan_start_time', 'savings_plan_total_commitment_to_date',
          'savings_plan_used_commitment'
        ]
      },
      {
        name: 'Split Line Item',
        color: 'text-violet-600',
        icon: Split,
        description: '',
        columns: [
          'split_line_item_actual_usage', 'split_line_item_net_split_cost', 'split_line_item_net_unused_cost',
          'split_line_item_parent_resource_id', 'split_line_item_public_on_demand_split_cost',
          'split_line_item_public_on_demand_unused_cost', 'split_line_item_reserved_usage',
          'split_line_item_split_cost', 'split_line_item_split_usage', 'split_line_item_split_usage_ratio',
          'split_line_item_unused_cost'
        ]
      }
    ]

    setDatabaseSchema(schema)
    setColumnGroups(groups)
  }

  // Column group management
  const toggleColumnGroup = (groupName: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(groupName)) {
        newSet.delete(groupName)
      } else {
        newSet.add(groupName)
      }
      return newSet
    })
  }

  // Extract columns from SQL query
  const extractColumnsFromQuery = (query: string): Set<string> => {
    const columns = new Set<string>()
    if (!query || !databaseSchema?.tables[0]?.columns) return columns
    
    // Get all available column names
    const availableColumns = databaseSchema.tables[0].columns.map(col => col.name)
    
    // Simple regex to find column names in the query
    availableColumns.forEach(columnName => {
      // Check if column name appears in the query (word boundary)
      const regex = new RegExp(`\\b${columnName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
      if (regex.test(query)) {
        columns.add(columnName)
      }
    })
    
    return columns
  }

  // Update selected columns when query changes
  useEffect(() => {
    const newSelectedColumns = extractColumnsFromQuery(currentQuery)
    setSelectedColumns(newSelectedColumns)
  }, [currentQuery, databaseSchema])

  // Insert column into query
  const insertColumnIntoQuery = (columnName: string) => {
    setCurrentQuery(prev => {
      if (!prev.trim()) {
        return columnName
      }
      // Simple insertion at the end, could be enhanced with cursor position
      return prev + (prev.endsWith(',') || prev.endsWith(' ') ? '' : ', ') + columnName
    })
  }

  const executeQuery = async () => {
    if (!currentQuery.trim() || isExecuting) return

    setIsExecuting(true)
    const startTime = Date.now()
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/finops/query', {
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
    // Format the SQL query nicely
    const formattedQuery = formatSQLQuery(query)
    setCurrentQuery(formattedQuery)
  }

  // SQL formatting function
  const formatSQLQuery = (sql: string): string => {
    // Remove any existing comments and normalize whitespace
    let cleanSQL = sql.replace(/^--.*$/gm, '').replace(/\s+/g, ' ').trim()
    
    // Add line breaks before major SQL keywords
    cleanSQL = cleanSQL
      .replace(/\bSELECT\b/gi, '\nSELECT')
      .replace(/\bFROM\b/gi, '\nFROM')
      .replace(/\bWHERE\b/gi, '\nWHERE')
      .replace(/\bGROUP BY\b/gi, '\nGROUP BY')
      .replace(/\bHAVING\b/gi, '\nHAVING')
      .replace(/\bORDER BY\b/gi, '\nORDER BY')
      .replace(/\bLIMIT\b/gi, '\nLIMIT')
      .replace(/\bJOIN\b/gi, '\nJOIN')
      .replace(/\bLEFT JOIN\b/gi, '\nLEFT JOIN')
      .replace(/\bRIGHT JOIN\b/gi, '\nRIGHT JOIN')
      .replace(/\bINNER JOIN\b/gi, '\nINNER JOIN')
      .replace(/\bUNION\b/gi, '\nUNION')
    
    // Handle SELECT columns - add line breaks after commas in SELECT clause
    const lines = cleanSQL.split('\n')
    const formattedLines = lines.map((line, index) => {
      const trimmedLine = line.trim()
      
      // Format SELECT clause
      if (trimmedLine.startsWith('SELECT')) {
        // Split by commas and format
        const selectPart = trimmedLine.substring(6).trim() // Remove 'SELECT'
        const nextKeywordIndex = lines.findIndex((l, i) => i > index && 
          /^\s*(FROM|WHERE|GROUP|ORDER|LIMIT|HAVING)\b/i.test(l.trim()))
        
        if (nextKeywordIndex > index) {
          // Combine all SELECT lines until next keyword
          const selectLines = lines.slice(index, nextKeywordIndex).join(' ')
          const selectPart = selectLines.substring(6).trim() // Remove 'SELECT'
          const columns = selectPart.split(',').map(col => col.trim()).filter(col => col)
          
          if (columns.length > 1) {
            return 'SELECT\n  ' + columns.join(',\n  ')
          }
        }
        return trimmedLine
      }
      
      // Indent AND/OR conditions
      if (trimmedLine.startsWith('AND ') || trimmedLine.startsWith('OR ')) {
        return '  ' + trimmedLine
      }
      
      return trimmedLine
    })
    
    // Join and clean up extra whitespace
    return formattedLines
      .filter(line => line.trim().length > 0)
      .join('\n')
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim()
  }

  const handleHistorySelect = (query: string) => {
    setCurrentQuery(query)
  }

  const deleteHistoryItem = (index: number) => {
    setQueryHistory(prev => prev.filter((_, i) => i !== index))
  }

  const clearAllHistory = () => {
    setQueryHistory([])
  }

  const copyQueryToClipboard = async (query: string) => {
    try {
      await navigator.clipboard.writeText(query)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy query:', err)
    }
  }

  // AI Assistant functions
  const generateAIQuery = async () => {
    if (!aiPrompt.trim()) return
    
    setIsGeneratingAI(true)
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/finops/bedrock/generate-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_query: aiPrompt,
          model_config: {
            model_id: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
            max_tokens: 4096,
            temperature: 0.1,
            top_p: 0.9,
            top_k: 250
          },
          include_examples: true,
          target_table: 'CUR'
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      // Extract the SQL query from the structured response
      let generatedSQL = ''
      if (data.structured_query && data.structured_query.sql_query) {
        generatedSQL = data.structured_query.sql_query
      } else if (data.structured_query && data.structured_query.sql) {
        generatedSQL = data.structured_query.sql
      } else if (data.structured_query && typeof data.structured_query === 'string') {
        generatedSQL = data.structured_query
      } else {
        // Fallback: try to extract from response text
        generatedSQL = `-- AI Generated Query
-- Request: "${aiPrompt}"
-- Generated by: ${data.model_used || 'AWS Bedrock'}
-- Confidence: ${data.confidence ? `${(data.confidence * 100).toFixed(1)}%` : 'N/A'}

${data.structured_query || 'SELECT * FROM CUR LIMIT 10;'}`
      }
      
      // Add a helpful comment header for AI-generated queries
      if (generatedSQL && !generatedSQL.includes('-- AI Generated')) {
        const confidence = data.confidence ? `${(data.confidence * 100).toFixed(0)}%` : 'N/A'
        generatedSQL = `-- 🤖 AI Generated SQL Query
-- Prompt: "${aiPrompt}"
-- Confidence: ${confidence}

${generatedSQL}`
      }
      
      setAiGeneratedQuery(generatedSQL)
      
    } catch (error) {
      console.error('AI query generation failed:', error)
      
      // Fallback to a simple template
      const fallbackQuery = `-- 🤖 AI Generated SQL Query (Fallback)
-- Prompt: "${aiPrompt}"
-- Note: Using template due to API unavailability

SELECT 
    product_servicecode AS service_name,
    SUM(line_item_unblended_cost) AS total_cost,
    COUNT(DISTINCT line_item_resource_id) AS resource_count
FROM CUR 
WHERE line_item_usage_start_date >= CURRENT_DATE - INTERVAL '1 month'
    AND line_item_unblended_cost > 0
GROUP BY product_servicecode
ORDER BY total_cost DESC
LIMIT 10;`
      
      setAiGeneratedQuery(fallbackQuery)
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const useAIQuery = () => {
    if (aiGeneratedQuery) {
      handleAiQueryGenerated(aiGeneratedQuery)
      setAiPrompt('')
      setAiGeneratedQuery('')
    }
  }

  // Helper functions for query type and color
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

  const truncateQuery = (query: string, maxLength: number = 80) => {
    const cleanQuery = query.replace(/\s+/g, ' ').trim()
    return cleanQuery.length > maxLength ? cleanQuery.substring(0, maxLength) + '...' : cleanQuery
  }

  // Quick query templates
  const quickQueryTemplates: QueryTemplate[] = [
    {
      id: 'monthly-cost-trends',
      name: 'Monthly Cost Trends',
      category: 'Analytics',
      description: 'Track month-over-month cost changes by service',
      query: `SELECT 
    DATE_FORMAT(line_item_usage_start_date, '%Y-%m') AS billing_month,
    product_product_name AS service_name,
    SUM(line_item_unblended_cost) AS total_cost
FROM CUR 
WHERE line_item_usage_start_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
GROUP BY billing_month, service_name
ORDER BY billing_month DESC, total_cost DESC;`
    },
    {
      id: 'top-cost-services',
      name: 'Top Cost Services',
      category: 'Analytics',
      description: 'Find the most expensive services last month',
      query: `SELECT 
    product_product_name AS service_name,
    SUM(line_item_unblended_cost) AS total_cost,
    COUNT(DISTINCT line_item_resource_id) AS resource_count
FROM CUR 
WHERE line_item_usage_start_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)
GROUP BY service_name
ORDER BY total_cost DESC
LIMIT 10;`
    },
    {
      id: 'ec2-instance-costs',
      name: 'EC2 Instance Costs',
      category: 'Compute',
      description: 'Analyze EC2 instance costs and usage',
      query: `SELECT 
    line_item_resource_id AS instance_id,
    product_instance_type,
    product_region,
    SUM(line_item_unblended_cost) AS total_cost,
    SUM(line_item_usage_amount) AS total_hours
FROM CUR 
WHERE line_item_product_code = 'AmazonEC2'
    AND line_item_operation = 'RunInstances'
    AND line_item_usage_start_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)
GROUP BY instance_id, product_instance_type, product_region
ORDER BY total_cost DESC;`
    }
  ]

  return (
    <ViewerRestricted>
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">SQL Lab</h1>
              <p className="text-muted-foreground">
                Interactive SQL environment for AWS Cost and Usage Report analysis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Real-time Analysis
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Secure Query Environment
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Unified Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <span>SQL Lab Tools</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 p-0">
                {/* Data Columns Browser */}
                <Collapsible open={columnsOpen} onOpenChange={setColumnsOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between px-6 py-3 h-auto rounded-none border-b border-border/40">
                      <div className="flex items-center gap-3">
                        <Database className="h-4 w-4 text-blue-600" />
                        <div className="text-left">
                          <div className="font-medium text-sm">AWS CUR 2.0 Columns</div>
                          <div className="text-xs text-muted-foreground">Browse and select columns</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {databaseSchema?.tables[0]?.columns.length || 125}
                        </Badge>
                        {columnsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-6 py-4 border-b border-border/40">
                    {/* Search */}
                    <div className="relative mb-4">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        placeholder="Search columns..."
                        value={columnSearch}
                        onChange={(e) => setColumnSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
                      />
                    </div>
                    
                    {/* Column Groups */}
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {columnGroups.map((group) => (
                        <div key={group.name} className="border rounded-lg overflow-hidden bg-background">
                          <div 
                            className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-3 bg-muted/20"
                            onClick={() => toggleColumnGroup(group.name)}
                          >
                            <div className="flex items-center gap-2">
                              {expandedGroups.has(group.name) ? 
                                <ChevronDown className="h-3 w-3" /> : 
                                <ChevronRight className="h-3 w-3" />
                              }
                              <group.icon className={`h-3 w-3 ${group.color}`} />
                              <span className={`font-medium text-xs ${group.color}`}>{group.name}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {group.columns.length}
                            </Badge>
                          </div>
                          
                          {expandedGroups.has(group.name) && (
                            <div className="p-2 space-y-1 bg-background max-h-48 overflow-y-auto">
                              {group.columns
                                .filter(colName => {
                                  if (!columnSearch) return true
                                  return colName.toLowerCase().includes(columnSearch.toLowerCase())
                                })
                                .map((columnName) => {
                                  const column = databaseSchema?.tables[0]?.columns.find(c => c.name === columnName)
                                  const isSelected = selectedColumns.has(columnName)
                                  
                                  return (
                                    <div 
                                      key={columnName}
                                      className={`p-2 rounded cursor-pointer group border transition-colors ${
                                        isSelected 
                                          ? 'bg-blue-100 border-blue-400 ring-1 ring-blue-300' 
                                          : 'hover:bg-blue-50 hover:border-blue-200 border-gray-200'
                                      }`}
                                      onClick={() => insertColumnIntoQuery(columnName)}
                                      title={columnName}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className={`font-mono text-xs font-medium ${
                                          isSelected ? 'text-blue-700' : 'text-blue-900'
                                        }`}>{columnName}</span>
                                        <Badge 
                                          variant={isSelected ? "default" : "secondary"} 
                                          className={`text-xs h-4 ${
                                            isSelected ? 'opacity-100 bg-blue-600' : 'opacity-0 group-hover:opacity-100'
                                          }`}
                                        >
                                          {column?.type}
                                        </Badge>
                                      </div>
                                    </div>
                                  )
                                })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* AI Assistant */}
                <Collapsible open={aiOpen} onOpenChange={setAiOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between px-6 py-3 h-auto rounded-none border-b border-border/40">
                      <div className="flex items-center gap-3">
                        <Brain className="h-4 w-4 text-purple-600" />
                        <div className="text-left">
                          <div className="font-medium text-sm">AI Assistant</div>
                          <div className="text-xs text-muted-foreground">Generate queries with AI</div>
                        </div>
                      </div>
                      {aiOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-6 py-4 border-b border-border/40 space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Describe your analysis needs:</Label>
                      <Textarea
                        placeholder="e.g., Show me the top 10 most expensive services last month, or Find EC2 instances with high costs but low utilization"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="min-h-20 text-xs resize-none"
                        rows={4}
                      />
                      <p className="text-xs text-muted-foreground">
                        💡 Use natural language to describe what you want to analyze. The AI will generate an optimized SQL query for your AWS Cost and Usage Report data.
                      </p>
                    </div>

                    <Button 
                      onClick={generateAIQuery} 
                      disabled={!aiPrompt.trim() || isGeneratingAI}
                      className="w-full h-8 text-xs"
                    >
                      {isGeneratingAI ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Brain className="h-3 w-3 mr-2" />
                          Generate Query
                        </>
                      )}
                    </Button>

                    {aiGeneratedQuery && (
                      <div className="space-y-2 p-3 bg-muted/50 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-medium text-green-700">Generated Query:</Label>
                          <Button 
                            onClick={useAIQuery} 
                            size="sm" 
                            className="h-6 text-xs px-2"
                          >
                            <ArrowRight className="h-3 w-3 mr-1" />
                            Use Query
                          </Button>
                        </div>
                        <pre className="text-xs bg-background p-2 rounded border font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                          {aiGeneratedQuery}
                        </pre>
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>

                {/* Quick Templates */}
                <Collapsible open={templatesOpen} onOpenChange={setTemplatesOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between px-6 py-3 h-auto rounded-none border-b border-border/40">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-4 w-4 text-green-600" />
                        <div className="text-left">
                          <div className="font-medium text-sm">Quick Templates</div>
                          <div className="text-xs text-muted-foreground">Ready-to-use query templates</div>
                        </div>
                      </div>
                      {templatesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-6 py-4 border-b border-border/40">
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {quickQueryTemplates.map((template) => (
                        <div key={template.id} className="border rounded-lg p-3 space-y-2 hover:bg-muted/30 transition-colors">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-medium">{template.name}</h4>
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              {template.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{template.description}</p>
                          <Button 
                            onClick={() => handleTemplateSelect(template)} 
                            size="sm" 
                            variant="outline" 
                            className="w-full h-6 text-xs"
                          >
                            Use Template
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Query History */}
                <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between px-6 py-3 h-auto rounded-none">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <div className="text-left">
                          <div className="font-medium text-sm">Query History</div>
                          <div className="text-xs text-muted-foreground">Recent executed queries</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {queryHistory.length > 0 && (
                          <div 
                            onClick={(e) => {
                              e.stopPropagation()
                              clearAllHistory()
                            }}
                            className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer transition-colors flex items-center"
                          >
                            Clear All
                          </div>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {queryHistory.length}
                        </Badge>
                        {historyOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-6 py-4">
                    {queryHistory.length > 0 ? (
                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        {queryHistory.map((query, index) => {
                          const queryType = getQueryType(query)
                          const typeColor = getQueryTypeColor(queryType)
                          
                          return (
                            <div key={index} className="border rounded-lg p-3 space-y-2 hover:bg-muted/30 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium">Query {index + 1}</span>
                                  <Badge className={`text-xs px-1 py-0 ${typeColor}`}>
                                    {queryType}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button 
                                    onClick={() => copyQueryToClipboard(query)} 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-5 text-xs px-1"
                                    title="Copy query"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    onClick={() => handleHistorySelect(query)} 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-5 text-xs px-2"
                                  >
                                    Use
                                  </Button>
                                  <Button 
                                    onClick={() => deleteHistoryItem(index)} 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-5 text-xs px-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    title="Delete query"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                                {truncateQuery(query)}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-8">
                        No query history yet. Execute a query to see it here.
                      </p>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
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