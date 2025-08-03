/**
 * Used by: sql-lab
 * Purpose: Pre-built SQL query templates for common AWS cost analysis scenarios
 */
"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { BookOpen, ChevronDown, ChevronRight } from 'lucide-react'

interface QueryTemplate {
  id: string
  name: string
  category: string
  description: string
  query: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

interface SqlTemplatesProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onTemplateSelect: (template: QueryTemplate) => void
}

const queryTemplates: QueryTemplate[] = [
  {
    id: 'cost-by-service',
    name: 'Cost by Service',
    category: 'Basic',
    description: 'Monthly cost breakdown by AWS service',
    difficulty: 'beginner',
    query: `-- Monthly cost breakdown by AWS service
SELECT 
    DATE_FORMAT(line_item_usage_start_date, '%Y-%m') AS billing_month,
    product_product_name AS service_name,
    SUM(line_item_unblended_cost) AS total_cost
FROM aws_cost_usage_report 
WHERE line_item_usage_start_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH)
GROUP BY billing_month, service_name
ORDER BY billing_month DESC, total_cost DESC;`
  },
  {
    id: 'ec2-utilization',
    name: 'EC2 Utilization',
    category: 'Optimization',
    description: 'EC2 instance utilization analysis',
    difficulty: 'intermediate',
    query: `-- EC2 instance utilization analysis
SELECT 
    line_item_resource_id AS instance_id,
    product_instance_type,
    AVG(line_item_usage_amount) AS avg_usage_hours,
    SUM(line_item_unblended_cost) AS total_cost,
    CASE 
        WHEN AVG(line_item_usage_amount) < 100 THEN 'Under-utilized'
        WHEN AVG(line_item_usage_amount) > 700 THEN 'Over-utilized'
        ELSE 'Well-utilized'
    END AS utilization_status
FROM aws_cost_usage_report 
WHERE product_product_name = 'Amazon Elastic Compute Cloud'
    AND line_item_usage_start_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)
GROUP BY instance_id, product_instance_type
ORDER BY total_cost DESC;`
  },
  {
    id: 'untagged-resources',
    name: 'Untagged Resources',
    category: 'Governance',
    description: 'Find resources without required tags',
    difficulty: 'intermediate',
    query: `-- Find untagged resources with cost impact
SELECT 
    product_product_name AS service,
    line_item_resource_id AS resource_id,
    SUM(line_item_unblended_cost) AS cost,
    CASE 
        WHEN resource_tags_user_environment IS NULL THEN 'Missing Environment Tag'
        WHEN resource_tags_user_team IS NULL THEN 'Missing Team Tag'
        WHEN resource_tags_user_project IS NULL THEN 'Missing Project Tag'
        ELSE 'Properly Tagged'
    END AS tag_status
FROM aws_cost_usage_report 
WHERE line_item_usage_start_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)
    AND (resource_tags_user_environment IS NULL 
         OR resource_tags_user_team IS NULL 
         OR resource_tags_user_project IS NULL)
GROUP BY service, resource_id, tag_status
ORDER BY cost DESC;`
  },
  {
    id: 'savings-opportunity',
    name: 'Savings Opportunities',
    category: 'Optimization',
    description: 'Identify potential savings with RIs and SPs',
    difficulty: 'advanced',
    query: `-- Savings opportunities analysis
SELECT 
    product_product_name AS service,
    product_instance_type,
    SUM(CASE WHEN pricing_term = 'OnDemand' THEN line_item_unblended_cost ELSE 0 END) AS on_demand_cost,
    SUM(CASE WHEN pricing_term != 'OnDemand' THEN line_item_unblended_cost ELSE 0 END) AS reserved_cost,
    COUNT(DISTINCT line_item_resource_id) AS resource_count,
    SUM(CASE WHEN pricing_term = 'OnDemand' THEN line_item_unblended_cost ELSE 0 END) * 0.3 AS potential_savings
FROM aws_cost_usage_report 
WHERE line_item_usage_start_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH)
    AND product_product_name IN ('Amazon Elastic Compute Cloud', 'Amazon Relational Database Service')
GROUP BY service, product_instance_type
HAVING on_demand_cost > 1000
ORDER BY potential_savings DESC;`
  }
]

export default function SqlTemplates({ isOpen, onOpenChange, onTemplateSelect }: SqlTemplatesProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-2 h-auto">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="font-medium">Quick Templates</span>
          </div>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 mt-2">
        {queryTemplates.map((template) => (
          <div key={template.id} className="border rounded p-2 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-medium">{template.name}</h4>
              <div className="flex gap-1">
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {template.category}
                </Badge>
                <Badge 
                  variant={template.difficulty === 'beginner' ? 'default' : template.difficulty === 'intermediate' ? 'secondary' : 'destructive'} 
                  className="text-xs px-1 py-0"
                >
                  {template.difficulty}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{template.description}</p>
            <Button 
              onClick={() => onTemplateSelect(template)} 
              size="sm" 
              variant="outline" 
              className="w-full h-6 text-xs"
            >
              Use Template
            </Button>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

// Component API configuration
const SQL_TEMPLATES_API_CONFIG = {
  relevantFilters: [] as string[], // Templates are static
  endpoint: '/api/sql-lab/templates',
  cacheDuration: 24 * 60 * 60 * 1000, // 24 hours (templates rarely change)
}

// Export API configuration for documentation
export { SQL_TEMPLATES_API_CONFIG, type QueryTemplate }