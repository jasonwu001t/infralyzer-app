# SQL Lab Troubleshooting Guide

## 🚨 **Current Issue: "Failed to fetch" Error**

Based on your error screenshot, you're experiencing a **network connectivity issue** between the frontend (running on port 3001) and the backend API (expected on port 8000).

### ✅ **Quick Diagnosis Steps**

1. **Test Backend Connection**: Click the new **"Test API"** button in the SQL Lab header
2. **Check Browser Console**: Look for specific error details in Developer Tools
3. **Verify Backend Status**: Ensure your backend is running and accessible

---

## 🔧 **Enhanced Error Handling (Now Implemented)**

The SQL Lab now provides **detailed error guidance** for different scenarios:

### **Connection Errors** (Status 0 / Failed to fetch)

- **Cause**: Backend API not running or not accessible
- **User Guidance**:
  1. Check if backend API is running on http://localhost:8000
  2. Verify CORS settings on your backend
  3. Check network connection

### **SQL Query Errors** (Status 400)

- **Cause**: Invalid SQL syntax or query structure
- **User Guidance**:
  1. Check SQL syntax for errors
  2. Verify table and column names exist
  3. Ensure proper data types in WHERE clauses
  4. Check for missing quotes around string values

### **Query Processing Errors** (Status 422)

- **Cause**: Query syntax issues or incompatible operations
- **User Guidance**:
  1. Verify SQL query syntax
  2. Check if referenced tables and columns exist
  3. Ensure query is compatible with DuckDB engine
  4. Try a simpler query to test connectivity

### **Server Errors** (Status 500)

- **Cause**: Backend processing failures
- **User Guidance**:
  1. Check backend server logs for detailed errors
  2. Verify database connectivity on backend
  3. Ensure sufficient memory/resources
  4. Contact system administrator if issue persists

---

## 🛠️ **Common Solutions**

### **1. Backend Not Running**

```bash
# Start your backend API server
# Make sure it's accessible at http://localhost:8000
```

### **2. CORS Issues**

Your backend needs to allow requests from `http://localhost:3001` (frontend). Update your backend CORS configuration:

```python
# For Python/FastAPI backends
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **3. Port Conflicts**

- Frontend is running on port **3001** (changed from 3000)
- Backend should be on port **8000**
- Verify no other services are using these ports

### **4. Environment Configuration**

Check your `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_ENABLE_AI=true
NEXT_PUBLIC_DEBUG=true
```

---

## 🎯 **Step-by-Step Debugging**

### **Step 1: Verify Backend is Running**

1. Open terminal and check if something is running on port 8000:
   ```bash
   lsof -i :8000
   # or
   curl http://localhost:8000/health
   ```

### **Step 2: Test API Connection**

1. In SQL Lab, click the **"Test API"** button in the top-right
2. Check browser console for connection results:
   - ✅ `Backend connection successful` = Good!
   - ❌ `Cannot connect to backend` = Backend issue

### **Step 3: Check Network Tab**

1. Open Browser Developer Tools (F12)
2. Go to **Network** tab
3. Try executing a query
4. Look for failed requests to `localhost:8000`

### **Step 4: Verify Query Syntax**

Try a simple test query first:

```sql
SELECT 1 as test_column
```

If basic queries fail, it's definitely a connection issue, not a query issue.

---

## 🔍 **Error Message Reference**

The SQL Lab now shows **three-column error tables** with:

| Error Type        | Details                  | Troubleshooting Steps       |
| ----------------- | ------------------------ | --------------------------- |
| Connection Error  | Cannot reach backend     | Check if backend is running |
| Invalid SQL Query | Syntax error details     | Review SQL syntax           |
| Server Error      | Backend processing issue | Check backend logs          |

---

## 🚀 **Next Steps**

1. **Immediate**: Click "Test API" button to verify backend connectivity
2. **If Connection Fails**: Start/restart your backend API server
3. **If Connection Works**: Try simple queries before complex ones
4. **If Still Issues**: Check backend logs for specific error details

### **Quick Test Query**

Once connected, try this simple CUR query:

```sql
SELECT
    product_product_name,
    COUNT(*) as record_count
FROM CUR
LIMIT 10;
```

---

## 📞 **Getting Help**

If you continue having issues:

1. **Check Backend Logs**: Look for specific error messages
2. **Verify Backend Health**: Ensure `/health` endpoint responds
3. **Test with cURL**: Try direct API calls outside the frontend
4. **Browser Console**: Copy exact error messages for debugging

The enhanced error handling should now guide you through most common issues automatically!
