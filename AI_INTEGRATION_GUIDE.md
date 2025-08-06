# SQL Lab AI Integration Guide

## Overview

The SQL Lab now integrates with AWS Bedrock AI through the main.py API server to provide intelligent SQL query generation from natural language prompts.

## API Integration

### Endpoint

```
POST http://localhost:8000/api/v1/finops/bedrock/generate-query
```

### Request Format

```json
{
  "user_query": "Show me the top 10 most expensive services last month",
  "model_config": {
    "model_id": "anthropic.claude-3-5-sonnet-20241022-v2:0",
    "max_tokens": 4096,
    "temperature": 0.1,
    "top_p": 0.9,
    "top_k": 250
  },
  "include_examples": true,
  "target_table": "CUR"
}
```

### Response Format

```json
{
  "structured_query": {
    "sql_query": "SELECT product_servicecode, SUM(line_item_unblended_cost) as total_cost FROM CUR WHERE line_item_usage_start_date >= CURRENT_DATE - INTERVAL '1 month' GROUP BY product_servicecode ORDER BY total_cost DESC LIMIT 10;"
  },
  "original_query": "Show me the top 10 most expensive services last month",
  "model_used": "anthropic.claude-3-5-sonnet-20241022-v2:0",
  "confidence": 0.95,
  "generated_at": "2025-01-15T10:30:00Z"
}
```

## Frontend Features

### User Experience

1. **Enter Natural Language Query**: Describe what you want to analyze in plain English
2. **Generate Query**: Click "Generate Query" to call Bedrock API
3. **Review Generated SQL**: Preview the AI-generated SQL query with metadata
4. **Use Query**: Click "Use Query" to load formatted SQL into the editor
5. **Execute**: Run the query and view results in a structured dataframe table

### Example Prompts

- "Show me the top 10 most expensive services last month"
- "Find EC2 instances with high costs but low utilization"
- "Which accounts have the highest S3 storage costs?"
- "Compare this month's costs to last month by service"
- "Find untagged resources that cost more than $100"

### Key Features

- **SQL Formatting**: Generated queries are automatically formatted with proper indentation and line breaks
- **Comment Headers**: AI queries include metadata (prompt, confidence, model used)
- **Dataframe Display**: Results are shown in a sortable, filterable table with proper formatting
- **Fallback Support**: Template-based queries when API is unavailable

### Error Handling

- **API Errors**: Graceful fallback to template-based queries
- **Network Issues**: Clear error messages with retry suggestions
- **Invalid Responses**: Robust parsing with fallback options

## Technical Implementation

### AI Query Generation Flow

```typescript
const generateAIQuery = async () => {
  try {
    // Call Bedrock API with user query
    const response = await fetch("/api/v1/finops/bedrock/generate-query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_query: aiPrompt,
        model_config: {
          model_id: "anthropic.claude-3-5-sonnet-20241022-v2:0",
          max_tokens: 4096,
          temperature: 0.1,
          top_p: 0.9,
          top_k: 250,
        },
        include_examples: true,
        target_table: "CUR",
      }),
    });

    // Parse and extract SQL from structured response
    const data = await response.json();
    const sql =
      data.structured_query?.sql_query ||
      data.structured_query?.sql ||
      data.structured_query;

    setAiGeneratedQuery(sql);
  } catch (error) {
    // Fallback to simple template
    setAiGeneratedQuery(fallbackTemplate);
  }
};
```

### Fallback Templates

When the API is unavailable, the system falls back to a simple cost analysis template that shows top services by cost for the last month.

## Setup Requirements

### Backend (main.py)

1. **AWS Credentials**: Configure AWS access for Bedrock
2. **Bedrock Access**: Enable Claude 3.5 Sonnet model access
3. **Dependencies**: Install required Python packages
4. **Server Running**: `python main.py` on port 8000

### Frontend (SQL Lab)

1. **API Connectivity**: Ensure frontend can reach localhost:8000
2. **CORS Configuration**: API server has CORS enabled for frontend
3. **Error Handling**: Fallback templates work without API

## Testing

Run the integration test:

```bash
cd infralyzer
python test_bedrock_api.py
```

This will:

- Check server health
- Test Bedrock API endpoint
- Validate response format
- Display generated SQL

## AWS Bedrock Models Supported

- **Claude 3.5 Sonnet** (Default): Best balance of performance and capability
- **Claude 3 Sonnet**: Good for most SQL generation tasks
- **Claude 3 Haiku**: Fast queries for simple analysis
- **Claude 3 Opus**: Most capable for complex analysis

## Future Enhancements

- **Model Selection**: UI to choose different Bedrock models
- **Query History**: Save and recall AI-generated queries
- **Query Refinement**: Iterative improvement of generated SQL
- **Knowledge Base**: Integration with CUR-specific knowledge base
- **Batch Generation**: Generate multiple related queries
- **Visualization Hints**: AI-suggested chart types for results

## Troubleshooting

### Common Issues

1. **API Not Available**

   - Check if main.py server is running
   - Verify port 8000 is accessible
   - Check network connectivity

2. **AWS Bedrock Errors**

   - Verify AWS credentials are configured
   - Check Bedrock model access permissions
   - Ensure region supports selected model

3. **Invalid SQL Generated**

   - AI falls back to templates automatically
   - Review prompt clarity and context
   - Try different analysis types

4. **Slow Response Times**
   - Bedrock API can take 5-10 seconds
   - Loading indicator shows during generation
   - Consider using Haiku model for faster responses

### Debug Mode

Enable debug logging in browser console to see:

- API request/response details
- Error messages and stack traces
- Fallback template selection
- Response parsing logic
