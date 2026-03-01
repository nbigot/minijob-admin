# Getting Started

Welcome to MiniJob Admin Dashboard! This guide will help you get up and running in just a few minutes.

## What is MiniJob Admin Dashboard?

MiniJob Admin Dashboard is a modern, web-based administration interface for managing and monitoring the MiniJob backend job processing system. It provides real-time visibility into job queues, resource management, and system health monitoring.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** - Comes with Node.js
- **Docker** (optional) - [Download here](https://www.docker.com/) for containerized deployment
- **MiniJob Backend** (optional) - For production use, or use simulation mode

## Installation Methods

### Method 1: Local Development (Quick Start)

Perfect for development and testing:

```bash
# Clone the repository
git clone https://github.com/nbigot/minijob-admin.git
cd minijob-admin

# Install dependencies
npm install

# Start development server with hot reload
npm run dev
```

The application will be available at `http://localhost:3000`

### Method 2: Simulation Mode (No Backend Required)

Use mock data without a real MiniJob backend:

```bash
# Install dependencies (if not already done)
npm install

# Run in simulation mode
npm run dev -- --mode simul
```

This mode uses hardcoded mock data defined in the `.env.simul` file.

### Method 3: Docker (Production)

For production deployment with runtime configuration:

```bash
# Pull and run the image
docker run -e BACKEND_URL="http://your-backend:8080" \
  -e PROMETHEUS_URL="http://your-prometheus:9090" \
  -p 8081:80 nbigot/minijob-admin
```

Access the dashboard at `http://localhost:8081`

### Method 4: Docker Compose (Recommended for Production)

```bash
# Start services
npm run docker:compose

# Or manually
docker-compose up -d

# Stop services
npm run docker:stop
# Or
docker-compose down
```

## Initial Configuration

### Environment Variables

Create a `.env.development` file in the root directory:

```bash
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8080

# Prometheus Configuration
VITE_PROMETHEUS_URL=http://localhost:9090

# Application Settings
VITE_APP_TITLE=MiniJob Admin Dashboard
VITE_APP_VERSION=1.0.0

# Enable/Disable Mock API
VITE_USE_MOCK_API=false
```

For simulation mode, these values are in `.env.simul`.

::: tip
Set `VITE_USE_MOCK_API=true` to use mock data even in development mode without needing a backend.
:::

## Verify Installation

After starting the application, you should see:

1. **Dashboard View** - Real-time job statistics
2. **Navigation Menu** - Jobs, Resources, Topics, Health, System
3. **Dark Mode Toggle** - In the top-right corner

### Test with Mock Data

1. Navigate to the Jobs page
2. Click "Create Job" to open the job creation form
3. Fill in the form or click "Generate Random Job"
4. Submit the job and verify it appears in the jobs list

## Next Steps

Now that you have MiniJob Admin Dashboard running, explore these guides:

- **[Configuration](/guide/configuration)** - Learn about environment variables and settings
- **[Deployment](/guide/deployment)** - Deploy to production with Docker
- **[Dashboard Features](/guide/features/dashboard)** - Explore the dashboard capabilities
- **[Job Management](/guide/features/jobs)** - Learn how to manage jobs effectively

## Troubleshooting

### Port Already in Use

If port 3000 (dev) or 8081 (Docker) is already in use:

```bash
# For development, specify a different port
npm run dev -- --port 3001

# For Docker, map to a different port
docker run -p 8082:80 nbigot/minijob-admin
```

### Backend Connection Issues

If you see connection errors:

1. Verify the `VITE_API_BASE_URL` is correct
2. Ensure the MiniJob backend is running
3. Check for CORS issues (backend must allow requests from your frontend URL)
4. Use simulation mode as a fallback: `npm run dev -- --mode simul`

### Build Errors

If you encounter build errors:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## Getting Help

- **GitHub Issues** - [Report bugs or request features](https://github.com/nbigot/minijob-admin/issues)
- **Discussions** - [Ask questions and share ideas](https://github.com/nbigot/minijob-admin/discussions)
- **Documentation** - Browse this documentation for detailed guides

## What's Next?

Continue to [Configuration](/guide/configuration) to learn about customizing your MiniJob Admin Dashboard.
