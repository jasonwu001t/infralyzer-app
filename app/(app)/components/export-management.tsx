"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  Database, 
  MoreHorizontal, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Download, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Cloud,
  Bell,
  ChevronDown,
  ChevronRight,
  Eye,
  Copy
} from 'lucide-react'

interface ExportJob {
  id: string
  name: string
  description?: string
  status: 'active' | 'paused' | 'failed' | 'completed'
  lastRun?: string
  nextRun?: string
  frequency?: 'daily' | 'weekly' | 'monthly' | 'one-time'
  s3Location: string
  format: 'csv' | 'json' | 'parquet'
  rowCount?: number
  fileSize?: string
  createdAt: string
  notifications: {
    slack?: boolean
    email?: boolean
    sms?: boolean
  }
}

// Mock data for demonstration
const mockExports: ExportJob[] = [
  {
    id: 'exp_001',
    name: 'Monthly EC2 Cost Analysis',
    description: 'Detailed breakdown of EC2 costs by instance type and region',
    status: 'active',
    lastRun: '2024-01-15T09:00:00Z',
    nextRun: '2024-02-15T09:00:00Z',
    frequency: 'monthly',
    s3Location: 's3://finops-exports/ec2-costs/',
    format: 'csv',
    rowCount: 1247,
    fileSize: '2.3 MB',
    createdAt: '2024-01-01T10:30:00Z',
    notifications: { slack: true, email: true }
  },
  {
    id: 'exp_002',
    name: 'Weekly S3 Storage Report',
    description: 'Storage usage and costs across all S3 buckets',
    status: 'active',
    lastRun: '2024-01-14T07:00:00Z',
    nextRun: '2024-01-21T07:00:00Z',
    frequency: 'weekly',
    s3Location: 's3://finops-exports/s3-storage/',
    format: 'parquet',
    rowCount: 856,
    fileSize: '1.8 MB',
    createdAt: '2024-01-01T08:15:00Z',
    notifications: { email: true }
  },
  {
    id: 'exp_003',
    name: 'Daily RDS Cost Tracking',
    status: 'failed',
    lastRun: '2024-01-15T06:00:00Z',
    frequency: 'daily',
    s3Location: 's3://finops-exports/rds-costs/',
    format: 'json',
    createdAt: '2024-01-10T12:00:00Z',
    notifications: { slack: true, sms: true }
  },
  {
    id: 'exp_004',
    name: 'Q4 Cost Summary',
    description: 'One-time export of Q4 2023 cost summary for audit',
    status: 'completed',
    lastRun: '2024-01-02T14:30:00Z',
    frequency: 'one-time',
    s3Location: 's3://finops-exports/q4-summary/',
    format: 'csv',
    rowCount: 2156,
    fileSize: '4.7 MB',
    createdAt: '2024-01-02T14:00:00Z',
    notifications: { email: true }
  }
]

export default function ExportManagement() {
  const [exports, setExports] = useState<ExportJob[]>(mockExports)
  const [selectedExport, setSelectedExport] = useState<ExportJob | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusBadge = (status: ExportJob['status']) => {
    const variants = {
      active: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      paused: { variant: 'secondary' as const, icon: Pause, color: 'text-yellow-600' },
      failed: { variant: 'destructive' as const, icon: AlertCircle, color: 'text-red-600' },
      completed: { variant: 'outline' as const, icon: CheckCircle, color: 'text-blue-600' }
    }
    const { variant, icon: Icon, color } = variants[status]
    
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${color}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getFrequencyBadge = (frequency?: string) => {
    if (!frequency) return null
    
    const colors = {
      'daily': 'bg-blue-100 text-blue-800',
      'weekly': 'bg-green-100 text-green-800', 
      'monthly': 'bg-purple-100 text-purple-800',
      'one-time': 'bg-gray-100 text-gray-800'
    }
    
    return (
      <Badge variant="outline" className={colors[frequency as keyof typeof colors]}>
        <Clock className="h-3 w-3 mr-1" />
        {frequency}
      </Badge>
    )
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleToggleStatus = (exportId: string) => {
    setExports(prev => prev.map(exp => 
      exp.id === exportId 
        ? { ...exp, status: exp.status === 'active' ? 'paused' : 'active' }
        : exp
    ))
  }

  const handleDeleteExport = (exportId: string) => {
    setExports(prev => prev.filter(exp => exp.id !== exportId))
  }

  const handleRunNow = (exportId: string) => {
    // TODO: Implement immediate execution
    console.log('Running export now:', exportId)
  }

  return (
    <div className="space-y-4">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-sm font-medium p-0 h-auto">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <Database className="h-4 w-4" />
              Export Management
              <Badge variant="secondary" className="ml-2 text-xs">
                {exports.length}
              </Badge>
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="space-y-3 mt-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Active Exports</span>
                <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-64 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="text-xs">
                      <TableHead className="h-8">Export Name</TableHead>
                      <TableHead className="h-8">Status</TableHead>
                      <TableHead className="h-8">Schedule</TableHead>
                      <TableHead className="h-8">Last Run</TableHead>
                      <TableHead className="h-8">Next Run</TableHead>
                      <TableHead className="h-8 w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exports.map((exportJob) => (
                      <TableRow key={exportJob.id} className="text-xs">
                        <TableCell className="py-2">
                          <div className="space-y-1">
                            <div className="font-medium">{exportJob.name}</div>
                            <div className="text-muted-foreground text-xs flex items-center gap-2">
                              <Cloud className="h-3 w-3" />
                              {exportJob.s3Location}
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                {exportJob.format.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-2">
                          {getStatusBadge(exportJob.status)}
                        </TableCell>
                        <TableCell className="py-2">
                          {getFrequencyBadge(exportJob.frequency)}
                        </TableCell>
                        <TableCell className="py-2 text-muted-foreground">
                          {formatDate(exportJob.lastRun)}
                          {exportJob.rowCount && (
                            <div className="text-xs text-muted-foreground">
                              {exportJob.rowCount.toLocaleString()} rows
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="py-2 text-muted-foreground">
                          {exportJob.status === 'active' && exportJob.frequency !== 'one-time' 
                            ? formatDate(exportJob.nextRun)
                            : '—'
                          }
                        </TableCell>
                        <TableCell className="py-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-6 w-6 p-0">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => setSelectedExport(exportJob)}>
                                <Eye className="h-3 w-3 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {exportJob.status === 'active' && (
                                <DropdownMenuItem onClick={() => handleRunNow(exportJob.id)}>
                                  <Play className="h-3 w-3 mr-2" />
                                  Run Now
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleToggleStatus(exportJob.id)}>
                                {exportJob.status === 'active' ? (
                                  <>
                                    <Pause className="h-3 w-3 mr-2" />
                                    Pause Export
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-3 w-3 mr-2" />
                                    Resume Export
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-3 w-3 mr-2" />
                                Edit Configuration
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-3 w-3 mr-2" />
                                Duplicate Export
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-3 w-3 mr-2" />
                                Download Latest
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteExport(exportJob.id)}
                              >
                                <Trash2 className="h-3 w-3 mr-2" />
                                Delete Export
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Export Details Dialog */}
      {selectedExport && (
        <Dialog open={!!selectedExport} onOpenChange={() => setSelectedExport(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                {selectedExport.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedExport.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Schedule</label>
                  <div className="mt-1">
                    {getFrequencyBadge(selectedExport.frequency)}
                  </div>
                </div>
              </div>
              
              {selectedExport.description && (
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedExport.description}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">S3 Location</label>
                  <p className="text-sm text-muted-foreground mt-1 font-mono">
                    {selectedExport.s3Location}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Export Format</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedExport.format.toUpperCase()}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Last Run</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(selectedExport.lastRun)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Next Run</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedExport.status === 'active' && selectedExport.frequency !== 'one-time' 
                      ? formatDate(selectedExport.nextRun)
                      : '—'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Created</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(selectedExport.createdAt)}
                  </p>
                </div>
              </div>
              
              {selectedExport.rowCount && selectedExport.fileSize && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Last Export Size</label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedExport.rowCount.toLocaleString()} rows • {selectedExport.fileSize}
                    </p>
                  </div>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium">Notifications</label>
                <div className="mt-1 flex gap-2">
                  {selectedExport.notifications.slack && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Bell className="h-3 w-3" />
                      Slack
                    </Badge>
                  )}
                  {selectedExport.notifications.email && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Bell className="h-3 w-3" />
                      Email
                    </Badge>
                  )}
                  {selectedExport.notifications.sms && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Bell className="h-3 w-3" />
                      SMS
                    </Badge>
                  )}
                  {!selectedExport.notifications.slack && !selectedExport.notifications.email && !selectedExport.notifications.sms && (
                    <span className="text-sm text-muted-foreground">None configured</span>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
