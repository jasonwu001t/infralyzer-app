/**
 * Used by: sql-lab
 * Purpose: AI-powered SQL query generation assistant with context-aware suggestions
 */
"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Brain, Loader2, ArrowRight, ChevronDown, ChevronRight } from 'lucide-react'

interface SqlAiAssistantProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onQueryGenerated: (query: string) => void
}

export default function SqlAiAssistant({ isOpen, onOpenChange, onQueryGenerated }: SqlAiAssistantProps) {
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiContext, setAiContext] = useState('cost-analysis')
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [aiGeneratedQuery, setAiGeneratedQuery] = useState('')

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
    if (aiGeneratedQuery) {
      onQueryGenerated(aiGeneratedQuery)
      setAiPrompt('')
      setAiGeneratedQuery('')
    }
  }

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-2 h-auto">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="font-medium">AI Assistant</span>
          </div>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 mt-2">
        <div className="space-y-2">
          <Label className="text-xs">Query Type:</Label>
          <Select value={aiContext} onValueChange={setAiContext}>
            <SelectTrigger className="h-8 text-xs">
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
  )
}

// Component API configuration
const SQL_AI_ASSISTANT_API_CONFIG = {
  relevantFilters: [] as string[], // No filters needed for AI assistant
  endpoint: '/api/sql-lab/ai-assistant',
  cacheDuration: 0, // No caching for AI interactions
}

// Export API configuration for documentation
export { SQL_AI_ASSISTANT_API_CONFIG }