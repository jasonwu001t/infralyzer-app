# 🔌 Component API Data Structures

## 📋 Overview

This document defines the complete API data structures for all dashboard components in the infralyzer application. Each component has been designed with a component-based API pattern that includes:

- **Demo data generation functions** for development
- **API endpoint configuration** for backend integration
- **TypeScript interfaces** for type safety
- **Filter-aware data fetching** using the `useFilteredData` hook

---

## 🏗️ Core Infrastructure

### Dashboard Filters Interface

```typescript
interface DashboardFilters {
  dateRange: {
    start: string; // ISO date string
    end: string; // ISO date string
  };
  granularity: "daily" | "weekly" | "monthly";
  costType: "blended" | "unblended" | "amortized";
  accounts: string[];
  services: string[];
  regions: string[];
  tags: Record<string, string[]>;
  costThreshold: {
    min?: number;
    max?: number;
  };
  comparisonMode: boolean;
  comparisonPeriod: {
    primary: "last-month" | "previous-month" | "custom";
    secondary: "last-month" | "previous-month" | "custom";
  };
}
```

### Standard API Response Format

```typescript
interface StandardAPIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    pagination?: {
      page: number;
      totalPages: number;
      totalCount: number;
    };
    filters?: DashboardFilters;
    executionTime?: number;
    lastUpdated?: string;
    cacheHit?: boolean;
  };
}
```

---

## 📊 Dashboard Components API Structures

### 1. KPI Cards (`kpi-card.tsx`)

**Endpoint**: `GET /api/dashboard/kpis`
**Filters**: `['dateRange', 'accounts', 'services', 'regions', 'tags', 'costType', 'granularity']`

```typescript
interface KpiRequest {
  userId: string;
  kpiId: "mtd-spend" | "forecast" | "savings" | "budget-utilization";
  filters: DashboardFilters;
}

interface KpiData {
  title: string;
  value: string;
  trend: string;
  icon: string;
}

interface KpiResponse {
  success: boolean;
  data: KpiData;
  meta: {
    executionTime: number;
    lastUpdated: string;
  };
}
```

### 2. Spend Summary Chart (`spend-summary-chart.tsx`)

**Endpoint**: `GET /api/dashboard/spend-summary`
**Filters**: `['dateRange', 'granularity', 'costType', 'accounts', 'services', 'regions', 'tags']`

```typescript
interface SpendSummaryDataPoint {
  date: string;
  current: number;
  previous: number;
  forecast: number;
  budget?: number;
}

interface SpendSummaryResponse {
  success: boolean;
  data: SpendSummaryDataPoint[];
  meta: {
    granularity: "daily" | "weekly" | "monthly";
    currency: string;
  };
}
```

### 3. Service Costs Table (`service-costs-table.tsx`)

**Endpoint**: `GET /api/dashboard/service-costs`
**Filters**: `['dateRange', 'accounts', 'services', 'regions', 'tags', 'costType', 'granularity']`

```typescript
interface ServiceCostData {
  serviceId: string;
  serviceName: string;
  displayName: string;
  category: string;
  cost: {
    current: number;
    previous: number;
    changePercent: number;
  };
  trend: {
    direction: "up" | "down" | "stable";
    data: number[];
  };
  usage: {
    amount: number;
    unit: string;
  };
  region?: string;
}

interface ServiceCostsResponse {
  success: boolean;
  data: {
    services: ServiceCostData[];
    totalCost: number;
    pagination: {
      page: number;
      totalPages: number;
      totalCount: number;
    };
  };
}
```

### 4. Account Costs Table (`account-costs-table.tsx`)

**Endpoint**: `GET /api/dashboard/account-costs`
**Filters**: `['dateRange', 'accounts', 'costThreshold']`

```typescript
interface AccountCostData {
  name: string;
  accountId: string;
  cost: number;
  trend: number[];
}

interface AccountCostsResponse {
  success: boolean;
  data: {
    accounts: AccountCostData[];
  };
}
```

### 5. Budget vs Forecast (`budget-vs-forecast.tsx`)

**Endpoint**: `GET /api/dashboard/budget-forecast`
**Filters**: `['dateRange']`

```typescript
interface BudgetForecastData {
  budget: number;
  forecast: number;
  progress: number;
  overage: number;
  status: "on-track" | "warning" | "over-budget";
}

interface BudgetForecastResponse {
  success: boolean;
  data: BudgetForecastData;
}
```

### 6. Optimization Potential (`optimization-potential.tsx`)

**Endpoint**: `GET /api/optimization/potential`
**Filters**: `['dateRange', 'services', 'accounts']`

```typescript
interface OptimizationData {
  category: string;
  potential: number;
  opportunities: number;
  priority: "High" | "Medium" | "Low";
  services: string[];
}

interface OptimizationPotentialResponse {
  success: boolean;
  data: {
    categories: OptimizationData[];
    totalPotential: number;
  };
}
```

### 7. Discount Coverage Gauges (`discount-coverage-gauges.tsx`)

**Endpoint**: `GET /api/dashboard/discount-coverage`
**Filters**: `['dateRange', 'accounts', 'services']`

```typescript
interface DiscountCoverageData {
  riData: { name: string; value: number; fill: string }[];
  spData: { name: string; value: number; fill: string }[];
  riPercentage: number;
  spPercentage: number;
}

interface DiscountCoverageResponse {
  success: boolean;
  data: DiscountCoverageData;
}
```

### 8. Commitment Expirations (`commitment-expirations.tsx`)

**Endpoint**: `GET /api/dashboard/commitment-expirations`
**Filters**: `['dateRange', 'accounts']`

```typescript
interface CommitmentExpiration {
  id: string;
  type: string;
  expires: string;
  commitment: string;
  daysUntilExpiry: number;
  urgency: "critical" | "warning" | "normal";
}

interface CommitmentExpirationsResponse {
  success: boolean;
  data: {
    expirations: CommitmentExpiration[];
  };
}
```

### 9. Cost Anomalies (`anomaly-feed.tsx`)

**Endpoint**: `GET /api/dashboard/anomalies`
**Filters**: `['dateRange', 'services', 'regions']`

```typescript
interface AnomalyData {
  id: string;
  title: string;
  severity: "High" | "Medium" | "Low";
  date: string;
  service?: string;
  region?: string;
  impact: number;
  status?: "new" | "investigating" | "resolved";
  description?: string;
  recommendations?: string[];
}

interface AnomalyResponse {
  success: boolean;
  data: {
    anomalies: AnomalyData[];
  };
}
```

### 10. Top Cost by Tag (`top-cost-by-tag.tsx`)

**Endpoint**: `GET /api/dashboard/top-cost-by-tag`
**Filters**: `['dateRange', 'tags', 'accounts', 'services']`

```typescript
interface TagCostData {
  tag: string;
  cost: number;
}

interface TopCostByTagResponse {
  success: boolean;
  data: TagCostData[];
}
```

### 11. Forecast Accuracy (`forecast-accuracy.tsx`)

**Endpoint**: `GET /api/dashboard/forecast-accuracy`
**Filters**: `['dateRange']`

```typescript
interface ForecastAccuracyData {
  accuracy: number;
  confidence: string;
  status: "excellent" | "good" | "poor";
}

interface ForecastAccuracyResponse {
  success: boolean;
  data: ForecastAccuracyData;
}
```

### 12. Cost by Charge Type (`cost-by-charge-type.tsx`)

**Endpoint**: `GET /api/dashboard/cost-by-charge-type`
**Filters**: `['dateRange', 'accounts', 'services']`

```typescript
interface ChargeTypeData {
  type: string;
  cost: number;
  fill: string;
}

interface CostByChargeTypeResponse {
  success: boolean;
  data: ChargeTypeData[];
}
```

### 13. Regional Cost Breakdown (`regional-cost-breakdown.tsx`)

**Endpoint**: `GET /api/dashboard/regional-costs`
**Filters**: `['dateRange', 'regions', 'accounts', 'services']`

```typescript
interface RegionalData {
  region: string;
  cost: number;
  percentage: number;
}

interface RegionalCostResponse {
  success: boolean;
  data: RegionalData[];
}
```

### 14. Cost by Purchase Option (`cost-by-purchase-option.tsx`)

**Endpoint**: `GET /api/dashboard/purchase-options`
**Filters**: `['dateRange', 'services', 'accounts', 'regions']`

```typescript
interface PurchaseOptionData {
  option: string;
  cost: number;
  percentage: number;
  fill: string;
}

interface PurchaseOptionResponse {
  success: boolean;
  data: PurchaseOptionData[];
}
```

### 15. Top Accounts Widget (`top-accounts-widget.tsx`)

**Endpoint**: `GET /api/dashboard/top-accounts`
**Filters**: `['dateRange', 'accounts', 'costThreshold']`

```typescript
interface TopAccountData {
  name: string;
  accountId: string;
  cost: number;
}

interface TopAccountsResponse {
  success: boolean;
  data: TopAccountData[];
}
```

---

## 🔍 SQL Lab Components API Structures

### 1. SQL Query Execution (`sql-query-editor.tsx`, `sql-query-results.tsx`)

**Endpoint**: `POST /api/sql-lab/execute`

```typescript
interface QueryExecuteRequest {
  userId: string;
  query: string;
  parameters?: Record<string, any>;
}

interface QueryResult {
  headers: string[];
  rows: (string | number | null)[][];
  executionTime: number;
  rowCount: number;
  queryName?: string;
  executedAt: string;
}

interface QueryExecuteResponse {
  success: boolean;
  data?: {
    queryId: string;
    results: QueryResult;
  };
  error?: string;
}
```

### 2. SQL Templates (`sql-templates.tsx`)

**Endpoint**: `GET /api/sql-lab/templates`

```typescript
interface QueryTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  query: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
}

interface SqlTemplatesResponse {
  success: boolean;
  data: {
    templates: QueryTemplate[];
    categories: string[];
  };
}
```

### 3. AI Query Generation (`sql-ai-assistant.tsx`)

**Endpoint**: `POST /api/sql-lab/ai-generate`

```typescript
interface AIGenerateRequest {
  prompt: string;
  context: "cost-analysis" | "optimization" | "governance";
  schema?: string[];
}

interface AIGenerateResponse {
  success: boolean;
  data?: {
    query: string;
    explanation: string;
    confidence: number;
  };
  error?: string;
}
```

### 4. Query History (`sql-query-history.tsx`)

**Endpoint**: `GET /api/sql-lab/query-history`

```typescript
interface QueryHistory {
  id: string;
  userId: string;
  query: string;
  status: "success" | "error" | "running";
  executedAt: string;
  duration?: number;
  resultRows?: number;
  errorMessage?: string;
}

interface QueryHistoryResponse {
  success: boolean;
  data: QueryHistory[];
}
```

---

## 🎨 Static Components (No API Required)

### Components with Static/Computed Data

These components don't require API calls as they display static content or compute data from other sources:

1. **`multi-cloud-spend.tsx`** - Placeholder for future multi-cloud integration
2. **`workload-cost-efficiency.tsx`** - Static efficiency metrics
3. **`finops-maturity-score.tsx`** - Computed maturity assessment
4. **`dashboard-filters.tsx`** - Filter UI controls
5. **`header.tsx`** - Navigation header
6. **`sidebar.tsx`** - Navigation sidebar

---

## 🔄 API Integration Pattern

### Component Structure

Each API-enabled component follows this pattern:

```typescript
// 1. Data interface definition
interface ComponentData {
  // Define your data structure
}

// 2. Demo data generation function
const generateComponentData = async (
  filters: DashboardFilters,
  userId: string,
  role: string,
  organization: string
): Promise<ComponentData> => {
  // Generate user-aware demo data with filters
};

// 3. API configuration
const COMPONENT_API_CONFIG = {
  relevantFilters: ["dateRange", "services"] as (keyof DashboardFilters)[],
  endpoint: "/api/dashboard/component-endpoint",
  cacheDuration: 5 * 60 * 1000, // 5 minutes
};

// 4. Component implementation
export default function Component() {
  const { user } = useAuth();
  const { data, isLoading, error } = useFilteredData(async (filters) => {
    if (!user) throw new Error("User not authenticated");
    return generateComponentData(
      filters,
      user.id,
      user.role,
      user.organization
    );
  }, COMPONENT_API_CONFIG.relevantFilters);

  // Loading, error, and success states
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay error={error} />;
  if (!data) return <EmptyState />;

  return <ComponentUI data={data} />;
}
```

### Backend Implementation Requirements

For each component, your backend should implement:

1. **Route Handler**: Create the endpoint specified in `COMPONENT_API_CONFIG.endpoint`
2. **Data Processing**: Process the `DashboardFilters` to filter/aggregate your data
3. **User Context**: Apply role-based filtering based on `user.role` and `user.organization`
4. **Response Format**: Return data in the `StandardAPIResponse<ComponentData>` format
5. **Caching**: Implement appropriate caching based on `COMPONENT_API_CONFIG.cacheDuration`

### Filter Processing Example

```python
# Python FastAPI backend example
@app.get("/api/dashboard/service-costs")
async def get_service_costs(
    filters: DashboardFilters,
    user: User = Depends(get_current_user)
):
    # Apply date range filtering
    query = f"""
        SELECT service_name, cost, usage
        FROM cost_data
        WHERE date >= '{filters.dateRange.start}'
        AND date <= '{filters.dateRange.end}'
    """

    # Apply service filtering
    if filters.services:
        service_list = "', '".join(filters.services)
        query += f" AND service_name IN ('{service_list}')"

    # Apply user organization filtering
    query += f" AND organization_id = '{user.organization}'"

    # Apply role-based data scoping
    if user.role == 'viewer':
        query += " AND cost > 1000"  # Hide small costs for viewers

    results = execute_query(query)
    return StandardAPIResponse(
        success=True,
        data=transform_to_component_format(results),
        meta={
            "executionTime": query_time,
            "lastUpdated": datetime.now().isoformat()
        }
    )
```

---

## 🎯 Implementation Checklist

### For Frontend (Already Complete)

- ✅ All components use `useFilteredData` hook
- ✅ Demo data generation functions implemented
- ✅ Loading/error/empty states handled
- ✅ TypeScript interfaces defined
- ✅ API endpoint configurations documented

### For Backend (To Implement)

- [ ] Create API endpoints for each component
- [ ] Implement `DashboardFilters` processing
- [ ] Add user authentication and role-based filtering
- [ ] Set up data caching mechanisms
- [ ] Add error handling and validation
- [ ] Implement pagination for large datasets
- [ ] Add monitoring and logging

### API Endpoints Summary

Total endpoints to implement: **15 dashboard + 4 SQL Lab = 19 endpoints**

#### Dashboard Endpoints (15)

1. `GET /api/dashboard/kpis`
2. `GET /api/dashboard/spend-summary`
3. `GET /api/dashboard/service-costs`
4. `GET /api/dashboard/account-costs`
5. `GET /api/dashboard/budget-forecast`
6. `GET /api/optimization/potential`
7. `GET /api/dashboard/discount-coverage`
8. `GET /api/dashboard/commitment-expirations`
9. `GET /api/dashboard/anomalies`
10. `GET /api/dashboard/top-cost-by-tag`
11. `GET /api/dashboard/forecast-accuracy`
12. `GET /api/dashboard/cost-by-charge-type`
13. `GET /api/dashboard/regional-costs`
14. `GET /api/dashboard/purchase-options`
15. `GET /api/dashboard/top-accounts`

#### SQL Lab Endpoints (4)

1. `POST /api/sql-lab/execute`
2. `GET /api/sql-lab/templates`
3. `POST /api/sql-lab/ai-generate`
4. `GET /api/sql-lab/query-history`

---

## 🚀 Ready for Backend Integration!

Your frontend components are fully prepared for backend integration. Simply implement the APIs according to these specifications, and your components will automatically display real data instead of demo data.

**The component-based API pattern ensures:**

- 🔧 **Easy Maintenance**: Each component manages its own data requirements
- 🚀 **Performance**: Smart caching and filter-aware data fetching
- 🔒 **Security**: User context and role-based filtering built-in
- 📊 **Type Safety**: Full TypeScript coverage with proper interfaces
- 🎯 **Scalability**: Clear separation between frontend and backend concerns
