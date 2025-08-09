# API Configuration

Configure the Infralyzer application backend connection using environment variables.

## Quick Setup

Create `.env.local` in project root:

```bash
# Required - Backend URL
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000

# Optional - Features and Security
NEXT_PUBLIC_API_KEY=
NEXT_PUBLIC_ENABLE_AI=true
NEXT_PUBLIC_DEBUG=true
```

## Environment Variables

| Variable                   | Default                 | Description            |
| -------------------------- | ----------------------- | ---------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | `http://127.0.0.1:8000` | Backend API URL        |
| `NEXT_PUBLIC_API_KEY`      | _(empty)_               | Authentication key     |
| `NEXT_PUBLIC_ENABLE_AI`    | `true`                  | Enable AI features     |
| `NEXT_PUBLIC_ENABLE_MCP`   | `true`                  | Enable MCP integration |
| `NEXT_PUBLIC_DEBUG`        | `false`                 | Debug mode             |

### Advanced Settings

| Variable                      | Default     | Description          |
| ----------------------------- | ----------- | -------------------- |
| `NEXT_PUBLIC_API_TIMEOUT`     | `30000`     | Request timeout (ms) |
| `NEXT_PUBLIC_API_MAX_RETRIES` | `3`         | Max retry attempts   |
| `NEXT_PUBLIC_AWS_REGION`      | `us-east-1` | AWS region for AI    |

## Environment Examples

**Development:**

```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_DEBUG=true
```

**Production:**

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com
NEXT_PUBLIC_API_KEY=your-secure-key
NEXT_PUBLIC_DEBUG=false
```

## Backend URL Options

- `http://127.0.0.1:8000` - Local development (recommended)
- `http://localhost:8000` - Local development (alternative)
- `https://api.domain.com` - Production deployment

## Deployment

**Vercel:** Set variables in project settings → Environment Variables

**Docker:**

```dockerfile
ENV NEXT_PUBLIC_API_BASE_URL=https://api.domain.com
ENV NEXT_PUBLIC_API_KEY=production-key
```

## Troubleshooting

- **API failures:** Verify `NEXT_PUBLIC_API_BASE_URL`
- **Auth errors:** Check `NEXT_PUBLIC_API_KEY`
- **Missing features:** Enable via `NEXT_PUBLIC_ENABLE_*` flags
- **Validation:** Check browser console for config issues
