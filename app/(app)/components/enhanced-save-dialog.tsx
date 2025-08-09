"use client"

import React, { useCallback, memo, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog"
import { CheckCircle, Cloud, RefreshCw, Bell, Mail, Phone, MessageSquare, Calendar, Database, AlertCircle, Save } from 'lucide-react'

interface S3ExportConfig {
  bucketName: string
  keyPrefix: string
  format: 'csv' | 'json' | 'parquet'
  region: string
}

interface RecurringRefreshConfig {
  enabled: boolean
  frequency: 'daily' | 'weekly' | 'monthly'
  time: string
  dayOfWeek?: number
  dayOfMonth?: number
  mode: 'override' | 'append'
}

interface NotificationConfig {
  slack?: {
    enabled: boolean
    webhookUrl: string
    channel?: string
  }
  email?: {
    enabled: boolean
    recipients: string[]
    subject?: string
  }
  phone?: {
    enabled: boolean
    numbers: string[]
    provider: 'twilio' | 'aws-sns'
  }
}

interface EnhancedSaveConfig {
  name: string
  description?: string
  s3Export?: S3ExportConfig
  recurringRefresh?: RecurringRefreshConfig
  notifications?: NotificationConfig
}

interface EnhancedSaveDialogProps {
  initialConfig?: Partial<EnhancedSaveConfig>
  onSave: (config: EnhancedSaveConfig, options: {
    enableS3Export: boolean
    enableRecurring: boolean
    enableNotifications: boolean
  }) => void
  onCancel: () => void
  results: any
}

const EnhancedSaveDialog = memo(function EnhancedSaveDialog({
  initialConfig,
  onSave,
  onCancel,
  results
}: EnhancedSaveDialogProps) {
  // Internal state management - isolated from parent component
  const [saveConfig, setSaveConfig] = useState<EnhancedSaveConfig>({
    name: initialConfig?.name || '',
    description: initialConfig?.description || '',
    s3Export: {
      bucketName: initialConfig?.s3Export?.bucketName || '',
      keyPrefix: initialConfig?.s3Export?.keyPrefix || 'finops-exports/',
      format: initialConfig?.s3Export?.format || 'csv',
      region: initialConfig?.s3Export?.region || 'us-east-1'
    },
    recurringRefresh: {
      enabled: initialConfig?.recurringRefresh?.enabled || false,
      frequency: initialConfig?.recurringRefresh?.frequency || 'daily',
      time: initialConfig?.recurringRefresh?.time || '09:00',
      mode: initialConfig?.recurringRefresh?.mode || 'override'
    },
    notifications: {
      slack: { 
        enabled: initialConfig?.notifications?.slack?.enabled || false, 
        webhookUrl: initialConfig?.notifications?.slack?.webhookUrl || ''
      },
      email: { 
        enabled: initialConfig?.notifications?.email?.enabled || false, 
        recipients: initialConfig?.notifications?.email?.recipients || []
      },
      phone: { 
        enabled: initialConfig?.notifications?.phone?.enabled || false, 
        numbers: initialConfig?.notifications?.phone?.numbers || [], 
        provider: initialConfig?.notifications?.phone?.provider || 'aws-sns'
      }
    }
  })
  
  const [enableS3Export, setEnableS3Export] = useState(true) // Always enabled
  const [enableRecurring, setEnableRecurring] = useState(initialConfig?.recurringRefresh?.enabled || false)
  const [enableNotifications, setEnableNotifications] = useState(false)

  // Memoized update functions to prevent re-renders and input blinking
  const updateName = useCallback((value: string) => {
    setSaveConfig(prev => ({ ...prev, name: value }))
  }, [])

  const updateDescription = useCallback((value: string) => {
    setSaveConfig(prev => ({ ...prev, description: value }))
  }, [])

  const updateS3Bucket = useCallback((value: string) => {
    setSaveConfig(prev => ({
      ...prev,
      s3Export: { ...prev.s3Export!, bucketName: value }
    }))
  }, [])

  const updateS3Region = useCallback((value: string) => {
    setSaveConfig(prev => ({
      ...prev,
      s3Export: { ...prev.s3Export!, region: value }
    }))
  }, [])

  const updateS3Prefix = useCallback((value: string) => {
    setSaveConfig(prev => ({
      ...prev,
      s3Export: { ...prev.s3Export!, keyPrefix: value }
    }))
  }, [])

  const updateS3Format = useCallback((value: 'csv' | 'json' | 'parquet') => {
    setSaveConfig(prev => ({
      ...prev,
      s3Export: { ...prev.s3Export!, format: value }
    }))
  }, [])

  const updateRecurringFrequency = useCallback((value: 'daily' | 'weekly' | 'monthly') => {
    setSaveConfig(prev => ({
      ...prev,
      recurringRefresh: { ...prev.recurringRefresh!, frequency: value }
    }))
  }, [])

  const updateRecurringTime = useCallback((value: string) => {
    setSaveConfig(prev => ({
      ...prev,
      recurringRefresh: { ...prev.recurringRefresh!, time: value }
    }))
  }, [])

  const updateRecurringMode = useCallback((value: 'override' | 'append') => {
    setSaveConfig(prev => ({
      ...prev,
      recurringRefresh: { ...prev.recurringRefresh!, mode: value }
    }))
  }, [])

  const updateSlackEnabled = useCallback((checked: boolean) => {
    setSaveConfig(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications!,
        slack: { ...prev.notifications!.slack!, enabled: checked }
      }
    }))
  }, [])

  const updateSlackWebhook = useCallback((value: string) => {
    setSaveConfig(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications!,
        slack: { ...prev.notifications!.slack!, webhookUrl: value }
      }
    }))
  }, [])

  const updateSlackChannel = useCallback((value: string) => {
    setSaveConfig(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications!,
        slack: { ...prev.notifications!.slack!, channel: value }
      }
    }))
  }, [])

  const updateEmailEnabled = useCallback((checked: boolean) => {
    setSaveConfig(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications!,
        email: { ...prev.notifications!.email!, enabled: checked }
      }
    }))
  }, [])

  const updateEmailRecipients = useCallback((value: string) => {
    setSaveConfig(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications!,
        email: { 
          ...prev.notifications!.email!, 
          recipients: value.split(',').map(email => email.trim()).filter(Boolean)
        }
      }
    }))
  }, [])

  const updatePhoneEnabled = useCallback((checked: boolean) => {
    setSaveConfig(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications!,
        phone: { ...prev.notifications!.phone!, enabled: checked }
      }
    }))
  }, [])

  const updatePhoneNumbers = useCallback((value: string) => {
    setSaveConfig(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications!,
        phone: { 
          ...prev.notifications!.phone!, 
          numbers: value.split(',').map(num => num.trim()).filter(Boolean)
        }
      }
    }))
  }, [])

  const updatePhoneProvider = useCallback((value: 'twilio' | 'aws-sns') => {
    setSaveConfig(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications!,
        phone: { ...prev.notifications!.phone!, provider: value }
      }
    }))
  }, [])

  // Handle save action
  const handleSave = useCallback(() => {
    onSave(saveConfig, {
      enableS3Export,
      enableRecurring,
      enableNotifications
    })
  }, [saveConfig, enableS3Export, enableRecurring, enableNotifications, onSave])

  return (
    <>
      <div className="space-y-6">
        {/* Export Configuration */}
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Database className="h-5 w-5" />
              Export Configuration
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Configure your data export settings and automation preferences
            </p>
          </div>
          
          {/* Export Name & Description */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="export-name">Export Name *</Label>
              <Input
                id="export-name"
                value={saveConfig.name}
                onChange={(e) => updateName(e.target.value)}
                placeholder="e.g., Monthly EC2 Cost Analysis"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="export-description">Description (Optional)</Label>
              <Textarea
                id="export-description"
                value={saveConfig.description || ''}
                onChange={(e) => updateDescription(e.target.value)}
                placeholder="Describe the purpose and contents of this export..."
                className="mt-1"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Recurring Refresh Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Recurring Refresh
              </h3>
              <p className="text-sm text-muted-foreground">
                Automatically re-execute query and update export data
              </p>
            </div>
            <Switch
              checked={enableRecurring}
              onCheckedChange={setEnableRecurring}
            />
          </div>
          
          {enableRecurring && (
            <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
              <div>
                <Label>Frequency</Label>
                <Select
                  value={saveConfig.recurringRefresh?.frequency}
                  onValueChange={updateRecurringFrequency}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="refresh-time">Execution Time</Label>
                <Input
                  id="refresh-time"
                  type="time"
                  value={saveConfig.recurringRefresh?.time}
                  onChange={(e) => updateRecurringTime(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Update Mode</Label>
                <Select
                  value={saveConfig.recurringRefresh?.mode}
                  onValueChange={updateRecurringMode}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="override">Override existing</SelectItem>
                    <SelectItem value="append">Append timestamped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
        {/* S3 Export Settings - Required */}
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              S3 Export Location
            </h3>
            <p className="text-sm text-muted-foreground">
              Configure where your export data will be stored in Amazon S3
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="s3-bucket">S3 Bucket Name *</Label>
                                <Input
                    id="s3-bucket"
                    value={saveConfig.s3Export?.bucketName || ''}
                    onChange={(e) => updateS3Bucket(e.target.value)}
                    placeholder="your-finops-bucket"
                    className="mt-1"
                  />
            </div>
            <div>
              <Label htmlFor="s3-region">AWS Region</Label>
              <Select
                value={saveConfig.s3Export?.region}
                onValueChange={updateS3Region}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                  <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                  <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                  <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="s3-prefix">Object Key Prefix</Label>
                              <Input
                  id="s3-prefix"
                  value={saveConfig.s3Export?.keyPrefix || ''}
                  onChange={(e) => updateS3Prefix(e.target.value)}
                  placeholder="finops-exports/"
                  className="mt-1"
                />
              <p className="text-xs text-muted-foreground mt-1">
                Optional prefix for organizing exports within your bucket
              </p>
            </div>
            <div>
              <Label htmlFor="s3-format">Export Format</Label>
              <Select
                value={saveConfig.s3Export?.format}
                onValueChange={updateS3Format}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Comma Separated)</SelectItem>
                  <SelectItem value="json">JSON (JavaScript Object)</SelectItem>
                  <SelectItem value="parquet">Parquet (Columnar)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2 text-blue-800">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <div className="font-medium mb-1">Required Permissions</div>
                <div>Your AWS credentials must have <code className="bg-blue-100 px-1 rounded">s3:PutObject</code> permissions for the specified bucket.</div>
              </div>
            </div>
          </div>
        </div>
        {/* Notifications - Optional Add-on */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications (Optional)
              </h3>
              <p className="text-sm text-muted-foreground">
                Get notified when exports complete or fail
              </p>
            </div>
            <Switch
              checked={enableNotifications}
              onCheckedChange={setEnableNotifications}
            />
          </div>
          
          {enableNotifications && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Slack */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <Label className="font-medium">Slack</Label>
                    </div>
                    <Switch
                      checked={saveConfig.notifications?.slack?.enabled}
                      onCheckedChange={updateSlackEnabled}
                    />
                  </div>
                  {saveConfig.notifications?.slack?.enabled && (
                    <div className="space-y-2">
                      <Input
                        placeholder="Webhook URL"
                        value={saveConfig.notifications?.slack?.webhookUrl || ''}
                        onChange={(e) => updateSlackWebhook(e.target.value)}
                        className="text-xs"
                      />
                      <Input
                        placeholder="#channel (optional)"
                        value={saveConfig.notifications?.slack?.channel || ''}
                        onChange={(e) => updateSlackChannel(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                  )}
                </div>
                
                {/* Email */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <Label className="font-medium">Email</Label>
                    </div>
                    <Switch
                      checked={saveConfig.notifications?.email?.enabled}
                      onCheckedChange={updateEmailEnabled}
                    />
                  </div>
                  {saveConfig.notifications?.email?.enabled && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="user@company.com, team@company.com"
                        value={saveConfig.notifications?.email?.recipients?.join(', ') || ''}
                        onChange={(e) => updateEmailRecipients(e.target.value)}
                        className="text-xs"
                        rows={2}
                      />
                    </div>
                  )}
                </div>
                
                {/* SMS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <Label className="font-medium">SMS</Label>
                    </div>
                    <Switch
                      checked={saveConfig.notifications?.phone?.enabled}
                      onCheckedChange={updatePhoneEnabled}
                    />
                  </div>
                  {saveConfig.notifications?.phone?.enabled && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="+1234567890, +0987654321"
                        value={saveConfig.notifications?.phone?.numbers?.join(', ') || ''}
                        onChange={(e) => updatePhoneNumbers(e.target.value)}
                        className="text-xs"
                        rows={2}
                      />
                      <Select
                        value={saveConfig.notifications?.phone?.provider}
                        onValueChange={updatePhoneProvider}
                      >
                        <SelectTrigger className="text-xs h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aws-sns">AWS SNS</SelectItem>
                          <SelectItem value="twilio">Twilio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <DialogFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Database className="h-4 w-4" />
          <span>{results?.rowCount || 0} rows • {results?.headers.length || 0} columns</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!saveConfig.name.trim() || !saveConfig.s3Export?.bucketName}
            className="min-w-24"
          >
            Create Export
          </Button>
        </div>
      </DialogFooter>
    </>
  )
})

export default EnhancedSaveDialog
