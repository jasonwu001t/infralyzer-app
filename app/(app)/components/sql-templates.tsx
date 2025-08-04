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
  // Analytics & FinOps Queries
  {
    id: 'monthly-cost-trends',
    name: 'Monthly Cost Trends',
    category: 'Analytics',
    description: 'Track month-over-month cost changes by service',
    difficulty: 'beginner',
    query: `-- Monthly cost trends analysis
SELECT 
    DATE_FORMAT(line_item_usage_start_date, '%Y-%m') AS billing_month,
    product_product_name AS service_name,
    SUM(line_item_unblended_cost) AS total_cost,
    LAG(SUM(line_item_unblended_cost)) OVER (PARTITION BY product_product_name ORDER BY DATE_FORMAT(line_item_usage_start_date, '%Y-%m')) AS previous_month_cost,
    ((SUM(line_item_unblended_cost) - LAG(SUM(line_item_unblended_cost)) OVER (PARTITION BY product_product_name ORDER BY DATE_FORMAT(line_item_usage_start_date, '%Y-%m'))) / 
     LAG(SUM(line_item_unblended_cost)) OVER (PARTITION BY product_product_name ORDER BY DATE_FORMAT(line_item_usage_start_date, '%Y-%m'))) * 100 AS mom_change_percent
FROM aws_cost_usage_report 
WHERE line_item_usage_start_date >= '2024-01-01T00:00:00Z'
GROUP BY billing_month, service_name
ORDER BY billing_month DESC, total_cost DESC;`
  },
  {
    id: 'top-cost-accounts',
    name: 'Top Cost Accounts',
    category: 'Analytics',
    description: 'Identify highest spending AWS accounts',
    difficulty: 'beginner',
    query: `-- Top cost accounts analysis
SELECT 
    line_item_usage_account_id AS account_id,
    SUM(line_item_unblended_cost) AS total_cost,
    COUNT(DISTINCT product_product_name) AS services_used,
    AVG(line_item_unblended_cost) AS avg_daily_cost
FROM aws_cost_usage_report 
WHERE line_item_usage_start_date >= '2024-01-01T00:00:00Z'
GROUP BY account_id
ORDER BY total_cost DESC
LIMIT 20;`
  },
  {
    id: 'cost-by-region',
    name: 'Cost by Region',
    category: 'Analytics',
    description: 'Analyze spend distribution across AWS regions',
    difficulty: 'beginner',
    query: `-- Cost distribution by AWS region
SELECT 
    product_region AS region,
    SUM(line_item_unblended_cost) AS total_cost,
    COUNT(DISTINCT line_item_resource_id) AS resource_count,
    COUNT(DISTINCT product_product_name) AS service_types
FROM aws_cost_usage_report 
WHERE line_item_usage_start_date >= '2024-01-01T00:00:00Z'
    AND product_region IS NOT NULL
    AND product_region != ''
GROUP BY region
ORDER BY total_cost DESC;`
  },
  
  // Compute Optimization
  {
    id: 'ec2-rightsizing',
    name: 'EC2 Rightsizing Analysis',
    category: 'Compute',
    description: 'Identify over-provisioned EC2 instances',
    difficulty: 'intermediate',
    query: `-- EC2 rightsizing opportunities
SELECT 
    line_item_resource_id AS instance_id,
    product_instance_type,
    product_region,
    SUM(line_item_usage_amount) AS total_hours,
    SUM(line_item_unblended_cost) AS total_cost,
    AVG(line_item_usage_amount) AS avg_daily_hours,
    CASE 
        WHEN AVG(line_item_usage_amount) < 8 THEN 'Under-utilized (<8h/day)'
        WHEN AVG(line_item_usage_amount) < 16 THEN 'Low utilization (8-16h/day)'
        WHEN AVG(line_item_usage_amount) < 20 THEN 'Good utilization (16-20h/day)'
        ELSE 'High utilization (>20h/day)'
    END AS utilization_category
FROM aws_cost_usage_report 
WHERE line_item_product_code = 'AmazonEC2'
    AND line_item_operation = 'RunInstances'
    AND line_item_usage_start_date >= '2024-01-01T00:00:00Z'
    AND line_item_resource_id IS NOT NULL
GROUP BY instance_id, product_instance_type, product_region
HAVING total_cost > 50
ORDER BY total_cost DESC;`
  },
  {
    id: 'spot-vs-ondemand',
    name: 'Spot vs On-Demand Analysis',
    category: 'Compute',
    description: 'Compare Spot and On-Demand instance costs',
    difficulty: 'intermediate',
    query: `-- Spot vs On-Demand cost comparison
SELECT 
    product_instance_type,
    product_region,
    SUM(CASE WHEN line_item_usage_type LIKE '%Spot%' THEN line_item_unblended_cost ELSE 0 END) AS spot_cost,
    SUM(CASE WHEN line_item_usage_type NOT LIKE '%Spot%' THEN line_item_unblended_cost ELSE 0 END) AS ondemand_cost,
    SUM(line_item_unblended_cost) AS total_cost,
    (SUM(CASE WHEN line_item_usage_type LIKE '%Spot%' THEN line_item_unblended_cost ELSE 0 END) / 
     SUM(line_item_unblended_cost)) * 100 AS spot_percentage
FROM aws_cost_usage_report 
WHERE line_item_product_code = 'AmazonEC2'
    AND line_item_usage_start_date >= '2024-01-01T00:00:00Z'
GROUP BY product_instance_type, product_region
HAVING total_cost > 100
ORDER BY total_cost DESC;`
  },
  {
    id: 'lambda-optimization',
    name: 'Lambda Cost Optimization',
    category: 'Compute',
    description: 'Analyze Lambda function costs and efficiency',
    difficulty: 'intermediate',
    query: `-- Lambda cost optimization analysis
SELECT 
    line_item_resource_id AS function_name,
    SUM(line_item_usage_amount) AS total_invocations,
    SUM(line_item_unblended_cost) AS total_cost,
    AVG(line_item_unblended_cost / line_item_usage_amount) AS cost_per_invocation,
    product_memory AS allocated_memory
FROM aws_cost_usage_report 
WHERE line_item_product_code = 'AWSLambda'
    AND line_item_usage_start_date >= '2024-01-01T00:00:00Z'
    AND line_item_usage_amount > 0
GROUP BY function_name, allocated_memory
ORDER BY total_cost DESC;`
  },
  
  // Container Optimization
  {
    id: 'ecs-fargate-analysis',
    name: 'ECS Fargate Cost Analysis',
    category: 'Container',
    description: 'Analyze ECS Fargate task costs and utilization',
    difficulty: 'intermediate',
    query: `-- ECS Fargate cost and utilization analysis
SELECT 
    line_item_resource_id AS task_definition,
    product_vcpu AS vcpu_count,
    product_memory AS memory_gb,
    SUM(line_item_usage_amount) AS total_vcpu_hours,
    SUM(line_item_unblended_cost) AS total_cost,
    AVG(line_item_unblended_cost / line_item_usage_amount) AS cost_per_vcpu_hour
FROM aws_cost_usage_report 
WHERE line_item_product_code = 'AmazonECS'
    AND line_item_operation = 'FargateTask'
    AND line_item_usage_start_date >= '2024-01-01T00:00:00Z'
GROUP BY task_definition, vcpu_count, memory_gb
ORDER BY total_cost DESC;`
  },
  {
    id: 'eks-node-optimization',
    name: 'EKS Node Cost Analysis',
    category: 'Container',
    description: 'Analyze EKS worker node costs and efficiency',
    difficulty: 'intermediate',
    query: `-- EKS worker node cost analysis
SELECT 
    line_item_resource_id AS node_id,
    product_instance_type,
    product_region,
    SUM(line_item_usage_amount) AS total_hours,
    SUM(line_item_unblended_cost) AS total_cost,
    resource_tags_user_kubernetes_cluster AS cluster_name
FROM aws_cost_usage_report 
WHERE line_item_product_code = 'AmazonEC2'
    AND resource_tags_user_kubernetes_cluster IS NOT NULL
    AND line_item_usage_start_date >= '2024-01-01T00:00:00Z'
GROUP BY node_id, product_instance_type, product_region, cluster_name
ORDER BY total_cost DESC;`
  },
  
  // Database Optimization
  {
    id: 'rds-idle-detection',
    name: 'RDS Idle Instance Detection',
    category: 'Database',
    description: 'Identify potentially idle RDS instances',
    difficulty: 'intermediate',
    query: `-- RDS idle instance detection
SELECT 
    line_item_resource_id AS db_instance,
    product_instance_type,
    product_database_engine,
    SUM(line_item_usage_amount) AS total_hours,
    SUM(line_item_unblended_cost) AS total_cost,
    AVG(line_item_usage_amount) AS avg_daily_hours,
    CASE 
        WHEN AVG(line_item_usage_amount) < 2 THEN 'Potentially Idle'
        WHEN AVG(line_item_usage_amount) < 12 THEN 'Low Utilization'
        ELSE 'Active'
    END AS utilization_status
FROM aws_cost_usage_report 
WHERE line_item_product_code = 'AmazonRDS'
    AND line_item_operation = 'CreateDBInstance'
    AND line_item_usage_start_date >= '2024-01-01T00:00:00Z'
GROUP BY db_instance, product_instance_type, product_database_engine
HAVING total_cost > 50
ORDER BY total_cost DESC;`
  },
  {
    id: 'dynamodb-cost-analysis',
    name: 'DynamoDB Cost Breakdown',
    category: 'Database',
    description: 'Analyze DynamoDB costs by table and usage type',
    difficulty: 'intermediate',
    query: `-- DynamoDB cost breakdown by table and usage
SELECT 
    line_item_resource_id AS table_name,
    line_item_usage_type AS usage_type,
    SUM(line_item_usage_amount) AS total_units,
    SUM(line_item_unblended_cost) AS total_cost,
    AVG(line_item_unblended_cost / line_item_usage_amount) AS cost_per_unit
FROM aws_cost_usage_report 
WHERE line_item_product_code = 'AmazonDynamoDB'
    AND line_item_usage_start_date >= '2024-01-01T00:00:00Z'
    AND line_item_usage_amount > 0
GROUP BY table_name, usage_type
ORDER BY total_cost DESC;`
  },
  
  // Storage Optimization
  {
    id: 's3-storage-analysis',
    name: 'S3 Storage Cost Analysis',
    category: 'Storage',
    description: 'Analyze S3 costs by storage class and bucket',
    difficulty: 'beginner',
    query: `-- S3 storage cost analysis by class and bucket
SELECT 
    line_item_resource_id AS bucket_name,
    product_storage_class AS storage_class,
    SUM(line_item_usage_amount) AS total_gb_month,
    SUM(line_item_unblended_cost) AS total_cost,
    AVG(line_item_unblended_cost / line_item_usage_amount) AS cost_per_gb
FROM aws_cost_usage_report 
WHERE line_item_product_code = 'AmazonS3'
    AND line_item_usage_type LIKE '%Storage%'
    AND line_item_usage_start_date >= '2024-01-01T00:00:00Z'
    AND line_item_usage_amount > 0
GROUP BY bucket_name, storage_class
ORDER BY total_cost DESC;`
  },
  {
    id: 'ebs-optimization',
    name: 'EBS Volume Optimization',
    category: 'Storage',
    description: 'Identify underutilized EBS volumes',
    difficulty: 'intermediate',
    query: `-- EBS volume optimization opportunities
SELECT 
    line_item_resource_id AS volume_id,
    product_volume_type AS volume_type,
    product_volume_api_name AS size_gb,
    SUM(line_item_usage_amount) AS total_hours,
    SUM(line_item_unblended_cost) AS total_cost,
    CASE 
        WHEN line_item_usage_type LIKE '%Snapshot%' THEN 'Snapshot'
        WHEN line_item_usage_type LIKE '%IOPS%' THEN 'Provisioned IOPS'
        ELSE 'Standard Storage'
    END AS usage_category
FROM aws_cost_usage_report 
WHERE line_item_product_code = 'AmazonEC2'
    AND line_item_usage_type LIKE '%EBS%'
    AND line_item_usage_start_date >= '2024-01-01T00:00:00Z'
GROUP BY volume_id, volume_type, size_gb, usage_category
ORDER BY total_cost DESC;`
  },
  
  // Network & Data Transfer
  {
    id: 'data-transfer-costs',
    name: 'Data Transfer Cost Analysis',
    category: 'Network',
    description: 'Analyze data transfer costs by service and region',
    difficulty: 'intermediate',
    query: `-- Data transfer cost analysis
SELECT 
    product_product_name AS service_name,
    product_from_region AS from_region,
    product_to_region AS to_region,
    SUM(line_item_usage_amount) AS total_gb_transferred,
    SUM(line_item_unblended_cost) AS total_cost,
    AVG(line_item_unblended_cost / line_item_usage_amount) AS cost_per_gb
FROM aws_cost_usage_report 
WHERE line_item_usage_type LIKE '%DataTransfer%'
    AND line_item_usage_start_date >= '2024-01-01T00:00:00Z'
    AND line_item_usage_amount > 0
GROUP BY service_name, from_region, to_region
ORDER BY total_cost DESC;`
  },
  
  // Cost Management & Governance
  {
    id: 'untagged-resources',
    name: 'Untagged Resource Analysis',
    category: 'Governance',
    description: 'Find high-cost resources without proper tagging',
    difficulty: 'intermediate',
    query: `-- Untagged resources with significant cost impact
SELECT 
    product_product_name AS service,
    line_item_resource_id AS resource_id,
    SUM(line_item_unblended_cost) AS total_cost,
    CASE 
        WHEN resource_tags_user_environment IS NULL OR resource_tags_user_environment = '' THEN 'Missing Environment'
        WHEN resource_tags_user_team IS NULL OR resource_tags_user_team = '' THEN 'Missing Team'
        WHEN resource_tags_user_project IS NULL OR resource_tags_user_project = '' THEN 'Missing Project'
        ELSE 'Properly Tagged'
    END AS tagging_issue
FROM aws_cost_usage_report 
WHERE line_item_usage_start_date >= '2024-01-01T00:00:00Z'
    AND (resource_tags_user_environment IS NULL OR resource_tags_user_environment = ''
         OR resource_tags_user_team IS NULL OR resource_tags_user_team = ''
         OR resource_tags_user_project IS NULL OR resource_tags_user_project = '')
GROUP BY service, resource_id, tagging_issue
HAVING total_cost > 100
ORDER BY total_cost DESC;`
  },
  {
    id: 'savings-plans-analysis',
    name: 'Savings Plans Utilization',
    category: 'Cost Management',
    description: 'Analyze Savings Plans coverage and utilization',
    difficulty: 'advanced',
    query: `-- Savings Plans utilization analysis
SELECT 
    product_product_name AS service,
    pricing_term,
    SUM(CASE WHEN pricing_term = 'OnDemand' THEN line_item_unblended_cost ELSE 0 END) AS on_demand_cost,
    SUM(CASE WHEN pricing_term LIKE '%Savings%' THEN line_item_unblended_cost ELSE 0 END) AS savings_plans_cost,
    SUM(line_item_unblended_cost) AS total_cost,
    (SUM(CASE WHEN pricing_term LIKE '%Savings%' THEN line_item_unblended_cost ELSE 0 END) / 
     SUM(line_item_unblended_cost)) * 100 AS savings_plan_coverage
FROM aws_cost_usage_report 
WHERE line_item_usage_start_date >= '2024-01-01T00:00:00Z'
    AND product_product_name IN ('Amazon Elastic Compute Cloud - Compute', 'AWS Lambda')
GROUP BY service, pricing_term
ORDER BY total_cost DESC;`
  },
  {
    id: 'reserved-instance-utilization',
    name: 'Reserved Instance Analysis',
    category: 'Cost Management',
    description: 'Track Reserved Instance utilization and coverage',
    difficulty: 'advanced',
    query: `-- Reserved Instance utilization analysis
SELECT 
    product_instance_type,
    product_region,
    reservation_reservation_a_r_n AS ri_arn,
    SUM(CASE WHEN line_item_line_item_type = 'RIFee' THEN line_item_unblended_cost ELSE 0 END) AS ri_fee,
    SUM(CASE WHEN line_item_line_item_type = 'Usage' AND pricing_term = 'Reserved' THEN line_item_usage_amount ELSE 0 END) AS ri_usage_hours,
    SUM(CASE WHEN line_item_line_item_type = 'Usage' AND pricing_term = 'OnDemand' THEN line_item_usage_amount ELSE 0 END) AS od_usage_hours,
    (SUM(CASE WHEN line_item_line_item_type = 'Usage' AND pricing_term = 'Reserved' THEN line_item_usage_amount ELSE 0 END) / 
     (SUM(CASE WHEN line_item_line_item_type = 'Usage' AND pricing_term = 'Reserved' THEN line_item_usage_amount ELSE 0 END) + 
      SUM(CASE WHEN line_item_line_item_type = 'Usage' AND pricing_term = 'OnDemand' THEN line_item_usage_amount ELSE 0 END))) * 100 AS ri_utilization_percent
FROM aws_cost_usage_report 
WHERE line_item_product_code = 'AmazonEC2'
    AND line_item_usage_start_date >= '2024-01-01T00:00:00Z'
    AND reservation_reservation_a_r_n IS NOT NULL
GROUP BY product_instance_type, product_region, ri_arn
ORDER BY ri_fee DESC;`
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