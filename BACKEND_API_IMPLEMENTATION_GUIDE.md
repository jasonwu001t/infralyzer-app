# 🚀 Infralyzer Backend API Implementation Guide

## 📋 Overview

This guide provides comprehensive instructions for implementing the backend API endpoints required to power the Infralyzer cloud cost management application. The application currently uses mock data and needs a full backend implementation.

---

## 🏗️ Architecture Overview

### Current Frontend Stack

- **Next.js 15.2.4** with App Router
- **Component-based architecture** with API patterns
- **User authentication** with role-based access control
- **Smart filtering system** using React Context
- **TypeScript** with strict type safety

### Backend Requirements

- **RESTful API** endpoints for data operations
- **User authentication & authorization** system
- **AWS Cost and Usage Report (CUR)** data processing
- **Real-time pricing data** integration
- **Data caching** and performance optimization
- **Role-based data filtering** and access control

---

## 🔐 Authentication & User Management

### Required Endpoints

#### 1. Authentication

```typescript
// POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  expiresAt: string;
}

// POST /api/auth/logout
// GET /api/auth/me (validate token)
// POST /api/auth/refresh
```

#### 2. User Management

```typescript
// GET /api/users/profile
// PUT /api/users/profile
// GET /api/users/preferences
// PUT /api/users/preferences

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "analyst" | "viewer";
  organization: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: string;
  lastLoginAt: string;
}
```

---

## 📊 Dashboard API Endpoints

### Core Dashboard Data

#### 1. KPI Metrics

```typescript
// GET /api/dashboard/kpis
interface KpiRequest {
  userId: string;
  filters: DashboardFilters;
}

interface KpiResponse {
  mtdSpend: {
    value: number;
    trend: string;
    currency: string;
  };
  forecast: {
    value: number;
    trend: string;
    confidence: number;
  };
  savings: {
    value: number;
    opportunities: number;
  };
  budgetUtilization: {
    percentage: number;
    status: "on-track" | "warning" | "over-budget";
  };
}
```

#### 2. Spend Summary

```typescript
// GET /api/dashboard/spend-summary
interface SpendSummaryResponse {
  data: Array<{
    date: string;
    current: number;
    previous: number;
    forecast: number;
    budget?: number;
  }>;
  granularity: "daily" | "weekly" | "monthly";
  currency: string;
}
```

#### 3. Service Costs

```typescript
// GET /api/dashboard/service-costs
interface ServiceCostsResponse {
  services: Array<{
    serviceId: string;
    serviceName: string;
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
  }>;
  totalCost: number;
  pagination: {
    page: number;
    totalPages: number;
    totalCount: number;
  };
}
```

#### 4. Account Costs

```typescript
// GET /api/dashboard/account-costs
interface AccountCostsResponse {
  accounts: Array<{
    accountId: string;
    accountName: string;
    cost: number;
    trend: number[];
    region: string;
  }>;
}
```

#### 5. Cost Anomalies

```typescript
// GET /api/dashboard/anomalies
interface AnomalyResponse {
  anomalies: Array<{
    id: string;
    title: string;
    description: string;
    severity: "High" | "Medium" | "Low";
    date: string;
    service?: string;
    region?: string;
    impact: number;
    status: "new" | "investigating" | "resolved";
    recommendations?: string[];
  }>;
}
```

---

## 💰 Cost Analytics API Endpoints

#### 1. Advanced Cost Breakdown

```typescript
// GET /api/cost-analytics/breakdown
interface CostBreakdownRequest {
  startDate: string;
  endDate: string;
  granularity: "daily" | "weekly" | "monthly";
  groupBy: "service" | "account" | "region" | "tag";
  costTypes: ("list" | "billed" | "contracted" | "effective")[];
}

interface CostBreakdownResponse {
  breakdown: Array<{
    dimension: string;
    costs: {
      list: number;
      billed: number;
      contracted: number;
      effective: number;
    };
    rates: {
      discount: number;
      commitment: number;
    };
    trend: number[];
  }>;
}
```

#### 2. Cost by Purchase Option

```typescript
// GET /api/cost-analytics/purchase-options
interface PurchaseOptionResponse {
  data: Array<{
    type: "On-Demand" | "Reserved" | "Spot" | "Savings Plan";
    cost: number;
    percentage: number;
    savings: number;
  }>;
}
```

#### 3. Discount Analysis

```typescript
// GET /api/cost-analytics/discounts
interface DiscountAnalysisResponse {
  riCoverage: {
    percentage: number;
    utilization: number;
    expiringSoon: number;
  };
  savingsPlans: {
    coverage: number;
    utilization: number;
    commitment: number;
  };
  spotUsage: {
    percentage: number;
    savings: number;
    interruptions: number;
  };
}
```

---

## 🔍 SQL Lab API Endpoints

#### 1. Query Execution

```typescript
// POST /api/sql-lab/execute
interface QueryExecuteRequest {
  userId: string;
  query: string;
  parameters?: Record<string, any>;
}

interface QueryExecuteResponse {
  success: boolean;
  queryId: string;
  results?: {
    headers: string[];
    rows: (string | number | null)[][];
    rowCount: number;
    executionTime: number;
  };
  error?: string;
}
```

#### 2. Query Management

```typescript
// GET /api/sql-lab/queries
// POST /api/sql-lab/queries (save query)
// PUT /api/sql-lab/queries/:id
// DELETE /api/sql-lab/queries/:id

interface SavedQuery {
  id: string;
  userId: string;
  name: string;
  description?: string;
  query: string;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  lastExecuted?: string;
  executionCount: number;
}
```

#### 3. Query Templates

```typescript
// GET /api/sql-lab/templates
interface QueryTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  query: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
}
```

#### 4. AI Query Generation

```typescript
// POST /api/sql-lab/ai-generate
interface AIGenerateRequest {
  prompt: string;
  context: "cost-analysis" | "optimization" | "governance";
  schema?: string[];
}

interface AIGenerateResponse {
  query: string;
  explanation: string;
  confidence: number;
}
```

---

## 🚀 Optimization API Endpoints

#### 1. Optimization Recommendations

```typescript
// GET /api/optimization/recommendations
interface OptimizationResponse {
  recommendations: Array<{
    id: string;
    category: "rightsizing" | "unused-resources" | "commitments" | "storage";
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    potential: {
      monthlySavings: number;
      annualSavings: number;
      effort: "low" | "medium" | "high";
    };
    resources: Array<{
      id: string;
      type: string;
      currentCost: number;
      recommendedAction: string;
    }>;
    implementation: {
      steps: string[];
      estimatedTime: string;
      risks: string[];
    };
  }>;
}
```

#### 2. Cost Optimization Potential

```typescript
// GET /api/optimization/potential
interface OptimizationPotentialResponse {
  categories: Array<{
    category: string;
    potential: number;
    opportunities: number;
    priority: "High" | "Medium" | "Low";
    services: string[];
  }>;
  totalPotential: number;
}
```

---

## 💳 AWS Pricing API Endpoints

#### 1. Instance Pricing (Already Implemented)

```typescript
// GET /api/aws-pricing
// POST /api/aws-pricing
interface PricingResponse {
  success: boolean;
  data: Array<{
    instance_type: string;
    metadata: {
      vcpu: string;
      memory: string;
      storage: string;
      network_performance: string;
    };
    pricing: {
      ondemand: PriceInfo;
      spot: PriceInfo;
      reserved_1yr: PriceInfo;
      savings_plan: PriceInfo;
    };
  }>;
  region: string;
  operating_system: string;
}
```

#### 2. Regional Pricing Comparison

```typescript
// GET /api/aws-pricing/regions
interface RegionalPricingResponse {
  regions: Array<{
    region: string;
    name: string;
    prices: {
      [instanceType: string]: {
        ondemand: number;
        spot: number;
      };
    };
  }>;
}
```

---

## 🏢 Multi-Cloud & Capacity API Endpoints

#### 1. Capacity Management

```typescript
// GET /api/capacity/overview
interface CapacityOverviewResponse {
  compute: {
    utilization: number;
    efficiency: number;
    recommendations: string[];
  };
  storage: {
    growth: number[];
    efficiency: number;
    optimization: string[];
  };
  network: {
    transfer: number;
    hotspots: Array<{
      source: string;
      destination: string;
      cost: number;
    }>;
  };
}
```

#### 2. Resource Allocation

```typescript
// GET /api/allocation/summary
interface AllocationResponse {
  allocations: Array<{
    dimension: string;
    allocated: number;
    unallocated: number;
    rules: string[];
  }>;
}
```

---

## 🤖 AI Insights API Endpoints

#### 1. AI-Generated Insights

```typescript
// GET /api/ai-insights/insights
interface AIInsightsResponse {
  insights: Array<{
    id: string;
    type: "cost-spike" | "optimization" | "trend" | "anomaly";
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
    confidence: number;
    data: any;
    recommendations: string[];
    createdAt: string;
  }>;
}
```

#### 2. Chat Interface

```typescript
// POST /api/ai-insights/chat
interface ChatRequest {
  userId: string;
  message: string;
  conversationId?: string;
  context?: any;
}

interface ChatResponse {
  response: string;
  insights?: string[];
  recommendations?: string[];
  conversationId: string;
}
```

---

## 🔧 Implementation Stack Recommendations

### Backend Framework Options

#### Option 1: FastAPI (Python) - Recommended

```python
# Pros:
# - Excellent performance and type safety
# - Great integration with existing de-polars engine
# - Built-in OpenAPI documentation
# - Easy deployment and scaling

# Structure:
app/
├── api/
│   ├── auth/
│   ├── dashboard/
│   ├── cost_analytics/
│   ├── sql_lab/
│   └── optimization/
├── models/
├── services/
├── utils/
└── main.py
```

#### Option 2: Node.js + Express/Fastify

```javascript
// Pros:
// - Same language as frontend
// - Easy deployment with Vercel
// - Good TypeScript support

// Structure:
src/
├── routes/
├── models/
├── middleware/
├── services/
└── app.js
```

### Database Options

#### Option 1: PostgreSQL + TimescaleDB

```sql
-- Optimized for time-series cost data
-- Excellent performance for analytics
-- Strong consistency and ACID compliance
```

#### Option 2: ClickHouse

```sql
-- Columnar database optimized for analytics
-- Excellent compression and query performance
-- Great for large-scale cost data
```

#### Option 3: DuckDB (Current)

```sql
-- Already integrated with de-polars
-- Excellent for analytics workloads
-- Easy deployment and maintenance
```

---

## 📦 Data Processing Pipeline

### AWS Cost Data Integration

#### 1. CUR Data Processing

```python
# Example Python implementation
import pandas as pd
from de_polars import FinOpsEngine

class CURProcessor:
    def __init__(self, bucket_name: str):
        self.engine = FinOpsEngine(bucket_name)

    def process_cur_data(self, start_date: str, end_date: str) -> pd.DataFrame:
        """Process CUR data for the specified date range"""
        return self.engine.query_cost_data(start_date, end_date)

    def get_service_costs(self, filters: dict) -> list:
        """Get service costs with applied filters"""
        # Implementation here
        pass
```

#### 2. Real-time Data Updates

```python
# Schedule regular data updates
from celery import Celery

app = Celery('infralyzer')

@app.task
def update_cost_data():
    """Scheduled task to update cost data"""
    processor = CURProcessor()
    processor.update_latest_data()

@app.task
def detect_anomalies():
    """Detect cost anomalies using ML models"""
    # Implementation here
    pass
```

---

## 🚀 Implementation Steps

### Phase 1: Core Infrastructure (Week 1-2)

1. **Set up backend framework** (FastAPI recommended)
2. **Implement authentication system** with JWT tokens
3. **Set up database** (PostgreSQL + TimescaleDB)
4. **Create user management endpoints**
5. **Implement basic CRUD operations**

### Phase 2: Dashboard APIs (Week 3-4)

1. **Implement KPI endpoints** (`/api/dashboard/kpis`)
2. **Create spend summary API** (`/api/dashboard/spend-summary`)
3. **Build service costs endpoint** (`/api/dashboard/service-costs`)
4. **Add account costs API** (`/api/dashboard/account-costs`)
5. **Implement anomaly detection** (`/api/dashboard/anomalies`)

### Phase 3: Advanced Features (Week 5-6)

1. **SQL Lab APIs** (`/api/sql-lab/*`)
2. **Cost analytics endpoints** (`/api/cost-analytics/*`)
3. **Optimization APIs** (`/api/optimization/*`)
4. **AI insights implementation** (`/api/ai-insights/*`)

### Phase 4: Performance & Production (Week 7-8)

1. **Implement caching** (Redis recommended)
2. **Add rate limiting** and security measures
3. **Set up monitoring** and logging
4. **Deploy and test** in production environment

---

## 🔒 Security Considerations

### Authentication & Authorization

```python
# JWT token implementation
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def get_current_user(token: str = Depends(security)) -> User:
    """Validate JWT token and return user"""
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return get_user_by_id(user_id)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### Role-Based Access Control

```python
def require_role(required_role: UserRole):
    """Decorator to require specific user role"""
    def decorator(func):
        async def wrapper(*args, current_user: User = Depends(get_current_user), **kwargs):
            if not has_permission(current_user.role, required_role):
                raise HTTPException(status_code=403, detail="Insufficient permissions")
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator
```

### Data Filtering by Organization

```python
async def filter_data_by_user(query: str, user: User) -> str:
    """Filter data based on user's organization and role"""
    if user.role == 'admin':
        return query  # Admin sees all org data
    elif user.role == 'analyst':
        return f"{query} WHERE organization_id = '{user.organization}'"
    else:  # viewer
        return f"{query} WHERE organization_id = '{user.organization}' AND department = '{user.department}'"
```

---

## 📊 Performance Optimization

### Caching Strategy

```python
import redis
from functools import wraps

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def cache_result(expire_seconds: int = 300):
    """Cache function results with expiration"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            cache_key = f"{func.__name__}:{hash(str(args) + str(kwargs))}"
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)

            result = await func(*args, **kwargs)
            redis_client.setex(cache_key, expire_seconds, json.dumps(result))
            return result
        return wrapper
    return decorator
```

### Database Optimization

```sql
-- Recommended indexes for cost data
CREATE INDEX idx_cost_data_date ON cost_data(line_item_usage_start_date);
CREATE INDEX idx_cost_data_service ON cost_data(product_product_name);
CREATE INDEX idx_cost_data_account ON cost_data(line_item_usage_account_id);
CREATE INDEX idx_cost_data_org ON cost_data(organization_id);

-- Partitioning for large datasets
CREATE TABLE cost_data_monthly PARTITION OF cost_data
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

---

## 📈 Monitoring & Observability

### API Monitoring

```python
from prometheus_client import Counter, Histogram, generate_latest

REQUEST_COUNT = Counter('api_requests_total', 'Total API requests', ['method', 'endpoint'])
REQUEST_LATENCY = Histogram('api_request_duration_seconds', 'API request latency')

@app.middleware("http")
async def monitor_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)

    REQUEST_COUNT.labels(method=request.method, endpoint=request.url.path).inc()
    REQUEST_LATENCY.observe(time.time() - start_time)

    return response
```

### Health Checks

```python
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "database": await check_database_health(),
        "cache": await check_redis_health()
    }
```

---

## 🚀 Deployment Guide

### Docker Configuration

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Configuration

```env
# .env
DATABASE_URL=postgresql://user:pass@localhost:5432/infralyzer
REDIS_URL=redis://localhost:6379
JWT_SECRET_KEY=your-secret-key
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
CORS_ORIGINS=http://localhost:3000,https://your-domain.com
```

### Production Deployment

```yaml
# docker-compose.yml
version: "3.8"
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/infralyzer
    depends_on:
      - db
      - redis

  db:
    image: postgres:14
    environment:
      POSTGRES_DB: infralyzer
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

volumes:
  postgres_data:
```

---

## 🧪 Testing Strategy

### API Testing

```python
import pytest
from fastapi.testclient import TestClient

@pytest.fixture
def client():
    return TestClient(app)

def test_get_kpis(client, auth_headers):
    response = client.get("/api/dashboard/kpis", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "mtdSpend" in data
    assert "forecast" in data
```

### Load Testing

```python
from locust import HttpUser, task, between

class InfralyzerUser(HttpUser):
    wait_time = between(1, 3)

    def on_start(self):
        # Login and get token
        response = self.client.post("/api/auth/login", json={
            "email": "test@example.com",
            "password": "password"
        })
        self.token = response.json()["token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}

    @task(3)
    def get_dashboard_data(self):
        self.client.get("/api/dashboard/kpis", headers=self.headers)

    @task(1)
    def execute_query(self):
        self.client.post("/api/sql-lab/execute",
                        json={"query": "SELECT * FROM cost_data LIMIT 10"},
                        headers=self.headers)
```

---

## 📚 Additional Resources

### Documentation Links

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [AWS Cost and Usage Report User Guide](https://docs.aws.amazon.com/cur/latest/userguide/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [PostgreSQL Performance Tuning](https://www.postgresql.org/docs/current/performance-tips.html)

### Sample Data

```sql
-- Sample CUR data structure
CREATE TABLE cost_data (
    line_item_usage_start_date DATE,
    line_item_usage_account_id VARCHAR(50),
    product_product_name VARCHAR(100),
    line_item_resource_id VARCHAR(200),
    line_item_unblended_cost DECIMAL(10,2),
    line_item_usage_amount DECIMAL(15,2),
    organization_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎯 Success Metrics

After implementation, track these metrics:

### Performance Metrics

- **API Response Time**: < 200ms for dashboard APIs
- **Database Query Time**: < 100ms for complex queries
- **Cache Hit Rate**: > 80% for frequently accessed data
- **Concurrent Users**: Support 100+ simultaneous users

### Business Metrics

- **Data Freshness**: Cost data updated within 4 hours
- **Query Success Rate**: > 99.5% for SQL Lab
- **User Adoption**: Track API endpoint usage
- **Cost Optimization**: Measure actual savings identified

---

## 📞 Support & Next Steps

1. **Start with Phase 1** (Core Infrastructure)
2. **Set up development environment** with Docker
3. **Implement authentication** and user management
4. **Build dashboard APIs** incrementally
5. **Test thoroughly** with realistic data volumes
6. **Deploy to staging** environment
7. **Migrate frontend** from mock data to real APIs
8. **Deploy to production** with monitoring

**Need help?** Refer to the existing `de-polars` backend integration or create an implementation plan based on your specific infrastructure requirements.

---

**🚀 Ready to build a world-class FinOps platform!**
