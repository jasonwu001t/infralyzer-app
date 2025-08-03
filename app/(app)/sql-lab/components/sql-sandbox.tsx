"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ResultsTable from "./results-table"
import { Loader2 } from "lucide-react"

const useCases = {
  "cost-components": {
    label: "Analyze costs of components of a resource",
    query: `SELECT
    BillingPeriod,
    ChargeType,
    SUM(BilledCost) AS Cost
FROM
    focus_0_9.focus_0_9
WHERE
    ChargeType = 'Usage'
GROUP BY
    BillingPeriod,
    ChargeType
ORDER BY
    Cost DESC;`,
    results: {
      headers: ["BillingPeriod", "ChargeType", "Cost"],
      rows: [
        ["2024-09", "Usage", "150234.56"],
        ["2024-08", "Usage", "145876.12"],
        ["2024-07", "Usage", "142331.98"],
      ],
    },
  },
  "service-spend": {
    label: "Track monthly spend for a service",
    query: `SELECT
    BillingPeriod,
    ServiceName,
    SUM(BilledCost) AS MonthlyCost
FROM
    focus_0_9.focus_0_9
WHERE
    ServiceName = 'Amazon EC2'
GROUP BY
    BillingPeriod,
    ServiceName
ORDER BY
    BillingPeriod DESC;`,
    results: {
      headers: ["BillingPeriod", "ServiceName", "MonthlyCost"],
      rows: [
        ["2024-09", "Amazon EC2", "45012.34"],
        ["2024-08", "Amazon EC2", "43889.76"],
        ["2024-07", "Amazon EC2", "42500.00"],
      ],
    },
  },
}

type UseCaseKey = keyof typeof useCases

export default function SqlSandbox() {
  const [selectedUseCase, setSelectedUseCase] = useState<UseCaseKey | null>(null)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{ headers: string[]; rows: string[][] } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectUseCase = (value: string) => {
    const key = value as UseCaseKey
    setSelectedUseCase(key)
    setQuery(useCases[key].query)
    setResults(null)
  }

  const handleRunQuery = () => {
    if (!selectedUseCase) return
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      if (selectedUseCase) {
        setResults(useCases[selectedUseCase].results)
      }
      setIsLoading(false)
    }, 1500)
  }

  const handleRestart = () => {
    setSelectedUseCase(null)
    setQuery("")
    setResults(null)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select a Use Case</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={handleSelectUseCase} value={selectedUseCase || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select a use case..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(useCases).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>FOCUS SQL Query</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto">
              <code>{query || "Please select a use case to view the query."}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center gap-4">
        <Button onClick={handleRunQuery} disabled={!selectedUseCase || isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Run Query
        </Button>
        <Button variant="ghost" onClick={handleRestart}>
          Restart
        </Button>
      </div>
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2">Running query...</span>
        </div>
      )}
      {results && <ResultsTable data={results} />}
    </div>
  )
}
