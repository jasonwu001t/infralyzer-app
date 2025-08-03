# 🧩 Component-Based API Architecture

A scalable, maintainable approach to API management where each component owns its data requirements and API interactions.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture Benefits](#architecture-benefits)
- [Component Structure](#component-structure)
- [Filter Management](#filter-management)
- [Implementation Examples](#implementation-examples)
- [Migration Guide](#migration-guide)
- [Best Practices](#best-practices)

## 🎯 Overview

### **Problem Solved**

- ❌ **Centralized API management** becomes a bottleneck as applications scale
- ❌ **Hard to understand** what data each component needs
- ❌ **Difficult to maintain** when API requirements change
- ❌ **Complex dependencies** between components and shared API layers

### **Solution: Component-Based APIs**

- ✅ **Each component owns its data structure** and API interactions
- ✅ **Self-contained** components with embedded demo data
- ✅ **Easy to swap** individual components with real APIs
- ✅ **Shared filter system** for cross-component coordination
- ✅ **Scalable** - no central API bottleneck

---

## 🏗️ Architecture Benefits

### **1. Scalability**

- No centralized API management bottleneck
- Components can be updated independently
- Easy to add new components without affecting existing ones

### **2. Maintainability**

- Data requirements are co-located with components
- Easy to understand what each component needs
- API changes affect only the relevant component

### **3. Developer Experience**

- Clear component boundaries
- Self-documenting API structures
- Easy testing with embedded demo data

### **4. Flexibility**

- Easy to swap demo data with real APIs per component
- Components can have different API strategies
- Progressive migration from demo to real APIs

---

## 🧱 Component Structure

Each component follows this pattern:

```typescript
// ComponentName.tsx
"use client";

import { useState, useEffect } from "react";
import { useDashboardFilters } from "@/lib/hooks/use-dashboard-filters";
import { useAuth } from "@/lib/hooks/use-auth";

// 1. Component-specific API data structure
export interface ComponentData {
  // Define your component's data structure
  id: string;
  value: number;
  metadata: {
    lastUpdated: string;
    source: string;
  };
}

// 2. Component API configuration
const COMPONENT_API_CONFIG = {
  // Which filters affect this component's data
  relevantFilters: ["dateRange", "accounts"] as (keyof DashboardFilters)[],

  // Cache duration in milliseconds
  cacheDuration: 5 * 60 * 1000, // 5 minutes

  // Real API endpoint (when ready to replace demo data)
  endpoint: "/api/component/data",

  // Demo data generator
  generateDemoData: (filters: DashboardFilters, user: any): ComponentData => {
    // Generate realistic demo data based on filters and user context
    return {
      id: "demo-1",
      value: 12345,
      metadata: {
        lastUpdated: new Date().toISOString(),
        source: "demo",
      },
    };
  },
};

// 3. Component implementation
export default function ComponentName({ ...props }) {
  const { user } = useAuth();
  const { filters } = useDashboardFilters();
  const [data, setData] = useState<ComponentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 4. Fetch data based on filters
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setIsLoading(true);
      setError(null);

      try {
        // TODO: Replace with actual API call when ready
        // const response = await fetch(COMPONENT_API_CONFIG.endpoint)
        // const data = await response.json()

        const data = COMPONENT_API_CONFIG.generateDemoData(filters, user);
        setData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filters, user]);

  // 5. Render component
  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {data && <div>{data.value}</div>}
    </div>
  );
}

// 6. Export API configuration for documentation
export { COMPONENT_API_CONFIG };
```

---

## 🔄 Filter Management

### **Problem: Cross-Component Filter Coordination**

Dashboard pages have multiple components that need to respond to the same filters (date range, services, accounts, etc.).

### **Solution: Shared Filter Context**

#### **1. Filter Hook (`use-dashboard-filters.ts`)**

```typescript
// Centralized filter state management
export const useDashboardFilters = () => {
  // Returns current filters and update functions
  // Handles filter state across all dashboard components
};

// Utility to check if component should refetch data
export const filterUtils = {
  shouldRefetch: (prevFilters, newFilters, relevantKeys) => {
    // Only refetch if relevant filters changed
  },
};
```

#### **2. Filter Provider**

```typescript
// Wrap dashboard page with filter provider
<DashboardFilterProvider>
  <KpiCard kpiId="mtd-spend" />
  <SpendSummaryChart />
  <ServiceCostsTable />
</DashboardFilterProvider>
```

#### **3. Component Filter Subscription**

```typescript
// Components subscribe to relevant filters only
const COMPONENT_API_CONFIG = {
  relevantFilters: ["dateRange", "services"], // Only these filters trigger refetch
  // ...
};
```

---

## 💡 Implementation Examples

### **1. Simple KPI Card**

```typescript
// kpi-card.tsx
export interface KpiData {
  id: string;
  title: string;
  value: number;
  displayValue: string;
  trend: string;
  icon: string;
}

const KPI_API_CONFIG = {
  relevantFilters: ["dateRange", "accounts"],
  endpoint: "/api/dashboard/kpis",
  generateDemoData: (filters, user) => [
    {
      id: "mtd-spend",
      title: "Month-to-Date Spend",
      value: 1250430 * getUserMultiplier(user),
      displayValue: "$1,250,430",
      trend: "+5.9% vs last month",
      icon: "DollarSign",
    },
  ],
};
```

### **2. Complex Chart Component**

```typescript
// spend-summary-chart.tsx
export interface SpendChartData {
  date: string;
  current: number;
  previous: number;
  forecast: number;
  metadata: {
    isWeekend: boolean;
    confidence: number;
  };
}

const SPEND_CHART_API_CONFIG = {
  relevantFilters: ["dateRange", "granularity"],
  endpoint: "/api/dashboard/spend-summary",
  generateDemoData: (filters, user) => ({
    chartData: generateTimeSeriesData(filters),
    summary: calculateSummaryMetrics(),
    insights: extractInsights(),
  }),
};
```

### **3. Table Component with Search**

```typescript
// service-costs-table.tsx
export interface ServiceCostData {
  serviceId: string;
  serviceName: string;
  category: "compute" | "storage" | "database";
  cost: {
    current: number;
    previous: number;
    change: number;
  };
  trend: {
    data: number[];
    direction: "up" | "down" | "stable";
  };
}

const SERVICE_COSTS_API_CONFIG = {
  relevantFilters: ["dateRange", "services", "accounts"],
  endpoint: "/api/dashboard/service-costs",
  generateDemoData: (filters, user) => ({
    services: generateServiceData(filters, user),
    summary: calculateTotals(),
    filters: getAvailableFilters(),
  }),
};
```

---

## 🔄 Migration Guide

### **Phase 1: Component Structure**

1. ✅ Add API data interfaces to each component
2. ✅ Add demo data generators
3. ✅ Implement filter subscription
4. ✅ Keep existing functionality working

### **Phase 2: Real API Integration**

```typescript
// Replace demo data generator with real API call
const fetchData = async () => {
  // Replace this:
  // const data = COMPONENT_API_CONFIG.generateDemoData(filters, user)

  // With this:
  const queryParams = filterUtils.toQueryParams(filters);
  const response = await fetch(
    `${COMPONENT_API_CONFIG.endpoint}?${queryParams}`
  );
  const data = await response.json();

  setData(data);
};
```

### **Phase 3: Advanced Features**

- Add real-time updates
- Implement optimistic updates
- Add offline support
- Implement data persistence

---

## 📁 Current Implementation Status

### **✅ Completed Components**

- **KpiCard**: Simple metric display with user-specific data
- **SpendSummaryChart**: Complex chart with time-series data and insights
- **ServiceCostsTable**: Table with search, filtering, and trend visualization

### **🔧 Filter System**

- **DashboardFilterProvider**: Centralized filter state management
- **useDashboardFilters**: Hook for filter subscription
- **filterUtils**: Utilities for filter management and optimization

### **📊 Demo Data Features**

- **User-specific scaling**: Data varies by user role and organization
- **Filter responsiveness**: Data updates when relevant filters change
- **Realistic data**: Complex, multi-dimensional demo data
- **Performance optimization**: Loading states, error handling, caching

---

## 🎯 Best Practices

### **1. Data Structure Design**

```typescript
// ✅ Good: Rich, structured data
export interface ComponentData {
  id: string;
  value: number;
  metadata: {
    lastUpdated: string;
    source: string;
    confidence: number;
  };
  insights: string[];
}

// ❌ Avoid: Flat, unstructured data
export interface ComponentData {
  value1: number;
  value2: string;
  value3: boolean;
}
```

### **2. Filter Optimization**

```typescript
// ✅ Good: Only subscribe to relevant filters
const COMPONENT_API_CONFIG = {
  relevantFilters: ["dateRange", "services"], // Specific filters only
};

// ❌ Avoid: Subscribe to all filters
const COMPONENT_API_CONFIG = {
  relevantFilters: Object.keys(filters), // Causes unnecessary refetches
};
```

### **3. Demo Data Quality**

```typescript
// ✅ Good: Realistic, user-aware demo data
generateDemoData: (filters, user) => {
  const orgMultiplier = user.organization === "StartupCo" ? 0.3 : 1;
  const roleMultiplier = user.role === "admin" ? 1 : 0.8;

  return generateRealisticData(filters, orgMultiplier * roleMultiplier);
};

// ❌ Avoid: Static, unrealistic data
generateDemoData: () => {
  return { value: 12345 }; // Same for all users
};
```

### **4. Error Handling**

```typescript
// ✅ Good: Comprehensive error handling
try {
  const data = await fetchData();
  setData(data);
} catch (err) {
  setError(err instanceof Error ? err.message : "Unknown error");
  // Optionally: retry logic, fallback data, etc.
}

// ❌ Avoid: Silent failures
const data = await fetchData(); // No error handling
setData(data);
```

### **5. Performance Optimization**

```typescript
// ✅ Good: Optimized re-renders
useEffect(() => {
  // Only run when relevant filters change
  fetchData();
}, [filters.dateRange, filters.services]); // Specific dependencies

// ❌ Avoid: Unnecessary re-renders
useEffect(() => {
  fetchData();
}, [filters]); // Runs on any filter change
```

---

## 🚀 Future Enhancements

### **Real-Time Updates**

```typescript
// WebSocket integration for real-time data
useEffect(() => {
  const ws = new WebSocket("/api/component/stream");
  ws.onmessage = (event) => {
    const newData = JSON.parse(event.data);
    setData(newData);
  };
  return () => ws.close();
}, []);
```

### **Optimistic Updates**

```typescript
// Update UI immediately, sync with server
const updateData = async (newValue) => {
  // Optimistic update
  setData((prev) => ({ ...prev, value: newValue }));

  try {
    await fetch("/api/update", { body: JSON.stringify(newValue) });
  } catch (err) {
    // Revert on error
    setData(originalData);
  }
};
```

### **Advanced Caching**

```typescript
// Component-level caching with TTL
const useComponentData = (filters) => {
  return useSWR(
    [COMPONENT_API_CONFIG.endpoint, filters],
    () => fetchData(filters),
    { refreshInterval: COMPONENT_API_CONFIG.cacheDuration }
  );
};
```

---

## 📝 Summary

The **Component-Based API Architecture** provides:

✅ **Scalable** - No centralized bottleneck  
✅ **Maintainable** - Clear component boundaries  
✅ **Flexible** - Easy migration from demo to real APIs  
✅ **Developer-Friendly** - Self-documenting structure  
✅ **Performance-Optimized** - Smart filter subscriptions  
✅ **User-Aware** - Data varies by user context

This architecture enables rapid development with demo data while providing a clear path to real API integration, all while maintaining excellent performance and developer experience.
