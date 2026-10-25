# Configuration

Learn how to configure MiniJob Admin Dashboard for different environments and use cases.

## Environment Variables

MiniJob Admin Dashboard uses environment variables prefixed with `VITE_` to configure the application at build time.

### Core Configuration

#### `VITE_API_BASE_URL`

- **Type**: `string`
- **Default**: `http://localhost:8080`
- **Description**: The base URL of your MiniJob backend API

```bash
VITE_API_BASE_URL=http://localhost:8080
```

For production:

```bash
VITE_API_BASE_URL=https://api.example.com
```

#### `VITE_PROMETHEUS_URL`

- **Type**: `string`
- **Default**: `http://localhost:9090`
- **Description**: URL for Prometheus metrics (if used)

```bash
VITE_PROMETHEUS_URL=http://localhost:9090
```

#### `VITE_APP_TITLE`

- **Type**: `string`
- **Default**: `MiniJob Admin Dashboard`
- **Description**: Application title displayed in the browser tab

```bash
VITE_APP_TITLE=My Custom Job Dashboard
```

#### `VITE_APP_VERSION`

- **Type**: `string`
- **Default**: `1.0.1`
- **Description**: Application version displayed in the UI

```bash
VITE_APP_VERSION=1.2.3
```

#### `VITE_USE_MOCK_API`

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Enable mock API for development without a backend

```bash
VITE_USE_MOCK_API=true
```

## Environment Files

### Development (`.env.development`)

Used when running `npm run dev`:

```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_PROMETHEUS_URL=http://localhost:9090
VITE_APP_TITLE=MiniJob Admin Dashboard
VITE_APP_VERSION=1.0.0
VITE_USE_MOCK_API=false
```

### Simulation (`.env.simul`)

Used when running `npm run dev -- --mode simul`:

```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_PROMETHEUS_URL=http://localhost:9090
VITE_APP_TITLE=MiniJob Admin Dashboard (Simulation)
VITE_APP_VERSION=1.0.0
VITE_USE_MOCK_API=true
```

### Production (`.env.production`)

Used when running `npm run build`:

```bash
VITE_API_BASE_URL=https://api.example.com
VITE_PROMETHEUS_URL=https://prometheus.example.com
VITE_APP_TITLE=MiniJob Admin Dashboard
VITE_APP_VERSION=1.0.0
VITE_USE_MOCK_API=false
```

::: warning
Never commit `.env` files with sensitive information to version control. Use `.env.example` as a template.
:::

## Docker Configuration

### Runtime Configuration

When using Docker, you can configure the backend URLs at runtime without rebuilding the image:

```bash
docker run \
  -e BACKEND_URL="http://backend:8080" \
  -e PROMETHEUS_URL="http://prometheus:9090" \
  -p 8081:80 \
  ghcr.io/nbigot/minijob-admin
```

These environment variables are injected into the nginx configuration at container startup using `envsubst`.

### Build-time Configuration

Override the app version during Docker build:

```bash
docker build \
  --build-arg VITE_APP_VERSION=1.2.3 \
  -t nbigot/minijob-admin .
```

### Docker Compose Configuration

In `docker-compose.yml`:

```yaml
version: "3.8"

services:
  minijob-admin:
    image: ghcr.io/nbigot/minijob-admin
    ports:
      - "8081:80"
    environment:
      - BACKEND_URL=http://minijob-backend:8080
      - PROMETHEUS_URL=http://prometheus:9090
```

## Application Settings

### Polling Intervals

The dashboard polls for updates at configurable intervals. These are currently hardcoded but can be customized:

**Dashboard Polling:**

- Default: 5 seconds
- Location: `src/views/Dashboard.vue`

```javascript
// Customize in Dashboard.vue
const pollingInterval = 5000; // milliseconds
```

### Time Windows

Dashboard supports multiple time windows for metrics:

- 1 minute
- 5 minutes
- 15 minutes
- 1 hour
- 6 hours
- 24 hours

## Mock Data Configuration

When `VITE_USE_MOCK_API=true`, the application uses mock data defined in:

- `src/mocks/data/mock_dashboard.js` - Dashboard metrics
- `src/mocks/data/mock_jobs.js` - Job listings
- `src/mocks/data/mock_health.js` - Health status
- `src/mocks/data/mock_resources.js` - Resource locks
- `src/mocks/data/mock_topics.js` - Topic statistics
- `src/mocks/data/mock_system.js` - System operations

You can customize these files to create realistic test scenarios.

## Axios Configuration

HTTP client configuration is in `src/services/axios.js`:

```javascript
// Customize timeout
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // 10 seconds
});
```

## Theme Configuration

### Dark Mode

Dark mode is automatically detected from system preferences and can be toggled by users. The preference is stored in `localStorage`.

### Colors

Customize colors in `src/assets/css/style.css` or via TailwindCSS configuration.

## Best Practices

1. **Use environment-specific files**: Keep separate `.env` files for development, staging, and production
2. **Never commit secrets**: Use `.gitignore` to exclude `.env` files
3. **Document variables**: Maintain an `.env.example` file with all required variables
4. **Runtime configuration**: For Docker deployments, prefer runtime environment variables over build-time
5. **Test with mocks**: Use simulation mode to test UI changes without a backend

## Advanced Configuration

### Custom API Endpoints

If your backend has different endpoint paths, modify the service files:

```javascript
// src/services/jobService.js
export const getJobs = (params) => {
  return axios.get("/api/v2/jobs", { params }); // Changed from /api/jobs
};
```

### CORS Configuration

If running the frontend and backend on different domains, ensure the backend allows CORS:

```javascript
// Backend example (Express.js)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
```

### Nginx Configuration (Docker)

The Docker image uses nginx. Customize `nginx.conf.template` for advanced configurations:

- Custom headers
- SSL/TLS settings
- Caching rules
- Compression

## Next Steps

- **[Deployment Guide](/guide/deployment)** - Learn how to deploy to production
- **[Environment Variables Reference](/reference/environment-variables)** - Complete variable documentation
- **[Troubleshooting](/guide/troubleshooting)** - Common configuration issues
