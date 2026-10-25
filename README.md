# MiniJob Admin Dashboard

A modern web-based administration interface for MiniJob - a distributed job queue system. Built with Vue.js 3, TailwindCSS, and designed for performance and usability.

## 📚 Documentation

**Complete documentation available at:** [https://nbigot.github.io/minijob-admin/](https://nbigot.github.io/minijob-admin/)

- [Getting Started Guide](https://nbigot.github.io/minijob-admin/guide/getting-started.html)
- [Configuration Reference](https://nbigot.github.io/minijob-admin/guide/configuration.html)
- [Deployment Guide](https://nbigot.github.io/minijob-admin/guide/deployment.html)
- [API Reference](https://nbigot.github.io/minijob-admin/reference/api.html)

---

A web application built with:

- Vue.js 3
- TailwindCSS
- Font Awesome
- Vite

## Setup

```bash
npm install
```

## Demo mode (without a server)

Demo mode runs the UI with fake data, so you can try it without a minijob server.
The API calls are answered in the browser by the mocks in `src/mocks`, which hold sample jobs, topics and resources.

```bash
npm run dev -- --mode simul
```

Then open http://localhost:3000.

- The settings come from `.env.simul`, where `VITE_USE_MOCK_API=true` turns the mocks on.
- The fake data lives in the page: after a reload, the jobs you created, cancelled or deleted are back to the sample data.
- The dashboard counters change every few seconds, to look like a busy server.
- Links that leave the UI, such as the raw Prometheus metrics, need a real server.

To use the mocks with the development settings instead, set `VITE_USE_MOCK_API=true` in `.env.development`, or for a single run:

```bash
VITE_USE_MOCK_API=true npm run dev
```

## Development

```bash
npm run dev
```

## Tests

```bash
# Unit tests
npm test

# Integration tests: the UI services and views against a running minijob server
MINIJOB_URL=http://127.0.0.1:8080 npm run test:integration

# Also run the tests that wipe the server (delete all jobs, clear queues, unlock all resources)
MINIJOB_DESTRUCTIVE=1 npm run test:integration
```

## Build

```bash
npm run build
```

## Docker Container Mode

### Build with Docker:

```bash
# Build the Docker image
npm run docker:build
```

### Using Docker Compose:

```bash
# Start the application
npm run docker:compose

# Stop the application
npm run docker:stop
```

The application will be available at `http://localhost:8081` when running in Docker mode.

### Manual Docker Commands:

```bash
# Build the image
docker build -t nbigot/minijob-admin .

# Using docker-compose
docker-compose up -d
docker-compose down
```

### Run container (single image, runtime-configurable)

The image supports runtime configuration of the backend and Prometheus URLs via environment variables. The container's entrypoint renders the `nginx` template at start using `envsubst`, so you don't need to rebuild the image to point to a different backend.

```bash
# Run the container and point nginx to the Docker host backend
npm run docker:run

# Or run manually:
docker run -e BACKEND_URL="http://host.docker.internal:8080" \
	-e PROMETHEUS_URL="http://host.docker.internal:9090" -p 8081:80 minijob-admin
```

Notes:

- `BACKEND_URL` and `PROMETHEUS_URL` are injected into the `nginx` config at container start (no rebuild required).
- If you run the backend as another container on the same Docker network, prefer using the service/container name (e.g. `http://backend:8080`) instead of `host.docker.internal`.

### Overriding embedded app version at build time

`VITE_APP_VERSION` defaults to `1.0.0` but can be overridden during image build with a build argument:

```bash
docker build --build-arg VITE_APP_VERSION=1.2.3 -t nbigot/minijob-admin .
```

## Modes Summary

- **Dev Mode**: `npm run dev` - Runs on port 3000 with hot reload
- **Demo Mode**: `npm run dev -- --mode simul` - Runs on port 3000 with fake data, no server needed
- **Docker Mode**: `npm run docker:compose` - Runs on port 8081 with nginx as web server
