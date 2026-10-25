# Environment Variables

Complete reference for all environment variables in MiniJob Admin Dashboard.

## Overview

MiniJob Admin Dashboard uses environment variables prefixed with `VITE_` for configuration. These are processed at build time by Vite.

::: warning Important
Changes to environment variables require rebuilding the application:

```bash
npm run build
```

For development:

```bash
npm run dev
```

:::

---

## Core Variables

### `VITE_API_BASE_URL`

**Type:** `string`  
**Default:** `http://localhost:8080`  
**Required:** Yes (for production)

Base URL for the MiniJob backend API.

**Examples:**

```bash
# Local development
VITE_API_BASE_URL=http://localhost:8080

# Production
VITE_API_BASE_URL=https://api.example.com

# Different port
VITE_API_BASE_URL=http://localhost:9000

# With path
VITE_API_BASE_URL=https://example.com/minijob-api
```

**Notes:**

- Must include protocol (`http://` or `https://`)
- No trailing slash
- Backend must allow CORS from frontend domain

---

### `VITE_PROMETHEUS_URL`

**Type:** `string`  
**Default:** `http://localhost:9090`  
**Required:** No

URL for Prometheus metrics endpoint.

**Examples:**

```bash
# Local Prometheus
VITE_PROMETHEUS_URL=http://localhost:9090

# Remote Prometheus
VITE_PROMETHEUS_URL=https://prometheus.example.com

# Prometheus with auth
VITE_PROMETHEUS_URL=https://user:pass@prometheus.example.com
```

**Usage:**

- System monitoring integration
- Performance metrics
- Health checks

---

### `VITE_APP_TITLE`

**Type:** `string`  
**Default:** `MiniJob Admin Dashboard`  
**Required:** No

Application title displayed in:

- Browser tab
- Page header
- Meta tags

**Examples:**

```bash
# Default
VITE_APP_TITLE=MiniJob Admin Dashboard

# Custom branding
VITE_APP_TITLE=Acme Job Manager

# Environment-specific
VITE_APP_TITLE=MiniJob Admin (Staging)
VITE_APP_TITLE=MiniJob Admin (Development)
```

---

### `VITE_APP_VERSION`

**Type:** `string`  
**Default:** `1.0.1`  
**Required:** No

Application version number displayed in:

- UI footer
- About page
- Meta tags

**Format:** Semantic versioning (`major.minor.patch`)

**Examples:**

```bash
VITE_APP_VERSION=1.0.0
VITE_APP_VERSION=1.2.3
VITE_APP_VERSION=2.0.0-beta.1
```

**Docker Build:**

```bash
# Override during Docker build
docker build --build-arg VITE_APP_VERSION=1.2.3 -t minijob-admin .
```

---

### `VITE_USE_MOCK_API`

**Type:** `boolean`  
**Default:** `false`  
**Required:** No

Enable mock API for development without backend.

**Values:**

- `true` - Use mock data
- `false` - Use real backend

**Examples:**

```bash
# Use mock API
VITE_USE_MOCK_API=true

# Use real backend
VITE_USE_MOCK_API=false
```

**When to use:**

- Frontend development without backend
- Testing UI changes
- Demo/presentation mode
- Offline development

**Mock Data Location:**

- `src/mocks/data/mock_*.js`

---

## Environment Files

### `.env.development`

Used when running `npm run dev`

```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_PROMETHEUS_URL=http://localhost:9090
VITE_APP_TITLE=MiniJob Admin Dashboard
VITE_APP_VERSION=1.0.0
VITE_USE_MOCK_API=false
```

### `.env.simul`

Used when running `npm run dev -- --mode simul`

```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_PROMETHEUS_URL=http://localhost:9090
VITE_APP_TITLE=MiniJob Admin Dashboard (Simulation)
VITE_APP_VERSION=1.0.0
VITE_USE_MOCK_API=true
```

### `.env.production`

Used when running `npm run build`

```bash
VITE_API_BASE_URL=https://api.example.com
VITE_PROMETHEUS_URL=https://prometheus.example.com
VITE_APP_TITLE=MiniJob Admin Dashboard
VITE_APP_VERSION=1.0.0
VITE_USE_MOCK_API=false
```

### `.env.staging`

Custom environment for staging

```bash
VITE_API_BASE_URL=https://staging-api.example.com
VITE_PROMETHEUS_URL=https://staging-prometheus.example.com
VITE_APP_TITLE=MiniJob Admin Dashboard (Staging)
VITE_APP_VERSION=1.0.0-staging
VITE_USE_MOCK_API=false
```

Build for staging:

```bash
npm run build -- --mode staging
```

---

## Docker Environment Variables

### Runtime Configuration

Docker containers use different variable names for runtime configuration:

#### `BACKEND_URL`

Maps to nginx backend proxy configuration.

```bash
docker run \
  -e BACKEND_URL="http://backend:8080" \
  -p 8081:80 \
  ghcr.io/nbigot/minijob-admin
```

**Not the same as `VITE_API_BASE_URL`:**

- `VITE_API_BASE_URL` - Build-time, baked into JS bundles
- `BACKEND_URL` - Runtime, nginx proxy configuration

#### `PROMETHEUS_URL`

Maps to nginx Prometheus proxy configuration.

```bash
docker run \
  -e PROMETHEUS_URL="http://prometheus:9090" \
  -p 8081:80 \
  ghcr.io/nbigot/minijob-admin
```

### Build Arguments

Override build-time variables:

```bash
docker build \
  --build-arg VITE_APP_VERSION=1.2.3 \
  --build-arg VITE_API_BASE_URL=https://api.example.com \
  -t minijob-admin .
```

---

## Accessing Variables in Code

### JavaScript/Vue

```javascript
// Access environment variables
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const appVersion = import.meta.env.VITE_APP_VERSION;
const useMockAPI = import.meta.env.VITE_USE_MOCK_API === "true";

// Check environment mode
if (import.meta.env.DEV) {
  console.log("Development mode");
}

if (import.meta.env.PROD) {
  console.log("Production mode");
}

// Get mode name
const mode = import.meta.env.MODE; // 'development', 'production', 'simul', etc.
```

### TypeScript

Define types for IntelliSense:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_PROMETHEUS_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_USE_MOCK_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## Validation

### Required Variables

Check for required variables:

```javascript
// src/config/validation.js
const requiredVars = ["VITE_API_BASE_URL", "VITE_APP_TITLE", "VITE_APP_VERSION"];

requiredVars.forEach((varName) => {
  if (!import.meta.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});
```

### URL Validation

```javascript
function validateURL(url, varName) {
  try {
    new URL(url);
  } catch (error) {
    throw new Error(`Invalid URL in ${varName}: ${url}`);
  }
}

validateURL(import.meta.env.VITE_API_BASE_URL, "VITE_API_BASE_URL");
```

---

## Security Considerations

### Never Commit Secrets

```bash
# .gitignore
.env
.env.local
.env.*.local
.env.production
```

Keep in version control:

```bash
.env.example          # Template
.env.development      # Safe defaults
.env.simul           # Mock mode
```

### Sensitive Data

::: danger
Do NOT put secrets in `VITE_*` variables:

- API keys
- Passwords
- Private tokens
- Database credentials

These are exposed in client-side JavaScript!
:::

**For secrets:**

- Use backend API authentication
- Implement proper authorization
- Use secure cookies
- Use server-side session management

### Production Security

```bash
# ❌ BAD - Exposes secret
VITE_API_KEY=secret-key-12345

# ✅ GOOD - Public identifier only
VITE_API_BASE_URL=https://api.example.com
# Authentication handled server-side
```

---

## Troubleshooting

### Variables Not Working

**Problem:** Changes don't take effect

**Solution:**

```bash
# Restart dev server
# Stop with Ctrl+C, then:
npm run dev

# Or rebuild
npm run build
```

### Undefined Variables

**Problem:** `import.meta.env.VITE_API_BASE_URL` is undefined

**Check:**

1. Variable name has `VITE_` prefix
2. File is `.env` or `.env.[mode]`
3. Dev server was restarted
4. No typos in variable name

### Wrong Environment

**Problem:** Using development variables in production

**Check:**

```bash
# Verify mode
echo $NODE_ENV

# Build with correct mode
npm run build -- --mode production
```

### Docker Variables Not Applied

**Problem:** Docker container ignores environment variables

**Check:**

```bash
# Environment variables passed?
docker inspect <container> | grep -A 10 Env

# Try explicitly
docker run \
  -e BACKEND_URL="http://localhost:8080" \
  -e PROMETHEUS_URL="http://localhost:9090" \
  -p 8081:80 \
  ghcr.io/nbigot/minijob-admin

# Check nginx config in container
docker exec <container> cat /etc/nginx/conf.d/default.conf
```

---

## Best Practices

1. **Use `.env.example`** as template
2. **Document all variables**
3. **Validate at startup**
4. **Never commit secrets**
5. **Use mode-specific files**
6. **Test with different configs**
7. **Log configuration** in development
8. **Fail fast** on missing required vars

---

## Examples

### Complete Development Setup

`.env.development`

```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_PROMETHEUS_URL=http://localhost:9090
VITE_APP_TITLE=MiniJob Admin Dashboard (Dev)
VITE_APP_VERSION=1.0.0-dev
VITE_USE_MOCK_API=false
```

### Complete Production Setup

`.env.production`

```bash
VITE_API_BASE_URL=https://api.example.com
VITE_PROMETHEUS_URL=https://prometheus.example.com
VITE_APP_TITLE=MiniJob Admin Dashboard
VITE_APP_VERSION=1.0.0
VITE_USE_MOCK_API=false
```

### Docker Compose

```yaml
version: "3.8"
services:
  minijob-admin:
    image: ghcr.io/nbigot/minijob-admin
    environment:
      - BACKEND_URL=http://minijob-backend:8080
      - PROMETHEUS_URL=http://prometheus:9090
    ports:
      - "8081:80"
```

---

## Next Steps

- **[Configuration Guide](/guide/configuration)** - Detailed configuration
- **[Deployment](/guide/deployment)** - Production deployment
- **[Troubleshooting](/guide/troubleshooting)** - Common issues
