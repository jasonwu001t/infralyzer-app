# Comprehensive Logging System

## Overview

This Next.js application now includes a comprehensive logging system that captures:

1. **User page access** - Who accessed which page and when
2. **API calls** - Which APIs are called with request/response details
3. **Timing information** - When pages/APIs are accessed and response times
4. **Error tracking** - Failed pages and API calls with error details
5. **User sessions** - Session tracking with unique identifiers

## Components

### 1. Server-side Logging

#### `lib/logger.ts`

Core logging utility with structured log formatting:

- Page access logging
- API call logging
- Error logging
- System logging

#### `middleware.ts`

Next.js middleware that automatically logs all page requests:

- Captures user info, timing, and response codes
- Adds tracking headers to responses

#### `lib/api-logger.ts`

Higher-order function for wrapping API routes:

- Automatic request/response logging
- Error handling and logging
- Performance tracking

### 2. Client-side Logging

#### `lib/client-logger.ts`

Browser-side logging for user interactions:

- Page view tracking with session IDs
- User action logging
- Client-side error capture

#### `components/logging-provider.tsx`

React context provider for automatic logging:

- Global error boundaries
- Session management
- Page view tracking

### 3. API Endpoints

#### `app/api/logs/route.ts`

Endpoint for receiving client-side logs and formatting them server-side

## Log Format

All logs follow this structured format:

```
[TIMESTAMP] LEVEL TYPE User:USER_ID Session:SESSION_ID METHOD PATH STATUS_CODE (DURATION_MS) from IP_ADDRESS Details: {...}
```

Example logs:

```
[2024-01-09T00:21:06.000Z] INFO  PAGE_ACCESS  User:user123 Session:abc12345 GET /dashboard 200 (120ms) from 192.168.1.100
[2024-01-09T00:21:08.000Z] INFO  API_CALL     User:user123 POST /api/aws-pricing 200 (45ms) from 192.168.1.100
[2024-01-09T00:21:10.000Z] ERROR ERROR        User:user123 GET /api/invalid 500 (2ms) from 192.168.1.100 ERROR: Route not found
```

## Features

### 1. User Identification

- Session ID (generated per browser session)
- User ID (from auth system - currently placeholder)
- IP address and User-Agent tracking

### 2. Performance Monitoring

- Request/response timing
- Page load duration
- API call duration

### 3. Error Tracking

- Server-side API errors
- Client-side JavaScript errors
- Unhandled promise rejections

### 4. Request Details

- HTTP methods and status codes
- Query parameters and headers
- Request/response payload info

## Usage

### Automatic Logging

The system automatically logs:

- All page visits (via middleware)
- All API calls (via withApiLogging wrapper)
- Client-side errors and page views

### Manual Logging

For custom events:

```typescript
import { logger } from "@/lib/logger";
import { clientLogger } from "@/lib/client-logger";

// Server-side
logger.logSystem("Custom event", { details: "something happened" });

// Client-side
clientLogger.logUserAction("button_click", { buttonId: "submit" });
```

### Adding Logging to New API Routes

```typescript
import { withApiLogging } from "@/lib/api-logger";

export const GET = withApiLogging(async (request: NextRequest) => {
  // Your API logic here
});
```

## Configuration

### Environment Variables

- `LOG_LEVEL` - Set logging level (info, warn, error)
- `LOG_TO_FILE` - Enable file logging (future enhancement)

### Customization

- Modify `lib/logger.ts` to change log format
- Update `middleware.ts` to exclude certain routes
- Extend `client-logger.ts` for additional client events

## Production Considerations

1. **Log Storage**: Currently logs to console - consider integrating with:

   - CloudWatch Logs
   - Datadog
   - Splunk
   - ELK Stack

2. **Performance**: Logging adds minimal overhead (~1-5ms per request)

3. **Privacy**: Ensure compliance with privacy policies regarding user tracking

4. **Log Rotation**: Implement log rotation for file-based logging

5. **Security**: Avoid logging sensitive data (passwords, tokens, PII)

## Sample Output

When you start the app and navigate pages, you'll see enhanced logs like:

```
[2024-01-09T00:21:06.000Z] INFO  SYSTEM       system User:anonymous session_start
[2024-01-09T00:21:06.000Z] INFO  PAGE_ACCESS  User:anonymous Session:abc12345 GET / 200 (150ms) from 192.168.1.100
[2024-01-09T00:21:08.000Z] INFO  PAGE_ACCESS  User:anonymous Session:abc12345 GET /dashboard 200 (120ms) from 192.168.1.100
[2024-01-09T00:21:10.000Z] INFO  API_CALL     User:anonymous Session:abc12345 GET /api/aws-pricing 200 (45ms) from 192.168.1.100
[2024-01-09T00:21:12.000Z] INFO  PAGE_ACCESS  User:anonymous Session:abc12345 GET /sql-lab 200 (200ms) from 192.168.1.100
```

This provides complete visibility into user behavior, system performance, and potential issues.
