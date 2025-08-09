# AI Assistant Setup Guide for SQL Lab

## ✅ Configuration Complete

The AI Assistant in your SQL Lab is now properly configured to work with your backend API at `http://localhost:8000`. Here's what has been set up:

### 🔧 Environment Configuration

The `.env.local` file has been created with the following settings:

```env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_TIMEOUT=30000

# AI Features
NEXT_PUBLIC_ENABLE_AI=true
NEXT_PUBLIC_BEDROCK_MODEL_ID=anthropic.claude-3-7-sonnet-20250109-v1:0

# AWS Configuration
NEXT_PUBLIC_AWS_REGION=us-east-1

# Debug (set to true for development)
NEXT_PUBLIC_DEBUG=true
```

### 🚀 Testing the AI Assistant

1. **Start your backend API server** (if not already running):

   ```bash
   # Make sure your backend is running on http://localhost:8000
   ```

2. **Start the frontend development server**:

   ```bash
   npm run dev
   ```

3. **Navigate to SQL Lab**: Open http://localhost:3000/sql-lab

4. **Test AI Query Generation**:
   - Open the "AI Assistant" section in the left sidebar
   - Enter a natural language query like:
     - "Show me the top 10 most expensive AWS services last month"
     - "Find EC2 instances with high costs in us-east-1"
     - "List all S3 storage costs grouped by bucket"
   - Click "Generate Query"
   - The AI should generate a proper CUR 2.0 SQL query

### 🎯 Expected Behavior

When the AI Assistant works correctly, you should see:

1. **Loading State**: "Generating..." with a spinner
2. **Generated Query**: A formatted SQL query appears in a code block
3. **Use Query Button**: Allows you to copy the query to the main editor
4. **Proper Error Handling**: If the backend is unavailable, you'll get helpful error messages

### 🛠️ API Endpoints Used

The AI Assistant calls this endpoint on your backend:

```
POST http://localhost:8000/api/v1/finops/bedrock/generate-query
```

With payload:

```json
{
  "user_query": "Your natural language request",
  "model_config": {
    "model_id": "anthropic.claude-3-7-sonnet-20250109-v1:0",
    "max_tokens": 4096,
    "temperature": 0.1,
    "top_p": 0.9,
    "top_k": 250
  },
  "include_examples": true,
  "target_table": "CUR"
}
```

### 🔍 Troubleshooting

**If AI Assistant shows "AI features are disabled":**

- Check that `NEXT_PUBLIC_ENABLE_AI=true` in `.env.local`
- Restart the development server after changing environment variables

**If you get connection errors:**

- Verify your backend API is running on `http://localhost:8000`
- Check the browser's Network tab for failed requests
- Ensure your backend has the `/api/v1/finops/bedrock/generate-query` endpoint

**If queries aren't generated properly:**

- Check your backend logs for errors
- Verify AWS Bedrock is properly configured on your backend
- Ensure the model ID `anthropic.claude-3-7-sonnet-20250109-v1:0` is available

### ✨ Features Available

1. **Natural Language Processing**: Convert business questions to SQL
2. **CUR 2.0 Schema Awareness**: Understands AWS Cost and Usage Report structure
3. **Error Handling**: Graceful fallbacks with helpful error messages
4. **Query Formatting**: Auto-formats generated SQL for readability
5. **Integration**: Seamlessly works with the query editor and execution engine

## 🎊 Success!

Your AI Assistant is now ready to help generate CUR 2.0 queries from natural language descriptions. The system is designed to work seamlessly with your existing backend API infrastructure.
