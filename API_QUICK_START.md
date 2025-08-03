# 🚀 Infralyzer API Quick Start Guide

## 📋 **TL;DR - What You Need to Build**

Your infralyzer frontend is **production-ready** but needs backend APIs to replace the current mock data. Here's what you need to implement:

---

## 🎯 **Priority 1: Core Infrastructure (Week 1)**

### Authentication System

```bash
POST /api/auth/login
GET /api/auth/me
POST /api/auth/logout
```

### User Management

```bash
GET /api/users/profile
PUT /api/users/profile
GET /api/users/preferences
```

---

## 🎯 **Priority 2: Dashboard APIs (Week 2)**

### Essential Dashboard Endpoints

```bash
GET /api/dashboard/kpis              # Main KPI cards
GET /api/dashboard/spend-summary     # Time-series chart data
GET /api/dashboard/service-costs     # Service breakdown table
GET /api/dashboard/account-costs     # Account breakdown table
GET /api/dashboard/anomalies         # Cost anomaly alerts
```

---

## 🎯 **Priority 3: Advanced Features (Week 3-4)**

### SQL Lab APIs

```bash
POST /api/sql-lab/execute           # Execute SQL queries
GET /api/sql-lab/templates          # Pre-built query templates
GET /api/sql-lab/queries            # User saved queries
POST /api/sql-lab/ai-generate       # AI query generation
```

### Cost Analytics

```bash
GET /api/cost-analytics/breakdown   # Advanced cost analysis
GET /api/cost-analytics/discounts   # RI/SP analysis
```

---

## 📊 **Data You Need to Process**

### 1. AWS Cost and Usage Report (CUR) Data

- **Billing data** with service, account, resource details
- **Time-series cost data** for trending and forecasting
- **Tagging information** for allocation and filtering

### 2. User Context Data

- **Role-based filtering** (admin/analyst/viewer)
- **Organization-specific data** isolation
- **User preferences** and saved queries

### 3. Real-time Pricing Data

- **AWS EC2 pricing** (already partially implemented)
- **Regional pricing variations**
- **Spot pricing** and savings opportunities

---

## 🔧 **Recommended Tech Stack**

### Option 1: Python FastAPI (Recommended)

```python
# Advantages:
✅ Integrates with existing de-polars engine
✅ Excellent performance for analytics
✅ Auto-generated API documentation
✅ Strong typing with Pydantic

# Quick Setup:
pip install fastapi uvicorn sqlalchemy psycopg2-binary redis
```

### Option 2: Node.js + TypeScript

```javascript
// Advantages:
✅ Same language as frontend
✅ Easy Next.js integration
✅ Vercel deployment compatibility

// Quick Setup:
npm install express prisma redis jsonwebtoken
```

---

## 💾 **Database Requirements**

### Data Storage Options

1. **PostgreSQL + TimescaleDB** (recommended for time-series data)
2. **ClickHouse** (columnar database for analytics)
3. **DuckDB** (continue with current de-polars integration)

### Key Tables Needed

```sql
-- Users and authentication
users, user_sessions, user_preferences

-- Cost data (main analytics tables)
cost_data, service_costs, account_costs

-- User-generated content
saved_queries, query_history, chat_conversations

-- System data
anomalies, optimization_recommendations
```

---

## 🔐 **Authentication Pattern**

### JWT Token System

```python
# Login flow:
1. POST /api/auth/login → JWT token
2. Include "Authorization: Bearer <token>" in all requests
3. Backend validates token + user permissions
4. Filter data based on user role/organization
```

### Role-Based Data Filtering

```python
# Data access control:
- Admin: Full organization data
- Analyst: Department/team filtered data
- Viewer: Read-only, limited scope data
```

---

## 📊 **Data Flow Pattern**

### Frontend → Backend Integration

```typescript
// Current frontend pattern:
const { data, isLoading, error } = useFilteredData(
  async (filters) => {
    // REPLACE THIS with real API call:
    const response = await fetch("/api/dashboard/kpis", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ filters, userId }),
    });
    return response.json();
  },
  ["dateRange", "services", "accounts"] // Filter dependencies
);
```

### Expected API Response Format

```typescript
// Standard API response:
{
  success: boolean
  data: T  // Your actual data
  meta?: {
    pagination?: { page, totalPages, totalCount }
    filters?: DashboardFilters
    executionTime?: number
  }
  error?: string
}
```

---

## ⚡ **Quick Implementation Tips**

### 1. Start with Mock APIs That Match Frontend

```python
# FastAPI example:
@app.get("/api/dashboard/kpis")
async def get_kpis(
    user: User = Depends(get_current_user),
    filters: DashboardFilters = Depends()
):
    # Start with mock data, gradually replace with real queries
    return {
        "success": True,
        "data": {
            "mtdSpend": {"value": 125043, "trend": "+2.5%"},
            "forecast": {"value": 245080, "trend": "+4.1%"},
            # ... more KPIs
        }
    }
```

### 2. Use Your Existing de-polars Engine

```python
# Leverage existing analytics engine:
from de_polars import FinOpsEngine

engine = FinOpsEngine(bucket_name="your-cur-bucket")

@app.get("/api/dashboard/service-costs")
async def get_service_costs(filters: DashboardFilters):
    # Use your existing analytics
    data = engine.get_service_costs(
        start_date=filters.dateRange.start,
        end_date=filters.dateRange.end,
        services=filters.services
    )
    return {"success": True, "data": data}
```

### 3. Implement Caching for Performance

```python
import redis
from functools import wraps

@cache_result(expire_seconds=300)  # 5-minute cache
async def get_dashboard_data(filters):
    # Expensive analytics query
    return expensive_calculation()
```

---

## 🚀 **4-Week Implementation Plan**

### Week 1: Foundation

- [ ] Set up FastAPI + PostgreSQL
- [ ] Implement JWT authentication
- [ ] Create user management endpoints
- [ ] Test with Postman/curl

### Week 2: Core Dashboard

- [ ] Implement 5 key dashboard endpoints
- [ ] Connect to your CUR data source
- [ ] Add role-based filtering
- [ ] Test with frontend integration

### Week 3: Advanced Features

- [ ] SQL Lab query execution
- [ ] AI query generation (optional)
- [ ] Cost analytics endpoints
- [ ] Optimization recommendations

### Week 4: Production Ready

- [ ] Add caching with Redis
- [ ] Implement rate limiting
- [ ] Add monitoring/logging
- [ ] Deploy and test at scale

---

## 🔍 **Testing Your APIs**

### Frontend Integration Test

```typescript
// Replace mock data generators with real API calls:
// File: app/(app)/components/kpi-card.tsx

const generateKpiData = async (
  filters: DashboardFilters,
  userId: string
): Promise<KpiData> => {
  // REPLACE THIS mock with real API:
  const response = await fetch("/api/dashboard/kpis", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filters, userId }),
  });

  if (!response.ok) throw new Error("Failed to fetch KPI data");
  const result = await response.json();
  return result.data;
};
```

### API Testing

```bash
# Test authentication:
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@techcorp.com", "password": "password"}'

# Test dashboard API:
curl -X GET http://localhost:8000/api/dashboard/kpis \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📚 **Files to Modify in Frontend**

Once your APIs are ready, update these files to use real data:

### Component Data Generators (Replace Mock Functions)

```bash
# Replace generateXxxData functions in:
app/(app)/components/kpi-card.tsx
app/(app)/components/spend-summary-chart.tsx
app/(app)/components/service-costs-table.tsx
app/(app)/components/account-costs-table.tsx
app/(app)/components/anomaly-feed.tsx
# ... and 20+ other components
```

### API Configuration

```typescript
// Update in: lib/config/api.ts (create this file)
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const API_ENDPOINTS = {
  AUTH: "/api/auth",
  DASHBOARD: "/api/dashboard",
  SQL_LAB: "/api/sql-lab",
  // ... etc
};
```

---

## 🎯 **Success Metrics**

After implementation, you should achieve:

- ✅ **< 200ms API response times** for dashboard data
- ✅ **Real-time cost data** updated every 4 hours
- ✅ **100+ concurrent users** supported
- ✅ **99.5% uptime** for critical APIs
- ✅ **Role-based security** working correctly

---

## 🆘 **Need Help?**

### Option 1: Use Existing de-polars Backend

Your infralyzer repository already has a Python backend in `../de-polars/`. Consider:

1. **Extending existing FastAPI** in `de-polars/de_polars/api/fastapi_app.py`
2. **Adding new endpoints** to `de-polars/de_polars/api/endpoints/`
3. **Leveraging existing analytics** in `de-polars/de_polars/analytics/`

### Option 2: Build New Dedicated API

Create a new backend specifically for the frontend:

1. **Separate concerns** - frontend API vs analytics engine
2. **Optimized for frontend needs** (caching, formatting, etc.)
3. **Independent deployment** and scaling

### Option 3: Hybrid Approach

1. **Use de-polars** for heavy analytics and data processing
2. **Build lightweight FastAPI** for frontend-specific endpoints
3. **Proxy calls** to de-polars for complex queries

---

## 🎉 **You're Ready to Build!**

Your frontend is **architecturally excellent** and ready for production APIs. The component-based design makes it easy to swap mock data for real APIs without major refactoring.

**Start with Week 1** and you'll have a working system integrated within a month! 🚀

---

**Need the full detailed guide?** → See `BACKEND_API_IMPLEMENTATION_GUIDE.md`
