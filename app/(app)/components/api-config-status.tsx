"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronRight, RefreshCw, Settings, Globe } from "lucide-react"
import { config, checkApiHealth } from "@/lib/api-config"

interface HealthStatus {
  isHealthy: boolean
  status: string
  responseTime?: number
  version?: string
  error?: string
}

export default function ApiConfigStatus() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null)
  const [isCheckingHealth, setIsCheckingHealth] = useState(false)
  const [configOpen, setConfigOpen] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const validation = config.validate()
  const autoDetect = config.autoDetect()

  useEffect(() => {
    // Auto-check health on mount
    checkHealth()
  }, [])

  const checkHealth = async () => {
    setIsCheckingHealth(true)
    try {
      const health = await checkApiHealth()
      setHealthStatus(health)
    } catch (error) {
      setHealthStatus({
        isHealthy: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsCheckingHealth(false)
    }
  }

  const getStatusIcon = (isHealthy: boolean) => {
    if (isHealthy) {
      return <CheckCircle className="h-4 w-4 text-green-600" />
    }
    return <XCircle className="h-4 w-4 text-red-600" />
  }

  const getStatusColor = (isHealthy: boolean) => {
    return isHealthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          API Configuration Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Validation Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Configuration Validation</h3>
            <Badge className={validation.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {validation.isValid ? 'Valid' : 'Issues Found'}
            </Badge>
          </div>

          {/* Configuration Issues */}
          {validation.issues.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <div className="space-y-1">
                  <span className="font-medium">Configuration Issues:</span>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {validation.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Configuration Warnings */}
          {validation.warnings.length > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription>
                <div className="space-y-1">
                  <span className="font-medium">Recommendations:</span>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {validation.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Health Check */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">API Health Check</h3>
            <div className="flex items-center gap-2">
              {healthStatus && (
                <Badge className={getStatusColor(healthStatus.isHealthy)}>
                  {healthStatus.status}
                </Badge>
              )}
              <Button 
                onClick={checkHealth} 
                disabled={isCheckingHealth}
                size="sm"
                variant="outline"
              >
                {isCheckingHealth ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>

          {healthStatus && (
            <div className="p-3 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-3 mb-2">
                {getStatusIcon(healthStatus.isHealthy)}
                <span className="font-medium text-sm">
                  {healthStatus.isHealthy ? 'API is responding' : 'API is not responding'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium">Response Time:</span> {healthStatus.responseTime}ms
                </div>
                {healthStatus.version && (
                  <div>
                    <span className="font-medium">Version:</span> {healthStatus.version}
                  </div>
                )}
                {healthStatus.error && (
                  <div className="col-span-2">
                    <span className="font-medium text-red-600">Error:</span> {healthStatus.error}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Current Configuration */}
        <Collapsible open={configOpen} onOpenChange={setConfigOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-3 h-auto">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="font-medium">Current Configuration</span>
              </div>
              {configOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 p-3 border rounded-lg bg-muted/20">
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Base URL:</span>
                  <div className="text-sm font-mono break-all">{validation.config.baseUrl}</div>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Environment:</span>
                  <div className="text-sm">{autoDetect.environment}</div>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground">AI Features:</span>
                  <Badge variant={validation.config.enableAI ? "default" : "secondary"} className="ml-2">
                    {validation.config.enableAI ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">API Version:</span>
                  <div className="text-sm font-mono">{validation.config.apiVersion}</div>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Authentication:</span>
                  <Badge variant={validation.config.hasApiKey ? "default" : "outline"} className="ml-2">
                    {validation.config.hasApiKey ? 'Configured' : 'None'}
                  </Badge>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Debug Mode:</span>
                  <Badge variant={validation.config.debug ? "default" : "secondary"} className="ml-2">
                    {validation.config.debug ? 'On' : 'Off'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Advanced Configuration */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
            </Button>

            {showAdvanced && (
              <div className="p-3 border rounded-lg bg-muted/10 space-y-2">
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="font-medium text-muted-foreground">Timeout:</span>
                    <div>{validation.config.timeout}ms</div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Max Retries:</span>
                    <div>{validation.config.maxRetries}</div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">MCP Integration:</span>
                    <div>{validation.config.enableMCP ? 'Enabled' : 'Disabled'}</div>
                  </div>
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Environment Suggestions */}
        {autoDetect.suggestions.length > 0 && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              <div className="space-y-1">
                <span className="font-medium">Environment Suggestions:</span>
                <ul className="space-y-1 text-sm">
                  {autoDetect.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Fix Instructions */}
        {!validation.isValid && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription>
              <div className="space-y-2">
                <span className="font-medium">Quick Fix:</span>
                <div className="text-sm">
                  Create a <code className="px-1 py-0.5 bg-gray-200 rounded text-xs">.env.local</code> file in your project root with:
                </div>
                <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
{`NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_ENABLE_AI=true
NEXT_PUBLIC_DEBUG=true`}
                </pre>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
